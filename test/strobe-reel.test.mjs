// strobe-reel: film settings, pack contracts and the shared sound data. No Blender, Chrome or ffmpeg.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const KIT = path.join(new URL('..', import.meta.url).pathname, 'plugins/video-covers/skills/lit-strobe-reel');
const filmDir = (n) => path.join(KIT, 'films', n);
const cfgOf = (n) => JSON.parse(readFileSync(path.join(filmDir(n), 'film.json'), 'utf8'));
const run = (dir, kit = KIT) => spawnSync(process.execPath, [path.join(kit, 'make.mjs'), dir, '--check'], { encoding: 'utf8' });
const check = (n) => { const r = run(filmDir(n)); assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout); };
function withFilm(edit, fn, kit) {
  const dir = mkdtempSync(path.join(tmpdir(), 'strobe-'));
  try { const c = cfgOf('lorem-ipsum'); edit(c); writeFileSync(path.join(dir, 'film.json'), JSON.stringify(c)); return fn(run(dir, kit), dir); }
  finally { rmSync(dir, { recursive: true, force: true }); }
}
const refuses = (edit, re, kit) => withFilm(edit, (r) => { assert.equal(r.status, 2, r.stdout + r.stderr); assert.match(r.stderr, re); }, kit);

test('--check prints the beat map of each existing film and writes nothing', () => {
  for (const n of ['hit-hold-cut', 'lorem-ipsum']) {
    const m = check(n);
    assert.equal(m.beats, 40);
    assert.equal(m.map.length, 40);
    assert.deepEqual([...new Set(m.map.map((q) => q.block))], cfgOf(n).acts.flatMap((a) => a.blocks));
    m.map.forEach((q, i) => assert.equal(q.beat, i));
  }
  withFilm(() => {}, (r, dir) => { assert.equal(r.status, 0, r.stderr); assert.deepEqual(readdirSync(dir), ['film.json']); });
});

test('wrong settings are refused by name', () => {
  refuses((c) => { c.pack = 'nope'; }, /pack/);
  refuses((c) => { c.acts[0].blocks.push('wobble'); }, /unknown block: wobble/);
  refuses((c) => { c.acts[0].blocks.push(c.acts[1].blocks[0]); }, /twice/);
  refuses((c) => { c.palette.flood = 'red'; }, /palette\.flood/);
  refuses((c) => { c.words[0] = 'Abcdefghi'; }, /first word/);
  refuses((c) => { c.page = ['Seed 0511']; }, /production data is not copy: "Seed 0511"/);
  refuses((c) => { c.lines = '1200 f'; }, /"lines"/);
  for (const v of [undefined, '7', null]) refuses((c) => { c.seed = v; }, /"seed"/);
  refuses((c) => { c.acts[0].blocks = 'key'; }, /acts/);
  refuses((c) => { c.acts[0].blocks.push('toString'); }, /unknown block: toString/);
  refuses((c) => { delete c.card; }, /"card"/);
  refuses((c) => { c.pack = 5; }, /no pack "5"/);
  refuses((c) => { c.acts.push(null); }, /acts/);
  refuses((c) => { c.words = [1, 2, 3]; }, /"words"/);
  refuses((c) => { c.pack = 'pads'; c.pattern = 'abc'; }, /pattern/);
  const tmp = mkdtempSync(path.join(tmpdir(), 'strobe-'));
  try { writeFileSync(path.join(tmp, 'film.json'), '{ "words": ['); const r = run(tmp); assert.equal(r.status, 2); assert.match(r.stderr, /not valid JSON/); } finally { rmSync(tmp, { recursive: true, force: true }); }
});

test('a film that leaves a shot out does not render it, and needs no card without the blade', async () => {
  const { loadFilm } = await import(path.join(KIT, 'engine/check.mjs'));
  const tmp = mkdtempSync(path.join(tmpdir(), 'strobe-'));
  try {
    const c = cfgOf('lorem-ipsum'); delete c.card; c.acts = [{ label: 'One', blocks: ['impact', 'key', 'print'] }];
    writeFileSync(path.join(tmp, 'film.json'), JSON.stringify(c)); assert.deepEqual(Object.keys((await loadFilm(tmp)).plates).sort(), ['key', 'print']);
    c.card = ['a']; c.acts[0].blocks.push('dither'); writeFileSync(path.join(tmp, 'film.json'), JSON.stringify(c)); const p = Object.keys((await loadFilm(tmp)).plates);
    for (const [k] of (await loadFilm(tmp)).pack.dither) assert.ok(p.includes(k), k);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

test('a pack that misses a part of its contract is refused by name', () => {
  const kit = mkdtempSync(path.join(tmpdir(), 'strobe-kit-'));
  try {
    for (const f of ['make.mjs', 'engine', 'packs']) cpSync(path.join(KIT, f), path.join(kit, f), { recursive: true });
    const bad = (file, from, to, re) => {
      const f = path.join(kit, 'packs/keys', file), was = readFileSync(f, 'utf8'); assert.ok(was.includes(from), `${file} has ${from}`);
      writeFileSync(f, was.replaceAll(from, to)); refuses(() => {}, re, kit); writeFileSync(f, was);
    };
    bad('data.mjs', "'triangle'", "", /pack keys: three marks/);
    bad('cues.mjs', 'dial()', 'dialx()', /pack keys: no sound for dial/);
    bad('shots.py', 'def dial()', 'def dialx()', /pack keys: no shot dial/);
    bad('data.mjs', 'key:2,', 'key:2,crop:3,', /pack keys: crop is a block of every pack/);
  } finally { rmSync(kit, { recursive: true, force: true }); }
});

test('levels: one loudness value and one wave strip per frame, matching a 440 Hz tone', async () => {
  const { levels, SR } = await import(path.join(KIT, 'engine/audio.mjs'));
  const n = SR * 2, s = new Int16Array(n);
  for (let i = n / 2; i < n; i++) s[i] = Math.round(16383 * Math.sin(2 * Math.PI * 440 * i / SR));
  const L = levels(s);
  assert.equal(L.level.length, 120);
  assert.equal(L.wave.length, 120);
  L.level.slice(0, 60).forEach((v) => assert.equal(v, 0));
  L.level.slice(60).forEach((v) => assert.ok(Math.abs(v - .5 / Math.SQRT2) < .02, String(v)));
  L.wave[90].forEach((v) => assert.ok(Math.abs(v) <= .51));
});

test('the sound of the existing films is the same file as before', { skip: !existsSync(path.join(KIT, '../../../../.litclaude/evidence/strobe-reel-examples/ref')) }, async () => {
  const { soundtrack, wav } = await import(path.join(KIT, 'engine/audio.mjs')), { loadFilm } = await import(path.join(KIT, 'engine/check.mjs'));
  for (const n of ['hit-hold-cut', 'lorem-ipsum']) {
    const film = await loadFilm(filmDir(n));
    assert.ok(wav(soundtrack(film)).equals(readFileSync(path.join(KIT, '../../../../.litclaude/evidence/strobe-reel-examples/ref', n, 'audio.wav'))), n);
  }
});

const NEW = ['board-ride-exit', 'rec-play-erase', 'place-wait-take', 'kick-snare-hat'];
test('no two films are one film: own blocks, core overlap, order and opening', async () => {
  const { loadFilm } = await import(path.join(KIT, 'engine/check.mjs')), { CORE } = await import(path.join(KIT, 'engine/blocks.mjs'));
  const films = {}; for (const n of [...NEW, 'hit-hold-cut', 'lorem-ipsum']) films[n] = await loadFilm(filmDir(n));
  const core = (f) => f.order.filter((b) => b in CORE);
  for (const n of NEW) {
    const f = films[n], own = Object.keys(f.pack.blocks);
    assert.equal(own.length, 6, n); assert.deepEqual(own.filter((b) => !f.order.includes(b)), [], `${n} uses all its own blocks`);
    assert.ok(core(f).length <= 14, `${n}: ${core(f).length} core blocks`);
    for (const [m, g] of Object.entries(films)) if (m !== n) {
      assert.notDeepEqual(f.order, g.order); assert.notDeepEqual(f.order.slice(0, 2), g.order.slice(0, 2), `${n} opens like ${m}`);
      if (NEW.includes(m)) { const both = core(f).filter((b) => core(g).includes(b)); assert.ok(both.length <= 11, `${n} and ${m} share ${both}`); assert.notEqual(f.name, g.name); }
    }
    const mine = new Set([...Object.keys(f.pack.shots), 'cols', 'index', 'print']);
    assert.deepEqual(Object.keys(f.plates).filter((p) => !mine.has(p)), [], `${n} plates`); assert.ok(f.pack.dither.every(([p]) => mine.has(p)));
    assert.ok(f.map.length * .4 >= 12 && f.map.length * .4 <= 18, `${n} length`);
  }
});
test('every pack draws its three marks, page, strobe and flash, and renders its shots', () => {
  for (const p of readdirSync(path.join(KIT, 'packs'))) {
    const js = readFileSync(path.join(KIT, 'packs', p, 'scenes.js'), 'utf8'), py = readFileSync(path.join(KIT, 'packs', p, 'shots.py'), 'utf8');
    for (const d of ['page', 'strobe', 'flash']) assert.ok(js.includes(`DRAW.${d}=`), `${p} DRAW.${d}`);
    assert.match(py, /^def parts\(G\):/m); assert.match(py, /^def props\(\):/m);
  }
});

const make = (args, env = {}) => spawnSync(process.execPath, [path.join(KIT, 'make.mjs'), ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
test('new copies the example of a pack, and refuses an existing folder, an unknown pack and the skill folder', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'strobe-new-'));
  try {
    for (const p of readdirSync(path.join(KIT, 'packs'))) {
      const dir = path.join(tmp, p), r = make(['new', dir, '--pack', p]); assert.equal(r.status, 0, r.stderr);
      assert.deepEqual(readdirSync(dir), ['film.json']); assert.equal(JSON.parse(run(dir).stdout).pack, p);
    }
    let r = make(['new', path.join(tmp, 'keys'), '--pack', 'keys']); assert.equal(r.status, 2); assert.match(r.stderr, /already exists/);
    r = make(['new', path.join(tmp, 'x'), '--pack', 'nope']); assert.equal(r.status, 2); assert.match(r.stderr, /no pack "nope"/); assert.ok(!existsSync(path.join(tmp, 'x')));
    r = make(['new', path.join(KIT, 'films/zz'), '--pack', 'keys']); assert.equal(r.status, 2); assert.match(r.stderr, /outside the skill/); assert.ok(!existsSync(path.join(KIT, 'films/zz')));
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
test('building inside the skill folder is refused, and a missing font or tool is named', () => {
  let r = make([filmDir('lorem-ipsum'), '--sheet']); assert.equal(r.status, 2); assert.match(r.stderr, /outside the skill/); assert.deepEqual(readdirSync(filmDir('lorem-ipsum')), ['film.json']);
  withFilm(() => {}, (_, dir) => {
    for (const [k, re] of [['PRETENDARD_BLACK', /Pretendard Black/], ['CHROME_PATH', /Chrome/], ['BLENDER_PATH', /Blender/]]) { r = make([dir, '--sheet'], { PRETENDARD_BLACK: process.execPath, CHROME_PATH: process.execPath, BLENDER_PATH: process.execPath, [k]: '/nowhere/x' }); assert.equal(r.status, 2, r.stdout); assert.match(r.stderr, re); }
    assert.deepEqual(readdirSync(dir), ['film.json']);
  });
});
test('the block lengths written in SKILL.md are the ones in the code', async () => {
  const md = readFileSync(path.join(KIT, 'SKILL.md'), 'utf8'), { CORE } = await import(path.join(KIT, 'engine/blocks.mjs')), { loadFilm } = await import(path.join(KIT, 'engine/check.mjs')); const code = { ...CORE };
  for (const n of readdirSync(path.join(KIT, 'films'))) Object.assign(code, (await loadFilm(filmDir(n))).pack.blocks);
  assert.deepEqual(Object.fromEntries([...md.matchAll(/`(\w+)` (\d+)/g)].map((m) => [m[1], +m[2]])), code);
});
test('a film can carry its own pack beside film.json, and a broken one is refused by name', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'strobe-own-'));
  try {
    const dir = path.join(tmp, 'a'); let r = make(['new', dir, '--pack', 'keys', '--own']); assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(readdirSync(dir).sort(), ['film.json', 'pack']); assert.deepEqual(readdirSync(path.join(dir, 'pack')).sort(), ['cues.mjs', 'data.mjs', 'scenes.js', 'shots.py']);
    const edit = (f, a, b) => { const p = path.join(dir, 'pack', f), s = readFileSync(p, 'utf8'); assert.ok(s.includes(a)); writeFileSync(p, s.replaceAll(a, b)); };
    edit('data.mjs', 'key:2,', 'key:3,');
    r = run(dir); assert.equal(r.status, 0, r.stderr); assert.equal(JSON.parse(r.stdout).pack, 'own'); assert.equal(JSON.parse(r.stdout).map.filter((m) => m.block === 'key').length, 3);
    rmSync(path.join(dir, 'pack/cues.mjs')); r = run(dir); assert.equal(r.status, 2); assert.match(r.stderr, /pack own: no cues\.mjs/);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

test('footage: a shot is copied in from frames already rendered, and a wrong folder is refused by name', async () => {
  const { loadFilm } = await import(path.join(KIT, 'engine/check.mjs')), tmp = mkdtempSync(path.join(tmpdir(), 'strobe-foot-'));
  try {
    const src = path.join(tmp, 'take/out/plates'), dir = path.join(tmp, 'reel'); mkdirSync(src, { recursive: true }); mkdirSync(dir);
    for (let i = 0; i < 959; i++) writeFileSync(path.join(src, `day-${String(i).padStart(2, '0')}.jpg`), '');
    const put = (f) => writeFileSync(path.join(dir, 'film.json'), JSON.stringify({ ...cfgOf('two-glasses'), footage: f }));
    const no = (f, re) => { put(f); const r = run(dir); assert.equal(r.status, 2, r.stdout); assert.match(r.stderr, re); };
    no({ day: '../take/out/plates' }, /footage\.day: no day-959\.jpg/);
    writeFileSync(path.join(src, 'day-959.jpg'), '');
    no({ cup: '../take/out/plates' }, /no shot "cup"/);
    no({ day: 'out/plates' }, /this film's own plates/);
    no(['x'], /"footage" maps a shot/);
    put({ day: '../take/out/plates' }); assert.equal(run(dir).status, 0);
    const film = await loadFilm(dir); assert.equal(film.footage.day, src); assert.equal(film.plates.day, 960);
    const take = await loadFilm(filmDir('two-glasses')); assert.equal(take.plates.day, 960, 'a shot with no block of its name is always needed');
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

test('the train film cuts one long shot on the schedule its pack writes once', async () => {
  const { loadFilm } = await import(path.join(KIT, 'engine/check.mjs'));
  const f = await loadFilm(filmDir('wait-pass-gone')); assert.equal(f.plates.plat, 408, 'one long shot');
  for (const k of ['wins', 'joints', 'bogies', 'cuts', 'can']) assert.ok(k in f.pack.shot, `shot.${k}`);
  assert.equal(check('wait-pass-gone').beats, 38);
});
