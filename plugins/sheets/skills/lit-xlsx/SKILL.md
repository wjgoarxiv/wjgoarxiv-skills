---
name: lit-xlsx
description: Build, fix and check Excel workbooks (.xlsx) with live formulas - financial models, budgets with scenarios, report tables, KPI dashboards, CSV imports and edits to an existing file - then recalculate them in LibreOffice, audit the formulas and look at a PNG of every sheet before handing them over. Use when someone asks for excel, an xlsx, a spreadsheet, a workbook, a financial model, a budget or tracker sheet, or an Excel dashboard, or says 엑셀, 엑셀 파일, 엑셀로 정리해줘, 스프레드시트, 예산표, 재무모델, 표 계산. Not for Word reports (lit-docx), slides (lit-pptx), plots of measured data as images (lit-scientific-visualization) or diagrams (lit-diagram-drawer).
---

# lit-xlsx

A workbook is finished when its numbers are computed by formulas that still work after someone changes an input, when
nothing in it reads `#REF!` or `#NAME?`, and when a person can read every sheet without widening a column. This skill
gets there the same way every time: plan the sheets, build them through one small kit, let LibreOffice compute the file,
audit it, render it, look at it, and only then hand it over.

`<skill>` below is the folder that holds this `SKILL.md`; `<plugin>` is two levels up (`<skill>/../..`).

## Tools in this skill

| Script | What it does |
| --- | --- |
| `<plugin>/lib/sheets-runtime.mjs` | `status` / `ensure`: the pinned Python runtime (openpyxl, XlsxWriter, defusedxml, lxml, Pillow) in its own cache. Every script below prepares it on first use, so you rarely call it yourself. |
| `<skill>/scripts/xlsx_kit.py` | Import it in your build script: looks, cell roles, number formats, tables, KPI tiles, charts, conditional formats, data validation, defined names. |
| `<skill>/scripts/make_templates.py` | The one generator for the starting workbooks: `--kind model / ledger / report / dashboard / all --out DIR`. |
| `<skill>/scripts/recalc.py` | Computes every formula in LibreOffice (a throwaway profile, never your own) and writes the values back into the file. |
| `<skill>/scripts/audit_xlsx.py` | Reports error values, broken references, missing `_xlfn.` prefixes, hardcodes, pattern breaks, failed checks. Changes nothing. |
| `<skill>/scripts/render_sheets.py` | One PNG per visible sheet (LibreOffice to PDF, Poppler to PNG) plus a font report. |

Run the Python scripts as `python3 <skill>/scripts/<name>.py ...`; each re-executes itself inside the runtime. Your own
build script does the same if it starts with the two lines at the top of `make_templates.py` (`sys.path.insert` to
`<plugin>/lib`, then `ensure_runtime([...])`). Host tools: LibreOffice (`soffice`) for recalculation and rendering,
Poppler (`pdftoppm`) for rendering. `node <plugin>/lib/sheets-runtime.mjs status` says what is missing.

## Workflow

### 1. Pin the job

Decide which of four jobs this is, because each changes what you may touch:
- **New workbook.** You own every cell. Pick a look (step 2) and, when one fits, start from a template.
- **Edit an existing workbook.** The file's own conventions win: its fonts, colours, sheet names, number formats and
  layout. Write only where the request points, and never re-save a file you only meant to read. When the person says
  not to change what is there ("don't change anything", "기존 내용은 건드리지 마"), every cell that existed stays as
  it was, blank ones included: new columns go to the right of the existing table only when the request asks for
  columns there, and new parameters (rates, thresholds, a lookup table) go on a **new sheet** you add, never into a
  free corner of an existing one. Before saving, compare every original sheet's used range and values with the input
  file; a difference you did not mean is a defect.
- **Import or clean data** (CSV, pasted tables, another workbook). Keep IDs and codes as text so leading zeros survive;
  dates become real dates with a date format.
- **Audit only.** Run steps 4 to 6 on the file and report findings; change nothing until the person says which to fix.

Ask only what would change the structure: the periods (months, quarters, years), the currency and unit, the language of
the labels, and for a model the cases to compare. Pick sensible defaults for the rest and state them under the title.

An **optional input that exists to show a comparison** (an extra payment, a discount, a price change, a what-if
amount) never opens at 0 or blank: the person asked to see the difference, and a zero shows dashes and two chart lines
on top of each other. Fill it with a realistic example (an extra mortgage payment of a few hundred, a 5% discount), put
it on the key fill with a hint beside it ("← type your amount; 0 turns it off"), and make sure the comparison, the
savings and the chart all show a visible difference at that value.

### 2. Pick the look

A finished workbook should look framed and calm. The house style is a charcoal title band, charcoal header rows, a few
light grey section bands, labels set in from the edge, plain white body rows and plenty of air. Leave out grids, zebra
stripes, tinted boxes, heat maps and notes beside cells: they make a sheet look busy even when it holds more. Structure
comes from the bands and the spacing, not from colour:

- **`calm` (default).** Rows 1-2 a charcoal band with a white title and a light unit line; section headings as a light
  grey band with thin rules (`kit.section`); header rows charcoal with white bold text; body rows with no borders and
  no fills; labels indented one step from a narrow empty column A (the kit does both); taller rows; a total row bold
  on a faint grey band with a rule above; inputs as blue numbers with no fill. Use it for every new workbook: models,
  budgets, reports, schedules, sensitivity grids, imports.
- **`dashboard`.** Calm plus KPI tiles whose values sit in dark boxes in white, and blue and orange chart series. Use
  it when the person asks for a dashboard, KPIs or a summary to show (대시보드, 한눈에, 보기 좋게).
- **`rich`.** Calm's frame plus a cell grid, zebra rows, input boxes and banded totals. Only when the person asks for
  something busier or more decorated (화려하게, 꽉 차게).
- **`restrained`.** Ink on white, no bands. Only for a plain or print-only request, or when an existing file you are
  editing already looks like that.

All looks share the colour roles that tell a reader what a cell is, and the kit applies them for you:

| Role | Looks like | Meaning |
| --- | --- | --- |
| input | blue text | a typed number someone may change |
| formula | black text | computed on this sheet |
| link | green text | a formula that reads another sheet |
| external | red text | a formula that reads another file (avoid) |
| key | blue bold on light yellow | the switch or assumption everything turns on |
| total / grand | bold, rule above (grand adds a double rule below) | sums |
| check | bold OK / CHECK, coloured | a test cell; the word carries the meaning, colour only helps |

These text colours are for the sheets where people **calculate**: Inputs and the calculation sheets of a model. Sheets
people **read** (a summary, a report or approval table, a dashboard, a sensitivity grid, a pivot-style summary) keep
their formulas in black: create them with `kit.sheet(wb, name, reader=True)` and `put()` does it for you; a report full
of green numbers reads as noise. On a reader sheet colour appears only where it says something: a negative in red
parentheses through the number format, the live case or the one "type here" cell on the soft yellow key fill, a failed
check, a status word. No heat maps, colour scales or data bars: a grid where every cell is tinted hides the number the
reader is looking for.

`references/look.md` has the palettes, number formats, layout rules, chart rules and the Korean font stack.

### 3. Build

Lock the layout before writing formulas: sheet order, which rows hold which lines, where inputs live. Inserting rows
after formulas exist is the usual source of `#REF!`.

- Start from `make_templates.py` when a template is close (operating model with cases and a sensitivity grid; budget
  against actuals with a scenario switch; a Korean report table; a KPI dashboard over a data sheet). Generate it, then
  adapt the generated build: copy the template function into your own build script and change it, rather than editing the
  `.xlsx` by hand.
- Otherwise write a short build script on `xlsx_kit`: `new_workbook(look(...))`, `sheet()`, `title(span=...)`,
  `section(span=...)`, `header_row()`, `put()` for every cell (labels with the `label` role, so they get the indent),
  `table_block()`, `footer()`, `kpi_tile()`, `bar_chart()` / `line_chart()`, `choice()` and `number_between()` for
  validation, `highlight()` / `check_flags()` for conditional formats. Content starts in column B (column A is the
  narrow gutter `title()` sets); give `title`, `section` and `footer` the width of the widest table plus one empty
  column, so the bands end a little past the content; set column widths before `footer`.
- **The first sheet is the answer, and it is calm.** Whatever the person asked to see opens the file: the summary by
  category before the item list, the results with the inputs they come from, the dashboard. Lay it out as two to four
  section bands (`Inputs`, `Results`, `Sensitivity`; `가정`, `결과`) with **two blank rows between sections**, each
  holding one table or one chart. Keep the face short: no explanation notes beside cells, no italic sentences under
  every table, at most one short footnote line at the bottom (what blue means, or the source). A chart gets its own
  section; one or two charts on a sheet, not four.
- **Checks live on a back sheet.** A `Checks` / `점검` sheet after the answer and the calculation sheets, whose last row
  says whether all checks pass; never a checks block on the first sheet. Long schedules, item lists and raw data also
  get their own sheet behind the answer. Two to four sheets covers almost every request; skip a Notes sheet.
- **Inputs are blue numbers and nothing else** (no box, no fill), the unit in the label (`Loan amount ($)`, `단위원가
  (원/개)`). Only the one cell the reader is meant to play with gets the soft yellow key fill and a short hint
  beside it (`← enter amount`).
- **Every number carries its unit.** Money uses a currency format (`usd`, `krw`) or the unit sits in the column header
  (`매출(천원)`, `Revenue ($k)`); temperatures, rainfall, counts and rates name their unit in the header (`°C`, `mm`,
  `명`, `%`). KPI tiles always show the currency or the `%`.
- **Text that explains** (notes, sources, assumptions) gets `wrap_text` and a column or merged range wide enough to show
  it in full; a note cut off at the column edge is invisible to the reader.
- **Dashboards**: one row of KPI tiles in one style (`kpi_tile` without a fill: dark value box, label and a short
  note on the band), the money tiles in currency. Then one section per chart (the main trend, then one comparison),
  each chart with a title, a unit, and `labels=True` when there are a dozen bars or fewer; two series that mean
  different things in clearly different colours (the look's blue and orange). Sort a category chart and its table by
  value unless the order means something (months, stages). Then the detail table by period and the one by category,
  each with a total row. No data bars or colour scales.
- **Sensitivity and what-if grids**: an assumptions section above the grid on the same sheet, then the grid, then a
  break-even table when it helps. Axis values in the charcoal header cells with their unit, one number format with red
  negatives in parentheses (`#,##0;[Red](#,##0)`), and the live case on the key fill. No shading of the grid cells.
- **Status columns** hold words (`초과`, `Over`, `OK`) and are worth a column only when they differ between rows; if every
  row would say the same, put one sentence under the table instead.
- Every number a person typed lives in one labelled input cell. Totals, growth, ratios, roll-forwards and anything that
  depends on another number are formulas. If you computed a value in Python, write the formula instead.
- Cases: put the case names in a row, pick the live one with a dropdown, and pull values with
  `=INDEX(D8:F8,$C$5)` where `$C$5` is `=MATCH(case,names,0)`. No nested `IF` chains.
- Stay with functions every Excel since 2007 opens (`SUMIFS`, `INDEX`/`MATCH`, `IFERROR`, `SUMPRODUCT`). Newer ones
  need the `_xlfn.` prefix when written through openpyxl; `references/formulas.md` has the list.

### 4. Recalculate

```bash
python3 <skill>/scripts/recalc.py book.xlsx
```

openpyxl stores formulas without results, so until this runs every viewer, PDF and `data_only` read sees blanks.
`recalc.py` computes a copy in LibreOffice with a fresh profile under the temp folder, then writes only the computed
values and their types back into the original file; styles, charts and validation stay as you built them. Exit 0 means
every formula got a value and none is an error. Exit 1 lists every error value by type and cell. Exit 4 means some
formula cells got no value (they are listed); fix them before you audit. Exit 3 means LibreOffice is missing: say that
the workbook was not recalculated and that Excel will compute it on open.

### 5. Audit

```bash
python3 <skill>/scripts/audit_xlsx.py book.xlsx
```

Fix every `critical` finding (error values, `#REF!` in a formula). Treat `warning` findings as defects unless you can
say why the cell is right: a literal inside a formula belongs in an input cell, a typed number between formulas breaks
the pattern, a total row of typed numbers will go stale, a failed check means the model is wrong (fix the model, not the
check). Re-run steps 4 and 5 after each fix. `references/audit.md` explains each category and the report format for an
audit-only job.

### 6. Render and look

```bash
python3 <skill>/scripts/render_sheets.py book.xlsx --out-dir <folder>
```

Then open every PNG it lists and look at it, the way a reader would. You are looking for: `####` where a column is too
narrow, labels cut off, wrapped headers that push the table apart, Korean text shown as boxes or in a fallback that
breaks widths, numbers without separators, a chart that sits on top of a table or runs off the sheet, a KPI tile whose
value does not fit, green or blue formulas on a sheet meant for reading, a money figure without its currency, a first
sheet that is only text or only a long list. Then look at it as the person will: does the first sheet open with the
charcoal band, are labels set in from the edge, is there air between sections, is the body free of grids, stripes,
tinted boxes and heat maps, is the face free of explanation notes and check blocks, is there one table or chart per
section, does every optional comparison show a visible difference? Fix the build script and repeat 4 to 6. A sheet taller
than the crop height is cut; set a print area or look at the top part only.

If `render_sheets.py` exits 3 (no LibreOffice or Poppler), say plainly that the visual check did not happen.

LibreOffice inserts a space between a digit and a Hangul unit in chart axis labels (`1 월`). Excel shows `1월`; leave it.

### 7. Hand over

Give the file path and, in a few lines: what each sheet holds, which cells to change, the checks result, and anything
you assumed (units, periods, cases). Mention the render only if it found something the person should know about.

## Rules that prevent the usual defects

- Never save a workbook that was opened with `data_only=True`: the formulas are replaced by their values for good.
- Load twice when you need both: `load_workbook(p)` for formulas, `load_workbook(p, data_only=True)` for values.
- A merged range is written through its top-left cell only.
- Saving through openpyxl drops shapes, text boxes and slicers of an existing file. Before editing such a file, check
  for `xl/drawings/` parts with shapes and `xl/slicers/`; if present, tell the person and edit a copy.
- `.xlsm` files need `load_workbook(p, keep_vba=True)`; never run their macros.
- Sheet names: 31 characters at most, none of `[]:*?/\`, quoted in formulas when they hold spaces or non-ASCII
  (`'예산'!C5`).
- Set `number_format` on every number you write; `General` is never the answer for money, percentages or dates.
- Years in headers are text (`"2026"`), so they do not get thousands separators.
- XlsxWriter writes 0 as the stored result of a formula unless you pass `value=`; run `recalc.py` anyway.
- Treat any workbook you were given as untrusted: the scripts parse it without entity expansion or network access,
  external links stay unrefreshed, and macros never run.

## Korean workbooks

Use `look(..., korean=True)`: the body face becomes Malgun Gothic, which every Windows and Office for Mac install has.
On a machine without it, LibreOffice falls back to Apple SD Gothic Neo or Noto Sans KR when rendering; the render report
names the fallback. Put the unit in a header or subtitle (`단위: 천원`, `단위: 백만원`), use the `krw`, `thousands` or
`millions` formats from the kit, write status words (`초과`, `주의`, `정상`) rather than relying on colour, and keep
dates as dates with the `kdate` format when the reader wants `2026년 1월 5일`.

## Large data

Up to a few tens of thousands of rows, openpyxl with `ws.append()` per row is fine. Beyond that, write the data sheet
with XlsxWriter in `constant_memory` mode (rows strictly in order, no tables) and keep summaries as formulas on a small
sheet; read big files with `load_workbook(p, read_only=True)` or pandas with explicit `dtype` and `usecols`. Never
render a 100,000-row sheet: give it a print area or render the summary sheets only. `references/large-data.md` has the
details and the CSV formula-injection guard.

## References

- `references/look.md`: both looks, palettes, number formats, layout, charts, KPI tiles, Korean fonts and formats.
- `references/formulas.md`: error values and their causes, the `_xlfn.` list, dynamic arrays, scenario and sensitivity
  patterns, the Checks sheet, openpyxl and XlsxWriter pitfalls.
- `references/rules-and-validation.md`: conditional-format and data-validation recipes with the kit calls.
- `references/audit.md`: every audit category, model integrity checks, and the findings report for audit-only jobs.
- `references/large-data.md`: writers by size, streaming reads, CSV import safety.
