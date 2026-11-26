#!/usr/bin/env node
// Python runtime for lit-xlsx (the sheets plugin).
//
// The lit-xlsx scripts need openpyxl, XlsxWriter, defusedxml, lxml and Pillow. None of them ship
// with the plugin. They install on first use from ./sheets-runtime-lock/requirements.lock into a
// cache that belongs to this plugin alone:
//
//   $LIT_XLSX_RUNTIME                                   when set (tests, isolated probes)
//   ${XDG_CACHE_HOME:-~/.cache}/litfamily/sheets-runtime otherwise
//
// The environment lives in python-<key>, where <key> hashes the lockfile, the platform and the
// Python minor version, so a lock change or a new interpreter gets a fresh environment. This cache
// is separate from the documents/decks office runtime: editing one lock never rebuilds the other.
// LibreOffice (soffice) and Poppler (pdftoppm) are host tools; they are reported, never installed.
//
//   node sheets-runtime.mjs status [--json]   readiness report, never installs
//   node sheets-runtime.mjs ensure [--json]   install on first use
//   node sheets-runtime.mjs python            ensure, then print the interpreter path

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LOCK = fileURLToPath(new URL("./sheets-runtime-lock/requirements.lock", import.meta.url));
const READY = ".lit-xlsx-ready";
const MIN_PYTHON = [3, 10];
// The newest CPython every pinned package ships a wheel for (pip runs --only-binary).
const MAX_PYTHON = [3, 14];
const STALE_LOCK_MS = 20 * 60 * 1000;

const HOST_TOOLS = [
  { id: "soffice", args: ["--version"], feature: "recalculation and the render gate" },
  { id: "pdftoppm", args: ["-v"], feature: "the render gate (PDF pages to PNG)" },
];

const run = (command, args, options = {}) => spawnSync(command, args, { encoding: "utf8", ...options });

export function probePython(command) {
  const probe = run(command, ["-c", "import sys; print('%d.%d.%d' % sys.version_info[:3])"]);
  if (probe.error || probe.status !== 0) return { ok: false, command, detail: probe.error?.code === "ENOENT" ? "not found" : (probe.stderr || probe.error?.message || "not found").trim() };
  const version = probe.stdout.trim();
  const [major, minor] = version.split(".").map(Number);
  if (major < MIN_PYTHON[0] || (major === MIN_PYTHON[0] && minor < MIN_PYTHON[1])) return { ok: false, command, version, detail: `${version} is older than ${MIN_PYTHON.join(".")}` };
  if (major > MAX_PYTHON[0] || (major === MAX_PYTHON[0] && minor > MAX_PYTHON[1])) return { ok: false, command, version, detail: `${version} is newer than ${MAX_PYTHON.join(".")}` };
  return { ok: true, command, version, detail: version };
}

/** $LIT_XLSX_PYTHON when set, otherwise the newest python3.X on PATH inside the supported range. */
export function pickPython(env = process.env, probe = probePython) {
  if (env.LIT_XLSX_PYTHON) return probe(env.LIT_XLSX_PYTHON);
  const candidates = [];
  for (let minor = MAX_PYTHON[1]; minor >= MIN_PYTHON[1]; minor -= 1) candidates.push(`python3.${minor}`);
  candidates.push("python3", "python");
  const tried = [];
  for (const command of candidates) {
    const found = probe(command);
    if (found.ok) return found;
    if (found.detail !== "not found") tried.push(`${command}: ${found.detail}`);
  }
  return { ok: false, command: "python3", detail: `no supported Python (${MIN_PYTHON.join(".")} to ${MAX_PYTHON.join(".")}) on PATH${tried.length ? `; tried ${tried.join(", ")}` : ""}` };
}

export function runtimeRoot(env = process.env) {
  if (env.LIT_XLSX_RUNTIME) return path.resolve(env.LIT_XLSX_RUNTIME);
  return path.join(env.XDG_CACHE_HOME || path.join(homedir(), ".cache"), "litfamily", "sheets-runtime");
}

export function runtimeDir(python = pickPython()) {
  const minor = python.version ? python.version.split(".").slice(0, 2).join(".") : "none";
  const key = createHash("sha256").update(readFileSync(LOCK)).update(`${process.platform}-${process.arch}-py${minor}`).digest("hex").slice(0, 12);
  return path.join(runtimeRoot(), `python-${key}`);
}

const venvPython = (dir) => (process.platform === "win32" ? path.join(dir, "Scripts", "python.exe") : path.join(dir, "bin", "python"));
const pinned = () => readFileSync(LOCK, "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));

// One installer per environment at a time: mkdir is atomic, so the directory is the lock.
function withLock(dir, fn) {
  mkdirSync(path.dirname(dir), { recursive: true });
  const lock = `${dir}.lock`;
  const deadline = Date.now() + STALE_LOCK_MS;
  for (;;) {
    try {
      mkdirSync(lock);
      break;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      let age = 0;
      try { age = Date.now() - statSync(lock).mtimeMs; } catch { continue; }
      if (age > STALE_LOCK_MS) { rmSync(lock, { recursive: true, force: true }); continue; }
      if (Date.now() > deadline) throw new Error(`SHEETS_RUNTIME_LOCKED: ${lock} is held by another installer`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
    }
  }
  try { return fn(); } finally { rmSync(lock, { recursive: true, force: true }); }
}

export function status() {
  const host = pickPython();
  const dir = runtimeDir(host);
  const ready = host.ok && existsSync(path.join(dir, READY)) && existsSync(venvPython(dir));
  return { ready, root: runtimeRoot(), dir, interpreter: venvPython(dir), host, pinned: pinned() };
}

export function ensure() {
  const now = status();
  if (now.ready) return now;
  if (!now.host.ok) throw new Error(`SHEETS_RUNTIME_PYTHON_UNAVAILABLE: ${now.host.detail}. Fix: install Python ${MAX_PYTHON.join(".")} or set LIT_XLSX_PYTHON to a ${MIN_PYTHON.join(".")}-${MAX_PYTHON.join(".")} interpreter.`);
  return withLock(now.dir, () => {
    if (existsSync(path.join(now.dir, READY))) return status();
    rmSync(now.dir, { recursive: true, force: true });
    process.stderr.write(`lit-xlsx runtime: creating a Python ${now.host.version} environment with ${now.pinned.length} pinned packages in ${now.dir} (first use only).\n`);
    const venv = run(now.host.command, ["-m", "venv", now.dir], { stdio: ["ignore", "pipe", "pipe"] });
    if (venv.error || venv.status !== 0) throw new Error(`SHEETS_RUNTIME_VENV_FAILED: ${(venv.stderr || venv.error?.message || "").trim().slice(-600)}`);
    const pip = run(venvPython(now.dir), ["-m", "pip", "install", "--only-binary=:all:", "--no-input", "--disable-pip-version-check", "--quiet", "-r", LOCK], { stdio: ["ignore", "pipe", "pipe"] });
    if (pip.error || pip.status !== 0) throw new Error(`SHEETS_RUNTIME_INSTALL_FAILED: pip exited ${pip.status}: ${(pip.stderr || pip.error?.message || "").trim().slice(-600)}`);
    writeFileSync(path.join(now.dir, READY), `${JSON.stringify({ python: now.host.version, at: new Date().toISOString() })}\n`);
    return status();
  });
}

export function hostTools() {
  return HOST_TOOLS.map(({ id, args, feature }) => {
    const probe = run(id, args, { stdio: ["ignore", "pipe", "pipe"], timeout: 20000 });
    const ok = !probe.error && probe.status === 0;
    const line = `${(ok ? probe.stdout || probe.stderr : probe.stderr) ?? ""}`.trim().split(/\r?\n/u)[0];
    return { id, available: ok, detail: ok ? line : probe.error?.code === "ENOENT" ? "not found on PATH" : line || "failed", feature };
  });
}

function main(argv) {
  const [command = "status", ...rest] = argv;
  const json = rest.includes("--json");
  try {
    if (command === "status") {
      const s = { ...status(), hostTools: hostTools() };
      if (json) console.log(JSON.stringify(s, null, 2));
      else {
        console.log(`lit-xlsx runtime: ${s.ready ? "ready" : s.host.ok ? "not installed (first use installs)" : `unavailable: ${s.host.detail}`}`);
        console.log(`environment:      ${s.dir}`);
        for (const t of s.hostTools) console.log(`${t.id.padEnd(9)} ${t.available ? t.detail : `missing; unavailable: ${t.feature}`}`);
      }
      return 0;
    }
    if (command === "ensure") {
      const unknown = rest.find((a) => a !== "--json");
      if (unknown !== undefined) { console.error(`unknown ensure option: ${unknown}`); return 2; }
      const s = ensure();
      console.log(json ? JSON.stringify(s, null, 2) : "lit-xlsx runtime ready");
      return 0;
    }
    if (command === "python") { console.log(ensure().interpreter); return 0; }
    console.error(`unknown command: ${command}`);
    return 2;
  } catch (error) {
    console.error(error.message);
    return 1;
  }
}

const invokedDirectly = (() => {
  try { return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; }
})();
if (invokedDirectly) process.exitCode = main(process.argv.slice(2));
