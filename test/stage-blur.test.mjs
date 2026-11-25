import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const engine = join(root, 'plugins/video-covers/skills/lit-typographic-motion/engine');
const { blendFrames, blurFor, shutterFrames, subframeOffsets } = await import(join(engine, 'node/blend.mjs'));
const { validateTreatment } = await import(join(engine, 'node/treatment.mjs'));
const { STAGE_BLUR } = await import(join(engine, 'core/constants.mjs'));

const W = 200;
const H = 4;
// A white bar 20 px wide whose left edge sits at x = 40 + speed * t (frames), on black.
const barFrame = (x0) => {
  const buf = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const on = x >= Math.round(x0) && x < Math.round(x0) + 20;
    const o = (y * W + x) * 4;
    buf[o] = buf[o + 1] = buf[o + 2] = on ? 255 : 0;
    buf[o + 3] = 255;
  }
  return buf;
};
// Pixels on row 0 that are neither black nor white: the width of the blurred edges.
const edgeWidth = (rgba) => {
  let n = 0;
  for (let x = 0; x < W; x++) if (rgba[x * 4] > 8 && rgba[x * 4] < 247) n++;
  return n;
};

test('sub-frame offsets are centred on the frame, span the shutter, and collapse to one sample', () => {
  assert.deepEqual(subframeOffsets(1, 0.45), [0]);
  assert.deepEqual(subframeOffsets(16, 0), [0]);
  const o = subframeOffsets(16, 0.45);
  assert.equal(o.length, 16);
  assert.ok(Math.abs(o.reduce((a, b) => a + b, 0)) < 1e-9);
  assert.ok(o.every((v, i) => i === 0 || v > o[i - 1]));
  assert.ok(o[15] - o[0] < 0.45 && o[15] - o[0] > 0.4);
});

test('the shutter never straddles a cut: sub-frames stay inside the frame\'s own shot', () => {
  const beats = [{ t0: 0, t1: 4 }, { t0: 4, t1: 8 }];
  const o = subframeOffsets(16, 0.45);
  const first = shutterFrames(240, o, 60, beats);
  assert.ok(first.every((v) => v >= 240), 'the first frame of a shot samples nothing from the shot before');
  assert.ok(first.some((v) => v > 240));
  const last = shutterFrames(239, o, 60, beats);
  assert.ok(last.every((v) => v < 240), 'the last frame of a shot samples nothing from the next');
  assert.ok(shutterFrames(0, o, 60, beats).every((v) => v >= 0));
  assert.deepEqual(shutterFrames(120, o, 60, beats), o.map((v) => 120 + v));
});

test('frames after the last beat, and a cut time with float error, still blur around their own time', () => {
  const o = subframeOffsets(16, 0.45);
  const tail = shutterFrames(1000, o, 60, [{ t0: 0, t1: 16 }]);
  assert.deepEqual(tail, o.map((v) => 1000 + v), 'a tail past the last beat does not freeze on the beat end');
  const cut = 0.1 + 0.2; // 0.30000000000000004 s, frame 18 at 60 fps
  const atCut = shutterFrames(18, o, 60, [{ t0: 0, t1: cut }, { t0: cut, t1: 1 }]);
  assert.ok(atCut.every((v) => v >= 18 - 1e-6), 'the cut frame belongs to the shot it opens');
});

test('only a cinematic film blurs by default; motionBlur turns it on or off for any film', () => {
  const on = { samples: STAGE_BLUR.samples, shutter: STAGE_BLUR.shutter };
  for (const register of [undefined, 'rich', 'minimal']) assert.equal(blurFor({ register }).samples, 1, `${register} takes one capture a frame`);
  assert.deepEqual(blurFor({ register: 'cinematic' }), on);
  assert.deepEqual(blurFor({ register: 'rich', motionBlur: {} }), on);
  assert.deepEqual(blurFor({ register: 'rich', motionBlur: { samples: 8 } }), { samples: 8, shutter: STAGE_BLUR.shutter });
  assert.equal(blurFor({ register: 'cinematic', motionBlur: { samples: 1 } }).samples, 1);
});

test('blending averages in linear light: half white over black is not mid grey', () => {
  const white = Buffer.from([255, 255, 255, 255]);
  const black = Buffer.from([0, 0, 0, 255]);
  const mid = blendFrames([white, black]);
  assert.ok(mid[0] >= 186 && mid[0] <= 189, `got ${mid[0]}`);
  assert.equal(mid[3], 255);
  assert.deepEqual([...blendFrames([white, white, white])], [255, 255, 255, 255]);
});

test('a fast-moving bar gets edges at least 4x wider at 16 samples than at 1', () => {
  const speed = 24; // px per frame
  const at = (offsets) => blendFrames(offsets.map((o) => barFrame(40 + speed * (5 + o))));
  const sharp = edgeWidth(at(subframeOffsets(1, 0.45)));
  const blurred = edgeWidth(at(subframeOffsets(16, 0.45)));
  assert.equal(sharp, 0);
  assert.ok(blurred >= 4 * Math.max(1, sharp) && blurred >= 16, `edge width ${blurred}`);
});

test('the validator accepts motionBlur in range and refuses it outside, naming the field', () => {
  const base = JSON.parse(readFileSync(join(root, 'test/fixtures/stage-treatment.json'), 'utf8'));
  const check = (motionBlur) => validateTreatment({ ...base, motionBlur }, { examples: [] });
  assert.equal(validateTreatment(base, { examples: [] }).path, 'stage');
  assert.deepEqual(check({ samples: 8, shutter: 0.5 }).motionBlur, { samples: 8, shutter: 0.5 });
  assert.throws(() => check({ samples: 64 }), /motionBlur\.samples/u);
  assert.throws(() => check({ samples: 2.5 }), /motionBlur\.samples/u);
  assert.throws(() => check({ shutter: 2 }), /motionBlur\.shutter/u);
  assert.throws(() => check([16]), /motionBlur/u);
});
