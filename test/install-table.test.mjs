import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p));
const json = (p) => JSON.parse(read(p).toString('utf8'));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));

const CLONE = '<path to your wjgoarxiv-skills clone>';
const HARNESSES = ['Claude Code', 'Codex CLI', 'OpenCode', 'Grok Build', 'Muse Code', 'Antigravity CLI', 'Hermes Agent'];
const VARIANT_PRODUCTS = ['litcodex', 'litopencode', 'litgrok', 'litgravity', 'litmuse'];

// Every skill the marketplace ships, as [family, id]. A skills/ folder without SKILL.md is a support folder.
const market = json('.claude-plugin/marketplace.json');
const moved = market.plugins.flatMap((p) => {
  const dir = p.source.replace(/^\.\//, '');
  return readdirSync(join(root, dir, 'skills'))
    .filter((id) => existsSync(join(root, dir, 'skills', id, 'SKILL.md')))
    .map((id) => [p.name, id]);
});

// The install lines each product's same-name stub gives, word for word. The scientific-visualization adapter reads
// the source under plugins/figures/vendor/, so the Codex stub copies that too and the Muse stub installs the source.
const expected = (family, id) => {
  const vendor = `${CLONE}/plugins/figures/vendor/scientific-visualization`;
  const sciVis = id === 'lit-scientific-visualization';
  const codexHome = '"${CODEX_HOME:-$HOME/.codex}';
  return {
    'Claude Code': [`claude plugin marketplace add ${CLONE}`, `claude plugin install ${family}@wjgoarxiv-skills`],
    'Codex CLI': [
      `mkdir -p ${codexHome}/skills"`,
      `cp -R "${CLONE}/plugins/${family}/skills/${id}" ${codexHome}/skills/${id}"`,
      ...(sciVis ? [`mkdir -p ${codexHome}/vendor"`, `cp -R "${vendor}" ${codexHome}/vendor/scientific-visualization"`] : []),
    ],
    OpenCode: [`rm -r ~/.config/opencode/skills/${id}`, `cp -R "${CLONE}/variants/litopencode/${id}" ~/.config/opencode/skills/${id}`],
    'Grok Build': [`grok plugin install "${CLONE}#plugins/${family}" --trust`],
    'Muse Code': [`muse skills install ${sciVis ? vendor : `${CLONE}/plugins/${family}/skills/${id}`} --scope user`],
    'Antigravity CLI': [`agy plugin install ${CLONE}/plugins/${family}`],
    'Hermes Agent': [],
  };
};

const readme = read('README.md').toString('utf8');

const table = () => {
  const start = readme.indexOf('## Pick one skill for one harness');
  assert.ok(start >= 0, 'README has the pick-one install table section');
  const lines = readme.slice(start).split('\n');
  const first = lines.findIndex((l) => l.startsWith('|'));
  assert.ok(first > 0, 'the section holds a table');
  const rows = [];
  for (const l of lines.slice(first)) {
    if (!l.startsWith('|')) break;
    rows.push(l.slice(1, -1).split('|').map((c) => c.trim()));
  }
  return { header: rows[0], body: rows.slice(2) };
};

const codeSpans = (cell) => [...cell.matchAll(/`([^`]+)`/gu)].map((m) => m[1]);

test('the pick-one table has one row per marketplace skill and one column per harness', () => {
  const { header, body } = table();
  assert.deepEqual(header, ['Skill', 'Family', ...HARNESSES]);
  const got = body.map((r) => [r[1].replace(/`/gu, ''), r[0].replace(/`/gu, '')]);
  assert.deepEqual(got.map((r) => r.join(':')).sort(), moved.map((r) => r.join(':')).sort());
});

test('every cell carries the install lines its product stub gives, and every path they name exists here', () => {
  const { body } = table();
  for (const row of body) {
    const id = row[0].replace(/`/gu, '');
    const family = row[1].replace(/`/gu, '');
    const want = expected(family, id);
    HARNESSES.forEach((h, i) => {
      const cell = row[i + 2];
      if (h === 'Hermes Agent') assert.equal(cell, 'coming', `${id} × ${h}`);
      else assert.deepEqual(codeSpans(cell), want[h], `${id} × ${h}`);
    });
    for (const line of Object.values(want).flat()) {
      for (const m of line.matchAll(/<path to your wjgoarxiv-skills clone>[/#]([^"\s]+)/gu)) {
        assert.ok(statSync(join(root, m[1])).isDirectory(), `${id}: ${m[1]} exists`);
      }
    }
  }
});

test('every variant is a moved skill id, and its receipt matches the bytes', () => {
  const ids = new Set(moved.map(([, id]) => id));
  for (const product of VARIANT_PRODUCTS) {
    const dir = `variants/${product}`;
    assert.ok(existsSync(join(root, dir)), `${dir} exists`);
    for (const id of readdirSync(join(root, dir))) {
      assert.ok(ids.has(id), `${dir}/${id} is a moved skill`);
      const md = read(`${dir}/${id}/SKILL.md`).toString('utf8');
      assert.match(md, new RegExp(`^---\\nname: "?${id}"?\\n`), `${dir}/${id} frontmatter names it`);
    }
    const rows = read(`receipts/variants-${product}.sha256`).toString('utf8').trim().split('\n').map((l) => l.split('  '));
    const covered = new Set();
    for (const [sha, source, dest] of rows) {
      assert.ok(source && dest, `${product} receipt row has three fields`);
      assert.equal(createHash('sha256').update(read(dest)).digest('hex'), sha, dest);
      covered.add(dest);
    }
    const files = walk(join(root, dir)).map((f) => relative(root, f));
    assert.deepEqual(files.filter((f) => !covered.has(f)), [], `${product} files without a receipt`);
  }
});

test('the OpenCode column names a variant folder for every moved skill', () => {
  for (const [, id] of moved) assert.ok(existsSync(join(root, 'variants/litopencode', id, 'SKILL.md')), id);
});
