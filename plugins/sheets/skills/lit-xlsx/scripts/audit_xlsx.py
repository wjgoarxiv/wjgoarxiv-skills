#!/usr/bin/env python3
"""Formula integrity check for an .xlsx: report first, change nothing.

Run it after recalc.py, because error values and failed checks only exist once something has
computed the workbook. Each finding has a severity (critical, warning, info), a sheet, a cell, a
category, what was seen and how to fix it.

Categories:
    error-value        a formula result is #REF!, #DIV/0!, #NAME?, #VALUE!, #N/A, #NUM!, #NULL!, ...
    broken-reference   the formula text itself contains #REF! (a deleted row, column or sheet)
    needs-prefix       a post-2007 function written without _xlfn. (Excel shows #NAME?)
    dynamic-array      FILTER, SORT, UNIQUE, XLOOKUP, LET ... (missing in older Excel)
    hardcode-in-formula a literal like *1.08 inside a formula; move it to a labelled input cell
    pattern-break      a typed number between formulas in the same row or column
    hardcoded-total    a total/합계/소계 row that holds typed numbers instead of sums
    not-recalculated   formula cells with no stored value: run recalc.py
    check-failed       a cell on a Checks/점검 sheet reads CHECK or FALSE
    general-format     numbers left in the General format
    default-sheet-name Sheet1, Sheet2 ...
    too-many-fills     more than 8 distinct fill colours

Usage:
    python3 audit_xlsx.py BOOK.xlsx [--json] [--strict]

Exit 1 when any critical finding exists (or any warning with --strict), else 0.
"""

from __future__ import annotations

import os
import sys

sys.dont_write_bytecode = True  # keep the installed plugin folder free of __pycache__
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "lib"))
from sheets_bootstrap import ensure_runtime  # noqa: E402

ensure_runtime(["openpyxl", "defusedxml"])

import argparse  # noqa: E402
import json  # noqa: E402
import re  # noqa: E402
from pathlib import Path  # noqa: E402

from openpyxl import load_workbook  # noqa: E402

ERRORS = {"#NULL!", "#DIV/0!", "#VALUE!", "#REF!", "#NAME?", "#NUM!", "#N/A", "#SPILL!", "#CALC!", "#GETTING_DATA"}
# Functions Excel stores with the _xlfn. prefix. Written bare through openpyxl they open as #NAME?.
NEEDS_PREFIX = {
    "IFS", "SWITCH", "MAXIFS", "MINIFS", "CONCAT", "TEXTJOIN", "IFNA", "XOR", "DAYS", "ISOWEEKNUM", "AGGREGATE",
    "STDEV.S", "STDEV.P", "VAR.S", "VAR.P", "MODE.SNGL", "PERCENTILE.INC", "PERCENTILE.EXC", "QUARTILE.INC",
    "RANK.EQ", "RANK.AVG", "CEILING.MATH", "FLOOR.MATH", "FORECAST.LINEAR", "NORM.DIST", "NORM.INV", "T.TEST",
    "XLOOKUP", "XMATCH", "FILTER", "SORT", "SORTBY", "UNIQUE", "SEQUENCE", "RANDARRAY", "LET", "LAMBDA",
    "TEXTBEFORE", "TEXTAFTER", "TEXTSPLIT", "VSTACK", "HSTACK", "TAKE", "DROP", "CHOOSECOLS", "CHOOSEROWS",
}
DYNAMIC = {"XLOOKUP", "XMATCH", "FILTER", "SORT", "SORTBY", "UNIQUE", "SEQUENCE", "RANDARRAY", "LET", "LAMBDA",
           "TEXTSPLIT", "VSTACK", "HSTACK", "TAKE", "DROP", "CHOOSECOLS", "CHOOSEROWS"}
# Literals that are units or counts rather than assumptions.
ALLOWED_LITERALS = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 24, 52, 60, 100, 365, 1000, 1000000}
TOTAL_LABEL = re.compile(r"^\s*(total|grand total|sum|subtotal|합계|총계|소계|계)\s*$", re.I)
CHECK_SHEET = re.compile(r"^(checks?|점검|검증)$", re.I)
DEFAULT_NAME = re.compile(r"^(sheet|시트)\d+$", re.I)
REF = re.compile(r"(?:'[^']+'|[A-Za-z0-9_.가-힣]+)?!?\$?[A-Z]{1,3}\$?\d+(?::\$?[A-Z]{1,3}\$?\d+)?")
FUNC = re.compile(r"(_xlfn\.)?([A-Z][A-Z0-9.]*)\s*\(")
NUMBER = re.compile(r"(?<![A-Za-z_.$\d])(\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)%?")


def finding(sev, sheet, cell, cat, detail, fix):
    return {"severity": sev, "sheet": sheet, "cell": cell, "category": cat, "detail": detail, "fix": fix}


def formula_text(v) -> str | None:
    if isinstance(v, str) and v.startswith("="):
        return v
    text = getattr(v, "text", None)  # ArrayFormula
    return text if isinstance(text, str) else None


def literals(formula: str) -> list[str]:
    body = re.sub(r'"[^"]*"', '""', formula)
    body = REF.sub("R", body)
    body = FUNC.sub("F(", body)
    hits = []
    for m in NUMBER.finditer(body):
        n = float(m.group(1))
        if m.group(0).endswith("%") or n not in ALLOWED_LITERALS:
            hits.append(m.group(0))
    return hits


def audit(path: Path) -> dict:
    wb_f = load_workbook(path, data_only=False)
    wb_v = load_workbook(path, data_only=True)
    out = []
    fills = set()
    for ws in wb_f.worksheets:
        wv = wb_v[ws.title]
        name = ws.title
        if DEFAULT_NAME.match(name):
            out.append(finding("info", name, "", "default-sheet-name", f"sheet is called {name}", "name the sheet for what it holds"))
        is_check_sheet = bool(CHECK_SHEET.match(name))
        formula_cells, blank_results, general = 0, 0, 0
        kinds: dict[tuple[int, int], str] = {}
        for row in ws.iter_rows():
            for c in row:
                v = c.value
                if c.fill is not None and c.fill.fill_type == "solid" and c.fill.fgColor is not None and c.fill.fgColor.rgb not in (None, "00000000"):
                    fills.add(str(c.fill.fgColor.rgb))
                f = formula_text(v)
                cached = wv[c.coordinate].value
                if f:
                    formula_cells += 1
                    kinds[(c.row, c.column)] = "f"
                    if cached is None:
                        blank_results += 1
                    if "#REF!" in f:
                        out.append(finding("critical", name, c.coordinate, "broken-reference", f, "rebuild the reference to the row, column or sheet that was removed"))
                    for prefix, fn in FUNC.findall(f.upper()):
                        if fn in NEEDS_PREFIX and not prefix:
                            out.append(finding("warning", name, c.coordinate, "needs-prefix", f"{fn} without _xlfn.", f"write _xlfn.{fn}( or use a 2007-era function"))
                        if fn in DYNAMIC:
                            out.append(finding("info", name, c.coordinate, "dynamic-array", fn, "INDEX/MATCH, SUMIFS or SUMPRODUCT open everywhere"))
                    lits = literals(f)
                    if lits:
                        out.append(finding("warning", name, c.coordinate, "hardcode-in-formula", f"{f}  (literal {', '.join(lits)})", "put the number in a labelled input cell and point to it"))
                elif isinstance(v, (int, float)) and not isinstance(v, bool):
                    kinds[(c.row, c.column)] = "n"
                if isinstance(cached, str) and cached.strip() in ERRORS:
                    out.append(finding("critical", name, c.coordinate, "error-value", f"{cached} from {f or v}", "fix the formula or guard it (IFERROR only where a blank is the right answer)"))
                if (f or isinstance(v, (int, float))) and not isinstance(v, bool) and c.number_format == "General" and not isinstance(cached, str):
                    general += 1
                if is_check_sheet and f and (cached is False or (isinstance(cached, str) and cached.strip().upper() in ("CHECK", "FALSE", "ERROR"))):
                    out.append(finding("warning", name, c.coordinate, "check-failed", f"{f} = {cached}", "find what the check compares and fix the model, not the check"))
        # A typed number between two formulas breaks a pattern when its own column is a formula
        # column; a whole column of typed numbers (an input column such as last year's figures)
        # beside formula columns is fine.
        per_col: dict[int, list[str]] = {}
        for (r, col), kind in kinds.items():
            per_col.setdefault(col, []).append(kind)
        for (r, col), kind in kinds.items():
            if kind != "n":
                continue
            formula_column = per_col[col].count("f") > per_col[col].count("n")
            row_pair = formula_column and kinds.get((r, col - 1)) == "f" and kinds.get((r, col + 1)) == "f"
            col_pair = kinds.get((r - 1, col)) == "f" and kinds.get((r + 1, col)) == "f"
            if row_pair or col_pair:
                ref = ws.cell(row=r, column=col).coordinate
                out.append(finding("warning", name, ref, "pattern-break", f"typed {ws.cell(row=r, column=col).value} between formulas", "use the same formula as its neighbours, or mark it as an input"))
        for row in ws.iter_rows():
            label = next((c for c in row if isinstance(c.value, str) and not c.value.startswith("=")), None)
            if label is None or not TOTAL_LABEL.match(label.value):
                continue
            typed = [c.coordinate for c in row if c.column > label.column and kinds.get((c.row, c.column)) == "n"]
            if typed:
                out.append(finding("warning", name, ",".join(typed[:6]), "hardcoded-total", f"{label.value} row holds typed numbers", "sum the rows above with =SUM(...)"))
        if formula_cells and blank_results == formula_cells:
            out.append(finding("warning", name, "", "not-recalculated", f"{formula_cells} formulas have no stored result", "run recalc.py, then audit again"))
        if general:
            out.append(finding("info", name, "", "general-format", f"{general} numeric cells use General", "give each number a format: #,##0, 0.0%, a currency or a date"))
    if len(fills) > 8:
        out.append(finding("info", "", "", "too-many-fills", f"{len(fills)} fill colours", "keep to 8 or fewer; colour should mark roles, not decorate"))
    counts = {s: sum(1 for f in out if f["severity"] == s) for s in ("critical", "warning", "info")}
    return {"file": str(path), "counts": counts, "findings": out}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("book")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--strict", action="store_true", help="exit 1 on warnings too")
    a = ap.parse_args()
    report = audit(Path(a.book).resolve())
    if a.json:
        print(json.dumps(report, ensure_ascii=False, indent=2, default=str))
    else:
        c = report["counts"]
        print(f"audit {report['file']}: {c['critical']} critical, {c['warning']} warning, {c['info']} info")
        for f in report["findings"]:
            where = f"{f['sheet']}!{f['cell']}" if f["cell"] else f["sheet"] or "workbook"
            print(f"  [{f['severity']}] {f['category']} {where}: {f['detail']} -> {f['fix']}")
    bad = report["counts"]["critical"] or (a.strict and report["counts"]["warning"])
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
