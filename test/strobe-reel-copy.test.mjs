// strobe-reel: only the film's own words reach the screen. Every frame of every example is drawn on a stub canvas and its text is judged.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const KIT = path.join(new URL('..', import.meta.url).pathname, 'plugins/video-covers/skills/lit-strobe-reel');
const { judge, slop } = await import(path.join(KIT, 'engine/copy.mjs'));
const { loadFilm } = await import(path.join(KIT, 'engine/check.mjs'));
const { soundtrack, levels } = await import(path.join(KIT, 'engine/audio.mjs'));

const SLOP = ['1400 stars', '24000 points', 'Seed 0511', '1200 f / 60 fps', '150 bpm', '20.0 s', 'Fig. 1', '00:00:04:16', '01/49', 'x 1420  y 508', '590 x 590', 'frame 012', 'copy 1', 'weight 900', 'mark 1', 'boot ldd/150', 'invented planet', 'roll 49.2', 'range 5.25', 'step 3'];
const cfg = { words: ['Leave', 'Drift', 'Dock'], sub: ['떠나고', '흐르고', '닿는다'], page: ['Nothing moves.'], lines: ['Nobody answers.'], acts: [{ label: 'Between', blocks: [] }] };
test('only the words of the film pass, whole, cut or joined', () => {
  const ok = judge(cfg, {});
  for (const s of ['Leave', 'LEAVE', 'Le', 'L', '떠', '떠나고', '떠나고 흐르고 닿는다', 'Leave / Drift / Dock', 'Nothing moves.', 'Nobody answers.', '4', '', ' ']) assert.ok(ok(s), s);
  for (const s of [...SLOP, 'globe', 'Between two']) assert.ok(!ok(s), s);
  assert.ok(judge(cfg, { signs: ['+3'] })('+3'));
});
test('production data is refused even when film.json carries it', () => {
  for (const s of SLOP.filter((s) => !['invented planet', 'boot ldd/150', 'mark 1', 'copy 1', 'weight 900', 'roll 49.2', 'range 5.25'].includes(s))) assert.ok(slop(s), s);
  for (const s of ['Nothing moves.', 'loud. So this one is silent.', '닿는다', 'She left at nine.', 'Room 4']) assert.ok(!slop(s), s);
});

// a canvas that draws nothing and remembers its text
function texts(film) {
  const seen = new Map(); let at = -1;
  const measure = (s) => ({ width: 60 * [...s].length, actualBoundingBoxLeft: 0, actualBoundingBoxRight: 60 * Math.max(1, [...s].length), actualBoundingBoxAscent: 72, actualBoundingBoxDescent: 0 });
  const any = () => new Proxy(function () {}, { get: (_, k) => (k === Symbol.toPrimitive ? () => 1 : any()), apply: () => any(), set: () => true });
  const ctx = () => new Proxy({}, { get: (t, k) => k === 'measureText' ? measure : k === 'fillText' ? (s) => { if (!seen.has(String(s))) seen.set(String(s), at); } : k === 'getImageData' ? (a, b, w, h) => ({ data: new Uint8Array(w * h * 4).fill(255) }) : k in t ? t[k] : () => any(), set: (t, k, v) => { t[k] = v; return true; } });
  const canvas = () => ({ width: 0, height: 0, toDataURL: () => '', getContext: (k) => (k === '2d' ? ctx() : any()) });
  const html = readFileSync(path.join(KIT, 'engine/reel.html'), 'utf8').replace('/*PACK*/', () => film.js);
  const box = { console, Math, document: { createElement: canvas, getElementById: canvas, fonts: { load: async () => {} } }, Image: class { width = 1920; height = 1080; set src(_) { this.onload(); } }, CanvasRenderingContext2D: class { fillText() {} }, CFG: film.cfg, LEN: film.len, PACK: film.pack, PLATES: film.plates, LEVELS: levels(soundtrack(film)) };
  box.window = box; vm.createContext(box);
  const js = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1].replace('/*CFG*/', '')).join('\n;');
  vm.runInContext(js + `;window.one=f=>{const b=Math.floor(f/BF);x.setTransform(1,0,0,1,0,0);S(b,f%BF)};`, box);
  return box.ready.then(() => { const n = film.map.length * 24; for (at = 0; at < n; at++) box.one(at); at = n; box.flat(); return seen; });
}
for (const n of readdirSync(path.join(KIT, 'films'))) test(`${n}: no frame draws a word that is not the film's`, async () => {
  const film = await loadFilm(path.join(KIT, 'films', n)), seen = await texts(film), ok = judge(film.cfg, film.pack);
  assert.ok(seen.size > 3, 'the stub saw the text');
  assert.deepEqual([...seen].filter(([s]) => !ok(s)).map(([s, f]) => `${s} @${f < film.map.length * 24 ? film.map[Math.max(0, Math.floor(f / 24))].block : 'poster'}`), []);
});
test('no pack models a text that is not the film\'s: literals are single glyphs or declared signs', async () => {
  for (const n of readdirSync(path.join(KIT, 'films'))) {
    const film = await loadFilm(path.join(KIT, 'films', n)), py = readFileSync(path.join(film.pdir, 'shots.py'), 'utf8');
    for (const [, s] of py.matchAll(/\btext\("([^"]*)"/g)) assert.ok([...s].length < 2 || (film.pack.signs || []).includes(s), `${film.name}: "${s}"`);
  }
});
