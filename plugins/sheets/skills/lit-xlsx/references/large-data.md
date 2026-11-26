# Large data

Pick the writer and reader by size, and keep the parts people read small.

| Rows x columns | Write with | Read with |
| --- | --- | --- |
| up to ~50,000 cells | `xlsx_kit` on openpyxl, `ws.append(row)` per row | `load_workbook(p)` |
| up to ~1,000,000 cells | openpyxl `Workbook(write_only=True)` with `ws.append` | `load_workbook(p, read_only=True)`; iterate `ws.iter_rows(values_only=True)` |
| beyond | XlsxWriter `Workbook(path, {"constant_memory": True})` | pandas `read_excel(..., usecols=..., dtype=...)` or `read_only` |

XlsxWriter's constant-memory mode writes each row once, strictly top to bottom, stores strings inline and cannot add
Excel tables; write the header first, then rows in order. openpyxl's write-only mode has the same one-pass rule.

## Shape of a big workbook

- A `Data` sheet with the raw rows (header row, freeze panes, an Excel table or an autofilter, formats on whole columns
  set once), and a small `Summary` sheet of `SUMIFS` / `COUNTIFS` formulas over it.
- Avoid whole-column references (`A:A`) in many formulas and volatile functions (`OFFSET`, `INDIRECT`, `TODAY`) in
  per-row formulas; both make every recalculation slow.
- Recalculation of a large file in LibreOffice can take minutes; raise `recalc.py --timeout`.
- Render only the summary sheets: hide the data sheet in a copy, or set a print area. `render_sheets.py` crops any sheet
  taller than `--max-height` pixels and says so.

## Importing CSV safely

- Read IDs, postal codes, phone numbers and account numbers as text (`dtype={"id": str}`) and write them with the `@`
  format, or leading zeros disappear.
- Parse dates explicitly with their format; do not let a parser guess day versus month.
- A cell from an outside source that starts with `=`, `+`, `-`, `@`, a tab or a carriage return can run as a formula
  when the file is opened, and openpyxl turns any string starting with `=` into a formula. When the data is untrusted,
  store such cells as text: assign the value, then set `cell.data_type = "s"` and the `@` format. If the cleaned data
  will also go back out as CSV, prefix those values with a single quote so a spreadsheet opening the CSV keeps them inert.
- Keep the original file untouched; write the cleaned workbook next to it.
