import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p));
const json = (p) => JSON.parse(read(p).toString('utf8'));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));

const market = json('.claude-plugin/marketplace.json');
const SUPPORT_FOLDERS = { figures: ['lit-humanizer'], design: ['browser-drive', 'lit-diagram-drawer', 'lit-typographic-motion'], 'video-covers': ['lit-pptx'] };

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

// The one exception to "copied unchanged": a file edited after the move keeps its row, with its current sha256 first
// and `edited-from:<sha256 of the unchanged copy>` as a fourth field, and the README names it.
test('every receipt matches the copied bytes, and every copied file has a receipt', () => {
  const readme = read('README.md').toString('utf8');
  for (const p of market.plugins) {
    const dir = p.source.replace(/^\.\//, '');
    const rows = read(`receipts/${p.name}.sha256`).toString('utf8').trim().split('\n').map((l) => l.split('  '));
    const covered = new Set();
    for (const [sha, , dest, edited, ...rest] of rows) {
      const got = createHash('sha256').update(read(dest)).digest('hex');
      assert.equal(got, sha, dest);
      assert.deepEqual(rest, [], `${dest} receipt row has at most four fields`);
      if (edited !== undefined) {
        assert.match(edited, /^edited-from:[0-9a-f]{64}$/u, `${dest} edited marker`);
        assert.ok(readme.includes(dest.replace(`${dir}/`, '')), `README names the edited file ${dest}`);
      }
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

test('the video-covers plugin carries lit-typographic-motion, readme-studio and every file they reach outside their folders', () => {
  assert.ok(market.plugins.some((p) => p.name === 'video-covers' && p.source === './plugins/video-covers'));
  const vc = (f) => join(root, 'plugins/video-covers', f);
  for (const id of ['lit-typographic-motion', 'readme-studio']) assert.ok(statSync(vc(`skills/${id}/SKILL.md`)).isFile(), id);
  for (const f of ['skills/lit-typographic-motion/scripts/motion.mjs', 'skills/lit-typographic-motion/scripts/motion-runtime.mjs',
    'skills/lit-typographic-motion/scripts/motion-doctor.mjs', 'skills/lit-typographic-motion/engine/node/done.mjs',
    'skills/lit-typographic-motion/engine/package-lock.json', 'skills/lit-typographic-motion/engine/NOTICE',
    'skills/lit-typographic-motion/engine/THIRD_PARTY_NOTICES', 'skills/lit-typographic-motion/fonts/manifest.json',
    'skills/readme-studio/scripts/validate-readme-facts.mjs', 'skills/readme-studio/templates/remotion-cover/package-lock.json',
    'lib/mark.mjs', 'lib/mark-logo.png', 'lib/output_mark.py', 'lib/project-state-root.mjs',
    'lib/rules/constants.mjs', 'lib/rules/discovery.mjs', 'lib/rules/scanner.mjs',
    'skills/lit-pptx/fonts/pretendard/Pretendard-Regular.otf', 'skills/lit-pptx/fonts/pretendard/Pretendard-Bold.otf',
    'skills/lit-pptx/fonts/pretendard/OFL.txt']) {
    assert.ok(statSync(vc(f)).isFile(), f);
  }
  assert.equal(existsSync(vc('skills/lit-pptx/SKILL.md')), false, 'lit-pptx support files are not a skill here');
  // The engine reaches the mark helper as ../../../../lib from engine/node, and the font manifest reaches Pretendard
  // as ../../lit-pptx/fonts/pretendard; both resolve inside this plugin and the fonts match their pinned hashes.
  for (const f of ['cover.mjs', 'encode.mjs', 'end-card.mjs']) {
    const body = read(`plugins/video-covers/skills/lit-typographic-motion/engine/node/${f}`).toString('utf8');
    assert.match(body, /\.\.\/\.\.\/\.\.\/\.\.\/lib\/mark\.mjs/u, f);
  }
  const fonts = join(root, 'plugins/video-covers/skills/lit-typographic-motion/fonts');
  const manifest = json('plugins/video-covers/skills/lit-typographic-motion/fonts/manifest.json');
  const pretendard = Object.values(manifest).flatMap((v) => (v && typeof v === 'object' ? Object.entries(v) : []))
    .filter(([key]) => key.startsWith('pretendard-')).map(([, font]) => font);
  assert.ok(pretendard.length >= 2, 'the manifest names the Pretendard weights');
  for (const font of pretendard) {
    for (const f of [{ path: font.path, sha256: font.sha256 }, ...font.licence]) {
      const sha = createHash('sha256').update(readFileSync(join(fonts, f.path))).digest('hex');
      assert.equal(sha, f.sha256, f.path);
    }
  }
});

// LitClaude 1.0.50 removed `litclaude-ai motion-runtime` and the motion and scientific-visualization doctor lines, so
// no moved file may tell anyone to run them. Two places may still name the old command: a line that dates it
// (`1.0.49 and earlier`), and the two lockfile-adjacent files whose bytes key the runtime cache, which stay unchanged
// so an existing cache is reused.
const CACHE_KEY_FILES = new Set(['plugins/video-covers/skills/lit-typographic-motion/engine/package.json',
  'plugins/video-covers/skills/lit-typographic-motion/engine/audio/requirements.lock']);
test('no family plugin tells anyone to run a command LitClaude removed', () => {
  const hits = [];
  for (const f of walk(join(root, 'plugins')).map((x) => relative(root, x))) {
    if (CACHE_KEY_FILES.has(f) || /\.(png|otf|woff2?|ttf|docx|pptx|xlsx|jpg|webp|mp4|gif|pdf)$/u.test(f)) continue;
    read(f).toString('utf8').split('\n').forEach((line, i) => {
      if (/litclaude-ai (motion-runtime|doctor|install)|`litclaude doctor`/u.test(line) && !/1\.0\.49 and earlier/u.test(line)) hits.push(`${f}:${i + 1}`);
    });
  }
  assert.deepEqual(hits, []);
});

test('the film runtime names its own script as the fix, from a plugin folder with no product installed', () => {
  const skill = join(root, 'plugins/video-covers/skills/lit-typographic-motion');
  const script = join(skill, 'scripts/motion-runtime.mjs');
  const cache = mkdtempSync(join(tmpdir(), 'motion-cache-'));
  try {
    const run = spawnSync(process.execPath, [script, 'status', '--json'], { encoding: 'utf8', env: { ...process.env, LITCLAUDE_MOTION_RUNTIME: cache } });
    assert.equal(run.status, 0, run.stderr);
    const status = JSON.parse(run.stdout);
    assert.equal(status.ready, false);
    assert.equal(status.command, `node "${script}" install`);
  } finally {
    rmSync(cache, { recursive: true, force: true });
  }
});
