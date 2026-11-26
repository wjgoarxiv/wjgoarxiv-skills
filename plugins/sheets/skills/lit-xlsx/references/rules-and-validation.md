# Conditional formats and data validation

Conditional formats and validation are part of the model: they tell the reader where to look and stop bad input. Use
them sparingly, give every colour a second cue (a word, a symbol, a sign), and never pair red with green as the only
difference.

## Conditional formats (`xlsx_kit`)

| Need | Call | Notes |
| --- | --- | --- |
| Compare sizes in a column | `kit.data_bars(ws, "J5:J10", color=...)` | bars start at zero, so the smallest value still has a length |
| Show intensity of a ratio | `kit.color_scale(ws, "E39:E42", color="93C5FD")` | white to one hue; readable in grey and by colour-blind readers |
| Loss against profit in a grid | `kit.diverging_scale(ws, "C7:I13", mid=0)` | soft red below `mid`, white at it, soft green above; pair it with red parenthesised negatives so the sign also shows in grey |
| Flag a condition | `kit.highlight(ws, "K5:K10", 'K5="초과"', ink=...)` | the formula is written for the top-left cell; relative refs move with each cell |
| Test cells | `kit.check_flags(ws, "C5:C10")` | colours the words OK and CHECK; the word is the signal |

Status columns work better than colour alone: `=IF(J5>'가정'!$C$19,"초과",IF(J5>'가정'!$C$18,"주의","정상"))`, then
`highlight` the words. Keep the thresholds in input cells.

Data bars, colour scales and `diverging_scale` tint cells; the default calm look leaves them out (negatives show as red parentheses instead), so use them only when the person asks for a heat map or a busier sheet.

Avoid: icon sets for money (they hide the number's size), more than two rules on one range, and rules over whole
columns (`A:A`), which slow large files.

## Data validation (`xlsx_kit`)

| Need | Call |
| --- | --- |
| A dropdown from fixed words | `kit.choice(ws, "C4", ["Base", "Upside", "Downside"], prompt="...")` |
| A dropdown from a range | `kit.choice(ws, "C4", "=$D$7:$F$7")` (preferred: one list, used everywhere) |
| A number range | `kit.number_between(ws, "D5:G10", 0, 100000000, prompt="...")` |
| Whole numbers only | `kit.number_between(..., whole=True)` |
| A date range | `kit.date_between(ws, "B5:B400", "DATE(2026,1,1)", "DATE(2026,12,31)")` |

Validation applies when someone types; it does not fix values already in the cells, so audit those separately. Give
every validated input a prompt in the reader's language, and put the switch cells in the key role so they stand out.

## Defined names

`kit.name(wb, "Scenario", "Inputs", "$C$4")` creates a workbook name. Use names for cells that other files, decks or
macros refer to, and for the one or two switches a person will search for. Do not name every input; plain references
are easier to audit.
