// Kick Snare Hat: one pattern is the sound and the picture.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const KIT = path.join(new URL('..', import.meta.url).pathname, 'plugins/video-covers/skills/lit-strobe-reel');
const { loadFilm } = await import(path.join(KIT, 'engine/check.mjs')), { soundtrack, SR } = await import(path.join(KIT, 'engine/audio.mjs'));
const dir = path.join(KIT, 'films/kick-snare-hat'), cfg = JSON.parse(readFileSync(path.join(dir, 'film.json'), 'utf8'));

test('every lit step sounds within 10 ms, and an unlit step has no onset', async () => {
  const film = await loadFilm(dir), first = film.map.find((m) => m.block === 'seq16').beat, s = soundtrack(film, { only: ['seq16'] });
  // onsets: 5 ms frames of the sample-to-sample difference, against the 20 ms before them
  const e = (a) => { let n = 0; for (let i = 0; i < 240; i++) n += ((s[a + i] || 0) - (s[a + i - 1] || 0)) ** 2; return Math.sqrt(n / 240); };
  const onset = (t) => { const a = Math.round(t * SR), before = Math.max(e(a - 480), e(a - 720), e(a - 960)); return [0, 240].some((d) => e(a + d) > 60 && e(a + d) > 2.5 * before); };
  for (let i = 0; i < 16; i++) {
    const lit = cfg.pattern.some((r) => r[i] === 'x'); assert.equal(onset(first * .4 + i * .1), lit, `step ${i + 1}`);
    if (!lit) for (let d = .01; d < .09; d += .005) assert.ok(!onset(first * .4 + i * .1 + d), `step ${i + 1} at +${d}`);
  }
  assert.deepEqual(film.pack.steps, cfg.pattern.map((r) => [...r].map((q) => +(q === 'x'))));
});
test('a row that is not sixteen steps is refused by name', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'strobe-pads-'));
  try {
    for (const p of [[cfg.pattern[0].slice(1), cfg.pattern[1], cfg.pattern[2]], cfg.pattern.slice(1), undefined]) {
      writeFileSync(path.join(tmp, 'film.json'), JSON.stringify({ ...cfg, pattern: p }));
      const r = spawnSync(process.execPath, [path.join(KIT, 'make.mjs'), tmp, '--check'], { encoding: 'utf8' }); assert.equal(r.status, 2); assert.match(r.stderr, /pattern/);
    }
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
