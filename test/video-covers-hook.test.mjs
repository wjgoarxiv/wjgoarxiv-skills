import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const plugin = join(root, 'plugins/video-covers');
const hookScript = join(plugin, 'hooks/motion-hook.mjs');

const hook = (event, input) => {
  const r = spawnSync(process.execPath, [hookScript, event], { input: JSON.stringify(input), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim() ? JSON.parse(r.stdout) : null;
};

const withProject = (fn) => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'vc-hook-')));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

test('hooks.json runs the plugin hook on prompt, tool and stop events', () => {
  const { hooks } = JSON.parse(readFileSync(join(plugin, 'hooks/hooks.json'), 'utf8'));
  assert.deepEqual(Object.keys(hooks).sort(), ['PostToolUse', 'Stop', 'UserPromptSubmit']);
  for (const [event, arg] of [['UserPromptSubmit', 'user-prompt-submit'], ['PostToolUse', 'post-tool-use'], ['Stop', 'stop']]) {
    assert.equal(hooks[event][0].hooks[0].command, `node "\${CLAUDE_PLUGIN_ROOT}/hooks/motion-hook.mjs" ${arg}`);
  }
  assert.equal(hooks.PostToolUse[0].matcher, '^(Bash|Skill)$');
});

test('a session that never touched the film skill ends its turn freely', () => withProject((cwd) => {
  const base = { session_id: 's1', cwd };
  assert.equal(hook('user-prompt-submit', base), null);
  assert.equal(hook('post-tool-use', { ...base, tool_name: 'Skill', tool_input: { skill: 'figures:lit-diagram-drawer' } }), null);
  assert.equal(hook('post-tool-use', { ...base, tool_name: 'Bash', tool_input: { command: 'ls' }, tool_response: { stdout: '' } }), null);
  assert.equal(hook('stop', base), null);
  assert.equal(existsSync(join(cwd, '.litclaude')), false);
}));

test('loading the film skill holds the turn until a render ran, then gives up with a notice', () => withProject((cwd) => {
  const base = { session_id: 's2', cwd };
  hook('user-prompt-submit', base);
  hook('post-tool-use', { ...base, tool_name: 'Skill', tool_input: { skill: 'video-covers:lit-typographic-motion' } });
  const first = hook('stop', base);
  assert.equal(first.decision, 'block');
  assert.match(first.reason, /not done: no render command ran in this turn/u);
  assert.equal(hook('stop', base).decision, 'block');
  const notice = hook('stop', base);
  assert.match(notice.reason, /Stop rendering now and say in the reply/u);
  assert.equal(hook('stop', base), null);
}));

test('a motion.mjs run arms the turn by itself and the done-check names what is missing', () => withProject((cwd) => {
  const base = { session_id: 's3', cwd };
  hook('post-tool-use', { ...base, tool_name: 'Bash', tool_input: { command: 'node motion.mjs stage --out film' }, tool_response: { stdout: 'exit 0 OK' } });
  const block = hook('stop', base);
  assert.equal(block.decision, 'block');
  assert.match(block.reason, new RegExp(`treatment\\.json is missing in ${join(cwd, 'film').replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}`, 'u'));
  assert.ok(existsSync(join(cwd, '.litclaude/.gitignore')), 'the state folder ignores itself');
}));

test('a blocked environment exit goes straight to the notice, and a new prompt clears the turn', () => withProject((cwd) => {
  const base = { session_id: 's4', cwd };
  hook('post-tool-use', { ...base, tool_name: 'Bash', tool_input: { command: 'node motion.mjs make brief.json --out film' }, tool_response: { stdout: 'exit 12 BLOCKED_NO_FFMPEG_FOR_VIDEO' } });
  assert.match(hook('stop', base).reason, /BLOCKED \(exit 12\)/u);
  hook('post-tool-use', { ...base, tool_name: 'Skill', tool_input: { skill: 'lit-typographic-motion' } });
  hook('user-prompt-submit', base);
  assert.equal(hook('stop', base), null);
  assert.equal(hook('stop', { ...base, session_id: 'other' }), null);
}));
