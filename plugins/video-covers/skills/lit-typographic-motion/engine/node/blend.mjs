// Stage-path motion blur. A master frame n is the average of `samples` captures taken at frame times
// n + shutter((i + 0.5)/samples - 0.5), the same sub-frame rule the type engine uses, averaged in linear
// light so a bright edge sweeping over a dark ground keeps its brightness instead of greying out.
import { STAGE_BLUR } from "../core/constants.mjs";

/** The sub-frame offsets, in frames, for one master frame; one sample is [0]. */
export function subframeOffsets(samples = STAGE_BLUR.samples, shutter = STAGE_BLUR.shutter) {
  if (samples <= 1 || shutter <= 0) return [0];
  return Array.from({ length: samples }, (_, i) => +(shutter * ((i + 0.5) / samples - 0.5)).toFixed(6));
}

/**
 * The frame times one master frame f is sampled at. A shutter never straddles a cut: every sub-frame
 * is clamped between the cut before f and the cut after it (each beat's t0 in seconds is a cut), and
 * never before t = 0. Averaging across a hard cut would add a frame that is half one shot and half the
 * next. A frame after the last cut, or in a gap between beats, is bounded by the cuts around it only.
 */
export function shutterFrames(f, offsets, fps, beats = []) {
  const t = f / fps;
  const cuts = beats.map((b) => b.t0).filter((c) => c > 0).sort((a, b) => a - b);
  let lo = 0;
  let hi = Infinity;
  for (const c of cuts) {
    // a cut computed as 2.3000000000000003 still owns the frame at 2.3 s
    if (c <= t + 1e-9) lo = c * fps;
    else {
      hi = c * fps - 1e-3;
      break;
    }
  }
  return offsets.map((o) => Math.min(hi, Math.max(lo, f + o)));
}

/**
 * The blur a treatment asks for: its `motionBlur` (an empty object takes the defaults, `{ samples: 1 }`
 * turns it off). Without the field only a cinematic film blurs: each sub-frame is one more capture, so
 * any other film takes a single capture a frame unless it asks.
 */
export function blurFor(treatment) {
  const mb = treatment?.motionBlur ?? (treatment?.register === "cinematic" ? {} : { samples: 1 });
  return { samples: mb.samples ?? STAGE_BLUR.samples, shutter: mb.shutter ?? STAGE_BLUR.shutter };
}

const TO_LINEAR = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  TO_LINEAR[i] = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
const LUT_SIZE = 4096;
const TO_SRGB = new Uint8Array(LUT_SIZE + 1);
for (let i = 0; i <= LUT_SIZE; i++) {
  const l = i / LUT_SIZE;
  const c = l <= 0.0031308 ? l * 12.92 : 1.055 * l ** (1 / 2.4) - 0.055;
  TO_SRGB[i] = Math.max(0, Math.min(255, Math.round(c * 255)));
}

/** Average equal-size RGBA buffers in linear light; alpha is set opaque (a stage frame is opaque). */
export function blendFrames(frames) {
  if (frames.length === 1) return frames[0];
  const n = frames[0].length;
  const acc = new Float32Array(n);
  for (const f of frames) {
    if (f.length !== n) throw new Error("blendFrames: frames differ in size");
    for (let i = 0; i < n; i += 4) {
      acc[i] += TO_LINEAR[f[i]];
      acc[i + 1] += TO_LINEAR[f[i + 1]];
      acc[i + 2] += TO_LINEAR[f[i + 2]];
    }
  }
  const out = Buffer.alloc(n);
  const k = LUT_SIZE / frames.length;
  for (let i = 0; i < n; i += 4) {
    out[i] = TO_SRGB[Math.min(LUT_SIZE, Math.round(acc[i] * k))];
    out[i + 1] = TO_SRGB[Math.min(LUT_SIZE, Math.round(acc[i + 1] * k))];
    out[i + 2] = TO_SRGB[Math.min(LUT_SIZE, Math.round(acc[i + 2] * k))];
    out[i + 3] = 255;
  }
  return out;
}
