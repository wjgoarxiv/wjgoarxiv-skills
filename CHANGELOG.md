# Changelog

## Unreleased

- `variants/`: the LitHermes (`a2466f2`) edition of the nine moved skills, copied unchanged with
  `receipts/variants-lithermes.sha256`. Then, one commit per product, the Codex CLI, OpenCode, Grok Build, Antigravity
  CLI, Muse Code and Hermes Agent editions were made to run on their own: each folder carries the files it reads,
  product commands became scripts inside the folder, and no path leaves the folder. `variants/<product>/CHANGES.md`
  lists each change.
- README: every column of the pick-one table now gives the install lines of that product's current stub. Claude Code
  installs the family plugin; the six other harnesses install their own edition of the one skill from
  `variants/<product>/<id>/`. The Hermes Agent column is filled in. `npm test` checks receipts against the unchanged copy
  committed with them.
- README: a pick-one install table, one row per moved skill and one column per harness (Claude Code, Codex CLI,
  OpenCode, Grok Build, Muse Code, Antigravity CLI; Hermes Agent coming), each cell the install lines that harness's
  stub gives. `npm test` checks the table against the marketplace and the folders its lines name.
- `variants/`: the LitCodex (`b82ad1c`), LitOpenCode (`dc56845`), LitGrok (`8fd2c96`), LitGravity (`9f2533c`) and
  LitMuse (`e966b07`) editions of the nine moved skills, copied unchanged with `receipts/variants-<product>.sha256`.
  The LitOpenCode stubs install from `variants/litopencode/`.
- `video-covers`: lit-typographic-motion and readme-studio, with the mark helper, `project-state-root.mjs` and its rules
  modules, and the Pretendard Regular and Bold pair the film engine's font manifest reaches, copied unchanged from
  LitClaude `4d03ca8` (1.0.49 plus the decks, documents, figures and design moves, which leave these files
  byte-identical to 1.0.49).
- `design`: frontend-ui-ux and visual-qa, with the strict-json, rename-aliases and secret-shapes modules, browser-drive's
  capability probe and the Pretendard and JetBrains Mono font pairs their scripts and design kit reach, copied unchanged
  from LitClaude `aaea364` (1.0.49 plus the decks, documents and figures moves, which leave these files byte-identical
  to 1.0.49).
- `figures`: lit-diagram-drawer, lit-schematic and lit-scientific-visualization, the scientific-visualization source
  and doctor the plot skill reaches, and the mark, renderer and lit-humanizer files the diagram and schematic scripts
  import, copied unchanged from LitClaude `2381bfe` (1.0.49 plus the decks and documents moves, which leave these files byte-identical to
  1.0.49).
- `documents`: lit-docx and the 16 office-runtime files it needs, copied unchanged from LitClaude `8c736ce` (1.0.49
  plus the decks move, whose only change in these files is lit-docx as the office runtime's first-use trigger).
- `decks`: lit-pptx and the 16 office-runtime files it needs, copied unchanged from LitClaude `fc0fe5d` (1.0.48).
