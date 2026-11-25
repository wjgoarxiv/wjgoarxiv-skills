import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const { blink, cocPx, hop, kelvinRgb, lag, lensFov, spring, squash } = await import(join(root, 'plugins/video-covers/skills/lit-typographic-motion/engine/stage/depth-math.js'));

test('the thin lens: in focus is sharp, wider apertures and farther grounds blur more', () => {
  const lens = { focus: 7, focalMm: 50, filmMm: 36, widthPx: 1920, unitM: 0.1 };
  assert.equal(cocPx({ ...lens, viewDist: 7, fstop: 1.8 }), 0);
  const wide = cocPx({ ...lens, viewDist: 14, fstop: 1.8 });
  const deep = cocPx({ ...lens, viewDist: 14, fstop: 16 });
  assert.ok(wide > 8 * deep, `f/1.8 ${wide.toFixed(1)} px vs f/16 ${deep.toFixed(1)} px`);
  assert.ok(cocPx({ ...lens, viewDist: 20, fstop: 1.8 }) > wide);
  assert.ok(wide > 10, `a tabletop f/1.8 background reads as blurred (${wide.toFixed(1)} px)`);
});

test('lens fov: longer lenses are narrower, and 50 mm on a 16:9 frame is about 23 degrees vertical', () => {
  assert.ok(lensFov(85, 16 / 9) < lensFov(35, 16 / 9));
  assert.ok(Math.abs(lensFov(50, 16 / 9) - 22.9) < 0.5, String(lensFov(50, 16 / 9)));
});

test('kelvin: 3200 K is warm, 7500 K is cool, 6600 K is near white', () => {
  const [r1, , b1] = kelvinRgb(3200);
  const [r2, , b2] = kelvinRgb(7500);
  assert.ok(r1 > b1 + 0.3);
  assert.ok(b2 > r2);
  assert.ok(kelvinRgb(6600).every((v) => v > 0.95));
});

test('the spring is closed form: 0 at rest, overshoots only below damping 1, settles at 1', () => {
  assert.equal(spring(0), 0);
  const peak = (damping) => Math.max(...Array.from({ length: 400 }, (_, i) => spring(i / 200, { damping, freq: 3 })));
  assert.ok(peak(0.45) > 1.1);
  assert.ok(peak(1) <= 1 + 1e-9);
  assert.ok(peak(1.5) <= 1 + 1e-9);
  assert.ok(Math.abs(spring(5, { damping: 0.45 }) - 1) < 1e-3);
});

test('squash keeps volume within 1%', () => {
  for (const a of [-0.3, -0.1, 0, 0.15, 0.4]) {
    const s = squash(a);
    assert.ok(Math.abs(s.x * s.y * s.z - 1) < 0.01, `a=${a}`);
  }
});

test('a hop crouches, flies a parabola to its height, and its landing overshoots only when underdamped', () => {
  const opts = { height: 1, air: 0.5 };
  assert.ok(hop(-0.06, 0, opts).squash < 0);
  assert.ok(Math.abs(hop(0.25, 0, opts).y - 1) < 1e-9);
  const landing = (damping) => Array.from({ length: 120 }, (_, i) => hop(0.5 + i / 120, 0, { ...opts, damping }).squash);
  assert.ok(Math.min(...landing(0.45)) < -0.05, 'squashes on landing');
  assert.ok(Math.max(...landing(0.45)) > 0.01, 'damping 0.45 rebounds into a stretch');
  assert.ok(Math.max(...landing(1)) <= 1e-9, 'damping 1 settles without a rebound');
});

test('a hop never jumps between poses, so a motion-blurred frame shows blur and not a double image', () => {
  const opts = { height: 1, air: 0.5, depth: 0.2 };
  for (const [at, o] of [[0, opts], [0.5, opts], [0.03, { ...opts, air: 0.03 }]]) {
    const before = hop(at - 1e-6, 0, o);
    const after = hop(at + 1e-6, 0, o);
    assert.ok(Math.abs(before.squash - after.squash) < 1e-3, `squash continuous at ${at}`);
    assert.ok(Math.abs(before.y - after.y) < 1e-3, `lift continuous at ${at}`);
  }
});

test('blink and lag are pure functions of t: frame 300 read directly equals frame 300 reached by stepping', () => {
  const pose = (t) => hop(t, 4.5, { height: 0.8 }).y + blink(t, [1, 4.9]) + lag((u) => spring(u - 4, { damping: 0.5 }), t, 4);
  let stepped;
  for (let f = 0; f <= 300; f++) stepped = pose(f / 60);
  assert.equal(pose(300 / 60), stepped);
  assert.equal(blink(1, [1]), 1);
  assert.equal(blink(2, [1]), 0);
});
