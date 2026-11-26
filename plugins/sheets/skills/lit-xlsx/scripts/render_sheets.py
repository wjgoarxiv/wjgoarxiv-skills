#!/usr/bin/env python3
"""Render every visible sheet of an .xlsx to one PNG, so the model can look before delivering.

LibreOffice (in a throwaway profile, see lo_profile.py) exports the workbook to PDF with
"one page per sheet", then Poppler's pdftoppm turns each page into a PNG. The PNGs are named
sheet-01-<name>.png in sheet order. A sheet taller than --max-height pixels is cropped at that
height and the report says so; set a print area for the part you need to see instead.

The report also lists the fonts the workbook asks for that this machine lacks, with the Korean
face LibreOffice will use instead, because a missing face changes widths and wrapping.

Usage:
    python3 render_sheets.py BOOK.xlsx --out-dir DIR [--dpi 110] [--max-height 2400] [--keep-profile] [--json]

Exit codes: 0 one PNG per visible sheet; 1 the page count did not match the sheets; 2 the
conversion failed; 3 skipped because soffice or pdftoppm is missing (say that the look did not
happen).
"""

from __future__ import annotations

import os
import sys

sys.dont_write_bytecode = True  # keep the installed plugin folder free of __pycache__
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "lib"))
from sheets_bootstrap import ensure_runtime  # noqa: E402

ensure_runtime(["lxml", "PIL"])

import argparse  # noqa: E402
import json  # noqa: E402
import re  # noqa: E402
import shutil  # noqa: E402
import subprocess  # noqa: E402
import tempfile  # noqa: E402
import zipfile  # noqa: E402
from pathlib import Path  # noqa: E402

from lxml import etree  # noqa: E402
from PIL import Image  # noqa: E402

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lo_profile  # noqa: E402
from recalc import NS, PARSER  # noqa: E402

KOREAN_FONTS = ("Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR")
PDF_FILTER = 'pdf:calc_pdf_Export:{"SinglePageSheets":{"type":"boolean","value":"true"}}'


def all_sheets(book: Path) -> list[tuple[str, bool]]:
    """(name, visible) for every sheet in workbook order."""
    with zipfile.ZipFile(book) as z:
        wb = etree.fromstring(z.read("xl/workbook.xml"), PARSER)
    return [(s.get("name"), s.get("state") not in ("hidden", "veryHidden")) for s in wb.findall("m:sheets/m:sheet", NS)]


def page_owners(sheets: list[tuple[str, bool]], pages: int) -> list[str | None] | None:
    """Which sheet each PDF page shows; None marks a page to drop (a hidden sheet).

    With one page per sheet, LibreOffice 26.x also exports hidden sheets, in workbook order. Older builds may skip
    them. Any other page count means the mapping is unknown.
    """
    if pages == len(sheets):
        return [name if visible else None for name, visible in sheets]
    visible = [name for name, ok in sheets if ok]
    return visible if pages == len(visible) else None


def workbook_fonts(book: Path) -> list[str]:
    with zipfile.ZipFile(book) as z:
        styles = etree.fromstring(z.read("xl/styles.xml"), PARSER) if "xl/styles.xml" in z.namelist() else None
    if styles is None:
        return []
    return sorted({n.get("val") for n in styles.iter("{%s}name" % NS["m"]) if n.get("val")})


def installed_families() -> set[str] | None:
    """Font family names fontconfig knows, or None when fc-list is not available."""
    exe = shutil.which("fc-list")
    if not exe:
        return None
    out = subprocess.run([exe, ":", "family"], capture_output=True, text=True, timeout=60).stdout
    return {f.strip() for line in out.splitlines() for f in line.split(",") if f.strip()}


def font_report(book: Path) -> dict:
    wanted = workbook_fonts(book)
    have = installed_families()
    if have is None:
        return {"wanted": wanted, "checked": False}
    missing = [f for f in wanted if f not in have]
    fallback = next((f for f in KOREAN_FONTS if f in have), None)
    return {"wanted": wanted, "checked": True, "missing": missing, "korean_fallback": fallback}


def slug(name: str) -> str:
    s = re.sub(r"[^\w가-힣-]+", "-", name, flags=re.UNICODE).strip("-").lower()
    return s or "sheet"


def render(book: Path, out_dir: Path, dpi: int = 110, max_height: int = 2400, keep_profile: bool = False) -> dict:
    report: dict = {"file": str(book), "status": "ok", "pngs": []}
    missing = [t for t in ("pdftoppm",) if not shutil.which(t)] + ([] if lo_profile.soffice() else ["soffice"])
    if missing:
        report.update(status="skip", reason=f"{', '.join(missing)} not on PATH; the sheets were not rendered, so say the visual check did not happen")
        return report
    out_dir.mkdir(parents=True, exist_ok=True)
    sheets = all_sheets(book)
    report["sheets"] = [name for name, visible in sheets if visible]
    report["fonts"] = font_report(book)
    profile = lo_profile.make_profile()
    report["profile"] = str(profile)
    work = Path(tempfile.mkdtemp(prefix="lit-xlsx-render-"))
    try:
        result = lo_profile.run_soffice(profile, ["--convert-to", PDF_FILTER, "--outdir", str(work), str(book)])
        pdf = work / f"{book.stem}.pdf"
        if result.returncode != 0 or not pdf.exists():
            report.update(status="failed", reason=(result.stderr or result.stdout or "no PDF").strip()[-400:])
            return report
        shutil.copy2(pdf, out_dir / pdf.name)
        report["pdf"] = str(out_dir / pdf.name)
        ppm = subprocess.run(["pdftoppm", "-png", "-r", str(dpi), str(pdf), str(work / "page")], capture_output=True, text=True, timeout=300)
        if ppm.returncode != 0:
            report.update(status="failed", reason=ppm.stderr.strip()[-400:])
            return report
        pages = sorted(work.glob("page-*.png"), key=lambda p: int(p.stem.split("-")[-1]))
        report["pages"] = len(pages)
        owners = page_owners(sheets, len(pages))
        if owners is None:
            report.update(status="mismatch", reason=f"{len(pages)} pages for {len(report['sheets'])} visible of {len(sheets)} sheets")
            owners = [f"page-{i + 1}" for i in range(len(pages))]
        n = 0
        for page, label in zip(pages, owners):
            if label is None:
                continue
            n += 1
            target = out_dir / f"sheet-{n:02d}-{slug(label)}.png"
            with Image.open(page) as im:
                entry = {"sheet": label, "png": str(target), "size": list(im.size)}
                if im.height > max_height:
                    im.crop((0, 0, im.width, max_height)).save(target)
                    entry["cropped_from"] = im.height
                else:
                    shutil.copy2(page, target)
            report["pngs"].append(entry)
        return report
    except Exception as exc:
        report.update(status="failed", reason=f"{type(exc).__name__}: {exc}"[-400:])
        return report
    finally:
        shutil.rmtree(work, ignore_errors=True)
        lo_profile.drop_profile(profile, keep_profile)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("book")
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--dpi", type=int, default=110)
    ap.add_argument("--max-height", type=int, default=2400)
    ap.add_argument("--keep-profile", action="store_true")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    report = render(Path(a.book).resolve(), Path(a.out_dir).resolve(), a.dpi, a.max_height, a.keep_profile)
    if a.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(f"render {report['status']}: {report['file']}")
        if report.get("reason"):
            print(f"  {report['reason']}")
        for p in report["pngs"]:
            note = f" (cropped from {p['cropped_from']} px)" if "cropped_from" in p else ""
            print(f"  {p['sheet']}: {p['png']}{note}")
        fonts = report.get("fonts", {})
        if fonts.get("missing"):
            print(f"  fonts not on this machine: {', '.join(fonts['missing'])}; Korean text falls back to {fonts.get('korean_fallback')}")
        if report["pngs"]:
            print("  Now open every PNG and look: #### in cells, clipped labels, unreadable Korean, charts off the page.")
    return {"ok": 0, "mismatch": 1, "failed": 2, "skip": 3}[report["status"]]


if __name__ == "__main__":
    sys.exit(main())
