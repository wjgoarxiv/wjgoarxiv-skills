"""lit-xlsx building blocks on top of openpyxl.

Import it from a build script (``sys.path.insert(0, <skill>/scripts)``; ``import xlsx_kit as kit``)
after ``ensure_runtime``. Every cell goes through ``put``, which applies the look and the colour
role in one place, so a workbook cannot drift into ad-hoc styling.

Looks: ``calm`` (default: a charcoal title band, charcoal header rows, light grey section bands with thin
rules, no cell borders or fills in the body, indented labels, taller rows), ``dashboard`` (calm plus dark
KPI value boxes and chart colours), ``rich`` (opt-in: cell grid, zebra rows, input boxes, banded totals) and
``restrained`` (ink on white, one header tint, no bands). Roles: text, label, header, input, formula, link, external, key, total,
note, check. A value that starts with ``=`` is a formula and gets the formula role automatically,
or the link role when it reads another sheet.
"""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass, field, replace

from openpyxl import Workbook
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.chart.label import DataLabelList
from openpyxl.chart.shapes import GraphicalProperties
from openpyxl.chart.text import RichText, Text
from openpyxl.chart.title import Title
from openpyxl.drawing.text import CharacterProperties, Paragraph, ParagraphProperties, RegularTextRun
from openpyxl.drawing.text import Font as Font_
from openpyxl.formatting.rule import CellIsRule, ColorScaleRule, DataBarRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.utils.indexed_list import IndexedList
from openpyxl.utils.cell import coordinate_from_string, column_index_from_string, range_boundaries
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.datavalidation import DataValidation

# Korean-capable faces in fallback order. Malgun Gothic ships with Windows and with Office for Mac;
# Apple SD Gothic Neo is the macOS system face; Noto Sans KR is the usual Linux one.
KOREAN_FONTS = ("Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR")
LATIN_FONT = "Arial"

# Number formats: positive; negative; zero. Zero shows as a dash, negatives in parentheses.
FMT = {
    "int": '#,##0;(#,##0);"-"',
    "num1": '#,##0.0;(#,##0.0);"-"',
    "num2": '#,##0.00;(#,##0.00);"-"',
    "pct": '0.0%;(0.0%);"-"',
    "pct0": '0%;(0%);"-"',
    "mult": '0.0"x";(0.0"x");"-"',
    "usd": '"$"#,##0;("$"#,##0);"-"',
    "krw": '"₩"#,##0;-"₩"#,##0;"-"',
    "thousands": '#,##0,;(#,##0,);"-"',
    "millions": '#,##0,,;(#,##0,,);"-"',
    "date": "yyyy-mm-dd",
    "kdate": 'yyyy"년" m"월" d"일"',
    "text": "@",
}


@dataclass(frozen=True)
class Look:
    name: str
    font: str = LATIN_FONT
    size: int = 10
    ink: str = "1F2328"
    muted: str = "57606A"
    rule: str = "D0D7DE"
    header_fill: str = "F2F4F7"
    header_ink: str = "1F2328"
    title_ink: str = "1F2328"
    title_fill: str | None = None
    accent: str = "1F4E79"
    input_ink: str = "0000FF"
    formula_ink: str = "000000"
    link_ink: str = "007A33"
    external_ink: str = "C00000"
    key_fill: str = "FFF2CC"
    ok_ink: str = "1A7F37"
    bad_ink: str = "CF222E"
    series: tuple[str, ...] = ("1F4E79", "8C959F", "4E79A7", "B07AA1")
    tiles: tuple[str, ...] = ()
    band: str | None = None        # section band fill; None = a coloured label only
    grid: str | None = None        # thin border colour around every table cell; None = a rule under each row
    total_fill: str | None = None  # band behind total rows
    input_fill: str | None = None  # light box behind typed inputs
    zebra: str | None = None       # alternate body-row fill in table_block
    subtitle_ink: str | None = None
    band_edge: str = "medium"      # rule style above a section band
    row_rule: str | None = "EAEEF2"  # hairline under each body row in table_block when there is no grid
    indent: int = 0                # label cells start this many indent steps in from their column edge
    row_height: float | None = None  # default row height in points; None = the application default
    extra: dict = field(default_factory=dict)


RESTRAINED = Look("restrained")
CALM = Look(
    "calm", ink="1A1A1A", muted="6B6B6B", rule="BFBFBF", header_fill="3A3D42", header_ink="FFFFFF",
    title_ink="FFFFFF", title_fill="3A3D42", subtitle_ink="E3E3E3", accent="595959", input_ink="3366CC",
    key_fill="FFF6BF", series=("3366CC", "ED7D31", "70AD47", "A5A5A5", "7F5FB0"),
    tiles=("2B2D31",), band="E3E3E3", band_edge="thin", total_fill="F2F2F2", row_rule=None, indent=1, row_height=17,
)
RICH = Look(
    "rich", ink="1B2430", muted="5B6675", rule="C9D1DC", header_fill="1F3A5F", header_ink="FFFFFF",
    title_ink="FFFFFF", title_fill="17233A", subtitle_ink="C9D4E5", accent="1F3A5F",
    series=("2563EB", "F97316", "10B981", "E11D48", "8B5CF6", "0EA5E9"),
    tiles=("17233A",), band="E4EAF2", grid="D5DCE6", total_fill="E9EEF5", input_fill="EEF4FF", zebra="F7F9FC",
)
DASHBOARD = replace(CALM, name="dashboard", series=("2F6FDE", "F28A2E", "3FA34D", "D64545", "8E6CC4"))
LOOKS = {"calm": CALM, "dashboard": DASHBOARD, "rich": RICH, "restrained": RESTRAINED}


def look(name: str = "calm", korean: bool = False) -> Look:
    """A preset, with a Korean body face when the workbook carries Korean text."""
    base = LOOKS[name]
    return replace(base, font=KOREAN_FONTS[0]) if korean else base


_thin = lambda color: Side(style="thin", color=color)  # noqa: E731


def _box(color: str) -> Border:
    return Border(left=_thin(color), right=_thin(color), top=_thin(color), bottom=_thin(color))


def _font(lk: Look, **kw) -> Font:
    return Font(name=lk.font, size=kw.pop("size", lk.size), color=kw.pop("color", lk.ink), **kw)


def role_style(lk: Look, role: str) -> dict:
    """Font, fill, border and alignment for one role."""
    s: dict = {"font": _font(lk)}
    if role == "label":
        s["font"] = _font(lk, bold=False)
    elif role == "header":
        s["font"] = _font(lk, bold=True, color=lk.header_ink)
        s["fill"] = PatternFill("solid", fgColor=lk.header_fill)
        s["border"] = Border(bottom=_thin(lk.rule if lk.name == "restrained" else lk.header_fill))
        s["alignment"] = Alignment(horizontal="center", vertical="center", wrap_text=True)
    elif role == "input":
        s["font"] = _font(lk, color=lk.input_ink)
        if lk.input_fill:
            s["fill"] = PatternFill("solid", fgColor=lk.input_fill)
            s["border"] = _box(lk.grid or lk.rule)
    elif role == "formula":
        s["font"] = _font(lk, color=lk.formula_ink)
    elif role == "link":
        s["font"] = _font(lk, color=lk.link_ink)
    elif role == "external":
        s["font"] = _font(lk, color=lk.external_ink)
    elif role == "key":
        s["font"] = _font(lk, color=lk.input_ink, bold=True)
        s["fill"] = PatternFill("solid", fgColor=lk.key_fill)
        if lk.grid:  # a frame survives a conditional fill laid over a grid
            edge = Side(style="medium", color=lk.accent)
            s["border"] = Border(left=edge, right=edge, top=edge, bottom=edge)
    elif role == "total":
        s["font"] = _font(lk, bold=True)
        s["border"] = Border(top=_thin(lk.ink))
        if lk.total_fill:
            s["fill"] = PatternFill("solid", fgColor=lk.total_fill)
    elif role == "grand":
        s["font"] = _font(lk, bold=True)
        s["border"] = Border(top=_thin(lk.ink), bottom=Side(style="double", color=lk.ink))
        if lk.total_fill:
            s["fill"] = PatternFill("solid", fgColor=lk.total_fill)
    elif role == "note":
        s["font"] = _font(lk, size=lk.size - 1, color=lk.muted, italic=True)
    elif role == "check":
        s["font"] = _font(lk, bold=True)
        s["alignment"] = Alignment(horizontal="center")
    return s


def formula_role(value: str) -> str:
    body = re.sub(r'"[^"]*"', "", value)
    if re.search(r"\[[^\]]+\]", body):
        return "external"
    return "link" if "!" in body else "formula"


def put(ws, ref: str, value, role: str | None = None, fmt: str | None = None, lk: Look | None = None, **align):
    """Write one cell with its role style. ``fmt`` is a key of FMT or a raw number format."""
    lk = lk or ws.parent._lit_look
    is_formula = isinstance(value, str) and value.startswith("=")
    reader = getattr(ws, "_lit_reader", False)
    if role is None:
        role = formula_role(value) if is_formula else "text"
    if reader and role == "link":
        role = "formula"  # a reader sheet is plain ink: the link colour is for sheets people calculate in
    cell = ws[ref]
    cell.value = value
    for k, v in role_style(lk, role).items():
        setattr(cell, k, v)
    bg = cell.fill.fgColor.rgb if cell.fill and cell.fill.fill_type == "solid" else None
    if isinstance(bg, str) and not _is_light(bg[-6:]):  # text written into the title band or a dark tile
        cell.font = _font(lk, size=cell.font.sz, bold=cell.font.b, italic=cell.font.i, color=lk.subtitle_ink or "FFFFFF")
    if role in ("total", "grand") and is_formula:
        link = formula_role(value) == "link" and not reader
        cell.font = _font(lk, bold=True, color=lk.link_ink if link else lk.formula_ink)
    if fmt:
        cell.number_format = FMT.get(fmt, fmt)
    if lk.indent and (role == "label" or (role in ("total", "grand") and isinstance(value, str) and not is_formula)):
        cell.alignment = Alignment(horizontal="left", indent=lk.indent, vertical="center")
    if align:
        cell.alignment = Alignment(**align)
    return cell


def new_workbook(lk: Look) -> Workbook:
    wb = Workbook()
    wb._lit_look = lk  # read by put()
    wb.remove(wb.active)
    # openpyxl's default font (index 0, used by every empty cell and by column widths) is Calibri 11.
    # Replace it and the Normal style with the look's face, so the file names one body font only.
    body = Font(name=lk.font, size=lk.size)
    wb._fonts = IndexedList([body])
    wb._named_styles["Normal"].font = body
    return wb


def sheet(wb, title: str, tab_color: str | None = None, reader: bool = False):
    """A new sheet. reader=True marks a sheet people read rather than calculate in (summary, report, dashboard,
    sensitivity grid): put() writes its formulas in plain ink, never in the link colour."""
    ws = wb.create_sheet(title=title[:31])
    ws._lit_reader = reader
    ws.sheet_view.showGridLines = False
    lk = wb._lit_look
    if lk.row_height:
        ws.sheet_format.defaultRowHeight = lk.row_height
        ws.sheet_format.customHeight = True
    ws.sheet_view.zoomScale = 100
    if tab_color:
        ws.sheet_properties.tabColor = tab_color
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_margins.left = ws.page_margins.right = 0.4
    ws.page_margins.top = ws.page_margins.bottom = 0.5
    return ws


def title(ws, text: str, subtitle: str | None = None, span: int = 6, lk: Look | None = None) -> int:
    """Title in row 1 (and a subtitle in row 2). With a banded look both rows sit in one dark band across ``span``
    columns from B; pass the table width so the band and the content share one right edge. Returns the first free row."""
    lk = lk or ws.parent._lit_look
    ws.row_dimensions[1].height = 32 if lk.title_fill else 24
    band_rows = (1, 2) if (lk.title_fill and subtitle) else (1,)
    for r in band_rows:
        for col in range(2, span + 2):
            if lk.title_fill:
                ws.cell(row=r, column=col).fill = PatternFill("solid", fgColor=lk.title_fill)
    c = ws["B1"]
    c.value = text
    c.font = _font(lk, size=16 if lk.title_fill else 14, bold=True, color=lk.title_ink)
    c.alignment = Alignment(vertical="center", indent=1 if lk.title_fill else 0)
    if subtitle:
        s = ws["B2"]
        s.value = subtitle
        s.font = _font(lk, size=lk.size - 1, color=(lk.subtitle_ink if lk.title_fill and lk.subtitle_ink else lk.muted))
        s.alignment = Alignment(vertical="center", indent=1 if lk.title_fill else 0)
        if lk.title_fill:
            ws.row_dimensions[2].height = 20
    ws.column_dimensions["A"].width = 2.5
    return 4 if subtitle else 3


def header_row(ws, row: int, col: int, labels: list[str], lk: Look | None = None) -> None:
    for i, label in enumerate(labels):
        put(ws, f"{get_column_letter(col + i)}{row}", label, "header", lk=lk)
    ws.row_dimensions[row].height = 20


def section(ws, ref: str, text: str, span: int = 6, lk: Look | None = None) -> None:
    """A section heading. With a banded look it is a light band ``span`` columns wide with a rule above and below;
    number the sections of a long sheet ("1. Inputs", "2. Results") so the reader can refer to them."""
    lk = lk or ws.parent._lit_look
    c = ws[ref]
    c.value = text
    if not lk.band:
        c.font = _font(lk, bold=True, color=lk.accent, size=lk.size + 1)
        return
    col_letter, row = coordinate_from_string(ref)
    c0 = column_index_from_string(col_letter)
    for col in range(c0, c0 + span):
        cell = ws.cell(row=row, column=col)
        cell.fill = PatternFill("solid", fgColor=lk.band)
        cell.border = Border(top=Side(style=lk.band_edge, color=lk.accent), bottom=_thin(lk.rule))
    c.font = _font(lk, bold=True, color=lk.ink, size=lk.size + 1)
    c.alignment = Alignment(vertical="center", indent=1)
    ws.row_dimensions[row].height = 20


def box(ws, rng: str, zebra: bool | None = None, lk: Look | None = None) -> None:
    """Put the look's thin grid around every cell of a table body (and alternate row fills when the look has them).
    Cells that already carry a fill (inputs, key, totals) keep it. Call it once per table after writing the cells."""
    lk = lk or ws.parent._lit_look
    if not lk.grid:
        return
    c0, r0, c1, r1 = range_boundaries(rng)
    stripe = lk.zebra if (zebra is None or zebra) else None
    for r in range(r0, r1 + 1):
        for col in range(c0, c1 + 1):
            cell = ws.cell(row=r, column=col)
            if cell.border and cell.border.left and cell.border.left.style == "medium":
                continue  # the key frame
            keep_top =cell.border.top if cell.border and cell.border.top and cell.border.top.style else None
            keep_bottom = cell.border.bottom if cell.border and cell.border.bottom and cell.border.bottom.style == "double" else None
            cell.border = Border(left=_thin(lk.grid), right=_thin(lk.grid), top=keep_top or _thin(lk.grid),
                                 bottom=keep_bottom or _thin(lk.grid))
            if stripe and (r - r0) % 2 == 1 and cell.fill.fill_type is None:
                cell.fill = PatternFill("solid", fgColor=stripe)


def footer(ws, ref: str, text: str, span: int = 6, lk: Look | None = None) -> None:
    """One muted line under a block for the source, the formula in words or how to use it; merged and wrapped
    across ``span`` columns so it is never cut at a column edge."""
    lk = lk or ws.parent._lit_look
    col_letter, row = coordinate_from_string(ref)
    c0 = column_index_from_string(col_letter)
    if span > 1:
        ws.merge_cells(start_row=row, start_column=c0, end_row=row, end_column=c0 + span - 1)
    c = ws.cell(row=row, column=c0)
    c.value = text
    c.font = _font(lk, size=lk.size - 1, color=lk.muted, italic=True)
    c.alignment = Alignment(wrap_text=True, vertical="top")
    room = sum(ws.column_dimensions[get_column_letter(c0 + i)].width or 9 for i in range(span))
    lines = max(1, -(-display_width(text) // max(1, int(room))))
    ws.row_dimensions[row].height = 14 * lines + 2


def display_width(text) -> int:
    """Column width in Excel units: East Asian wide characters count twice."""
    s = str(text)
    return sum(2 if unicodedata.east_asian_width(ch) in ("W", "F") else 1 for ch in s)


def widths(ws, spec: dict[str, float]) -> None:
    for col, w in spec.items():
        ws.column_dimensions[col].width = w


def fit_widths(ws, min_width: float = 8, max_width: float = 48, skip: tuple[str, ...] = ("A",)) -> None:
    """Set widths from the longest constant text or number in each column (formulas count as 12)."""
    best: dict[str, int] = {}
    for row in ws.iter_rows():
        for c in row:
            if c.value is None or c.coordinate in ws.merged_cells:
                continue
            v = c.value
            n = 12 if isinstance(v, str) and v.startswith("=") else display_width(v if not isinstance(v, float) else f"{v:,.1f}")
            if c.font and c.font.sz and c.font.sz > 12:
                n = int(n * c.font.sz / 11)
            best[c.column_letter] = max(best.get(c.column_letter, 0), n)
    for col, n in best.items():
        if col not in skip:
            ws.column_dimensions[col].width = max(min_width, min(max_width, n + 2))


def freeze(ws, ref: str) -> None:
    ws.freeze_panes = ref


def name(wb, label: str, sheet_title: str, ref: str) -> None:
    """A workbook-level defined name, e.g. name(wb, 'Scenario', 'Inputs', '$C$4')."""
    wb.defined_names[label] = DefinedName(label, attr_text=f"'{sheet_title}'!{ref}")


# Conditional formats and validation ------------------------------------------------------------

def data_bars(ws, rng: str, color: str | None = None) -> None:
    """Bars measured from zero, so the smallest value still shows its length."""
    lk = ws.parent._lit_look
    ws.conditional_formatting.add(rng, DataBarRule(start_type="num", start_value=0, end_type="max", color=color or lk.accent, showValue=True))


def color_scale(ws, rng: str, color: str | None = None) -> None:
    """Two-colour scale, white to one hue: readable without telling red from green."""
    lk = ws.parent._lit_look
    ws.conditional_formatting.add(rng, ColorScaleRule(start_type="min", start_color="FFFFFF", end_type="max", end_color=color or "9EC5FE"))


def diverging_scale(ws, rng: str, mid: float = 0, low: str = "F4A6A6", high: str = "9FD8B0") -> None:
    """Loss-to-profit shading for a sensitivity or variance grid: soft red below ``mid`` (zero, break-even, budget),
    white at it, soft green above. Pair it with a number format that also marks negatives, so the sign survives
    a grey-scale print."""
    ws.conditional_formatting.add(rng, ColorScaleRule(start_type="min", start_color=low, mid_type="num", mid_value=mid,
                                                      mid_color="FFFFFF", end_type="max", end_color=high))


def highlight(ws, rng: str, formula: str, ink: str | None = None, fill: str | None = None, bold: bool = True) -> None:
    """Formula-driven highlight; formula is written for the top-left cell of rng."""
    lk = ws.parent._lit_look
    font = Font(color=ink or lk.bad_ink, bold=bold)
    ws.conditional_formatting.add(rng, FormulaRule(formula=[formula], font=font, fill=PatternFill("solid", fgColor=fill) if fill else None))


def check_flags(ws, rng: str) -> None:
    """Check cells hold the words OK / CHECK (the word is the cue); colour only adds to it."""
    lk = ws.parent._lit_look
    ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"OK"'], font=Font(color=lk.ok_ink, bold=True)))
    ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"CHECK"'], font=Font(color=lk.bad_ink, bold=True), fill=PatternFill("solid", fgColor="FFEBE9")))


def choice(ws, rng: str, options: list[str] | str, prompt: str | None = None, title_text: str | None = None) -> DataValidation:
    """Dropdown from a list of words or a range reference like '=$E$4:$G$4'."""
    src = options if isinstance(options, str) else '"' + ",".join(options) + '"'
    dv = DataValidation(type="list", formula1=src, allow_blank=False, showDropDown=False)
    _messages(dv, prompt, title_text)
    ws.add_data_validation(dv)
    dv.add(rng)
    return dv


def number_between(ws, rng: str, low, high, whole: bool = False, prompt: str | None = None) -> DataValidation:
    dv = DataValidation(type="whole" if whole else "decimal", operator="between", formula1=str(low), formula2=str(high))
    _messages(dv, prompt, None)
    dv.error = f"Enter a number from {low} to {high}."
    dv.showErrorMessage = True
    ws.add_data_validation(dv)
    dv.add(rng)
    return dv


def date_between(ws, rng: str, first: str, last: str, prompt: str | None = None) -> DataValidation:
    """first/last as Excel date formulas, e.g. 'DATE(2026,1,1)'."""
    dv = DataValidation(type="date", operator="between", formula1=first, formula2=last)
    _messages(dv, prompt, None)
    dv.showErrorMessage = True
    ws.add_data_validation(dv)
    dv.add(rng)
    return dv


def _messages(dv, prompt, title_text):
    if prompt:
        dv.prompt = prompt
        dv.promptTitle = title_text
        dv.showInputMessage = True


# KPI tiles and charts ----------------------------------------------------------------------------

def _is_light(hex6: str) -> bool:
    r, g, b = (int(hex6[i:i + 2], 16) for i in (0, 2, 4))
    return 0.299 * r + 0.587 * g + 0.114 * b > 160


def kpi_tile(ws, top_left: str, label: str, formula: str, fmt: str, fill: str | None = None, cols: int = 2,
             note: str | None = None) -> None:
    """A KPI tile: label row, a large value row, an optional note row; merged across cols. Every tile on a sheet
    looks the same: in a banded look the label and note sit on the light band and the value in a dark box (the look's
    tile colour) in white; otherwise all three rows share the tile fill with an accent rule on top. A different
    colour per tile is decoration, not meaning. ``fmt`` should carry the unit (``usd``, ``krw``, ``pct``)."""
    lk = ws.parent._lit_look
    fill = fill or (lk.tiles[0] if lk.tiles else lk.header_fill)
    frame = lk.band if (lk.band and not _is_light(fill)) else fill
    col_letter, row = coordinate_from_string(top_left)
    c0 = column_index_from_string(col_letter)
    c1 = c0 + cols - 1
    rows = [(row, label, 9, False), (row + 1, formula, 20, True), (row + 2, note or "", 8, False)]
    for r, value, size, bold in rows:
        bg = fill if r == row + 1 else frame
        for c in range(c0, c1 + 1):
            ws.cell(row=r, column=c).fill = PatternFill("solid", fgColor=bg)
            if r == row:
                ws.cell(row=r, column=c).border = Border(top=Side(style="medium", color=lk.accent))
        ws.merge_cells(start_row=r, start_column=c0, end_row=r, end_column=c1)
        cell = ws.cell(row=r, column=c0)
        cell.value = value
        light = _is_light(bg)
        ink = (lk.ink if r == row + 1 else lk.muted) if light else "FFFFFF"
        cell.font = Font(name=lk.font, size=size, bold=bold, color=ink)
        cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        if r == row + 1:
            cell.number_format = FMT.get(fmt, fmt)
    ws.row_dimensions[row].height = 18
    ws.row_dimensions[row + 1].height = 34
    ws.row_dimensions[row + 2].height = 16


def _text(text: str, lk: Look, size: int, bold: bool) -> Title:
    """A chart title in the look's face (latin and East Asian), size in points."""
    face = Font_(typeface=lk.font)
    cp = CharacterProperties(sz=size * 100, b=bold, solidFill=lk.ink, latin=face, ea=face)
    para = Paragraph(pPr=ParagraphProperties(defRPr=cp), r=[RegularTextRun(rPr=cp, t=text)])
    return Title(tx=Text(rich=RichText(p=[para])), overlay=False)


def _chart_common(chart, title_text: str, y_title: str | None, x_title: str | None, lk: Look, width: float, height: float):
    chart.title = _text(title_text, lk, 12, True)
    chart.y_axis.title = _text(y_title, lk, 9, False) if y_title else None
    chart.x_axis.title = _text(x_title, lk, 9, False) if x_title else None
    chart.width, chart.height = width, height
    chart.legend.position = "b"
    chart.legend.overlay = False
    # Without delete=False some Excel builds hide both axes of an openpyxl chart.
    chart.x_axis.delete = False
    chart.y_axis.delete = False
    chart.y_axis.majorGridlines = None if lk.name == "restrained" else chart.y_axis.majorGridlines
    chart.roundedCorners = False
    for i, s in enumerate(chart.series):
        color = lk.series[i % len(lk.series)]
        s.graphicalProperties.solidFill = color
        s.graphicalProperties.line.solidFill = color
    return chart


def bar_chart(ws, data_ref: tuple, cats_ref: tuple, anchor: str, title_text: str, y_title: str | None = None,
              x_title: str | None = None, fmt: str | None = None, width: float = 16, height: float = 7.5, stacked: bool = False,
              labels: bool = False, horizontal: bool = False):
    """data_ref/cats_ref: (sheet, min_col, min_row, max_col, max_row); the data block includes its header row.
    labels=True prints each value on its bar (worth it up to about 12 bars); horizontal=True for long category names."""
    lk = ws.parent._lit_look
    ch = BarChart()
    ch.type = "bar" if horizontal else "col"
    if stacked:
        ch.grouping, ch.overlap = "stacked", 100
    ch.add_data(Reference(data_ref[0], min_col=data_ref[1], min_row=data_ref[2], max_col=data_ref[3], max_row=data_ref[4]), titles_from_data=True)
    ch.set_categories(Reference(cats_ref[0], min_col=cats_ref[1], min_row=cats_ref[2], max_col=cats_ref[3], max_row=cats_ref[4]))
    _chart_common(ch, title_text, y_title, x_title, lk, width, height)
    if fmt:
        ch.y_axis.number_format = FMT.get(fmt, fmt)
    if labels:
        _value_labels(ch, FMT.get(fmt, fmt) if fmt else None)
    if horizontal:
        ch.x_axis.scaling.orientation = "maxMin"  # first category on top, as in the table
    ws.add_chart(ch, anchor)
    return ch


def _value_labels(ch, number_format: str | None) -> None:
    ch.dataLabels = DataLabelList()
    ch.dataLabels.showVal = True
    for flag in ("showSerName", "showCatName", "showLegendKey", "showPercent"):
        setattr(ch.dataLabels, flag, False)
    if number_format:
        ch.dataLabels.numFmt = number_format


def line_chart(ws, data_ref: tuple, cats_ref: tuple, anchor: str, title_text: str, y_title: str | None = None,
               x_title: str | None = None, fmt: str | None = None, width: float = 16, height: float = 7.5):
    lk = ws.parent._lit_look
    ch = LineChart()
    ch.add_data(Reference(data_ref[0], min_col=data_ref[1], min_row=data_ref[2], max_col=data_ref[3], max_row=data_ref[4]), titles_from_data=True)
    ch.set_categories(Reference(cats_ref[0], min_col=cats_ref[1], min_row=cats_ref[2], max_col=cats_ref[3], max_row=cats_ref[4]))
    _chart_common(ch, title_text, y_title, x_title, lk, width, height)
    markers = lk.name != "restrained" and (data_ref[4] - data_ref[2]) <= 24
    for i, s in enumerate(ch.series):
        s.smooth = False
        s.graphicalProperties.line.width = 28575
        s.graphicalProperties.solidFill = None
        if markers:
            color = lk.series[i % len(lk.series)]
            s.marker.symbol = "circle"
            s.marker.size = 6
            s.marker.graphicalProperties = GraphicalProperties(solidFill=color)
            s.marker.graphicalProperties.line.solidFill = color
    if fmt:
        ch.y_axis.number_format = FMT.get(fmt, fmt)
    ws.add_chart(ch, anchor)
    return ch


def table_block(ws, top: int, left: int, headers: list[str], rows: list[list], roles: list[str | None] | None = None,
                fmts: list[str | None] | None = None, zebra: bool | None = None) -> tuple[int, int]:
    """Header row plus body rows. roles/fmts are per column (None = automatic). zebra=None follows the look.
    Returns (first, last) body row."""
    lk = ws.parent._lit_look
    header_row(ws, top, left, headers)
    for r, values in enumerate(rows, start=top + 1):
        for i, v in enumerate(values):
            role = roles[i] if roles and i < len(roles) else None
            if isinstance(v, str) and v.startswith("="):
                role = None if role in (None, "input", "text") else role
            elif role is None:
                role = "label" if isinstance(v, str) else "input"
            fmt = fmts[i] if fmts and i < len(fmts) else None
            cell = put(ws, f"{get_column_letter(left + i)}{r}", v, role, fmt)
            if not lk.grid:
                if zebra and (r - top) % 2 == 0 and role != "key":
                    cell.fill = PatternFill("solid", fgColor="F6F8FA")
                if lk.row_rule:
                    cell.border = Border(bottom=_thin(lk.row_rule))
    if lk.grid and rows:
        box(ws, f"{get_column_letter(left)}{top + 1}:{get_column_letter(left + len(headers) - 1)}{top + len(rows)}", zebra)
    return top + 1, top + len(rows)


def bounds(rng: str) -> tuple[int, int, int, int]:
    return range_boundaries(rng)
