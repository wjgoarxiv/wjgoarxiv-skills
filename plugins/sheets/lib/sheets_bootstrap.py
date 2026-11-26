"""Run a lit-xlsx script inside the sheets plugin's own Python runtime.

Each script calls ``ensure_runtime([...])`` before its third-party imports. Unless it already
runs inside the pinned environment, the script asks ``sheets-runtime.mjs python`` for the
interpreter (first use installs the lockfile) and re-executes itself there with the same
arguments. The host Python is used only when the runtime cannot be prepared and the host
already has every module; that fallback is announced on stderr.
"""

from __future__ import annotations

import importlib.util
import os
import subprocess
import sys

_MARK = "LIT_XLSX_REEXEC"
_RUNTIME = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sheets-runtime.mjs")


def _missing(modules: list[str]) -> list[str]:
    return [m for m in modules if importlib.util.find_spec(m) is None]


def ensure_runtime(modules: list[str]) -> None:
    # Already inside: re-executed by this function, or started with the runtime's own interpreter
    # (its venv folder carries the ready marker the installer writes).
    if os.environ.get(_MARK) == "1" or os.path.exists(os.path.join(sys.prefix, ".lit-xlsx-ready")):
        missing = _missing(modules)
        if missing:
            raise SystemExit("BLOCKED: the lit-xlsx runtime is active but lacks " + ", ".join(missing)
                             + f". Run `node {_RUNTIME} status`.")
        return
    node = os.environ.get("LIT_XLSX_NODE", "node")
    try:
        result = subprocess.run([node, _RUNTIME, "python"], stdout=subprocess.PIPE, stderr=None, text=True, check=False)
        interpreter = result.stdout.strip() if result.returncode == 0 else ""
    except FileNotFoundError:
        interpreter = ""
    if not interpreter:
        missing = _missing(modules)
        if not missing:
            print("lit-xlsx runtime unavailable; continuing with the host Python packages.", file=sys.stderr)
            return
        raise SystemExit("BLOCKED: the lit-xlsx runtime could not be prepared and the host Python lacks "
                         + ", ".join(missing) + f". Fix: node {_RUNTIME} ensure")
    env = dict(os.environ, **{_MARK: "1", "PYTHONDONTWRITEBYTECODE": "1"})
    argv = [interpreter, os.path.abspath(sys.argv[0]), *sys.argv[1:]]
    if os.name == "nt":
        sys.exit(subprocess.call(argv, env=env))
    os.execve(argv[0], argv, env)
