// The pure half of the depth kit, served at /lit/depth-math.js and imported by /lit/depth-kit.js: lens
// optics and closed-form character motion. No imports and no state, so the tests run it in Node and a
// frame drawn directly equals the same frame reached by stepping.

/** Circle of confusion in pixels for a point at viewDist (scene units), a thin lens. */
export function cocPx({ viewDist, focus, focalMm, fstop, filmMm, widthPx, unitM }) {
  const f = focalMm / 1000;
  const z = viewDist * unitM;
  const s = focus * unitM;
  if (z <= f || s <= f) return 0;
  const cocM = ((f / fstop) * f * Math.abs(z - s)) / (z * (s - f));
  return (cocM / (filmMm / 1000)) * widthPx;
}

/** Vertical field of view (degrees) of a lens on the 36 x 24 mm frame, fitted to the film's aspect. */
export function lensFov(focalMm, aspect) {
  const filmH = aspect >= 36 / 24 ? 36 / aspect : 24;
  return (2 * Math.atan(filmH / 2 / focalMm) * 180) / Math.PI;
}

/**
 * sRGB 0-1 [r, g, b] of a black-body light at k kelvin (1000-40000). The constants are Tanner Helland's
 * published curve fit to black-body colour data (2012); the code is written here.
 */
export function kelvinRgb(k) {
  const t = Math.max(1000, Math.min(40000, k)) / 100;
  let r = 255;
  let g;
  let b = 255;
  if (t <= 66) {
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * (t - 60) ** -0.1332047592;
    g = 288.1221695283 * (t - 60) ** -0.0755148492;
  }
  return [r, g, b].map((v) => Math.max(0, Math.min(255, v)) / 255);
}

/**
 * A damped spring released at t = 0 from 0 towards 1, in closed form: the value at t is computed
 * from t alone. damping is the ratio (0.2 bouncy, 1 no overshoot), freq the natural frequency in Hz.
 */
export function spring(t, { damping = 0.5, freq = 3 } = {}) {
  if (t <= 0) return 0;
  const w = 2 * Math.PI * freq;
  const z = damping;
  if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
  }
  if (z === 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const r1 = -w * (z - Math.sqrt(z * z - 1));
  const r2 = -w * (z + Math.sqrt(z * z - 1));
  return 1 + (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r1 - r2);
}

/** Volume-preserving squash and stretch: a > 0 stretches tall, a < 0 squashes flat. */
export function squash(a) {
  const y = Math.max(0.2, 1 + a);
  const xz = 1 / Math.sqrt(y);
  return { x: xz, y, z: xz };
}

/**
 * One hop from t0: a crouch, a parabolic flight of `air` seconds to `height`, and a landing that
 * squashes and settles on a spring. Returns the lift y and the squash amount for squash().
 */
export function hop(t, t0, { height = 1, air = 0.5, crouch = 0.12, depth = 0.18, damping = 0.45, freq = 3.2 } = {}) {
  const u = t - t0;
  if (u < -crouch) return { y: 0, squash: 0 };
  if (u < 0) {
    const p = 1 + u / crouch;
    return { y: 0, squash: -depth * Math.sin((p * Math.PI) / 2) };
  }
  // squash is continuous everywhere: a motion-blurred frame averages the poses inside its shutter, and a
  // jump between two poses shows as a double image rather than as blur
  if (u < air) {
    const p = u / air;
    const flight = depth * 0.8 * Math.cos(p * Math.PI);
    const release = Math.min(1, u / Math.min(0.05, air));
    return { y: 4 * height * p * (1 - p), squash: -depth + (flight + depth) * release };
  }
  const v = u - air;
  // the landing: from the flight's end into a deeper squash that the spring returns to rest,
  // overshooting when damping < 1
  const settle = 1 - spring(v, { damping, freq });
  const kick = 0.8 + 0.2 * Math.min(1, v / 0.04);
  return { y: 0, squash: -depth * settle * kick };
}

/** Eyelid closure 0 (open) to 1 (shut) for blinks centred at each of `times`, each `dur` seconds long. */
export function blink(t, times, dur = 0.14) {
  let c = 0;
  for (const b of times) {
    const p = (t - b) / dur + 0.5;
    if (p > 0 && p < 1) c = Math.max(c, Math.sin(p * Math.PI));
  }
  return c;
}

/** Follow-through: the same pose function, read `frames` frames late. */
export function lag(fn, t, frames, fps = 60) {
  return fn(t - frames / fps);
}
