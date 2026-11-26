# Formulas: errors, portability and patterns

## Error values after recalculation

| Value | Usual cause | Fix |
| --- | --- | --- |
| `#REF!` | a formula points at a row, column or sheet that was deleted, or a range was built past the sheet edge | rebuild the reference; lock the layout before writing formulas |
| `#DIV/0!` | a ratio over an empty or zero cell | `=IFERROR(a/b,0)` when 0 is the right answer, or fix the empty denominator |
| `#NAME?` | a misspelt function or name, a newer function without `_xlfn.`, a defined name that was never created | spell it, add the prefix, or create the name |
| `#VALUE!` | text where a number is expected (a number stored as text, a stray space) | convert the source column to numbers |
| `#N/A` | a lookup found nothing | check the key; wrap with `IFERROR` only when a blank is a correct answer |
| `#NUM!` | an impossible number (`IRR` without a sign change, a negative square root) | check the inputs |
| `#NULL!` | a space between two ranges where a comma was meant | use `,` or `:` |
| `#SPILL!`, `#CALC!` | dynamic-array results blocked or empty | avoid dynamic arrays (below) |

`recalc.py` lists each error value with its cells; `audit_xlsx.py` reports them as `critical`. Before blaming an edit,
recalculate the original file too: an error that was already there is a finding, not a regression.

## Functions that need `_xlfn.`

Excel stores functions added after 2007 with a prefix. openpyxl writes formula text as given, so `=IFS(...)` opens as
`#NAME?` in Excel; write `=_xlfn.IFS(...)`. The audit checks for these:

`IFS`, `SWITCH`, `MAXIFS`, `MINIFS`, `CONCAT`, `TEXTJOIN`, `IFNA`, `XOR`, `DAYS`, `ISOWEEKNUM`, `AGGREGATE`,
`STDEV.S`, `STDEV.P`, `VAR.S`, `VAR.P`, `MODE.SNGL`, `PERCENTILE.INC`, `PERCENTILE.EXC`, `QUARTILE.INC`, `RANK.EQ`,
`RANK.AVG`, `CEILING.MATH`, `FLOOR.MATH`, `FORECAST.LINEAR`, `NORM.DIST`, `NORM.INV`, `T.TEST`, and the dynamic-array
family below. XlsxWriter adds the prefixes itself with `Workbook(..., {"use_future_functions": True})`; `LAMBDA`
parameters there also need `_xlpm.`.

## Dynamic arrays

`XLOOKUP`, `XMATCH`, `FILTER`, `SORT`, `SORTBY`, `UNIQUE`, `SEQUENCE`, `RANDARRAY`, `LET`, `LAMBDA`, `TEXTSPLIT`,
`VSTACK`, `HSTACK`, `TAKE`, `DROP`, `CHOOSECOLS`, `CHOOSEROWS` do not exist in Excel 2016/2019 and older viewers.
Use `INDEX`/`MATCH` for lookups, `SUMIFS`/`COUNTIFS` for filtered totals, a sorted copy of the data for sorting. Use them
only when the person says everyone has Microsoft 365, and then with the prefix.

## Patterns

**Case switch.** Case names in a row (`D7:F7`), a dropdown in the key cell (`C4`), its position in `C5`
(`=MATCH(C4,D7:F7,0)`), and a Live column `=INDEX(D8:F8,$C$5)` per assumption. Every model line reads the Live column.
The Checks sheet tests `ISNUMBER(C5)`.

**Sensitivity grid.** Odd size (5 x 5), the centre row and column equal to the live inputs, steps as input cells
(`C3`, `C4`), each grid cell one closed-form formula of the row and column headers. Highlight the centre and add a check
that it equals the model's output. Plain formulas recalculate everywhere; Excel data tables do not survive LibreOffice.

**Roll-forward.** Opening = previous closing; closing = opening + additions - reductions; a check that the last closing
equals the balance it should tie to.

**Checks sheet.** A sheet of its own behind the answer and the calculation sheets, never a block on the first sheet. One row per test, each `=IF(test,"OK","CHECK")` with a tolerance of 1 for money (`ABS(a-b)<1`), and a
final row `=IF(COUNTIF(range,"OK")=n,"OK","CHECK")`. Typical tests: totals equal the sum of their parts, the balance
sheet balances, cash ties to the cash-flow statement, the selected case exists, the sensitivity centre equals the model.

**Thresholds.** A rule such as "warn above 90%" takes its 90% from an input cell, so the audit does not flag it as a
hardcode and the person can change it.

## openpyxl and XlsxWriter pitfalls

- `load_workbook(p, data_only=True)` gives the stored results; saving that workbook writes the results as constants and
  the formulas are gone.
- A formula returning `""` reads back as `None` with `data_only=True`.
- openpyxl writes no stored results, so values appear only after `recalc.py` or after Excel opens and calculates the
  file (`kit` templates set full calculation on load).
- XlsxWriter cannot read or edit an existing file; it is for new files, especially large ones.
- Formulas are written in English with commas (`=SUM(A1,B1)`), whatever the reader's locale.
- Quote sheet names that hold spaces or non-ASCII characters: `='예산'!C5`, `='Cash flow'!B4`.
- Charts written by openpyxl need visible axes (`axis.delete = False`); the kit sets this.
