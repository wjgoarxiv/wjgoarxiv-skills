"""A throwaway LibreOffice profile for every lit-xlsx run.

LibreOffice keeps settings, macros and a lock file in its user profile. lit-xlsx never touches the
profile a person uses (on macOS ``~/Library/Application Support/LibreOffice``). Each run makes a new
folder under the system temp directory, passes it as ``-env:UserInstallation=file://...`` and
deletes it afterwards. The folder is seeded with one setting: recalculate every formula on load, for
both OOXML and ODF files, so the values LibreOffice writes are fresh rather than the cached ones.
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

PROFILE_PREFIX = "lit-xlsx-lo-"

# 0 = always recalculate on load (1 = never, 2 = ask).
_XCU = """<?xml version="1.0" encoding="UTF-8"?>
<oor:items xmlns:oor="http://openoffice.org/2001/registry" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<item oor:path="/org.openoffice.Office.Calc/Formula/Load"><prop oor:name="OOXMLRecalcMode" oor:op="fuse"><value>0</value></prop></item>
<item oor:path="/org.openoffice.Office.Calc/Formula/Load"><prop oor:name="ODFRecalcMode" oor:op="fuse"><value>0</value></prop></item>
<item oor:path="/org.openoffice.Office.Common/Misc"><prop oor:name="FirstRun" oor:op="fuse"><value>false</value></prop></item>
<item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="MacroSecurityLevel" oor:op="fuse"><value>3</value></prop></item>
</oor:items>
"""


def shared_profile_dirs() -> list[Path]:
    """Where a person's own LibreOffice profile lives; lit-xlsx must never write there."""
    home = Path.home()
    if sys.platform == "darwin":
        return [home / "Library" / "Application Support" / "LibreOffice"]
    if os.name == "nt":
        return [Path(os.environ.get("APPDATA", home / "AppData" / "Roaming")) / "LibreOffice"]
    return [Path(os.environ.get("XDG_CONFIG_HOME", home / ".config")) / "libreoffice"]


def soffice() -> str | None:
    found = shutil.which("soffice") or shutil.which("libreoffice")
    if found:
        return found
    mac = Path("/Applications/LibreOffice.app/Contents/MacOS/soffice")
    return str(mac) if mac.exists() else None


def make_profile() -> Path:
    """Create a fresh profile folder under the temp directory, seeded with the recalc setting."""
    root = Path(tempfile.mkdtemp(prefix=PROFILE_PREFIX)).resolve()
    shared = [p.resolve() for p in shared_profile_dirs()]
    if any(root == p or p in root.parents for p in shared):
        raise RuntimeError(f"refusing to use {root}: it is inside the shared LibreOffice profile")
    (root / "user").mkdir()
    (root / "user" / "registrymodifications.xcu").write_text(_XCU, encoding="utf-8")
    return root


def run_soffice(profile: Path, args: list[str], timeout: int = 180) -> subprocess.CompletedProcess:
    exe = soffice()
    if not exe:
        raise FileNotFoundError("LibreOffice (soffice) is not on PATH")
    cmd = [exe, f"-env:UserInstallation={profile.as_uri()}", "--headless", "--norestore", "--nologo",
           "--nodefault", "--nolockcheck", *args]
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, stdin=subprocess.DEVNULL)


def drop_profile(profile: Path, keep: bool = False) -> None:
    if not keep:
        shutil.rmtree(profile, ignore_errors=True)
