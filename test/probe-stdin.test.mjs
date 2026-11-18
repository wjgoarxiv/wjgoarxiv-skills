import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;

// Linux caps one argv string at 128 KiB (MAX_ARG_STRLEN). The interface probe's page script is ~100 KB, ~135 KB as
// base64, so it must reach agent-browser on stdin.
test('every interface probe sends its page script on stdin, not as one base64 argument', () => {
  for (const file of ['plugins/design/skills/frontend-ui-ux/scripts/interface-probe.mjs',
    'variants/litgrok/frontend-ui-ux/scripts/interface-probe.mjs']) {
    const source = readFileSync(`${root}${file}`, 'utf8');
    assert.doesNotMatch(source, /"eval", "--json", "-b"/u, file);
    assert.match(source, /"eval", "--json", "--stdin"\], script\)/u, file);
  }
});

test('the litgrok edition driver hands input larger than 128 KiB to the child on stdin', async () => {
  const { runBrowserCommand } = await import(`${root}variants/litgrok/frontend-ui-ux/scripts/interface-probe-driver.mjs`);
  const payload = 'x'.repeat(200 * 1024);
  const read = "let n=0;process.stdin.on('data',(c)=>{n+=c.length});process.stdin.on('end',()=>process.stdout.write(String(n)))";
  const result = runBrowserCommand(process.execPath, ['-e', read], { timeout: 10_000, input: payload });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.stdout, String(payload.length));
});

// Windows: a driver call that starts the agent-browser daemon hands it the call's stdout/stderr; with pipes,
// spawnSync waits for the daemon to close them and the call ends in ETIMEDOUT. Owned temp files do not hold it open.
test('the litgrok edition driver returns when its child exits, even if a grandchild keeps stdout open (win32 path)', async () => {
  const { runBrowserCommand } = await import(`${root}variants/litgrok/frontend-ui-ux/scripts/interface-probe-driver.mjs`);
  const holder = "require('child_process').spawn(process.execPath,['-e','setTimeout(()=>{},4000)'],{stdio:'inherit',detached:true}).unref();process.stdout.write('ready')";
  const started = performance.now();
  const result = runBrowserCommand(process.execPath, ['-e', holder], { timeout: 2500, platform: 'win32' });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.stdout, 'ready');
  assert.ok(performance.now() - started < 2000, 'returned without waiting for the grandchild');
});
