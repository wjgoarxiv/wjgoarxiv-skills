#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Skill-owned cache; nothing outside this skill folder and this cache is read or written.
const cacheBase = join(process.env.XDG_CACHE_HOME || join(homedir(), ".cache"), "lit-office");
const commands = {
  docx: {
    convert: ["python", join(docRoot, "scripts/convert_md_to_docx.py")],
    qa: ["python", join(docRoot, "scripts/docx_craft.py")],
    edit: ["python", join(docRoot, "scripts/edit_docx.py")],
    pdf: ["python", join(docRoot, "scripts/convert_md_to_pdf.py")],
    extract_pdf: ["python", join(docRoot, "scripts/convert_pdf.py")],
    slop: ["python", join(docRoot, "scripts/slop_lint.py")],
    audit: ["python", join(docRoot, "scripts/visual_audit.py")],
    clean: ["python", join(docRoot, "scripts/clean_markdown.py")],
    images: ["python", join(docRoot, "scripts/embed_images.py")],
  },
};

function run(program, args, options = {}) {
  const result = spawnSync(program, args, { stdio: "inherit", ...options });
  // Name the failed step: a bare stack or exit code is all the installer could show otherwise.
  if (result.error) {
    process.stderr.write(`[lit-office] ${options.shell ? program : [program, ...args].join(" ")} could not start: ${result.error.message}\n`);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.stderr.write(`[lit-office] ${options.shell ? program : [program, ...args].join(" ")} exited with ${result.status ?? result.signal}\n`);
    process.exit(result.status ?? 1);
  }
}

/** A PATH lookup that also tries PATHEXT on Windows, where `which` does not exist. */
export function onPath(name, env = process.env, platform = process.platform, exists = existsSync) {
  const extensions = platform === "win32" ? (env.PATHEXT || ".COM;.EXE;.BAT;.CMD").split(";").filter(Boolean) : [""];
  for (const dir of (env.PATH ?? env.Path ?? "").split(platform === "win32" ? ";" : ":")) {
    if (!dir) continue;
    for (const extension of extensions) {
      const candidate = join(dir, `${name}${extension}`);
      if (exists(candidate)) return candidate;
    }
  }
  return null;
}

function cacheFor(skill) {
  const hash = createHash("sha256").update(readFileSync(join(docRoot, "runtime/requirements.lock")));
  return join(cacheBase, skill, hash.digest("hex").slice(0, 16));
}

function ready(skill) {
  const cache = cacheFor(skill);
  return existsSync(join(cache, "python.ready")) &&
    existsSync(join(cache, "venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python"));
}

function ensurePython(skill, cache) {
  if (existsSync(join(cache, "python.ready"))) return;
  const root = docRoot;
  const venv = join(cache, "venv");
  const python = join(venv, process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
  process.stderr.write(`[lit-office] preparing ${skill} Python runtime in ${cache}\n`);
  mkdirSync(cache, { recursive: true });
  const uv = spawnSync("uv", ["--version"], { stdio: "ignore" });
  if (uv.status === 0) {
    run("uv", ["venv", venv]);
    run("uv", ["pip", "sync", "--python", python, join(root, "runtime/requirements.lock")]);
  } else {
    run("python3", ["-m", "venv", venv]);
    run(python, ["-m", "pip", "install", "--disable-pip-version-check", "-r", join(root, "runtime/requirements.lock")]);
  }
  writeFileSync(join(cache, "python.ready"), "ready\n");
}

function main() {
  const [skill, command, ...args] = process.argv.slice(2);
  if (skill === "install" && command === undefined) {
    ensurePython("docx", cacheFor("docx"));
    process.stdout.write("[lit-office] docx runtime ready\n");
    return;
  }
  if (skill === "doctor") {
    const which = (name) => onPath(name) !== null;
    process.stdout.write(`${JSON.stringify({
      docx: { ready: ready("docx"), cache: cacheFor("docx") },
      optional: { pandoc: which("pandoc"), xelatex: which("xelatex"), soffice: which("soffice") },
    }, null, 2)}\n`);
    return;
  }
  const selected = commands[skill]?.[command];
  if (!selected) {
    process.stderr.write("Usage: office-run.mjs install | doctor | docx <convert|qa|edit|pdf|extract_pdf|slop|audit|clean|images> ...\n");
    process.exitCode = 2;
    return;
  }
  const cache = cacheFor(skill);
  if (!ready(skill)) {
    process.stderr.write(`docx runtime not installed; run \`node "${join(docRoot, "scripts/office-run.mjs")}" install\` outside the sandbox or approve network for this one step\n`);
    process.exitCode = 78;
    return;
  }
  const python = join(cache, "venv", process.platform === "win32" ? "Scripts/python.exe" : "bin/python");
  const program = selected[0] === "python" ? python : process.execPath;
  const path = join(cache, "venv", process.platform === "win32" ? "Scripts" : "bin");
  run(program, [selected[1], ...args], {
    env: {
      ...process.env,
      PATH: `${path}${process.platform === "win32" ? ";" : ":"}${process.env.PATH || ""}`,
    },
  });
}

const invoked = process.argv[1] && existsSync(process.argv[1]) ? realpathSync(process.argv[1]) : "";
if (invoked === realpathSync(fileURLToPath(import.meta.url))) main();
