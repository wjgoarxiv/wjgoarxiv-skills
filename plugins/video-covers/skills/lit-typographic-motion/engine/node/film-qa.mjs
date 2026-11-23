// Checks on the encoded film itself, the file a viewer gets, in one ffmpeg decode. The frame rules judge
// the frames before encoding and the sound audit the muxed samples; these read what the encoder and the mux
// produced: cuts the storyboard did not plan, a picture that stops moving, black runs, the true (inter-sample)
// peak, one moment far louder than the rest, and a DC offset or NaN samples. They report (PASS or WARN) and
// never fail the gate: a WARN is something to look at in the next look round.
import { spawnSync } from "node:child_process";

export const FILM_QA = Object.freeze({
  cutScore: 10,
  freezeSec: 3,
  freezeNoiseDb: -60,
  blackSec: 0.25,
  blackPixel: 0.1,
  truePeakDbtp: -1,
  shortTermOverLu: 8,
  dcOffset: 0.01,
});

const num = (re, text) => [...text.matchAll(re)].map((m) => Number(m[1]));
const secs = (list) => list.slice(0, 5).map((t) => `${t.toFixed(2)} s`).join(", ") + (list.length > 5 ? `, +${list.length - 5} more` : "");

/** Parse the decode log into measurements (exported for tests). */
export function parseFilmLog(log, { durationSec }) {
  const cuts = num(/lavfi\.scd\.time: ([\d.]+)/gu, log);
  const starts = num(/freeze_start: ([\d.]+)/gu, log);
  const ends = num(/freeze_end: ([\d.]+)/gu, log);
  const freezes = starts.map((s, i) => ({ start: s, end: ends[i] ?? durationSec }));
  const blacks = [...log.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/gu)].map((m) => ({ start: Number(m[1]), end: Number(m[2]) }));
  const summary = log.slice(log.lastIndexOf("Summary:"));
  const integrated = num(/I:\s+(-?[\d.]+) LUFS/gu, summary)[0];
  const truePeak = num(/True peak:\s+Peak:\s+(-?[\d.inf]+) dBFS/gu, summary)[0];
  const shortTerm = [...log.matchAll(/t: ([\d.]+)\s+TARGET:.*?S:\s*(-?[\d.]+)/gu)].map((m) => ({ t: Number(m[1]), s: Number(m[2]) }));
  const dc = num(/DC offset: (-?[\d.e+-]+)/gu, log).at(-1);
  const nan = num(/Number of NaNs: ([\d.]+)/gu, log).at(-1);
  return { cuts, freezes, blacks, integrated, truePeak, shortTerm, dc, nan };
}

/** Turn measurements into gate rules. `boundaries` are the planned cut times (beat starts, end card start). */
export function filmQaRules(m, { fps, boundaries = [], cardStartSec = null, hasAudio }) {
  const rules = [];
  const near = (t) => boundaries.some((b) => Math.abs(b - t) <= 2 / fps + 0.05);
  const unplanned = m.cuts.filter((t) => !near(t) && !(cardStartSec !== null && t >= cardStartSec - 0.05));
  rules.push({ id: "FILM-CUTS", status: unplanned.length ? "WARN" : "PASS", detail: unplanned.length ? `${unplanned.length} hard cut(s) where no beat starts: ${secs(unplanned)}; look at those frames for a pop or a glitch` : `${m.cuts.length} hard cut(s), each on a beat boundary` });
  const body = cardStartSec ?? Infinity;
  const frozen = m.freezes.filter((f) => f.start < body - 0.05 && Math.min(f.end, body) - f.start >= FILM_QA.freezeSec);
  rules.push({ id: "FILM-FREEZE", status: frozen.length ? "WARN" : "PASS", detail: frozen.length ? `the picture stops for ${FILM_QA.freezeSec} s or more at ${secs(frozen.map((f) => f.start))} (before the end card); a held shot should still move` : `no still run of ${FILM_QA.freezeSec} s or more before the end card` });
  rules.push({ id: "FILM-BLACK", status: m.blacks.length ? "WARN" : "PASS", detail: m.blacks.length ? `black run(s) of ${FILM_QA.blackSec} s or more in the encoded film at ${secs(m.blacks.map((b) => b.start))}` : "no black run in the encoded film" });
  if (!hasAudio) return rules;
  const tp = m.truePeak;
  rules.push({ id: "SOUND-TRUEPEAK", status: Number.isFinite(tp) && tp > FILM_QA.truePeakDbtp ? "WARN" : "PASS", detail: Number.isFinite(tp) ? `true peak ${tp.toFixed(1)} dBTP (limit ${FILM_QA.truePeakDbtp} dBTP; a sample peak under it can still clip after decoding)` : "true peak not measured" });
  const body3 = m.shortTerm.filter((x) => x.t >= 3 && Number.isFinite(x.s));
  const loudest = body3.reduce((a, b) => (b.s > (a?.s ?? -Infinity) ? b : a), null);
  const over = loudest && Number.isFinite(m.integrated) ? loudest.s - m.integrated : null;
  rules.push({ id: "SOUND-SHORTTERM", status: over !== null && over > FILM_QA.shortTermOverLu ? "WARN" : "PASS", detail: over === null ? "short-term loudness not measured" : `loudest 3 s window ${loudest.s.toFixed(1)} LUFS at ${loudest.t.toFixed(1)} s, ${over.toFixed(1)} LU over the film's ${m.integrated.toFixed(1)} LUFS (limit +${FILM_QA.shortTermOverLu} LU)` });
  const dcBad = Number.isFinite(m.dc) && Math.abs(m.dc) > FILM_QA.dcOffset;
  const nanBad = Number.isFinite(m.nan) && m.nan > 0;
  rules.push({ id: "SOUND-DC", status: dcBad || nanBad ? "WARN" : "PASS", detail: `DC offset ${Number.isFinite(m.dc) ? m.dc.toFixed(4) : "not measured"} (limit ±${FILM_QA.dcOffset}), NaN samples ${Number.isFinite(m.nan) ? m.nan : "not measured"}` });
  return rules;
}

/** Decode the encoded film once and return its rules. A decode that fails is one WARN, never a FAIL. */
export function filmQa({ ffmpeg, film, fps, durationSec, boundaries = [], cardStartSec = null, hasAudio }) {
  const v = `[0:v]scdet=threshold=${FILM_QA.cutScore},freezedetect=n=${FILM_QA.freezeNoiseDb}dB:d=${Math.min(FILM_QA.freezeSec, 1)},blackdetect=d=${FILM_QA.blackSec}:pix_th=${FILM_QA.blackPixel}[v]`;
  const a = "[0:a:0]ebur128=peak=true:framelog=info,astats=measure_overall=DC_offset+Number_of_NaNs:measure_perchannel=none[a]";
  const args = ["-hide_banner", "-nostats", "-i", film, "-filter_complex", hasAudio ? `${v};${a}` : v, "-map", "[v]", ...(hasAudio ? ["-map", "[a]"] : []), "-f", "null", "-"];
  const r = spawnSync(ffmpeg, args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  if (!ffmpeg || r.status !== 0) return [{ id: "FILM-QA", status: "WARN", detail: `the encoded film could not be decoded for its checks (${r.error?.message ?? `ffmpeg exit ${r.status}`})` }];
  return filmQaRules(parseFilmLog(r.stderr, { durationSec }), { fps, boundaries, cardStartSec, hasAudio });
}
