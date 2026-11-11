# Changelog

## Unreleased

- README: the repository is public at https://github.com/wjgoarxiv/wjgoarxiv-skills, so the Claude Code install
  section and the Claude Code column of the pick-one table give `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`
  (a local clone stays the offline form), and the Grok Build column starts with LitGrok's
  `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills` line. Every cell again matches its product's current stub;
  `npm test` checks the new lines.
- `variants/litgrok/`: the nine SKILL.md files, both `complete-contract.md` references and `CHANGES.md` give the
  folder-path install line, `grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/<id>" --trust`.
  Grok Build copied the whole repository, `.git` included, for the earlier `#` subfolder form.
- README: the Grok Build column and the table intro follow LitGrok's current notes (the folder-path line above).
  `npm test` rejects a `#` subfolder install line in the README and in every edition.
- `variants/litcodex/lit-diagram-drawer/`: the visible-text detector is bundled in `humanizer/` (copied unchanged from
  LitCodex `b82ad1c`). `diagram-metrics.mjs` and `doctor.mjs` reached it in a sibling `lit-humanizer` folder, so the
  verifiers failed from a one-folder copy. `npm test` now follows the paths every edition builds from its own location
  and runs that detector and doctor from a folder copied alone.
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
