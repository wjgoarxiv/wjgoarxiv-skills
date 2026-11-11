import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p));
const json = (p) => JSON.parse(read(p).toString('utf8'));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));

const CLONE = '<path to your wjgoarxiv-skills clone>';
const HARNESSES = ['Claude Code', 'Codex CLI', 'OpenCode', 'Grok Build', 'Muse Code', 'Antigravity CLI', 'Hermes Agent'];
const VARIANT_PRODUCTS = ['litcodex', 'litopencode', 'litgrok', 'litgravity', 'litmuse', 'lithermes'];

// Every skill the marketplace ships, as [family, id]. A skills/ folder without SKILL.md is a support folder.
const market = json('.claude-plugin/marketplace.json');
const moved = market.plugins.flatMap((p) => {
  const dir = p.source.replace(/^\.\//, '');
  return readdirSync(join(root, dir, 'skills'))
    .filter((id) => existsSync(join(root, dir, 'skills', id, 'SKILL.md')))
    .map((id) => [p.name, id]);
});

// The install lines each product's same-name stub gives, word for word. Claude Code installs the family plugin;
// every other harness installs that product's own edition of the one skill from variants/<product>/<id>.
const expected = (family, id) => {
  const codexHome = '"${CODEX_HOME:-$HOME/.codex}';
  const hermesHome = '"${HERMES_HOME:-$HOME/.hermes}';
  return {
    'Claude Code': ['claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills', `claude plugin install ${family}@wjgoarxiv-skills`],
    'Codex CLI': [`mkdir -p ${codexHome}/skills"`, `cp -R "${CLONE}/variants/litcodex/${id}" ${codexHome}/skills/${id}"`],
    OpenCode: [`rm -r ~/.config/opencode/skills/${id}`, `cp -R "${CLONE}/variants/litopencode/${id}" ~/.config/opencode/skills/${id}`],
    'Grok Build': ['git clone https://github.com/wjgoarxiv/wjgoarxiv-skills', `grok plugin install "${CLONE}/variants/litgrok/${id}" --trust`],
    'Muse Code': [`muse skills install ${CLONE}/variants/litmuse/${id} --scope user`],
    'Antigravity CLI': [`mkdir -p ~/.gemini/config/skills && cp -R "${CLONE}/variants/litgravity/${id}" ~/.gemini/config/skills/`],
    'Hermes Agent': [`mkdir -p ${hermesHome}/skills"`, `cp -R "${CLONE}/variants/lithermes/${id}" ${hermesHome}/skills/"`],
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
      assert.deepEqual(codeSpans(cell), want[h], `${id} × ${h}`);
    });
    for (const line of Object.values(want).flat()) {
      for (const m of line.matchAll(/<path to your wjgoarxiv-skills clone>\/([^"\s]+)/gu)) {
        assert.ok(statSync(join(root, m[1])).isDirectory(), `${id}: ${m[1]} exists`);
      }
    }
  }
});

// A receipt describes the unchanged copy, as it was committed together with the receipt. Later commits adapt the
// edition to run on its own and record each change in variants/<product>/CHANGES.md.
const git = (args, input) => execFileSync('git', ['-C', root, ...args], { input, maxBuffer: 1 << 30 });
const blobs = (rev, paths) => {
  const out = git(['cat-file', '--batch'], paths.map((p) => `${rev}:${p}\n`).join(''));
  const got = new Map();
  let at = 0;
  for (const p of paths) {
    const nl = out.indexOf(10, at);
    const head = out.subarray(at, nl).toString('utf8').split(' ');
    if (head[1] !== 'blob') { got.set(p, null); at = nl + 1; continue; }
    const size = Number(head[2]);
    got.set(p, out.subarray(nl + 1, nl + 1 + size));
    at = nl + 1 + size + 1;
  }
  return got;
};

test('every variant is a moved skill id, and its receipt matches the unchanged copy committed with it', () => {
  const ids = new Set(moved.map(([, id]) => id));
  for (const product of VARIANT_PRODUCTS) {
    const dir = `variants/${product}`;
    assert.ok(existsSync(join(root, dir)), `${dir} exists`);
    for (const id of readdirSync(join(root, dir))) {
      if (!statSync(join(root, dir, id)).isDirectory()) continue;
      assert.ok(ids.has(id), `${dir}/${id} is a moved skill`);
      const md = read(`${dir}/${id}/SKILL.md`).toString('utf8');
      assert.match(md, new RegExp(`^---\\nname: "?${id}"?\\n`), `${dir}/${id} frontmatter names it`);
    }
    const receipt = `receipts/variants-${product}.sha256`;
    const rev = git(['log', '--format=%H', '-1', '--', receipt]).toString('utf8').trim();
    assert.match(rev, /^[0-9a-f]{40}$/u, `${receipt} is committed`);
    const rows = read(receipt).toString('utf8').trim().split('\n').map((l) => l.split('  '));
    const copy = blobs(rev, rows.map(([, , dest]) => dest));
    const covered = new Set();
    for (const [sha, source, dest] of rows) {
      assert.ok(source && dest, `${product} receipt row has three fields`);
      assert.ok(copy.get(dest), `${dest} is in ${rev.slice(0, 7)}`);
      assert.equal(createHash('sha256').update(copy.get(dest)).digest('hex'), sha, dest);
      covered.add(dest);
    }
    const files = git(['ls-tree', '-r', '--name-only', rev, '--', dir]).toString('utf8').trim().split('\n');
    assert.deepEqual(files.filter((f) => !covered.has(f)), [], `${product} files without a receipt at ${rev.slice(0, 7)}`);
    const now = walk(join(root, dir)).map((f) => relative(root, f));
    const same = now.length === covered.size && now.every((f) => covered.has(f) && createHash('sha256').update(read(f)).digest('hex') === rows.find((r) => r[2] === f)[0]);
    if (!same) assert.ok(existsSync(join(root, dir, 'CHANGES.md')), `${dir} differs from its receipt, so CHANGES.md says why`);
  }
});

// Grok Build copies the whole repository, .git included, for a `<source>#<subfolder>` install, and only the folder
// for a folder path, so no install line or prose here may give the `#` form.
test('no install line names a #subfolder of the repository', () => {
  const docs = ['README.md', ...walk(join(root, 'variants')).map((f) => relative(root, f)).filter((f) => /\.(md|json|ya?ml)$/u.test(f) && !f.includes('_canonical-corpus'))];
  const hits = docs.filter((f) => /wjgoarxiv-skills clone>#|wjgoarxiv-skills#/u.test(read(f).toString('utf8')));
  assert.deepEqual(hits, []);
});

test('the OpenCode column names a variant folder for every moved skill', () => {
  for (const [, id] of moved) assert.ok(existsSync(join(root, 'variants/litopencode', id, 'SKILL.md')), id);
});
