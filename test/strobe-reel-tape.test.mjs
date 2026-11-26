// Rec Play Erase: the bars of `wave` are the loudness of the film's own sound.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
const KIT = path.join(new URL('..', import.meta.url).pathname, 'plugins/video-covers/skills/lit-strobe-reel');
const { loadFilm } = await import(path.join(KIT, 'engine/check.mjs')), { levels, soundtrack, wav, SR } = await import(path.join(KIT, 'engine/audio.mjs'));
const dir = path.join(KIT, 'films/rec-play-erase'), built = path.join(KIT, '../../../../.litclaude/evidence/strobe-reel-examples/films/rec-play-erase');

function agrees(L, sound, frames) {
  assert.equal(L.level.length, frames); assert.equal(L.wave.length, frames);
  const F = SR / 60, rms = Array.from({ length: frames }, (_, f) => { let e = 0; for (let i = 0; i < F; i++) e += (sound.readInt16LE(44 + 2 * (f * F + i)) / 32768) ** 2; return Math.sqrt(e / F); });
  const top = (a) => a.indexOf(Math.max(...a)); assert.equal(top(L.level), top(rms));
  rms.forEach((v, i) => assert.ok(Math.abs(v - L.level[i]) < 1e-3, `frame ${i}`));
}
test('one loudness value per frame, and the loudest frame is the loudest frame of the sound', async () => {
  const film = await loadFilm(dir), s = soundtrack(film);
  agrees(levels(s), wav(s), film.map.length * 24);
});
test('the built levels.json belongs to the built sound file', { skip: !existsSync(path.join(built, 'levels.json')) }, async () => {
  const film = await loadFilm(dir);
  agrees(JSON.parse(readFileSync(path.join(built, 'levels.json'))), readFileSync(path.join(built, 'audio.wav')), film.map.length * 24);
});
