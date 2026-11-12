# Changelog

## Unreleased

- README, `README_ko-KR.md` and the six `variants/<product>/CHANGES.md`: the install lines now match the products'
  safe-install stubs. Each harness first looks for same-name skills it would also load; Codex CLI, OpenCode,
  Antigravity CLI and Hermes Agent move an existing copy whole into a dated `extension-backups/` folder outside every
  skills folder, copy into the emptied place and write a `.litfamily-extension.json` receipt; Muse Code moves an
  occupied folder aside before `muse skills install`; Grok Build counts installed copies, moves a competing personal
  copy aside and updates by uninstall plus install; Claude Code checks for a personal or project `lit-*` folder and
  gains the update pair. No line deletes a folder (the OpenCode `rm -r` is gone). The pick-one table now names the
  family plugin and the edition folder per skill, and the full lines for each harness sit in the per-harness notes,
  shown for `lit-pptx`. `test/stub-install-lines.json` holds the stub lines and `npm test` checks both READMEs
  against it. AGENTS.md and the README rules add that every content change to a family bumps its plugin version.

- `video-covers` and `figures`: the runtimes run from the extension itself. LitClaude 1.0.50 removed
  `litclaude-ai motion-runtime` and the motion and scientific-visualization lines of `litclaude doctor`, yet the
  moved lit-typographic-motion still told you to run that command, so on a fresh machine a render stopped at BLOCKED 14
  with a fix that no longer existed. Every BLOCKED 14 and 15 message, the status, the doctor and the skill text now
  give `node "<skill dir>/scripts/motion-runtime.mjs" install` (the script was already in the plugin), and
  lit-scientific-visualization runs only its bundled doctor. The cache is still
  `${XDG_CACHE_HOME:-~/.cache}/litclaude/motion-runtime`, and the two files whose bytes key it are unchanged, so a
  runtime that LitClaude 1.0.49 or earlier pre-warmed is reused. This is the one documented exception to "copied
  unchanged": README "Edited after the move" lists the ten edited files, and their receipt rows carry
  `edited-from:<sha256 of the unchanged copy>`. `npm test` checks the marker, the list, that no plugin file gives a
  removed LitClaude command, and that the film runtime names its own script. `decks`, `documents` and the editions
  under `variants/` already ran their runtimes from inside the folder and are unchanged.
- README and `README_ko-KR.md`: the shelf is presented as LitFamily extensions (확장). The opening says LitFamily's core
  is complete on its own and that installing these skills alongside a LitFamily product gives the full LitFamily
  experience; the skills still work without one. The pick-one table intro names its rows extensions. The
  `package.json` and marketplace descriptions say the same. Commands, tables, links and pictures are unchanged.
- README: a cover loop, a big-picture diagram, a skill map with a slice per family and an install-paths flowchart (each
  in light and dark), and two schematics (the skill plant and the editions manifold), all in `docs/assets/`; a section per
  family, per-harness notes, a licence table and a note on the `lit-` names. The pick-one table is unchanged.
  `README_ko-KR.md` is the same page in Korean.
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
