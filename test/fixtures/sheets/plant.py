"""Test fixture for test/sheets.test.mjs, run with the lit-xlsx runtime interpreter.

    plant.py write OUT.xlsx   Data: a plain SUM (A3), an INDEX past its range that computes to #REF! (A4) and a
                              formula with #REF! written into its text (A5); a hidden sheet between two visible ones
    plant.py read BOOK.xlsx   print the stored results of Data!A3 and Data!A4 as JSON
"""

import json
import sys

from openpyxl import Workbook, load_workbook


def write(path):
    wb = Workbook()
    ws = wb.active
    ws.title = "Data"
    ws["A1"], ws["A2"] = 10, 20
    ws["A3"] = "=SUM(A1:A2)"
    ws["A4"] = "=INDEX(A1:A2,5)"
    ws["A5"] = "=#REF!+1"
    hidden = wb.create_sheet("Hidden")
    hidden["A1"] = "not rendered"
    hidden.sheet_state = "hidden"
    wb.create_sheet("Notes")["A1"] = "visible second sheet"
    wb.save(path)


def read(path):
    ws = load_workbook(path, data_only=True)["Data"]
    print(json.dumps({"A3": ws["A3"].value, "A4": ws["A4"].value}))


if __name__ == "__main__":
    {"write": write, "read": read}[sys.argv[1]](sys.argv[2])
