// Driver adapter: the interface probe speaks the probeBrowserDriver/runBrowserCommand contract,
// while the bundled browser-capability-probe.mjs exposes the older probe() shape. This module
// translates between them; it changes no behavior of the probe itself.
import { spawnSync } from "node:child_process";
import { closeSync, mkdtempSync, openSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { probe } from "./browser-capability-probe.mjs";

export const DRIVER_COMMAND = "agent-browser";

// Shape the interface probe consumes: { status, version, command, blocker } where status
// is one of available | beyond-verified | unavailable | unverified-identity and blocker is
// a BLOCKED_REASON key from interface-probe-rules.mjs (or null when ready).
export function probeBrowserDriver() {
  const found = probe();
  if (!found.available) {
    return { status: "unavailable", version: null, command: DRIVER_COMMAND, blocker: "BLOCKED_BROWSER_DRIVER_UNAVAILABLE" };
  }
  if (!found.accepted) {
    return { status: "unverified-identity", version: null, command: DRIVER_COMMAND, blocker: "BLOCKED_BROWSER_IDENTITY_UNVERIFIED" };
  }
  const version = found.version ? `${found.version.major}.${found.version.minor}.${found.version.patch}` : null;
  return { status: found.state === "beyond-verified" ? "beyond-verified" : "available", version, command: DRIVER_COMMAND, blocker: null };
}

// Windows: the agent-browser daemon a call starts inherits that call's stdout and stderr. With pipes,
// spawnSync waits until the daemon closes them and the call ends in ETIMEDOUT, so on Windows the output
// goes to owned temp files that are read back once the direct child exits.
function spawnWithFiles(command, args, options) {
  const dir = mkdtempSync(join(tmpdir(), "litgrok-browser-"));
  const paths = [join(dir, "stdout"), join(dir, "stderr")];
  const fds = paths.map((path) => openSync(path, "w"));
  try {
    const result = spawnSync(command, args, {
      timeout: options.timeout,
      env: options.env,
      stdio: [options.input === undefined ? "ignore" : "pipe", fds[0], fds[1]],
      ...(options.input === undefined ? {} : { input: options.input }),
    });
    for (const fd of fds) closeSync(fd);
    fds.length = 0;
    const limit = options.maxBuffer ?? 64 * 1024 * 1024;
    const [stdout, stderr] = paths.map((path) => readFileSync(path, "utf8").slice(0, limit));
    return { ...result, stdout, stderr, output: [null, stdout, stderr] };
  } finally {
    for (const fd of fds) closeSync(fd);
    // The daemon can still hold the files open on Windows; removal is best effort.
    try { rmSync(dir, { recursive: true, force: true }); } catch { /* left for the OS temp cleaner */ }
  }
}

// Minimal runBrowserCommand: spawnSync already returns { status, stdout, stderr, error }.
export function runBrowserCommand(command, args, options = {}) {
  if ((options.platform ?? process.platform) === "win32") return spawnWithFiles(command, args, options);
  return spawnSync(command, args, {
    encoding: "utf8",
    timeout: options.timeout,
    maxBuffer: options.maxBuffer,
    env: options.env,
    // A caller with input gets it on stdin; without input stdin stays a pipe that closes at once.
    ...(options.input === undefined ? {} : { input: options.input }),
  });
}
