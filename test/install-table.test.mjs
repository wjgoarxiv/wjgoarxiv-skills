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

// The install lines each product's same-name stub gives, word for word, with {id} and {family} for the skill. Claude
// Code installs the family plugin; every other harness installs that product's own edition from variants/<product>/<id>.
const lines = json('test/stub-install-lines.json');
const fill = (list, id, family) => list.map((l) => l.split('{id}').join(id).split('{family}').join(family));
const READMES = ['README.md', 'README_ko-KR.md'];
const COPYING = { 'Codex CLI': 'litcodex', OpenCode: 'litopencode', 'Antigravity CLI': 'litgravity', 'Hermes Agent': 'lithermes' };

const table = (readme) => {
  const start = readme.search(/^## (Pick one skill for one harness|하네스별로 스킬 하나 설치하기)$/mu);
  assert.ok(start >= 0, 'README has the pick-one install table section');
  const all = readme.slice(start).split('\n');
  const first = all.findIndex((l) => l.startsWith('|'));
  assert.ok(first > 0, 'the section holds a table');
  const rows = [];
  for (const l of all.slice(first)) {
    if (!l.startsWith('|')) break;
    rows.push(l.slice(1, -1).split('|').map((c) => c.trim().replace(/`/gu, '')));
  }
  return { header: rows[0], body: rows.slice(2) };
};

test('the pick-one table has one row per marketplace skill, with its family plugin and edition folder', () => {
  for (const f of READMES) {
    const { header, body } = table(read(f).toString('utf8'));
    assert.equal(header.length, 4, `${f} header`);
    assert.deepEqual(body.map((r) => `${r[1]}:${r[0]}`).sort(), moved.map((r) => r.join(':')).sort(), f);
    for (const [id, family, plugin, folder] of body) {
      assert.equal(plugin, `${family}@wjgoarxiv-skills`, `${f} ${id}`);
      assert.equal(folder, `variants/<product>/${id}/`, `${f} ${id}`);
      for (const product of VARIANT_PRODUCTS) assert.ok(existsSync(join(root, 'variants', product, id, 'SKILL.md')), `${product}/${id}`);
    }
  }
});

test('the per-harness notes carry every stub line block, word for word, for lit-pptx', () => {
  assert.deepEqual(Object.keys(lines).filter((k) => !k.startsWith('_')), HARNESSES);
  for (const f of READMES) {
    const md = read(f).toString('utf8');
    for (const h of HARNESSES) {
      for (const [step, list] of Object.entries(lines[h])) {
        // A block may go on after the stub's lines (the Claude Code block also installs the other families).
        const block = '```bash\n' + fill(list, 'lit-pptx', 'decks').join('\n') + '\n';
        // A single command may also stand inline in the prose.
        const inline = list.length === 1 && md.includes('`' + fill(list, 'lit-pptx', 'decks')[0] + '`');
        assert.ok(md.includes(block) || inline, `${f}: ${h} ${step}`);
      }
    }
  }
});

test('every folder the lines name exists here for every moved skill', () => {
  for (const [family, id] of moved) {
    for (const h of HARNESSES) {
      for (const line of fill(Object.values(lines[h]).flat(), id, family)) {
        for (const m of line.matchAll(/<path to your wjgoarxiv-skills clone>\/([^"\s]+)/gu)) {
          assert.ok(statSync(join(root, m[1])).isDirectory(), `${id} × ${h}: ${m[1]} exists`);
        }
      }
    }
  }
});

test('copying harnesses look first, move an old copy aside outside the skills folder, copy, then write a receipt', () => {
  for (const [h, product] of Object.entries(COPYING)) {
    const all = Object.values(lines[h]).flat().join('\n');
    assert.match(all, /extension-backups\//u, `${h} backup folder`);
    assert.doesNotMatch(all, /extension-backups[^\s"]*\/skills|skills\/[^\s"]*extension-backups/u, `${h} backup sits outside skills/`);
    assert.match(all, new RegExp(`"variant":"${product}"`, 'u'), `${h} receipt names its edition`);
    assert.match(all, /\.litfamily-extension\.json/u, `${h} receipt file`);
    const first = lines[h].install[0];
    assert.doesNotMatch(first, /\b(mv|cp|printf)\b/u, `${h}: the first line only reads`);
  }
});

test('no install line on this page or in a CHANGES.md deletes a folder or copies into an existing one', () => {
  const docs = [...READMES, ...VARIANT_PRODUCTS.map((p) => `variants/${p}/CHANGES.md`)];
  for (const f of docs) {
    const code = [...read(f).toString('utf8').matchAll(/```(?:bash|sh)\n([\s\S]*?)```/gu)].map((m) => m[1]).join('\n');
    assert.doesNotMatch(code, /(^|[;&|]\s*)rm -r/mu, `${f}: no rm -r`);
    assert.doesNotMatch(code, /cp -R "[^"]+" [^\s;&]*skills\/"?(\s|$)/mu, `${f}: no cp -R into a skills folder that may hold the id`);
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
