"""Read-only preflight for the lit-scientific-visualization Hermes skill.

Run it with the Python that will draw the figure:

    python3 <skill dir>/scripts/preflight.py          # human-readable
    python3 <skill dir>/scripts/preflight.py --json   # machine-readable

It imports each scientific package for real (no find_spec guess), never installs anything, and
prints the resolved paths of the bundled source so a figure script can import them. Exit 0 when
matplotlib imports (READY), 3 when it does not (DEGRADED): only this skill's execution is blocked.
"""

from __future__ import annotations

import argparse
import importlib
import json
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent.parent
SOURCE_ROOT = SKILL_ROOT / "vendor" / "scientific-visualization"
PATHS = {
    "source_root": SOURCE_ROOT,
    "source_skill": SOURCE_ROOT / "SKILL.md",
    "figure_export_script": SOURCE_ROOT / "scripts" / "figure_export.py",
    "style_presets_script": SOURCE_ROOT / "scripts" / "style_presets.py",
    "publication_style": SOURCE_ROOT / "assets" / "publication.mplstyle",
    "color_palettes": SOURCE_ROOT / "assets" / "color_palettes.py",
    "color_palette_import_root": SOURCE_ROOT / "assets",
    "seaborn_reference_fallback": SOURCE_ROOT / "references" / "seaborn_for_publications.md",
}
CORE_DEPENDENCIES = ("matplotlib",)
RECOMMENDED_DEPENDENCIES = ("numpy",)
OPTIONAL_DEPENDENCIES = (
    "seaborn",
    "plotly",
    "scipy",
    "pandas",
    "colorspacious",
    "kaleido",
    "MDAnalysis",
    "nglview",
    "py3Dmol",
)


def _module_available(name: str) -> bool:
    try:
        importlib.import_module(name)
        return True
    except Exception:
        return False


def dependency_status() -> dict[str, object]:
    """Report capability using real imports without installing packages."""
    missing_core = [name for name in CORE_DEPENDENCIES if not _module_available(name)]
    missing_recommended = [name for name in RECOMMENDED_DEPENDENCIES if not _module_available(name)]
    missing_optional = [name for name in OPTIONAL_DEPENDENCIES if not _module_available(name)]
    return {
        "state": "DEGRADED" if missing_core else "READY",
        "missing_core": missing_core,
        "missing_recommended": missing_recommended,
        "missing_optional": missing_optional,
    }


def dependency_summary(status: dict[str, object]) -> str:
    parts = [str(status["state"])]
    if status["missing_core"]:
        parts.append("missing core: " + ", ".join(status["missing_core"]))
    if status["missing_recommended"]:
        parts.append("missing recommended: " + ", ".join(status["missing_recommended"]))
    if status["missing_optional"]:
        parts.append("optional unavailable: " + ", ".join(status["missing_optional"]))
    return "; ".join(parts)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Read-only dependency preflight for lit-scientific-visualization.")
    parser.add_argument("--json", action="store_true", help="print the report as JSON")
    args = parser.parse_args(argv)
    status = dependency_status()
    paths = {key: str(value) for key, value in PATHS.items()}
    missing = [key for key, value in PATHS.items() if not value.exists()]
    if args.json:
        print(json.dumps({"capability": status, "paths": paths, "missing_paths": missing}, indent=2))
    else:
        print(f"capability: {dependency_summary(status)}")
        for key, value in paths.items():
            print(f"{key}: {value}")
        if missing:
            print("missing bundled files: " + ", ".join(missing))
        print("Nothing was installed. DEGRADED blocks only this skill's execution.")
    if missing:
        return 2
    return 0 if status["state"] == "READY" else 3


if __name__ == "__main__":
    raise SystemExit(main())
