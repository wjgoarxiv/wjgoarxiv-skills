import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const { filmQa, filmQaRules, parseFilmLog } = await import(join(root, 'plugins/video-covers/skills/lit-typographic-motion/engine/node/film-qa.mjs'));
const hasFfmpeg = spawnSync('ffmpeg', ['-version']).status === 0;
const byId = (rules) => Object.fromEntries(rules.map((r) => [r.id, r]));

test('the rules only ever PASS or WARN, and a missing decode is one WARN', () => {
  const quiet = filmQaRules(parseFilmLog('', { durationSec: 5 }), { fps: 30, hasAudio: true });
  assert.ok(quiet.every((r) => ['PASS', 'WARN'].includes(r.status)));
  const broken = filmQa({ ffmpeg: 'ffmpeg', film: '/nonexistent/film.mp4', fps: 30, durationSec: 5, hasAudio: false });
  assert.deepEqual(broken.map((r) => [r.id, r.status]), [['FILM-QA', 'WARN']]);
});

test('a cut on a beat boundary passes; a cut elsewhere, and cuts inside the end card, are told apart', () => {
  const m = { cuts: [2.0, 3.4, 6.1], freezes: [], blacks: [] };
  const r = byId(filmQaRules(m, { fps: 30, boundaries: [2.0], cardStartSec: 6, hasAudio: false }));
  assert.equal(r['FILM-CUTS'].status, 'WARN');
  assert.match(r['FILM-CUTS'].detail, /1 hard cut\(s\) where no beat starts: 3\.40 s/u);
});

test('a long still run warns only before the end card', () => {
  const rules = (freezes) => byId(filmQaRules({ cuts: [], freezes, blacks: [] }, { fps: 30, cardStartSec: 10, hasAudio: false }))['FILM-FREEZE'].status;
  assert.equal(rules([{ start: 2, end: 6 }]), 'WARN');
  assert.equal(rules([{ start: 9, end: 14 }]), 'PASS');
  assert.equal(rules([{ start: 2, end: 4 }]), 'PASS');
});

test('a loud spike, a high true peak and a DC offset warn', () => {
  const m = { cuts: [], freezes: [], blacks: [], integrated: -16, truePeak: -0.4, dc: 0.03, nan: 0,
    shortTerm: [{ t: 1, s: -2 }, { t: 4, s: -15 }, { t: 6, s: -6 }] };
  const r = byId(filmQaRules(m, { fps: 30, hasAudio: true }));
  assert.equal(r['SOUND-TRUEPEAK'].status, 'WARN');
  assert.equal(r['SOUND-SHORTTERM'].status, 'WARN');
  assert.match(r['SOUND-SHORTTERM'].detail, /-6\.0 LUFS at 6\.0 s, 10\.0 LU over/u);
  assert.equal(r['SOUND-DC'].status, 'WARN');
});

test('one decode of a real encoded film finds its stray cut, its black run and its still run', { skip: !hasFfmpeg && 'ffmpeg not on PATH' }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'film-qa-'));
  try {
    const film = join(dir, 'film.mp4');
    // 0-2 s moving pattern, 2-2.5 s black, 2.5-6.5 s one still colour, 6.5-8 s moving pattern again; a tone under it.
    const graph = '[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0,format=yuv420p[v]';
    const r = spawnSync('ffmpeg', ['-v', 'error', '-y',
      '-f', 'lavfi', '-i', 'testsrc2=s=320x180:r=30:d=2', '-f', 'lavfi', '-i', 'color=c=black:s=320x180:r=30:d=0.5',
      '-f', 'lavfi', '-i', 'color=c=orange:s=320x180:r=30:d=4', '-f', 'lavfi', '-i', 'testsrc2=s=320x180:r=30:d=1.5',
      '-f', 'lavfi', '-i', 'sine=f=440:d=8:sample_rate=48000',
      '-filter_complex', graph, '-map', '[v]', '-map', '4:a', '-c:v', 'libx264', '-c:a', 'aac', '-shortest', film]);
    assert.equal(r.status, 0, r.stderr?.toString());
    const rules = byId(filmQa({ ffmpeg: 'ffmpeg', film, fps: 30, durationSec: 8, boundaries: [2.5], hasAudio: true }));
    assert.equal(rules['FILM-BLACK'].status, 'WARN');
    assert.match(rules['FILM-BLACK'].detail, /at 2\.0\d s/u);
    assert.equal(rules['FILM-FREEZE'].status, 'WARN');
    assert.equal(rules['FILM-CUTS'].status, 'WARN', rules['FILM-CUTS'].detail);
    assert.equal(rules['SOUND-DC'].status, 'PASS');
    assert.equal(rules['SOUND-TRUEPEAK'].status, 'PASS', rules['SOUND-TRUEPEAK'].detail);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
