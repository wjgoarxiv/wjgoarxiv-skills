// Place Wait Take: both sequences are legal Go, checked with a liberty count that does not use the pack's own rules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
const KIT = path.join(new URL('..', import.meta.url).pathname, 'plugins/video-covers/skills/lit-strobe-reel');
const { ladder, capture, start, play } = await import(path.join(KIT, 'packs/stones/data.mjs'));

const next = (k) => { const [a, b] = k.split(',').map(Number); return [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]].filter(([c, d]) => c >= 0 && d >= 0 && c < 19 && d < 19).map(String); };
function chain(pos, k) { const seen = new Set([k]); for (const s of seen) for (const n of next(s)) if (pos.get(n) === pos.get(k)) seen.add(n); return seen; }
const liberties = (pos, k) => new Set([...chain(pos, k)].flatMap(next).filter((n) => !pos.has(n))).size;

function replay({ set, moves }) {
  const pos = new Map(set.map(([c, a, b]) => [`${a},${b}`, c])); let taken = [];
  assert.equal(pos.size, set.length, 'set-up stones do not overlap');
  moves.forEach(([c, a, b], i) => {
    const k = `${a},${b}`; assert.ok(!pos.has(k), `move ${i} (${c} ${k}) is on an empty point`);
    if (i) assert.notEqual(c, moves[i - 1][0], `move ${i} alternates`);
    pos.set(k, c);
    const dead = new Set(); for (const n of next(k)) if (pos.has(n) && pos.get(n) !== c && liberties(pos, n) === 0) chain(pos, n).forEach((s) => dead.add(s));
    dead.forEach((s) => pos.delete(s));
    assert.ok(liberties(pos, k) > 0, `move ${i} keeps a liberty`);
    if (dead.size) { assert.equal(i, moves.length - 1, `move ${i}: only the last move captures`); taken = [...dead]; }
  });
  return { pos, taken };
}
test('the ladder is legal and its last stone takes the whole chain', () => {
  const l = ladder(), { taken } = replay(l), black = [...l.set, ...l.moves].filter((m) => m[0] === 'B').map((m) => `${m[1]},${m[2]}`);
  assert.deepEqual(taken.sort(), black.sort());
  l.moves.forEach((m, i) => { if (m[0] === 'W' && i < l.moves.length - 1) { const pos = start(l.set); l.moves.slice(0, i + 1).forEach((q) => play(pos, q)); const head = i ? `${l.moves[i - 1][1]},${l.moves[i - 1][2]}` : '9,9'; assert.equal(liberties(pos, head), 1, `white ${i} gives atari`); } });
});
test('the capture removes the diamond, and nothing else leaves the board', () => {
  const c = capture(), { pos, taken } = replay(c);
  assert.equal(taken.length, 41);
  assert.deepEqual(taken.sort(), c.set.map((m) => `${m[1]},${m[2]}`).sort());
  assert.equal(pos.size, c.moves.length);
});
test('the pack rules agree with the independent count on what is taken', () => {
  for (const s of [ladder(), capture()]) { const pos = start(s.set); let out = []; for (const m of s.moves) out = play(pos, m); assert.deepEqual(out.sort(), replay(s).taken.sort()); }
});
test('an illegal move is refused by name', () => {
  const c = capture(); assert.throws(() => play(start(c.set), ['W', 9, 9]), /illegal move W 9,9/);
  const bad = { set: c.set, moves: [...c.moves.slice(0, 4), ['W', 9, 9]] }; assert.throws(() => replay(bad), /move 4 \(W 9,9\)/);
});
