import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const { checkAnswers } = await import(join(root, 'plugins/video-covers/skills/lit-typographic-motion/engine/node/look.mjs'));

const FILES = ['stills/sheet.png', 'stills/beat-01.png', 'stills/beat-02.png', 'stills/beat-03.png', 'stills/board.png'];

function withFilm(register, fn) {
  const out = mkdtempSync(join(tmpdir(), 'critic-'));
  try {
    mkdirSync(join(out, 'stills'));
    for (const f of FILES) writeFileSync(join(out, f), 'x');
    writeFileSync(join(out, 'treatment.json'), JSON.stringify({ register, story: { beat: 1 } }));
    const stills = { index: { files: FILES.map((file) => ({ file })), round: 2 } };
    return fn((doc) => checkAnswers(doc, { round: 2, stills, out }));
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

const answers = () => Array.from({ length: 10 }, (_, i) => {
  const q = i + 1;
  return {
    q,
    verdict: q === 7 ? 'none' : [4, 8, 9].includes(q) ? 'no' : 'yes',
    frame: q === 10 ? 'stills/beat-02.png' : 'stills/beat-01.png',
    observed: `Observation number ${q}: the hero lands on the left third under warm key light.`,
    ...(q === 1 ? { by: 'blind', sentence: 'A small creature tries to catch something and finally does.' } : {}),
  };
});
const critic = (over = {}) => ({
  by: 'blind',
  notes: [
    { n: 1, note: 'The landing in beat two has no squash, so the hop reads as weightless.', frame: 'stills/beat-02.png' },
    { n: 2, note: 'The background is as sharp as the hero, so the eye has nowhere to rest.', frame: 'stills/beat-01.png' },
  ],
  scores: { subject: 6, motion: 4, light: 7, story: 5 },
  responses: [
    { n: 1, status: 'done', how: 'Added a 0.18 squash on landing with damping 0.45.' },
    { n: 2, status: 'refused', how: 'Beat one is a wide establishing shot; f/8 keeps the room readable.' },
  ],
  ...over,
});
const doc = (extra = {}) => ({ viewed: FILES, answers: answers(), ...extra });

test('a cinematic round without the blind critic is refused; with it, the notes and answers are recorded', () => withFilm('cinematic', (check) => {
  assert.throws(() => check(doc()), /critic: a cinematic film records the blind critic/u);
  const rec = check(doc({ critic: critic() }));
  assert.equal(rec.critic.by, 'blind');
  assert.deepEqual(rec.critic.responses.map((r) => r.status), ['done', 'refused']);
}));

test('every critic note needs an answer, and the critic must be blind', () => withFilm('cinematic', (check) => {
  assert.throws(() => check(doc({ critic: critic({ responses: [critic().responses[0]] }) })), /critic note 2 has no response/u);
  assert.throws(() => check(doc({ critic: critic({ by: 'self' }) })), /critic\.by must be blind/u);
  assert.throws(() => check(doc({ critic: critic({ scores: { subject: 6, motion: 11, light: 7, story: 5 } }) })), /critic\.scores\.motion/u);
}));

test('a rich film may skip the critic', () => withFilm('rich', (check) => {
  assert.equal(check(doc()).critic, undefined);
}));
