import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p));
const json = (p) => JSON.parse(read(p).toString('utf8'));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));

const market = json('.claude-plugin/marketplace.json');

test('every marketplace entry is a plugin folder with a manifest and at least one skill', () => {
  assert.equal(market.name, 'wjgoarxiv-skills');
  assert.ok(market.plugins.length >= 1);
  for (const p of market.plugins) {
    const dir = p.source.replace(/^\.\//, '');
    const manifest = json(`${dir}/.claude-plugin/plugin.json`);
    assert.equal(manifest.name, p.name);
    const skills = readdirSync(join(root, dir, 'skills'));
    assert.ok(skills.length >= 1, `${p.name} has skills`);
    for (const id of skills) {
      const md = read(`${dir}/skills/${id}/SKILL.md`).toString('utf8');
      assert.match(md, new RegExp(`^---\\nname: ${id}\\n`), `${id} frontmatter names it`);
    }
    assert.ok(existsSync(join(root, dir, 'LICENSE')), `${p.name} carries its licence`);
  }
});

test('every receipt matches the copied bytes, and every copied file has a receipt', () => {
  for (const p of market.plugins) {
    const dir = p.source.replace(/^\.\//, '');
    const rows = read(`receipts/${p.name}.sha256`).toString('utf8').trim().split('\n').map((l) => l.split('  '));
    const covered = new Set();
    for (const [sha, , dest] of rows) {
      const got = createHash('sha256').update(read(dest)).digest('hex');
      assert.equal(got, sha, dest);
      covered.add(dest);
    }
    const files = walk(join(root, dir)).map((f) => relative(root, f)).filter((f) => !f.includes('/.claude-plugin/'));
    assert.deepEqual(files.filter((f) => !covered.has(f)), [], 'files without a receipt');
  }
});

test('the decks plugin carries the runtime files lit-pptx reaches as ../../lib', () => {
  for (const f of ['office-runtime.mjs', 'office_runtime_bootstrap.py', 'office_data.py', 'ooxml_integrity.py',
    'render_pages.py', 'mark.mjs', 'output_mark.py', 'office-runtime-lock/package.json', 'office-runtime-lock/requirements.lock']) {
    assert.ok(statSync(join(root, 'plugins/decks/lib', f)).isFile(), f);
  }
});
