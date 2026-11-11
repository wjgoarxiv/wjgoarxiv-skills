#!/usr/bin/env node
// Read-only integrity check for references/_canonical-corpus (no dependencies, never writes).
//   node <skill dir>/scripts/verify-corpus.mjs [--json]
// Checks every manifest entry under corpus/ and legal/ for a regular, non-symlinked file of the
// recorded size and SHA-256, rejects any file the manifest does not list, and recomputes the
// aggregate digest ("sorted sha256 two-spaces path newline" over corpus files). Exit 0 on PASS,
// 1 on FAIL, 2 when the manifest itself cannot be read.
import { createHash } from 'node:crypto';
import { lstatSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', '_canonical-corpus');
const json = process.argv.includes('--json');
const failures = [];
let manifest;
try {
  manifest = JSON.parse(readFileSync(join(base, 'manifest.json'), 'utf8'));
} catch (error) {
  console.error(`corpus manifest unreadable: ${error.message}`);
  process.exit(2);
}
const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const safe = (path) => typeof path === 'string' && path && !path.startsWith('/') && !path.split('/').some((part) => !part || part === '.' || part === '..');
function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(relative(base, full).split(sep).join('/'));
  }
  return out;
}
function check(root, entries, prefix) {
  const listed = new Set();
  for (const entry of entries || []) {
    if (!safe(entry.path)) { failures.push(`unsafe manifest path ${entry.path}`); continue; }
    const rel = `${prefix}${entry.path}`;
    listed.add(rel);
    let stat;
    try { stat = lstatSync(join(base, rel)); } catch { failures.push(`missing ${rel}`); continue; }
    if (!stat.isFile()) { failures.push(`not a regular file ${rel}`); continue; }
    if (stat.size !== entry.size) failures.push(`size ${rel}: ${stat.size} != ${entry.size}`);
    else if (sha(join(base, rel)) !== entry.sha256) failures.push(`sha256 ${rel}`);
  }
  for (const rel of walk(join(base, root))) if (!listed.has(rel)) failures.push(`unlisted file ${rel}`);
}
check('corpus', manifest.files, 'corpus/');
check('legal', (manifest.legal || []).map((entry) => ({ ...entry, path: entry.path.replace(/^legal\//, '') })), 'legal/');
const files = manifest.files || [];
const digest = createHash('sha256').update([...files].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)).map((f) => `${f.sha256}  ${f.path}\n`).join('')).digest('hex');
if (manifest.corpus?.fileCount !== files.length) failures.push(`fileCount ${manifest.corpus?.fileCount} != ${files.length} entries`);
const total = files.reduce((sum, f) => sum + f.size, 0);
if (manifest.corpus?.totalBytes !== total) failures.push(`totalBytes ${manifest.corpus?.totalBytes} != ${total}`);
if (manifest.corpus?.digest !== digest) failures.push('aggregate digest mismatch');
const result = { status: failures.length ? 'FAIL' : 'PASS', files: files.length, legal: (manifest.legal || []).length, digest, failures };
if (json) console.log(JSON.stringify(result, null, 2));
else console.log(failures.length ? `canonical corpus FAIL\n${failures.join('\n')}` : `canonical corpus PASS (${files.length} files, ${result.legal} legal, digest ${digest})`);
process.exit(failures.length ? 1 : 0);
