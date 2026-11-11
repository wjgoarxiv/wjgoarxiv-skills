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
const SUPPORT_FOLDERS = { figures: ['lit-humanizer'], design: ['browser-drive', 'lit-diagram-drawer', 'lit-typographic-motion'] };

test('every marketplace entry is a plugin folder with a manifest and at least one skill', () => {
  assert.equal(market.name, 'wjgoarxiv-skills');
  assert.ok(market.plugins.length >= 1);
  for (const p of market.plugins) {
    const dir = p.source.replace(/^\.\//, '');
    const manifest = json(`${dir}/.claude-plugin/plugin.json`);
    assert.equal(manifest.name, p.name);
    const folders = readdirSync(join(root, dir, 'skills'));
    // A folder without SKILL.md is not a skill: it carries files a moved skill imports by relative path.
    const support = folders.filter((id) => !existsSync(join(root, dir, 'skills', id, 'SKILL.md')));
    assert.deepEqual(support, SUPPORT_FOLDERS[p.name] ?? [], `${p.name} support folders`);
    const skills = folders.filter((id) => !support.includes(id));
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

const OFFICE_LIB = ['office-runtime.mjs', 'office_runtime_bootstrap.py', 'office_data.py', 'ooxml_integrity.py',
  'render_pages.py', 'mark.mjs', 'output_mark.py', 'office-runtime-lock/package.json', 'office-runtime-lock/requirements.lock'];

test('the decks plugin carries the runtime files lit-pptx reaches as ../../lib', () => {
  for (const f of OFFICE_LIB) assert.ok(statSync(join(root, 'plugins/decks/lib', f)).isFile(), f);
});

test('the documents plugin carries lit-docx and the runtime files its scripts reach as ../../../lib', () => {
  assert.ok(market.plugins.some((p) => p.name === 'documents' && p.source === './plugins/documents'));
  for (const f of OFFICE_LIB) assert.ok(statSync(join(root, 'plugins/documents/lib', f)).isFile(), f);
  for (const f of ['SKILL.md', 'NOTICE', 'scripts/convert_md_to_docx.py', 'scripts/qa_docx.py', 'templates/docx/korean-generic.docx']) {
    assert.ok(statSync(join(root, 'plugins/documents/skills/lit-docx', f)).isFile(), f);
  }
});

test('the figures plugin carries its three skills and every file they reach outside their folders', () => {
  assert.ok(market.plugins.some((p) => p.name === 'figures' && p.source === './plugins/figures'));
  const fig = (f) => join(root, 'plugins/figures', f);
  for (const id of ['lit-diagram-drawer', 'lit-schematic', 'lit-scientific-visualization']) assert.ok(statSync(fig(`skills/${id}/SKILL.md`)).isFile(), id);
  for (const f of ['lib/mark.mjs', 'lib/mark-logo.png', 'lib/npm-invocation.mjs', 'lib/project-state-root.mjs', 'lib/rules/discovery.mjs',
    'lib/bundled-skills-integrity.mjs', 'bin/litclaude-scientific-visualization-doctor.js', 'vendor/scientific-visualization/SKILL.md',
    'vendor/scientific-visualization/scripts/style_presets.py', 'vendor/handoff/SKILL.md', 'vendor/licenses/045_scientific-visualization-MIT.txt',
    'skills/lit-humanizer/scripts/core.mjs', 'skills/lit-humanizer/scripts/detect.mjs', 'skills/lit-humanizer/rules.json',
    'skills/lit-diagram-drawer/assets/fonts/PretendardVariable.woff2']) {
    assert.ok(statSync(fig(f)).isFile(), f);
  }
  assert.equal(existsSync(fig('skills/lit-humanizer/SKILL.md')), false, 'lit-humanizer support files are not a skill here');
});

test('the design plugin carries frontend-ui-ux, visual-qa and every file they reach outside their folders', () => {
  assert.ok(market.plugins.some((p) => p.name === 'design' && p.source === './plugins/design'));
  const des = (f) => join(root, 'plugins/design', f);
  for (const id of ['frontend-ui-ux', 'visual-qa']) assert.ok(statSync(des(`skills/${id}/SKILL.md`)).isFile(), id);
  for (const f of ['skills/frontend-ui-ux/scripts/interface-probe.mjs', 'skills/frontend-ui-ux/scripts/design-lock.mjs', 'skills/frontend-ui-ux/kit/fonts.json',
    'skills/frontend-ui-ux/references/_canonical-corpus/manifest.json', 'skills/visual-qa/scripts/cli.mjs', 'skills/visual-qa/scripts/evidence.mjs',
    'skills/browser-drive/scripts/capability-probe.mjs', 'lib/secret-shapes.mjs', 'lib/strict-json.mjs', 'lib/rename-aliases.mjs',
    'skills/lit-diagram-drawer/assets/fonts/PretendardVariable.woff2', 'skills/lit-diagram-drawer/assets/fonts/OFL.txt',
    'skills/lit-typographic-motion/fonts/jetbrains-mono/JetBrainsMono-wght-latin.woff2', 'skills/lit-typographic-motion/fonts/jetbrains-mono/OFL.txt']) {
    assert.ok(statSync(des(f)).isFile(), f);
  }
  for (const id of ['browser-drive', 'lit-diagram-drawer', 'lit-typographic-motion']) {
    assert.equal(existsSync(des(`skills/${id}/SKILL.md`)), false, `${id} support files are not a skill here`);
  }
  const kit = des('skills/frontend-ui-ux/kit');
  for (const font of json('plugins/design/skills/frontend-ui-ux/kit/fonts.json').fonts) {
    for (const f of [font, font.licence]) {
      const sha = createHash('sha256').update(readFileSync(join(kit, f.source))).digest('hex');
      assert.equal(sha, f.sha256, f.source);
    }
  }
});
