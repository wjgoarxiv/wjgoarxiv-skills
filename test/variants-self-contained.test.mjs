import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const VARIANT_PRODUCTS = ['litcodex', 'litopencode', 'litgrok', 'litgravity', 'litmuse', 'lithermes'];
const SKIP = new Set(['node_modules', '_canonical-corpus']);
const walk = (dir) => readdirSync(dir, { withFileTypes: true })
  .flatMap((d) => (SKIP.has(d.name) ? [] : d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
const editions = () => VARIANT_PRODUCTS.flatMap((p) => readdirSync(join(root, 'variants', p))
  .filter((id) => statSync(join(root, 'variants', p, id)).isDirectory())
  .map((id) => join(root, 'variants', p, id)));

// The string literal of an argument, or null when the argument is not a plain literal.
const literal = (s) => s.trim().match(/^(['"`])([^'"`$]*)\1$/)?.[2] ?? null;
const args = (s) => {
  const out = []; let depth = 0; let cur = ''; let quote = null;
  for (const ch of s) {
    if (quote) { cur += ch; if (ch === quote) quote = null; continue; }
    if (`'"\``.includes(ch)) { quote = ch; cur += ch; continue; }
    if ('([{'.includes(ch)) depth += 1;
    if (')]}'.includes(ch)) { if (depth === 0) break; depth -= 1; }
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
};

// Every path a code file builds from its own location, a variable holding one, or a relative import, as
// { line, target }. Paths built from runtime values are not followed; only literals are.
function builtPaths(file) {
  const dir = dirname(file);
  const vars = new Map();
  const py = file.endsWith('.py');
  const evaluate = (e) => {
    e = e.trim().replace(/;$/u, '');
    if (/^(path\.)?dirname\((fileURLToPath\()?import\.meta\.url\)?\)$|^__dirname$|^import\.meta\.dirname$/u.test(e)) return dir;
    if (vars.has(e)) return vars.get(e);
    let m = e.match(/^(?:fileURLToPath\()?new URL\(([^,]+),\s*import\.meta\.url\)\)?$/u);
    if (m) { const l = literal(m[1]); return l === null ? null : resolve(dir, l); }
    m = e.match(/^(?:path\.)?(?:resolve|join)\((.*)\)$/su);
    if (m) {
      let acc = null;
      for (const a of args(m[1])) {
        const v = literal(a) ?? evaluate(a);
        if (v === null) break;
        acc = acc === null ? v : join(acc, v);
      }
      return acc && isAbsolute(acc) ? acc : null;
    }
    if (py) {
      m = e.match(/^Path\(__file__\)(?:\.resolve\(\))?((?:\.parent)*)(?:\.parents\[(\d+)\])?((?:\s*\/\s*['"][^'"]*['"])*)$/u);
      if (m) {
        let p = file;
        const ups = (m[1].match(/parent/gu) ?? []).length + (m[2] === undefined ? 0 : Number(m[2]) + 1);
        for (let i = 0; i < ups; i += 1) p = dirname(p);
        for (const s of m[3].matchAll(/(['"])([^'"]*)\1/gu)) p = join(p, s[2]);
        return p;
      }
      m = e.match(/^([A-Za-z_]\w*)((?:\.parent)*)((?:\s*\/\s*['"][^'"]*['"])*)$/u);
      if (m && vars.has(m[1]) && (m[2] || m[3])) {
        let p = vars.get(m[1]);
        for (let i = 0; i < (m[2].match(/parent/gu) ?? []).length; i += 1) p = dirname(p);
        for (const s of m[3].matchAll(/(['"])([^'"]*)\1/gu)) p = join(p, s[2]);
        return p;
      }
    }
    return null;
  };
  const found = [];
  readFileSync(file, 'utf8').split('\n').forEach((text, i) => {
    if (text.length > 3000) return;
    const line = i + 1;
    const add = (target) => { if (target) found.push({ line, target }); };
    const assign = text.match(py ? /^\s*([A-Za-z_]\w*)\s*(?::[^=]+)?=\s*(.+?)\s*(?:#.*)?$/u : /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(.+?);?\s*$/u);
    if (assign) { const v = evaluate(assign[2]); if (v) { vars.set(assign[1], v); add(v); } }
    for (const c of text.matchAll(/(?:(?<![\w.$])|path\.)(?:resolve|join)\(([^;]*)/gu)) add(evaluate(`resolve(${c[1]}`));
    for (const c of text.matchAll(/new URL\(([^,)]+),\s*import\.meta\.url\)/gu)) { const l = literal(c[1]); if (l !== null) add(resolve(dir, l)); }
    for (const c of text.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\(\s*|^\s*import\s*)(['"])(\.{1,2}\/[^'"]*)\1/gu)) add(resolve(dir, c[2]));
    if (py) for (const c of text.matchAll(/Path\(__file__\)[\w.()[\]]*(?:\s*\/\s*['"][^'"]*['"])*/gu)) add(evaluate(c[0]));
  });
  return found;
}

test('no harness edition builds a path that leaves its own skill folder', () => {
  const escapes = [];
  for (const skill of editions()) {
    for (const file of walk(skill).filter((f) => /\.(mjs|cjs|js|ts|mts|py)$/u.test(f))) {
      for (const { line, target } of builtPaths(file)) {
        if (!target.startsWith(join(root, 'variants'))) continue;
        if (relative(skill, target).startsWith('..')) escapes.push(`${relative(root, file)}:${line} -> ${relative(root, target)}`);
      }
    }
  }
  assert.deepEqual([...new Set(escapes)], []);
});

test('the Codex diagram edition runs its visible-text detector from a folder copied alone', () => {
  const work = mkdtempSync(join(tmpdir(), 'variant-alone-'));
  try {
    const skill = join(work, 'lit-diagram-drawer');
    cpSync(join(root, 'variants/litcodex/lit-diagram-drawer'), skill, { recursive: true });
    const metrics = spawnSync(process.execPath, ['--input-type=module', '-e',
      `const m = await import(${JSON.stringify(join(skill, 'scripts/diagram-metrics.mjs'))});
       process.stdout.write(JSON.stringify(m.detectorFindings('It is important to note that this diagram delves into the system.')));`],
    { encoding: 'utf8' });
    assert.equal(metrics.status, 0, metrics.stderr);
    const found = JSON.parse(metrics.stdout);
    assert.ok(Array.isArray(found.findings) && found.findings.length > 0, 'the detector flags templated text');
    const doctor = spawnSync(process.execPath, [join(skill, 'scripts/doctor.mjs')], { encoding: 'utf8' });
    const check = JSON.parse(doctor.stdout).checks.find((c) => /detector/u.test(c.name));
    assert.equal(check?.status, 'pass', JSON.stringify(check));
    assert.ok(existsSync(join(skill, check.detail)), check.detail);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
});
