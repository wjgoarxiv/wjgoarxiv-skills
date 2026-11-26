// Board Ride Exit: the route on the line map is the film itself.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
const KIT = path.join(new URL('..', import.meta.url).pathname, 'plugins/video-covers/skills/lit-strobe-reel');
const { loadFilm } = await import(path.join(KIT, 'engine/check.mjs'));

const { default: data } = await import(path.join(KIT, 'packs/transit/data.mjs'));

test('the route of a film of any length stays on the page', () => {
  for (let n = 2; n <= 30; n++) data({ acts: [{ blocks: Array.from({ length: n }, (_, i) => `b${i}`) }] }).route.forEach(([x, y], i) => assert.ok(x > 60 && x < 1860 && y > 240 && y < 1000, `${n} stops: stop ${i} at ${x},${y}`));
});
test('every stop on the line map is a block of the film, in order, on a route that only turns by 45 degrees', async () => {
  const film = await loadFilm(path.join(KIT, 'films/board-ride-exit'));
  assert.deepEqual(film.pack.stops, film.order);
  assert.equal(film.pack.route.length, film.order.length);
  film.pack.route.forEach(([x, y], i) => {
    assert.ok(x > 60 && x < 1860 && y > 240 && y < 1000, `stop ${i} at ${x},${y} is on the page`);
    if (i) { const [a, b] = film.pack.route[i - 1]; assert.ok(Math.abs(y - b) <= 1 || Math.abs(Math.abs(y - b) - (x - a)) <= 2, `leg ${i}`); }
  });
});
