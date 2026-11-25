import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const engine = join(root, 'plugins/video-covers/skills/lit-typographic-motion/engine');
const { evaluateDone } = await import(join(engine, 'node/done.mjs'));
const { readStills } = await import(join(engine, 'node/stills.mjs'));
const base = JSON.parse(readFileSync(join(root, 'test/fixtures/stage-treatment.json'), 'utf8'));

const row = { lensMm: 50, fstop: 2.8, key: { kelvin: 3200, azimuth: 35, elevation: 40 }, fill: { kelvin: 7500, ratio: 0.3 }, heroSpring: { damping: 0.45, freq: 3 } };
const { world, ...rest } = base;
const cinematic = { ...rest, request: `${base.request} · cinematic`, register: 'cinematic', shots: base.beats.map(() => row) };
const critic = { by: 'blind', notes: [{ n: 1, note: 'The landing has no squash.', frame: 'stills/sheet.png' }], scores: { subject: 6, motion: 5, light: 6, story: 5 }, responses: [{ n: 1, status: 'done', how: 'Added a squash on landing.' }] };

// A finished cinematic film on disk: a passed gate, a stills set, and `n` look rounds with a critic.
function withFinishedFilm(rounds, fn, lastCritic = critic) {
  const out = mkdtempSync(join(tmpdir(), 'critic-done-'));
  try {
    mkdirSync(join(out, 'stills'));
    writeFileSync(join(out, 'treatment.json'), JSON.stringify(cinematic));
    writeFileSync(join(out, 'manifest.json'), '{}');
    writeFileSync(join(out, 'gate-report.txt'), 'QA gate: PASS\n');
    writeFileSync(join(out, 'stills/sheet.png'), 'x');
    writeFileSync(join(out, 'stills/index.json'), JSON.stringify({ files: [{ file: 'stills/sheet.png', kind: 'sheet' }] }));
    const sha = readStills(out).sha256;
    const look = Array.from({ length: rounds }, (_, i) => (i === 0
      ? { round: 1, stillsOnly: true, change: 'Moved the hop onto the beat.', critic }
      : { round: i + 1, stillsSha256: sha, viewed: ['stills/sheet.png'], critic: i === rounds - 1 ? lastCritic : critic }));
    writeFileSync(join(out, 'look.json'), JSON.stringify({ rounds: look }));
    return fn(out);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

test('the done-check holds a cinematic film with two blind critic rounds and names why', () => withFinishedFilm(2, (out) => {
  const r = evaluateDone({ out });
  assert.equal(r.status, 'NOT_DONE');
  assert.ok(r.reasons.some((x) => /three blind critic rounds; 2 recorded/u.test(x)), r.reasons.join(' | '));
}));

test('three blind critic rounds clear the critic rule', () => withFinishedFilm(3, (out) => {
  const r = evaluateDone({ out });
  assert.ok(!r.reasons.some((x) => /critic/u.test(x)), r.reasons.join(' | '));
  assert.equal(r.status, 'DONE');
}));

test('recording the same round twice does not count as another critic round', () => withFinishedFilm(3, (out) => {
  const file = join(out, 'look.json');
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  doc.rounds[2].round = 2;
  writeFileSync(file, JSON.stringify(doc));
  const r = evaluateDone({ out });
  assert.ok(r.reasons.some((x) => /three blind critic rounds; 2 recorded/u.test(x)), r.reasons.join(' | '));
}));

test('a cinematic film with no image tool ends unviewed instead of waiting for critics forever', () => withFinishedFilm(2, (out) => {
  const file = join(out, 'look.json');
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  doc.rounds[1] = { round: 2, blocked: 'no-vision-tool', stillsSha256: doc.rounds[1].stillsSha256 };
  writeFileSync(file, JSON.stringify(doc));
  const r = evaluateDone({ out });
  assert.equal(r.status, 'DONE_UNVIEWED', r.reasons.join(' | '));
}));

test('an empty look.json is not done', () => withFinishedFilm(3, (out) => {
  writeFileSync(join(out, 'look.json'), JSON.stringify({ rounds: [] }));
  const r = evaluateDone({ out });
  assert.equal(r.status, 'NOT_DONE');
  assert.ok(r.reasons.some((x) => /holds no look round/u.test(x)), r.reasons.join(' | '));
}));

test('a note refused in the last critic round is delivered as an open item', () => {
  const refused = { ...critic, responses: [{ n: 1, status: 'refused', how: 'The squash would break the hold.' }] };
  withFinishedFilm(3, (out) => {
    const r = evaluateDone({ out });
    assert.equal(r.status, 'DONE');
    assert.ok(r.openItems.some((x) => /critic note 1 refused: The squash would break the hold/u.test(x)), r.openItems.join(' | '));
  }, refused);
});
