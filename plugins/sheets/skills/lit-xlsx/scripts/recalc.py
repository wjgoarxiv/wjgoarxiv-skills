#!/usr/bin/env python3
"""Recalculate every formula in an .xlsx with LibreOffice and write the values back.

openpyxl writes formulas without results, and XlsxWriter writes 0 unless told otherwise, so a
viewer, a PDF export or ``openpyxl(data_only=True)`` sees blanks or zeros until something computes
the workbook. This script lets LibreOffice compute a copy (in a throwaway profile, see lo_profile.py),
then copies only the computed ``<v>`` values and their types back into the original sheet XML.
Everything else in the file (styles, charts, validation, names) stays byte-for-byte as it was,
because the workbook is never re-saved through LibreOffice or openpyxl.

Usage:
    python3 recalc.py BOOK.xlsx [--out OUT.xlsx] [--timeout 180] [--keep-profile] [--json]

Exit codes: 0 every formula computed without an error value; 1 error values found (listed by type
and cell); 2 the recalculation itself failed; 3 skipped because LibreOffice is not installed.
"""

from __future__ import annotations

import os
import sys

sys.dont_write_bytecode = True  # keep the installed plugin folder free of __pycache__
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "lib"))
from sheets_bootstrap import ensure_runtime  # noqa: E402

ensure_runtime(["lxml"])

import argparse  # noqa: E402
import json  # noqa: E402
import posixpath  # noqa: E402
import shutil  # noqa: E402
import tempfile  # noqa: E402
import time  # noqa: E402
import zipfile  # noqa: E402
from pathlib import Path  # noqa: E402

from lxml import etree  # noqa: E402

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lo_profile  # noqa: E402

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
      "pr": "http://schemas.openxmlformats.org/package/2006/relationships"}
M = "{%s}" % NS["m"]
ERROR_VALUES = ("#NULL!", "#DIV/0!", "#VALUE!", "#REF!", "#NAME?", "#NUM!", "#N/A", "#SPILL!", "#CALC!", "#GETTING_DATA")
# Untrusted workbooks: no entity expansion, no network, no huge trees.
PARSER = etree.XMLParser(resolve_entities=False, no_network=True, huge_tree=False, remove_blank_text=False)


def _xml(data: bytes):
    return etree.fromstring(data, PARSER)


def sheet_parts(z: zipfile.ZipFile) -> dict[str, str]:
    """Map sheet name -> part path (xl/worksheets/sheetN.xml) through workbook.xml and its rels."""
    wb = _xml(z.read("xl/workbook.xml"))
    rels = _xml(z.read("xl/_rels/workbook.xml.rels"))
    target = {r.get("Id"): r.get("Target") for r in rels.findall("pr:Relationship", NS)}
    parts = {}
    for s in wb.findall("m:sheets/m:sheet", NS):
        t = target.get(s.get("{%s}id" % NS["r"]))
        if not t:
            continue
        parts[s.get("name")] = t.lstrip("/") if t.startswith("/") else posixpath.normpath(posixpath.join("xl", t))
    return parts


def shared_strings(z: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in z.namelist():
        return []
    root = _xml(z.read("xl/sharedStrings.xml"))
    return ["".join(si.itertext()) for si in root.findall("m:si", NS)]


def computed_values(path: Path) -> dict[str, dict[str, tuple[str | None, str]]]:
    """Formula cell values LibreOffice wrote: {sheet: {ref: (type, text)}}."""
    out: dict[str, dict[str, tuple[str | None, str]]] = {}
    with zipfile.ZipFile(path) as z:
        sst = shared_strings(z)
        for name, part in sheet_parts(z).items():
            cells = {}
            for c in _xml(z.read(part)).iter(M + "c"):
                if c.find(M + "f") is None:
                    continue
                v = c.find(M + "v")
                if v is None or v.text is None:
                    continue
                t = c.get("t")
                text = v.text
                if t == "s":
                    t, text = "str", sst[int(text)]
                cells[c.get("r")] = (t, text)
            out[name] = cells
    return out


def splice(original: Path, dest: Path, values: dict) -> dict:
    """Write original to dest with each formula cell's <v> and t= taken from values."""
    stats = {"formula_cells": 0, "updated": 0, "missing": [], "errors": {}}
    with zipfile.ZipFile(original) as zin:
        parts = sheet_parts(zin)
        by_part = {p: n for n, p in parts.items()}
        tmp = dest.with_suffix(dest.suffix + ".tmp")
        with zipfile.ZipFile(tmp, "w") as zout:
            for info in zin.infolist():
                data = zin.read(info.filename)
                name = by_part.get(info.filename)
                if name is not None:
                    root = _xml(data)
                    sheet_vals = values.get(name, {})
                    for c in root.iter(M + "c"):
                        f = c.find(M + "f")
                        if f is None:
                            continue
                        stats["formula_cells"] += 1
                        ref = c.get("r")
                        got = sheet_vals.get(ref)
                        if got is None:
                            stats["missing"].append(f"{name}!{ref}")
                            continue
                        t, text = got
                        for old in c.findall(M + "v") + c.findall(M + "is"):
                            c.remove(old)
                        v = etree.SubElement(c, M + "v")
                        v.text = text
                        f.addnext(v)
                        if t in (None, "n"):
                            c.attrib.pop("t", None)
                        else:
                            c.set("t", t)
                        if t == "e":
                            stats["errors"].setdefault(text, []).append(f"{name}!{ref}")
                        stats["updated"] += 1
                    data = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)
                zout.writestr(info, data)
        os.replace(tmp, dest)
    return stats


def recalc(path: Path, out: Path | None = None, timeout: int = 180, keep_profile: bool = False) -> dict:
    report: dict = {"file": str(path), "status": "ok"}
    if not lo_profile.soffice():
        report.update(status="skip", reason="LibreOffice (soffice) is not on PATH; formulas were not recalculated")
        return report
    profile = lo_profile.make_profile()
    report["profile"] = str(profile)
    work = Path(tempfile.mkdtemp(prefix="lit-xlsx-recalc-"))
    try:
        src = work / "in" / path.name
        src.parent.mkdir()
        shutil.copy2(path, src)
        before = src.stat().st_mtime
        started = time.time()
        result = lo_profile.run_soffice(profile, ["--convert-to", "xlsx:Calc MS Excel 2007 XML", "--outdir", str(work / "out"), str(src)], timeout)
        report["seconds"] = round(time.time() - started, 1)
        computed = work / "out" / path.name
        if result.returncode != 0 or not computed.exists() or computed.stat().st_mtime < before:
            report.update(status="failed", reason=(result.stderr or result.stdout or "no output file").strip()[-400:])
            return report
        stats = splice(path, out or path, computed_values(computed))
        report.update(out=str(out or path), formula_cells=stats["formula_cells"], updated=stats["updated"],
                      not_computed=stats["missing"][:50], not_computed_count=len(stats["missing"]),
                      errors=stats["errors"], error_count=sum(len(v) for v in stats["errors"].values()))
        if report["error_count"]:
            report["status"] = "errors"
        elif report["not_computed_count"]:
            report["status"] = "incomplete"
        return report
    except Exception as exc:  # a crash or timeout is a failed recalculation, reported, not raised
        report.update(status="failed", reason=f"{type(exc).__name__}: {exc}"[-400:])
        return report
    finally:
        shutil.rmtree(work, ignore_errors=True)
        lo_profile.drop_profile(profile, keep_profile)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("book")
    ap.add_argument("--out")
    ap.add_argument("--timeout", type=int, default=180)
    ap.add_argument("--keep-profile", action="store_true", help="keep the throwaway profile folder (tests)")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    report = recalc(Path(a.book).resolve(), Path(a.out).resolve() if a.out else None, a.timeout, a.keep_profile)
    if a.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(f"recalc {report['status']}: {report.get('file')}")
        if report["status"] in ("skip", "failed"):
            print(f"  {report['reason']}")
        else:
            print(f"  {report['updated']}/{report['formula_cells']} formula cells computed in {report['seconds']} s")
            for err, cells in report["errors"].items():
                print(f"  {err} x{len(cells)}: {', '.join(cells[:10])}{' ...' if len(cells) > 10 else ''}")
            if report["not_computed_count"]:
                print(f"  {report['not_computed_count']} formula cells got no value: {', '.join(report['not_computed'][:10])}")
    return {"ok": 0, "errors": 1, "failed": 2, "skip": 3, "incomplete": 4}[report["status"]]


if __name__ == "__main__":
    sys.exit(main())
