# Audit: what `audit_xlsx.py` reports and how to answer an audit request

The audit reads the workbook twice (formulas and stored results) and changes nothing. Run `recalc.py` first; without
stored results it can only report `not-recalculated`.

## Categories

| Category | Severity | What it means | Usual fix |
| --- | --- | --- | --- |
| `error-value` | critical | a formula's result is an error value | see `formulas.md`, error table |
| `broken-reference` | critical | `#REF!` is written into the formula text | rebuild the reference |
| `needs-prefix` | warning | a post-2007 function without `_xlfn.` | add the prefix or use an older function |
| `hardcode-in-formula` | warning | a literal such as `*1.08` or `>0.9` inside a formula | move it to a labelled input cell |
| `pattern-break` | warning | a typed number between formulas of a formula column or row | restore the formula, or make it a declared input |
| `hardcoded-total` | warning | a total / 합계 / 소계 row with typed numbers | `=SUM(...)` of the rows above |
| `not-recalculated` | warning | no formula on the sheet has a stored result | run `recalc.py` |
| `check-failed` | warning | a Checks / 점검 cell reads CHECK or FALSE | fix the model, not the check |
| `dynamic-array` | info | a function older Excel lacks | `INDEX`/`MATCH`, `SUMIFS` |
| `general-format` | info | numbers in the General format | apply a number format |
| `default-sheet-name` | info | Sheet1, Sheet2 ... | name sheets for their content |
| `too-many-fills` | info | more than eight fill colours | colour roles only |

Literals the audit accepts inside formulas: 0 to 10, 12, 24, 52, 60, 100, 365, 1000 and 1000000 (counts and unit
conversions). Anything else, and any percentage literal, is reported.

## Model integrity checks to add by hand

The script cannot know a model's accounting. For financial models, add these to the Checks sheet and confirm they read OK:
- the balance sheet balances in every period (assets = liabilities + equity, tolerance 1);
- closing cash on the balance sheet equals closing cash in the cash-flow statement;
- retained earnings roll forward: opening + net income - dividends = closing;
- every case passes all checks, not only the live one (switch the case, recalculate, audit again);
- reasonableness: growth above 100% a year, margins outside 0-100%, a tax rate outside the local range, a terminal value
  that is most of the enterprise value. Report these as questions, not errors.

## Audit-only requests

When someone asks to check a workbook ("이 엑셀 검토해줘", "find the formula errors"), report before touching anything:
1. Recalculate a copy (`recalc.py book.xlsx --out copy.xlsx`), audit the copy, render it.
2. Give a findings table: sheet, cell, severity, category, what you saw, the fix you propose. Critical first.
3. Say what you could not check (macros, external links, pivot caches, data that only exists in another file).
4. Change the file only after the person picks which findings to fix, then recalculate, audit and render again.
