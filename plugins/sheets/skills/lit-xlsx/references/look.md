# Look: four presets, one set of roles

A finished workbook should look framed and calm: a charcoal title band, charcoal header rows, a few light grey section
bands, plain white body rows, labels set in from the edge and air between sections. Structure comes from the bands and
the spacing; colour in cells only says what a cell is (input, formula, link, key, total, check). The presets live in
`scripts/xlsx_kit.py` (`CALM`, `DASHBOARD`, `RICH`, `RESTRAINED`); change them there, not cell by cell.

## calm (default)

| Part | Setting |
| --- | --- |
| Body | Arial 10, or Malgun Gothic 10 with `korean=True`; ink `1A1A1A`; rows 17 pt tall |
| Gutter | column A is a narrow empty column; content starts in B; `label` cells are indented one step |
| Title band | rows 1-2 filled `3A3D42` across `span` columns: 16 pt bold white title, 9 pt subtitle `E3E3E3` (unit, period) |
| Section band | `kit.section(ws, ref, "Inputs", span)`: bold ink on light grey `E3E3E3`, thin rules above and below |
| Header row | bold white on `3A3D42`, centred |
| Body rows | no borders, no fills, no stripes |
| Inputs | blue `3366CC` numbers, no fill; the one cell to play with on soft yellow `FFF6BF` with a short hint beside it |
| Formulas | black; cross-sheet formulas green `007A33`; external links red `C00000`. On reader sheets (`kit.sheet(..., reader=True)`: summaries, reports, dashboards, sensitivity grids) every formula is black |
| Totals | bold on a faint `F2F2F2` band with a thin rule above; the grand total adds a double rule below |
| Negatives | red parentheses through the number format; never a cell fill |
| Footnote | at most one `kit.footer` line at the bottom of the sheet |
| Charts | series `3366CC`, `ED7D31`, `70AD47`; gridlines on; markers on lines of up to 24 points |

## dashboard

Calm plus KPI tiles: merged blocks two columns wide, 3 rows, label 9 pt and note 8 pt on the grey band, the value
20 pt bold white in a dark `2B2D31` box; every tile the same; the value carries its unit (`usd`, `krw`, `pct`). Chart
series are blue `2F6FDE` and orange `F28A2E` first.

A dashboard sheet reads top to bottom: title band, the KPI row, one section per chart (one or two charts), then the
detail tables by period and by category. Keep every number on it a formula over the data sheet. Size charts to the
width of the KPI row (about 19.4 cm for eight 12.5-wide columns) so the page has one right edge.

## rich (on request)

Calm's frame plus a thin grid around table cells (`kit.box`), zebra rows, inputs in light boxes and banded totals.
Only when the person asks for something busier (화려하게, 꽉 차게).

## restrained (on request)

Ink on white, 14 pt title without a band, bold ink headers on `F2F4F7`, a hairline under each row. Only for a plain or
print-only request, or when the file you are editing already looks like that.

## Number formats (`xlsx_kit.FMT`)

| Key | Format | Shows |
| --- | --- | --- |
| `int` | `#,##0;(#,##0);"-"` | 12,345 / (1,200) / - |
| `num1`, `num2` | one or two decimals, same shape | 12.3 |
| `pct`, `pct0` | `0.0%` / `0%`, negatives in parentheses | 8.2% |
| `mult` | `0.0"x"` | 4.5x |
| `usd` | `"$"#,##0` | $12,345 |
| `krw` | `"₩"#,##0;-"₩"#,##0;"-"` | ₩12,345 |
| `thousands`, `millions` | `#,##0,` / `#,##0,,` | a value in units shown in thousands or millions |
| `date`, `kdate` | `yyyy-mm-dd` / `yyyy"년" m"월" d"일"` | 2026-01-05 / 2026년 1월 5일 |
| `text` | `@` | IDs and codes that must keep leading zeros |

Put the unit once, in the header or subtitle (`USD thousands`, `단위: 천원`), not on every number. A year in a header is
text. For a change column, `0.0%;[Red]-0.0%;"-"` adds red to the minus sign, which is a second cue rather than the only one.

## Layout

- Row 1 title, row 2 subtitle or unit line, content from row 4, column B onward.
- Freeze panes below the header row and right of the label column (`kit.freeze(ws, "C5")`).
- Widths: set them (`kit.widths`) or estimate (`kit.fit_widths`, which counts Hangul as two). After rendering, widen any
  column that shows `####`.
- Every sheet prints landscape, fit to one page wide (`kit.sheet` sets it), which is also what the render gate uses.
- A sheet is two to four section bands (`Inputs`, `Results`, `Sensitivity`), one table or one chart per band, two
  blank rows between sections. `title`, `section` and `footer` take the width of the widest table plus one column, so
  the bands end a little past the content.
- Keep the face short: no notes beside cells, no sentence under every table, one footnote line at the bottom at most.
- Checks on a back sheet; long schedules, lists and raw data on their own sheets behind the answer.
- Put the unit in the label (`Loan amount ($)`, `단위원가 (원/개)`) or the column header.

## Charts

- One idea per chart; a title that states the subject, the unit on the value axis or in the title.
- Clustered columns for amounts by period, lines for rates and trends, never 3-D, no pie with more than four slices.
- `kit.bar_chart` / `kit.line_chart` already set what openpyxl gets wrong by default: axes kept visible (`delete=False`),
  legend not overlapping the plot, square corners, the look's series colours, a title in the body face (so Korean titles
  render).
- Anchor charts below or beside tables, never over cells that hold data, and check the PNG.
- Up to about a dozen bars, print the values on them (`labels=True`). Sort categories by value unless their order
  means something; long names read better as horizontal bars (`horizontal=True`).
- Series that mean different things get clearly different colours (the look's blue then orange); highs warm and lows
  cool. Pass your own colours by setting `s.graphicalProperties` on the returned chart's series.
- Two series on very different scales (revenue in billions, cost in millions) flatten the small one; give each its own
  chart, or chart the ratio (ROAS, margin) instead.
- One or two charts per sheet, each in its own section. No data bars or colour scales in tables.

## Sensitivity grids

On the same sheet as the assumptions they use, each under a section band. Axis values (prices across, volumes down)
sit in the charcoal header cells with their unit. One number format with red negatives in parentheses
(`#,##0;[Red](#,##0)`) and no cell shading; the live case on the key fill. A break-even table (break-even volume per
price) can follow under its own band.

## Korean fonts

| Face | Where it exists |
| --- | --- |
| Malgun Gothic (맑은 고딕) | Windows, Office for Mac; the default for `korean=True` |
| Apple SD Gothic Neo | macOS system face; LibreOffice's fallback on a Mac without Malgun Gothic |
| Noto Sans KR | common on Linux; the fallback there |

Excel substitutes a missing face silently, so stay with Malgun Gothic unless the person names another font that their
readers have. `render_sheets.py` reports faces the rendering machine lacks and which Korean face it used instead.
