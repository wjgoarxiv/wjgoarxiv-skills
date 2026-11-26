import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, statSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p), 'utf8');
const plugin = join(root, 'plugins/sheets');
const skill = join(plugin, 'skills/lit-xlsx');
const runtime = join(plugin, 'lib/sheets-runtime.mjs');
const market = JSON.parse(read('.claude-plugin/marketplace.json'));

// The Python half needs the runtime installed (`node plugins/sheets/lib/sheets-runtime.mjs ensure`) and LibreOffice plus
// Poppler on PATH. Without them those tests skip with that line; the suite never installs anything itself.
const status = JSON.parse(spawnSync(process.execPath, [runtime, 'status', '--json'], { encoding: 'utf8' }).stdout);
const ready = status.ready && status.hostTools.every((t) => t.available);
const skip = ready ? false : `needs the lit-xlsx runtime, soffice and pdftoppm: node ${runtime} ensure`;
const py = (script, args, env = {}) => spawnSync(status.interpreter, [script, ...args], {
  encoding: 'utf8', timeout: 300000, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', ...env },
});
const script = (name) => join(skill, 'scripts', name);
const plant = join(root, 'test/fixtures/sheets/plant.py');
const scratch = () => realpathSync(mkdtempSync(join(tmpdir(), 'lit-xlsx-test-')));

test('sheets has its own runtime lock and cache, apart from the documents office runtime', async () => {
  const lock = read('plugins/sheets/lib/sheets-runtime-lock/requirements.lock');
  for (const pkg of ['openpyxl', 'xlsxwriter', 'defusedxml', 'lxml', 'pillow']) assert.match(lock, new RegExp(`^${pkg}==\\d`, 'mu'), pkg);
  assert.notEqual(lock, read('plugins/documents/lib/office-runtime-lock/requirements.lock'));
  const { runtimeRoot } = await import(runtime);
  assert.equal(runtimeRoot({}), join(homedir(), '.cache', 'litfamily', 'sheets-runtime'));
  assert.equal(runtimeRoot({ XDG_CACHE_HOME: '/c' }), join('/c', 'litfamily', 'sheets-runtime'));
  assert.doesNotMatch(read('plugins/sheets/lib/sheets-runtime.mjs'), /office-runtime/u, 'never points into the office runtime');
});

test('lit-xlsx says what it does, when to use it in English and Korean, and what it is not for', () => {
  const md = read('plugins/sheets/skills/lit-xlsx/SKILL.md');
  const description = md.match(/^---\nname: lit-xlsx\ndescription: (.+)\n---\n/u)?.[1];
  assert.ok(description, 'single-line frontmatter description');
  assert.match(description, /Use when/u);
  for (const cue of ['excel', 'xlsx', 'spreadsheet', '엑셀', '스프레드시트']) assert.ok(description.includes(cue), cue);
  assert.match(description, /Not for .*lit-docx/u);
  assert.match(description, /lit-scientific-visualization/u);
  for (const f of ['references/look.md', 'references/formulas.md', 'references/rules-and-validation.md', 'references/audit.md',
    'references/large-data.md', 'NOTICE', 'scripts/make_templates.py', 'scripts/recalc.py', 'scripts/audit_xlsx.py',
    'scripts/render_sheets.py', 'scripts/xlsx_kit.py', 'scripts/lo_profile.py']) {
    assert.ok(statSync(join(skill, f)).isFile(), f);
    if (f.startsWith('references/')) assert.ok(md.includes(f), `SKILL.md points to ${f}`);
  }
  const notice = read('plugins/sheets/skills/lit-xlsx/NOTICE');
  for (const src of ['anthropics/skills', 'anthropics/financial-services', 'openai/skills', 'Apache License 2.0']) assert.ok(notice.includes(src), src);
});

test('every listing names the sheets plugin, and the install and validate lines count every plugin', () => {
  assert.ok(market.plugins.some((p) => p.name === 'sheets' && p.source === './plugins/sheets' && p.description.includes('lit-xlsx')));
  for (const f of ['README.md', 'README_ko-KR.md']) {
    const md = read(f);
    const installs = [...md.matchAll(/^claude plugin install ([a-z-]+)@wjgoarxiv-skills$/gmu)].map((m) => m[1]);
    assert.deepEqual([...new Set(installs)].sort(), market.plugins.map((p) => p.name).sort(), `${f} quick start installs every plugin`);
    const validates = [...md.matchAll(/^claude plugin validate plugins\/([a-z-]+)$/gmu)].map((m) => m[1]);
    assert.deepEqual(validates.sort(), market.plugins.map((p) => p.name).sort(), `${f} validates every plugin`);
    for (const s of ['`sheets`', 'sheets:lit-xlsx', '| `sheets` | MIT']) assert.ok(md.includes(s), `${f} names ${s}`);
  }
  for (const f of ['docs/reference.md', 'docs/reference_ko-KR.md']) assert.match(read(f), /### `sheets`/u, f);
});

test('make_templates builds all four templates; each recalculates with no error and audits clean', { skip }, () => {
  const out = scratch();
  try {
    const made = py(script('make_templates.py'), ['--out', out]);
    assert.equal(made.status, 0, made.stderr);
    const files = readdirSync(out).filter((f) => f.endsWith('.xlsx')).sort();
    assert.deepEqual(files, ['lit-xlsx-dashboard.xlsx', 'lit-xlsx-ledger.xlsx', 'lit-xlsx-model.xlsx', 'lit-xlsx-report.xlsx']);
    for (const f of files) {
      const r = py(script('recalc.py'), [join(out, f), '--json']);
      const rep = JSON.parse(r.stdout);
      assert.equal(r.status, 0, `${f}: ${r.stdout}`);
      assert.equal(rep.error_count, 0, f);
      assert.ok(rep.formula_cells > 0 && rep.updated === rep.formula_cells, `${f} every formula computed`);
      const a = py(script('audit_xlsx.py'), [join(out, f), '--json']);
      const audit = JSON.parse(a.stdout);
      assert.equal(a.status, 0, f);
      assert.deepEqual([audit.counts.critical, audit.counts.warning], [0, 0], `${f}: ${JSON.stringify(audit.findings.slice(0, 3))}`);
    }
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('recalc catches a planted #REF!, still computes the other formulas, and the audit fails on it', { skip }, () => {
  const out = scratch();
  try {
    const book = join(out, 'planted.xlsx');
    assert.equal(py(plant, ['write', book]).status, 0);
    const r = py(script('recalc.py'), [book, '--json']);
    assert.equal(r.status, 1, r.stdout);
    const rep = JSON.parse(r.stdout);
    assert.deepEqual(rep.errors['#REF!'], ['Data!A4']);
    assert.equal(rep.error_count, 2, 'the #REF! typed into A5 also ends in an error value');
    assert.deepEqual(JSON.parse(py(plant, ['read', book]).stdout), { A3: 30, A4: '#REF!' });
    const a = py(script('audit_xlsx.py'), [book, '--json']);
    assert.equal(a.status, 1);
    const cats = JSON.parse(a.stdout).findings.filter((f) => f.severity === 'critical').map((f) => `${f.category}:${f.cell}`);
    for (const c of ['error-value:A4', 'error-value:A5', 'broken-reference:A5']) assert.ok(cats.includes(c), `${c} in ${cats.join(' ')}`);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('render writes one PNG per visible sheet and none for a hidden one', { skip }, () => {
  const out = scratch();
  try {
    assert.equal(py(script('make_templates.py'), ['--out', out, '--kind', 'dashboard']).status, 0);
    const planted = join(out, 'planted.xlsx');
    assert.equal(py(plant, ['write', planted]).status, 0);
    for (const [book, sheets] of [[join(out, 'lit-xlsx-dashboard.xlsx'), ['대시보드', '데이터']], [planted, ['Data', 'Notes']]]) {
      const dir = join(out, `png-${sheets[0]}`);
      const r = py(script('render_sheets.py'), [book, '--out-dir', dir, '--json']);
      assert.equal(r.status, 0, r.stdout + r.stderr);
      const rep = JSON.parse(r.stdout);
      assert.deepEqual(rep.pngs.map((p) => p.sheet), sheets);
      const pngs = readdirSync(dir).filter((f) => f.endsWith('.png'));
      assert.equal(pngs.length, sheets.length);
      for (const f of pngs) assert.deepEqual([...readFileSync(join(dir, f)).subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47], f);
    }
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

// Every file and folder up to three levels deep, with its mtime: a write anywhere in the shared profile changes it.
const snapshot = (dir) => {
  if (!existsSync(dir)) return null;
  const seen = {};
  const walk = (d, depth) => {
    seen[d] = statSync(d).mtimeMs;
    if (depth === 0 || !statSync(d).isDirectory()) return;
    for (const e of readdirSync(d)) walk(join(d, e), depth - 1);
  };
  walk(dir, 3);
  return seen;
};

test('LibreOffice runs in a fresh profile under the temp folder and the shared profile stays untouched', { skip }, () => {
  const shared = process.platform === 'darwin' ? join(homedir(), 'Library/Application Support/LibreOffice')
    : process.platform === 'win32' ? join(process.env.APPDATA ?? '', 'LibreOffice') : join(process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config'), 'libreoffice');
  const before = snapshot(shared);
  const tmp = scratch();
  try {
    const book = join(tmp, 'planted.xlsx');
    assert.equal(py(plant, ['write', book]).status, 0);
    const r = py(script('recalc.py'), [book, '--json', '--keep-profile'], { TMPDIR: tmp, TEMP: tmp, TMP: tmp });
    const rep = JSON.parse(r.stdout);
    assert.ok(rep.profile.startsWith(join(tmp, 'lit-xlsx-lo-')), rep.profile);
    assert.match(readFileSync(join(rep.profile, 'user/registrymodifications.xcu'), 'utf8'), /OOXMLRecalcMode/u);
    const rendered = py(script('render_sheets.py'), [book, '--out-dir', join(tmp, 'png'), '--json'], { TMPDIR: tmp, TEMP: tmp, TMP: tmp });
    assert.equal(rendered.status, 0);
    assert.equal(existsSync(JSON.parse(rendered.stdout).profile), false, 'the render profile is removed afterwards');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  assert.deepEqual(snapshot(shared), before, `${shared} unchanged`);
});
