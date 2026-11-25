import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const engine = join(root, 'plugins/video-covers/skills/lit-typographic-motion/engine');
const { validateTreatment } = await import(join(engine, 'node/treatment.mjs'));
const { scaffoldHtml } = await import(join(engine, 'node/scaffold.mjs'));
const base = JSON.parse(readFileSync(join(root, 'test/fixtures/stage-treatment.json'), 'utf8'));

const row = (over = {}) => ({ lensMm: 50, fstop: 2.8, key: { kelvin: 3200, azimuth: 35, elevation: 40 }, fill: { kelvin: 7500, ratio: 0.3 }, heroSpring: { damping: 0.45, freq: 3 }, ...over });
const cinematic = (over = {}) => {
  const { world, ...rest } = base;
  return { ...rest, request: `${base.request} · cinematic`, register: 'cinematic', shots: base.beats.map(() => row()), ...over };
};
const valid = (t) => validateTreatment(t, { examples: [] });

test('a cinematic treatment with a full shot sheet validates without a labelled world', () => {
  assert.equal(valid(cinematic()).register, 'cinematic');
});

test('cinematic needs the request to ask for it, and a 3D stage film', () => {
  assert.throws(() => valid(cinematic({ request: base.request })), /register: cinematic only when the request asks/u);
  assert.throws(() => valid(cinematic({ depth: '2d' })), /register: a cinematic film is a 3D stage film/u);
});

test('the shot sheet: one row per beat, numbers in range, never words', () => {
  assert.throws(() => valid(cinematic({ shots: undefined })), /shots: a cinematic film writes one shot-sheet row per beat/u);
  assert.throws(() => valid(cinematic({ shots: base.beats.slice(1).map(() => row()) })), /shots:/u);
  const bad = (over, re) => assert.throws(() => valid(cinematic({ shots: base.beats.map((_, i) => (i === 2 ? row(over) : row())) })), re);
  bad({ lensMm: 300 }, /shots\[2\]\.lensMm: the focal length in mm must be 14-200/u);
  bad({ lensMm: 'a long lens' }, /shots\[2\]\.lensMm: the focal length in mm as a number/u);
  bad({ key: { kelvin: 'warm', azimuth: 0, elevation: 30 } }, /shots\[2\]\.key\.kelvin/u);
  bad({ heroSpring: { damping: 2, freq: 3 } }, /shots\[2\]\.heroSpring\.damping/u);
  bad({ fstop: 0.5 }, /shots\[2\]\.fstop/u);
});

test('a cinematic shot shows at most two copy lines; a rich film may not carry a shot sheet', () => {
  const beats = base.beats.map((b, i) => (i === 0 ? { ...b, lines: [0, 1, 2] } : b));
  assert.throws(() => valid(cinematic({ beats })), /beats\[0\]\.lines: a cinematic shot shows at most 2 copy lines/u);
  assert.throws(() => valid({ ...base, shots: base.beats.map(() => row()) }), /shots: a shot sheet belongs to a cinematic film/u);
});

test('the 3D scaffold imports the depth kit, carries the shot sheet and renders through the depth of field', () => {
  const html = scaffoldHtml(valid(cinematic()));
  assert.match(html, /from "\/lit\/depth-kit\.js"/u);
  assert.match(html, /const SHEET = \[\{"lensMm":50/u);
  assert.match(html, /DOF\.render\(scene, cam, \{ fstop, focus \}\)/u);
  const rich = scaffoldHtml(valid(base));
  assert.match(rich, /const SHEET = \[\];/u);
  assert.match(html, /fill\.intensity = key\.intensity \* row\.fill\.ratio/u);
});

test('a style picked in the design question ("Style: paper") wins over the house style', async () => {
  const { pickStyle } = await import(join(engine, 'node/styles.mjs'));
  const house = { style: 'swiss-signal' };
  for (const id of ['paper', 'tidal', 'terminalcore', 'swiss-signal']) {
    assert.equal(pickStyle({ request: `A film · Path: stage · Style: ${id} · Format: 16:9`, house }).id, id);
  }
  assert.equal(pickStyle({ request: 'A film about paper cranes', house }).id, 'swiss-signal');
});
