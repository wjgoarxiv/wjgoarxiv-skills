#!/usr/bin/env python3
"""Build the lit-xlsx starting workbooks. This one script is the only source of every template.

Kinds:
    model      operating model (English, calm look): Inputs with a Base/Upside/Downside switch,
               a five-year Model, a 5x5 Sensitivity grid tied to the base case, and Checks.
    ledger     예산 대비 실적 (Korean, calm look): 가정 with a scenario switch, quarterly actuals
               against budget, 집행률 and 상태 flags, and 점검.
    report     지역별 매출 현황 (Korean, calm look): one report table with totals, 비중 and 전년 대비.
    dashboard  월간 영업 대시보드 (Korean, dashboard look): a KPI band, two charts and a quarter table
               over a 데이터 sheet.

Usage:
    python3 make_templates.py --out DIR [--kind all|model|ledger|report|dashboard]

Each file is written as DIR/lit-xlsx-<kind>.xlsx with live formulas and no cached values; run
recalc.py on it before anyone reads the numbers.
"""

from __future__ import annotations

import os
import sys

sys.dont_write_bytecode = True  # keep the installed plugin folder free of __pycache__
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "lib"))
from sheets_bootstrap import ensure_runtime  # noqa: E402

ensure_runtime(["openpyxl"])

import argparse  # noqa: E402
from pathlib import Path  # noqa: E402

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import xlsx_kit as kit  # noqa: E402
from openpyxl.utils import get_column_letter as L  # noqa: E402


def _notes(ws, start: int, lines: list[str]) -> None:
    for i, line in enumerate(lines):
        kit.put(ws, f"B{start + i}", line, "label")
    kit.widths(ws, {"B": 96})


def _finish(wb, path: Path) -> Path:
    # The workbook opens on its answer: the how-to-read sheet goes last, never first.
    for notes in ("Notes", "안내"):
        if notes in wb.sheetnames:
            wb.move_sheet(notes, offset=len(wb.sheetnames) - 1 - wb.sheetnames.index(notes))
    wb.active = 0
    wb.calculation.fullCalcOnLoad = True
    wb.save(path)
    return path


def model(out: Path) -> Path:
    lk = kit.look("calm")
    wb = kit.new_workbook(lk)

    ws = kit.sheet(wb, "Notes")
    kit.title(ws, "Operating model", "Five-year plan with three cases. USD thousands.")
    _notes(ws, 4, [
        "Change only the blue cells on Inputs. Black cells are formulas; green cells read another sheet.",
        "Pick the case in Inputs!C4 (Base, Upside or Downside). The yellow cell is the switch.",
        "Model builds revenue, costs and net income from the Live column of Inputs.",
        "Sensitivity shows 2030 net income for growth and margin around the live case; its centre equals Model.",
        "Checks must all read OK before the numbers are used.",
    ])

    ws = kit.sheet(wb, "Inputs")
    kit.title(ws, "Inputs", "USD thousands unless stated")
    kit.put(ws, "B4", "Case", "label")
    kit.put(ws, "C4", "Base", "key")
    kit.put(ws, "D4", "Pick Base, Upside or Downside", "note")
    kit.put(ws, "B5", "Case number", "label")
    kit.put(ws, "C5", "=MATCH(C4,D7:F7,0)", fmt="0")
    kit.choice(ws, "C4", "=$D$7:$F$7", prompt="Pick the case the model runs.", title_text="Case")
    rows = [
        ("Revenue, last year", "USD k", 12000, 12000, 12000, "int"),
        ("Revenue growth", "% a year", 0.08, 0.14, 0.03, "pct"),
        ("Gross margin", "% of revenue", 0.42, 0.45, 0.38, "pct"),
        ("Operating costs", "% of revenue", 0.24, 0.23, 0.26, "pct"),
        ("Tax rate", "% of profit", 0.22, 0.22, 0.22, "pct"),
    ]
    kit.header_row(ws, 7, 2, ["Assumption", "Unit", "Base", "Upside", "Downside", "Live"])
    for r, (label, unit, base, up, down, fmt) in enumerate(rows, start=8):
        kit.put(ws, f"B{r}", label, "label")
        kit.put(ws, f"C{r}", unit, "note")
        for col, v in zip("DEF", (base, up, down)):
            kit.put(ws, f"{col}{r}", v, "input", fmt)
        kit.put(ws, f"G{r}", f"=INDEX(D{r}:F{r},$C$5)", fmt=fmt)
    kit.box(ws, "B8:G12")
    kit.widths(ws, {"B": 24, "C": 16, "D": 12, "E": 12, "F": 12, "G": 12})
    kit.freeze(ws, "B8")

    ws = kit.sheet(wb, "Model")
    kit.title(ws, "Model", span=6)
    kit.put(ws, "B2", '="USD thousands · case: "&Inputs!C4', "note")
    years = [str(y) for y in range(2026, 2031)]
    kit.header_row(ws, 4, 2, ["", *years])
    lines = [
        (5, "Revenue", lambda c, p: "=Inputs!$G$8*(1+Inputs!$G$9)" if p is None else f"={p}5*(1+Inputs!$G$9)", "formula"),
        (6, "Cost of sales", lambda c, p: f"={c}5*(1-Inputs!$G$10)", "formula"),
        (7, "Gross profit", lambda c, p: f"={c}5-{c}6", "total"),
        (8, "Operating costs", lambda c, p: f"={c}5*Inputs!$G$11", "formula"),
        (9, "Operating profit", lambda c, p: f"={c}7-{c}8", "total"),
        (10, "Tax", lambda c, p: f"=MAX({c}9,0)*Inputs!$G$12", "formula"),
        (11, "Net income", lambda c, p: f"={c}9-{c}10", "grand"),
    ]
    for r, label, make, role in lines:
        summed = role in ("total", "grand")
        kit.put(ws, f"B{r}", label, role if summed else "label")
        for i in range(5):
            c, p = L(3 + i), (L(2 + i) if i else None)
            kit.put(ws, f"{c}{r}", make(c, p), role if summed else None, "int")
    ratios = [
        (13, "Gross margin", lambda c, p: f"=IFERROR({c}7/{c}5,0)"),
        (14, "Operating margin", lambda c, p: f"=IFERROR({c}9/{c}5,0)"),
        (15, "Revenue growth", lambda c, p: f"=IFERROR({c}5/Inputs!$G$8-1,0)" if p is None else f"=IFERROR({c}5/{p}5-1,0)"),
    ]
    for r, label, make in ratios:
        kit.put(ws, f"B{r}", label, "label")
        for i in range(5):
            c, p = L(3 + i), (L(2 + i) if i else None)
            kit.put(ws, f"{c}{r}", make(c, p), fmt="pct")
    kit.box(ws, "B5:G11", zebra=False)
    kit.box(ws, "B13:G15")
    kit.widths(ws, {"B": 22, **{L(3 + i): 12 for i in range(5)}})
    kit.freeze(ws, "C5")

    ws = kit.sheet(wb, "Sensitivity", reader=True)
    kit.title(ws, "Sensitivity")
    kit.put(ws, "B2", "Net income 2030, USD thousands: revenue growth down the side, gross margin across", "note")
    kit.put(ws, "B3", "Growth step", "label")
    kit.put(ws, "C3", 0.02, "input", "pct")
    kit.put(ws, "B4", "Margin step", "label")
    kit.put(ws, "C4", 0.02, "input", "pct")
    kit.put(ws, "B6", "Growth \\ margin", "header")
    steps = {-2: "-2*{s}", -1: "-{s}", 0: "", 1: "+{s}", 2: "+2*{s}"}
    for i, k in enumerate(steps):
        kit.put(ws, f"{L(3 + i)}6", "=Inputs!$G$10" + steps[k].format(s="$C$4"), "header", "pct")
        kit.put(ws, f"B{7 + i}", "=Inputs!$G$9" + steps[k].format(s="$C$3"), "header", "pct")
    for i in range(5):
        for j in range(5):
            col, r = L(3 + j), 7 + i
            f = (f"=Inputs!$G$8*(1+$B{r})^5*({col}$6-Inputs!$G$11)"
                 f"*(1-IF({col}$6>Inputs!$G$11,Inputs!$G$12,0))")
            kit.put(ws, f"{col}{r}", f, "key" if (i, j) == (2, 2) else None, "int")
    kit.box(ws, "C7:G11", zebra=False)
    kit.widths(ws, {"B": 18, **{L(3 + i): 12 for i in range(5)}})
    kit.footer(ws, "B13", "The yellow centre is the live case and equals Model!G11.", span=6)

    ws = kit.sheet(wb, "Checks")
    kit.title(ws, "Checks", "Every row must read OK")
    kit.header_row(ws, 4, 2, ["Check", "Result"])
    checks = [
        ("Gross profit equals revenue less cost of sales", '=IF(ABS(SUM(Model!C7:G7)-SUM(Model!C5:G5)+SUM(Model!C6:G6))<1,"OK","CHECK")'),
        ("Sensitivity centre equals model net income 2030", '=IF(ABS(Sensitivity!E9-Model!G11)<1,"OK","CHECK")'),
        ("The case is one of the three", '=IF(ISNUMBER(Inputs!C5),"OK","CHECK")'),
        ("Tax is never negative", '=IF(MIN(Model!C10:G10)>=0,"OK","CHECK")'),
    ]
    for r, (label, f) in enumerate(checks, start=5):
        kit.put(ws, f"B{r}", label, "label")
        kit.put(ws, f"C{r}", f, "check")
    kit.put(ws, "B10", "All checks", "label").font = kit.Font(name=lk.font, size=lk.size, bold=True)
    kit.put(ws, "C10", '=IF(COUNTIF(C5:C8,"OK")=4,"OK","CHECK")', "check")
    kit.check_flags(ws, "C5:C10")
    kit.box(ws, "B5:C8")
    kit.widths(ws, {"B": 50, "C": 12})
    return _finish(wb, out / "lit-xlsx-model.xlsx")


LEDGER_ITEMS = [
    ("인건비", 480000, (118000, 121000, 119500, 124000)),
    ("마케팅", 120000, (28000, 35000, 31000, 22000)),
    ("임차료", 96000, (24000, 24000, 24000, 24000)),
    ("소프트웨어", 36000, (7000, 7500, 8000, 6500)),
    ("출장비", 24000, (4000, 6500, 5200, 3100)),
    ("교육훈련", 18000, (2000, 5000, 6000, 6500)),
]


def ledger(out: Path) -> Path:
    lk = kit.look("calm", korean=True)
    wb = kit.new_workbook(lk)

    ws = kit.sheet(wb, "안내")
    kit.title(ws, "예산 대비 실적", "2026년 연간 비용 예산과 분기 실적 · 단위: 천원")
    _notes(ws, 4, [
        "파란 숫자만 바꿉니다. 검은 숫자는 수식이고, 초록 숫자는 다른 시트를 읽는 수식입니다.",
        "시나리오는 가정 시트 C4에서 고릅니다(기본, 보수, 공격). 노란 칸이 선택 칸입니다.",
        "예산 시트의 분기 실적(파란 칸)에 금액을 넣으면 합계, 차이, 집행률, 상태가 바로 바뀝니다.",
        "상태는 집행률이 초과 기준(가정 C19, 100%)을 넘으면 ‘초과’, 주의 기준(C18, 90%)을 넘으면 ‘주의’, 그 밖에는 ‘정상’입니다.",
        "점검 시트가 모두 OK인지 확인한 뒤 숫자를 씁니다.",
    ])

    ws = kit.sheet(wb, "가정")
    kit.title(ws, "가정", "단위: 천원")
    kit.put(ws, "B4", "시나리오", "label")
    kit.put(ws, "C4", "기본", "key")
    kit.put(ws, "D4", "기본, 보수, 공격 중에서 고릅니다", "note")
    kit.put(ws, "B5", "시나리오 번호", "label")
    kit.put(ws, "C5", "=MATCH(C4,C7:E7,0)", fmt="0")
    kit.choice(ws, "C4", "=$C$7:$E$7", prompt="예산 배수를 정할 시나리오를 고릅니다.", title_text="시나리오")
    kit.header_row(ws, 7, 2, ["구분", "기본", "보수", "공격", "적용"])
    kit.put(ws, "B8", "예산 배수", "label")
    for col, v in zip("CDE", (1, 0.92, 1.12)):
        kit.put(ws, f"{col}8", v, "input", "pct0")
    kit.put(ws, "F8", "=INDEX(C8:E8,$C$5)", fmt="pct0")
    kit.header_row(ws, 10, 2, ["비용 항목", "기본 연간 예산"])
    for r, (item, base, _) in enumerate(LEDGER_ITEMS, start=11):
        kit.put(ws, f"B{r}", item, "label")
        kit.put(ws, f"C{r}", base, "input", "int")
    kit.put(ws, "B18", "주의 기준 집행률", "label")
    kit.put(ws, "C18", 0.9, "input", "pct0")
    kit.put(ws, "B19", "초과 기준 집행률", "label")
    kit.put(ws, "C19", 1, "input", "pct0")
    kit.widths(ws, {"B": 18, "C": 16, "D": 12, "E": 12, "F": 12})

    ws = kit.sheet(wb, "예산")
    kit.title(ws, "예산 대비 실적", "단위: 천원", span=10)
    kit.put(ws, "B2", "=\"시나리오: \"&'가정'!C4&\" · 단위: 천원\"", "note")
    kit.header_row(ws, 4, 2, ["항목", "연간 예산", "1분기", "2분기", "3분기", "4분기", "실적 합계", "차이", "집행률", "상태"])
    first = 5
    for i, (item, _, quarters) in enumerate(LEDGER_ITEMS):
        r = first + i
        kit.put(ws, f"B{r}", item, "label")
        kit.put(ws, f"C{r}", f"='가정'!C{11 + i}*'가정'!$F$8", fmt="int")
        for col, v in zip("DEFG", quarters):
            kit.put(ws, f"{col}{r}", v, "input", "int")
        kit.put(ws, f"H{r}", f"=SUM(D{r}:G{r})", fmt="int")
        kit.put(ws, f"I{r}", f"=C{r}-H{r}", fmt="int")
        kit.put(ws, f"J{r}", f"=IFERROR(H{r}/C{r},0)", fmt="pct")
        kit.put(ws, f"K{r}", f"=IF(J{r}>'가정'!$C$19,\"초과\",IF(J{r}>'가정'!$C$18,\"주의\",\"정상\"))", "check")
    last = first + len(LEDGER_ITEMS) - 1
    t = last + 1
    kit.put(ws, f"B{t}", "합계", "grand")
    for col in "CDEFGHI":
        kit.put(ws, f"{col}{t}", f"=SUM({col}{first}:{col}{last})", "grand", "int")
    kit.put(ws, f"J{t}", f"=IFERROR(H{t}/C{t},0)", "grand", "pct")
    kit.put(ws, f"K{t}", None, "grand")
    kit.highlight(ws, f"K{first}:K{last}", f'K{first}="초과"', ink=lk.bad_ink)
    kit.highlight(ws, f"K{first}:K{last}", f'K{first}="주의"', ink="9A6700")
    kit.number_between(ws, f"D{first}:G{last}", 0, 100000000, prompt="분기 실적(천원)을 넣습니다.")
    kit.box(ws, f"B{first}:K{last}")
    kit.widths(ws, {"B": 14, "C": 13, **{c: 11 for c in "DEFG"}, "H": 13, "I": 12, "J": 10, "K": 8})
    kit.footer(ws, f"B{t + 2}", "상태는 글자로 표시하고 색은 보조로만 씁니다. 차이가 음수면 예산을 넘은 것입니다.", span=10)
    kit.freeze(ws, "C5")

    ws = kit.sheet(wb, "점검")
    kit.title(ws, "점검", "모든 행이 OK여야 합니다")
    kit.header_row(ws, 4, 2, ["점검 항목", "결과"])
    checks = [
        ("연간 예산 합계 = 기본 예산 합계 × 배수", "=IF(ABS('예산'!C11-SUM('가정'!C11:C16)*'가정'!F8)<1,\"OK\",\"CHECK\")"),
        ("실적 합계 = 분기 실적의 합", "=IF(ABS('예산'!H11-SUM('예산'!D5:G10))<1,\"OK\",\"CHECK\")"),
        ("시나리오 선택이 올바름", "=IF(ISNUMBER('가정'!C5),\"OK\",\"CHECK\")"),
    ]
    for r, (label, f) in enumerate(checks, start=5):
        kit.put(ws, f"B{r}", label, "label")
        kit.put(ws, f"C{r}", f, "check")
    kit.put(ws, "B9", "전체", "label").font = kit.Font(name=lk.font, size=lk.size, bold=True)
    kit.put(ws, "C9", '=IF(COUNTIF(C5:C7,"OK")=3,"OK","CHECK")', "check")
    kit.check_flags(ws, "C5:C9")
    kit.widths(ws, {"B": 44, "C": 12})
    return _finish(wb, out / "lit-xlsx-ledger.xlsx")


REGIONS = [
    ("서울", (412, 438, 455, 481), 1650),
    ("경기", (305, 322, 318, 347), 1240),
    ("부산", (128, 131, 140, 152), 560),
    ("대구", (96, 94, 101, 108), 410),
    ("광주", (71, 75, 73, 80), 300),
    ("대전", (64, 69, 72, 77), 255),
]


def report(out: Path) -> Path:
    lk = kit.look("calm", korean=True)
    wb = kit.new_workbook(lk)
    ws = kit.sheet(wb, "보고서", reader=True)
    kit.title(ws, "2026년 지역별 매출 현황", "단위: 백만원 · 출처: 영업관리 시스템, 2026-11-20 기준", span=9)
    kit.header_row(ws, 4, 2, ["지역", "1분기", "2분기", "3분기", "4분기", "합계", "비중", "전년", "전년 대비"])
    first = 5
    last = first + len(REGIONS) - 1
    t = last + 1
    yoy = '0.0%;[Red]-0.0%;"-"'
    for i, (region, q, prior) in enumerate(REGIONS):
        r = first + i
        kit.put(ws, f"B{r}", region, "label")
        for col, v in zip("CDEF", q):
            kit.put(ws, f"{col}{r}", v, "input", "int")
        kit.put(ws, f"G{r}", f"=SUM(C{r}:F{r})", fmt="int")
        kit.put(ws, f"H{r}", f"=IFERROR(G{r}/$G${t},0)", fmt="pct")
        kit.put(ws, f"I{r}", prior, "input", "int")
        kit.put(ws, f"J{r}", f"=IFERROR(G{r}/I{r}-1,0)", fmt=yoy)
    kit.put(ws, f"B{t}", "합계", "grand")
    for col in "CDEFGI":
        kit.put(ws, f"{col}{t}", f"=SUM({col}{first}:{col}{last})", "grand", "int")
    kit.put(ws, f"H{t}", f"=IFERROR(G{t}/$G${t},0)", "grand", "pct")
    kit.put(ws, f"J{t}", f"=IFERROR(G{t}/I{t}-1,0)", "grand", yoy)
    kit.box(ws, f"B{first}:J{last}")
    kit.widths(ws, {"B": 12, **{c: 10 for c in "CDEF"}, "G": 11, "H": 9, "I": 10, "J": 11})
    kit.footer(ws, f"B{t + 2}", "전년 대비는 연간 합계 기준입니다. 파란 숫자는 원자료, 검은 숫자는 수식입니다.", span=9)
    kit.freeze(ws, "C5")
    return _finish(wb, out / "lit-xlsx-report.xlsx")


MONTHS = [f"{m}월" for m in range(1, 13)]
SALES = [820, 860, 905, 880, 940, 990, 1010, 1050, 1080, 1120, 1170, 1240]
COSTS = [690, 705, 730, 725, 760, 790, 805, 830, 850, 870, 900, 940]
NEW = [120, 132, 140, 128, 150, 165, 158, 170, 182, 190, 205, 230]
LOST = [40, 42, 45, 47, 44, 48, 50, 49, 52, 55, 53, 58]


def dashboard(out: Path) -> Path:
    lk = kit.look("dashboard", korean=True)
    wb = kit.new_workbook(lk)
    dash = kit.sheet(wb, "대시보드", tab_color=lk.accent, reader=True)
    data = kit.sheet(wb, "데이터")

    kit.title(data, "데이터", "단위: 백만원 · 고객 수는 명", span=7)
    kit.header_row(data, 4, 2, ["월", "매출", "비용", "영업이익", "이익률", "신규 고객", "해지 고객"])
    for i, month in enumerate(MONTHS):
        r = 5 + i
        kit.put(data, f"B{r}", month, "label")
        kit.put(data, f"C{r}", SALES[i], "input", "int")
        kit.put(data, f"D{r}", COSTS[i], "input", "int")
        kit.put(data, f"E{r}", f"=C{r}-D{r}", fmt="int")
        kit.put(data, f"F{r}", f"=IFERROR(E{r}/C{r},0)", fmt="pct")
        kit.put(data, f"G{r}", NEW[i], "input", "int")
        kit.put(data, f"H{r}", LOST[i], "input", "int")
    kit.put(data, "B17", "합계", "grand")
    for col in "CDEGH":
        kit.put(data, f"{col}17", f"=SUM({col}5:{col}16)", "grand", "int")
    kit.put(data, "F17", "=IFERROR(E17/C17,0)", "grand", "pct")
    kit.box(data, "B5:H16")
    kit.widths(data, {"B": 10, **{c: 12 for c in "CDEFGH"}})
    kit.freeze(data, "C5")

    kit.title(dash, "월간 영업 대시보드", "2026년 · 단위: 백만원 · 숫자는 데이터 시트에서 계산합니다", span=8)
    tiles = [
        ("B4", "연간 매출", "='데이터'!C17", "int", "1~12월 합계"),
        ("D4", "영업이익", "='데이터'!E17", "int", "매출 − 비용"),
        ("F4", "평균 이익률", "=IFERROR('데이터'!E17/'데이터'!C17,0)", "pct", "영업이익 ÷ 매출"),
        ("H4", "순증 고객", "=SUM('데이터'!G5:G16)-SUM('데이터'!H5:H16)", "int", "신규 − 해지 (명)"),
    ]
    for ref, label, f, fmt, note in tiles:
        kit.kpi_tile(dash, ref, label, f, fmt, cols=2, note=note)
    kit.widths(dash, {c: 12.5 for c in "BCDEFGHI"})
    kit.bar_chart(dash, (data, 3, 4, 4, 16), (data, 2, 5, 2, 16), "B8", "월별 매출과 비용", y_title="백만원",
                  fmt="#,##0", width=19.4, height=7.2)
    kit.line_chart(dash, (data, 6, 4, 6, 16), (data, 2, 5, 2, 16), "B23", "월별 이익률", fmt="0%", width=19.4, height=6.2)

    kit.section(dash, "B37", "분기 요약", span=8)
    kit.header_row(dash, 38, 2, ["분기", "매출", "영업이익", "이익률", "순증 고객"])
    for q in range(4):
        r, a, b = 39 + q, 5 + 3 * q, 7 + 3 * q
        kit.put(dash, f"B{r}", f"{q + 1}분기", "label")
        kit.put(dash, f"C{r}", f"=SUM('데이터'!C{a}:C{b})", fmt="int")
        kit.put(dash, f"D{r}", f"=SUM('데이터'!E{a}:E{b})", fmt="int")
        kit.put(dash, f"E{r}", f"=IFERROR(D{r}/C{r},0)", fmt="pct")
        kit.put(dash, f"F{r}", f"=SUM('데이터'!G{a}:G{b})-SUM('데이터'!H{a}:H{b})", fmt="int")
    kit.box(dash, "B39:F42")
    kit.footer(dash, "B44", "출처: 데이터 시트. 대시보드의 숫자는 모두 데이터 시트를 읽는 수식입니다.", span=8)
    return _finish(wb, out / "lit-xlsx-dashboard.xlsx")


KINDS = {"model": model, "ledger": ledger, "report": report, "dashboard": dashboard}


def main() -> int:
    ap = argparse.ArgumentParser(description="Build the lit-xlsx starting workbooks.")
    ap.add_argument("--out", required=True)
    ap.add_argument("--kind", default="all", choices=["all", *KINDS])
    a = ap.parse_args()
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    for kind in (KINDS if a.kind == "all" else [a.kind]):
        print(KINDS[kind](out))
    return 0


if __name__ == "__main__":
    sys.exit(main())
