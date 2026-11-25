// One frame-analysis worker: decode a captured PNG to RGBA and analyse it off the capture thread
// (the SHA-256 of the decoded RGBA, the flash-audit cells on the frame's own grid, the 0.5th and
// 99.5th percentile luminance, the busy-cell share for DEAD-AIR). The capture loop steps the next
// frame while a pool of these decodes.
import { parentPort } from "node:worker_threads";
import { analyzeFrame, busyShare } from "./analysis.mjs";
import { blendFrames } from "./blend.mjs";
import { decodePng } from "./png.mjs";

const decodeChecked = (png, width, height) => {
  const image = decodePng(Buffer.from(png));
  if (image.width !== width || image.height !== height) throw new Error(`captured ${image.width}x${image.height}, expected ${width}x${height}`);
  return image.channels === 4 ? image.pixels : toRgba(image.pixels, image.channels);
};

// `pngs` (the sub-frame captures of one motion-blurred frame) are averaged first, then analysed as one.
parentPort.on("message", ({ id, png, pngs, width, height }) => {
  try {
    const rgba = pngs ? blendFrames(pngs.map((p) => decodeChecked(p, width, height))) : decodeChecked(png, width, height);
    // A stage frame is opaque: analyzeFrame's alpha-as-ink count is meaningless here and is dropped.
    const { cells, luminanceP995, luminanceP005, rgbaSha256 } = analyzeFrame(rgba, width, height);
    const busy = busyShare(rgba, width, height);
    const buffer = rgba.buffer.slice(rgba.byteOffset, rgba.byteOffset + rgba.byteLength);
    parentPort.postMessage({ id, rgba: buffer, cells, luminanceP995, luminanceP005, rgbaSha256, busy }, [buffer, cells.R.buffer, cells.G.buffer, cells.B.buffer]);
  } catch (error) {
    parentPort.postMessage({ id, error: error.message });
  }
});

function toRgba(pixels, channels) {
  const n = pixels.length / channels;
  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const s = i * channels;
    out[i * 4] = pixels[s];
    out[i * 4 + 1] = pixels[channels >= 3 ? s + 1 : s];
    out[i * 4 + 2] = pixels[channels >= 3 ? s + 2 : s];
    out[i * 4 + 3] = 255;
  }
  return out;
}
