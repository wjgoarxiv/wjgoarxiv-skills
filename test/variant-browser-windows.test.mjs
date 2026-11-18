import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, writeSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (file) => readFileSync(`${root}${file}`, 'utf8');

// getImageData returns un-premultiplied channels. Dividing them by alpha again inflated every translucent
// colour (rgba(255,255,255,.18) read as r = 1414), so a dark glass panel was measured as white.
test('every variant interface probe reads canvas colour channels as returned, without a second alpha division', () => {
  for (const file of ['variants/litgravity/visual-qa/scripts/probe/interface-probe-page.mjs',
    'variants/litgravity/frontend-ui-ux/scripts/interface-probe-page.mjs',
    'variants/litgrok/frontend-ui-ux/scripts/interface-probe-page.mjs',
    'variants/litmuse/visual-qa/scripts/probe/interface-probe-page.mjs',
    'variants/litmuse/frontend-ui-ux/scripts/interface-probe-page.mjs']) {
    const source = read(file);
    assert.doesNotMatch(source, /\* 255\) \/ a\)/u, file);
    assert.match(source, /parsed = a === 0 \? null : \{ r, g, b, a: a \/ 255 \};/u, file);
  }
});

// A driver that starts its daemon on the first call hands the daemon its stdout and stderr. On Windows the
// caller then waits for those pipes until its timeout, so browser output goes to owned files there.
test('the Hermes edition runs browser calls on Windows with owned output files', async () => {
  const { spawnBrowserTool } = await import(`${root}variants/lithermes/frontend-ui-ux/scripts/hostexec.mjs`);
  let seen;
  const result = spawnBrowserTool('agent-browser', ['--session', 's', 'open', 'http://x.test/'], { encoding: 'utf8' }, {
    platform: 'win32', env: { PATH: 'C:\\bin', PATHEXT: '.EXE;.CMD' }, exists: (file) => file === 'C:\\bin\\agent-browser.EXE',
    spawnSync: (command, args, options) => { seen = options; writeSync(options.stdio[1], 'ok\r\n'); return { status: 0, command }; },
  });
  assert.equal(seen.stdio[0], 'ignore');
  assert.equal(typeof seen.stdio[1], 'number');
  assert.equal(result.stdout, 'ok\r\n');
  const source = read('variants/lithermes/frontend-ui-ux/scripts/probe.mjs');
  assert.doesNotMatch(source, /\bspawnTool\(/u);
  // cmd.exe runs the npm .cmd shim on Windows and refuses an argument holding a double quote.
  assert.doesNotMatch(source, /run\('eval',/u);
});

test('the OpenCode edition resolves agent-browser on Windows on disk and follows the npm shim to the native binary', async () => {
  const { probeBrowserDriver } = await import(`${root}variants/litopencode/frontend-ui-ux/scripts/browser-driver-probe.mjs`);
  const prefix = mkdtempSync(join(tmpdir(), 'variant-win-prefix-'));
  try {
    const bin = join(prefix, 'node_modules', 'agent-browser', 'bin');
    mkdirSync(bin, { recursive: true });
    writeFileSync(join(prefix, 'agent-browser'), '#!/bin/sh\n');
    // Upper case, as in the default PATHEXT, so a case-sensitive host filesystem finds it too.
    writeFileSync(join(prefix, 'agent-browser.CMD'), '@ECHO off\r\n"%~dp0node_modules\\agent-browser\\bin\\agent-browser-win32-x64.exe" %*\r\n');
    const native = join(bin, 'agent-browser-win32-x64.exe');
    writeFileSync(native, '');
    const calls = [];
    const report = probeBrowserDriver({
      platform: 'win32', path: prefix,
      runCommand: (command, args) => { calls.push([command, ...args]); return { status: 0, stdout: 'agent-browser 0.39.1\r\n', stderr: '' }; },
    });
    assert.equal(report.status, 'available', report.detail);
    assert.equal(report.command, native);
    assert.deepEqual(calls, [[native, '--version']]);
  } finally {
    rmSync(prefix, { recursive: true, force: true });
  }
  const source = read('variants/litopencode/frontend-ui-ux/scripts/probe.mjs');
  assert.match(source, /child\.on\(windows \? "exit" : "close"/u, 'Windows settles on exit, not on pipe close');
});

test('the Codex edition starts the driver shell-free on Windows and keeps its output in owned files', () => {
  const source = read('variants/litcodex/frontend-ui-ux/scripts/probe.mjs');
  assert.match(source, /shellFreeInvocation\(executable, args\)/u, 'a .cmd shim is unwrapped before spawnSync');
  assert.match(source, /stdio: \['pipe', fds\[0\], fds\[1\]\]/u);
  assert.doesNotMatch(source, /mkdtempSync\('\/tmp\/uiux-'\)/u, 'Windows has no /tmp');
});
