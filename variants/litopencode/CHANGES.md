# OpenCode editions: what changed from the unchanged copies

The nine folders here started as unchanged copies of the OpenCode product's own skill folders from before they moved
(their hashes are in `receipts/variants-litopencode.sha256`). Those copies leaned on things that are no longer there for
someone who installs one skill on its own: product commands removed with the move (`litopencode motion-runtime`, the
product's install-time pre-warm and its doctor lines), product environment variables, a hook that recorded image reads,
sibling skill folders reached through `../`, and a vendored source that lived outside the skill.

Each folder now works when it is the only thing copied into `~/.config/opencode/skills/<id>/` (or
`$XDG_CONFIG_HOME/opencode/skills/<id>/`), with no LitFamily product installed. The references, scripts, templates and
QA gates are all still there; nothing was cut to make a folder smaller.

Changes that apply to every folder:

- Contract labels `litopencode.skill_contract.v1` became `opencode.skill_contract.v1`, and the other product-prefixed
  schema ids became `opencode.*` (`frontend-style`, `frontend-kit-fonts`, `design-lock`, `motion-style`,
  `motion-house`, `motion-sound-cues`). Code and data were renamed together, so the readers and the files agree. A lock
  or house file written by the old product edition carries the old id and has to be written again.
- Text that said the product installs, verifies or routes the skill now says what is true for a copied folder: OpenCode
  discovers it through its skill tool, there is no chat route, slash command or doctor line, and integrity is checked
  with the skill's own tools or with `diff -r` against this source copy.
- No folder contains a nested `SKILL.md` (OpenCode would register it as a second skill), a `../` path out of the
  folder, a product command or env var, another harness's name, or a machine-specific path.

## lit-pptx

- `run.mjs`: cache moved from `XDG_CACHE_HOME/litopencode/office` to `XDG_CACHE_HOME/opencode-skills/lit-pptx`; the
  interpreter override `LITOPENCODE_OFFICE_PYTHON` became `LIT_PPTX_PYTHON`; notices name the skill. First use still
  installs the pinned Node lockfile and Python venv by itself, so the runtime the product used to provide is now the
  skill's own.
- `package.json` / `package-lock.json`: package name `lit-pptx-runtime` (no dependency changed).
- `SKILL.md`, `NOTICE.md`, two references and three QA scripts: product name replaced; the bare-`lit` chat route, which
  the product's hook provided, is described as an ordinary skill-tool load.

## lit-docx

- `run.py`: cache `XDG_CACHE_HOME/opencode-skills/lit-docx`, override `LIT_DOCX_PYTHON` (was
  `LITOPENCODE_OFFICE_PYTHON`), notice names the skill. `run.py doctor` stays: it is the skill's own readiness check.
- `scripts/craft_docx.py`: temp-folder prefix renamed.
- `SKILL.md`: runtime, cache and route text as for lit-pptx.

## lit-diagram-drawer

- The humanizer detector the visible-text check calls used to be read from `../lit-humanizer`. Its four files
  (`detect.mjs`, `core.mjs`, `extract_office_text.py`, `rules.json`) and its `NOTICE` now live in `scripts/humanizer/`.
  `detect.mjs` reads `rules.json` beside itself. Two edits from the source: the `code-ai-attribution` rule (commit
  trailers naming AI tools, which a diagram never carries) was left out, and `core.mjs` no longer names one other
  harness's state folder in its internal-path list.
- The browser-driver probe used to be imported from `../../browser-drive`. It is now `scripts/lib/browser-driver-probe.mjs`,
  and its run-as-script guard matches its own file name (the old guard also matched the diagram skill's
  `capability-probe.mjs` and printed a stray line before the JSON report).
- `SKILL.md` and `references/export.md`: product name and route text replaced.
- Checked: `scripts/capability-probe.mjs` reports `ready: true`, the seven `scripts/test-*.mjs` and `verify-coverage.mjs`
  exit 0, and `verify-diagram.mjs` passes an example.

## lit-schematic

- Pretendard used to be read from the sibling `lit-diagram-drawer`. `assets/fonts/` now holds the unmodified
  `PretendardVariable.woff2`, `OFL.txt` and `provenance.json`; `scripts/lib/fonts.mjs` reads it from there.
- `SKILL.md`: product name and route text replaced.
- Checked: `scripts/doctor.mjs` prints `DOCTOR PASS` with the font from the skill; a scaffolded P&ID builds, `qa.mjs`
  prints `QA PASS`, and `render.mjs` writes a 600 dpi PNG.

## lit-scientific-visualization

- The unchanged copy was `SKILL.md` alone; it pointed at `../../vendor/scientific-visualization`. The 16 source files now
  ship in `canonical/`, byte for byte, with `LICENSE-scientific-visualization.txt` and a `PROVENANCE.md` carrying the
  source commit and every hash. The source's `SKILL.md` is stored as `canonical/SOURCE-SKILL.md` so OpenCode does not
  list it as a second skill. `canonical/SHA256SUMS` makes `shasum -a 256 -c SHA256SUMS` the integrity check.
- `SKILL.md`: `exact_source_root` is `canonical`; every path points there; the product's installer rewrite, doctor
  READY/DEGRADED line, completion hook and banner are replaced by a manual `python3 -c "import matplotlib"` capability
  check; the description says when to use it instead of naming product routes.
- Checked: all 16 hashes match; the two upstream test files pass (11 tests).

## frontend-ui-ux

- `kit/fonts.json` used to copy fonts from `../../lit-diagram-drawer` and `../../lit-typographic-motion`. The four files
  now ship in `kit/fonts/` with the same SHA-256 values, and `design-lock.mjs` errors name that folder.
- `scripts/probe.mjs` spawned `../../browser-drive/scripts/capability-probe.mjs`; it now spawns
  `scripts/browser-driver-probe.mjs` (the same probe, run-as-script guard on its own name).
- `references/complete-contract.md`: the product's generated-marker metadata, product test commands, managed manifest,
  installer and doctor transcript are replaced by an install verification any user can run (corpus verifier, validator
  exits 0/1/2, `diff -r`, `opencode debug skill`).
- `SKILL.md`: product hook routes removed; one paragraph says the upstream design corpus is pinned byte for byte (its
  verifier fails on any edit), and where that text names another coding agent or its tools, read it as OpenCode.
- Not edited on purpose: the 171 files `scripts/verify-canonical-corpus.mjs` pins. They are upstream text under their
  own licence and still pass that verifier.
- Checked: the corpus verifier reports `ok: true`; `design-lock.mjs init --scaffold` writes the kit fonts; `probe.mjs`
  finds the browser driver and captures all seven viewports.

## visual-qa

- `references/complete-contract.md`: product test commands, managed manifest, installer and doctor transcript and the
  product config file name are replaced by an install verification any user can run. The three validator outputs shown
  there were run against this folder.
- `SKILL.md` and two script comments: product name and hook routes removed.

## lit-typographic-motion

- The runtime installer was a product command, `litopencode motion-runtime install|status`. `runtime.mjs` is now the
  skill's own: `node <skill>/runtime.mjs install|status [--audio] [--word-timing] [--json]`, caching under
  `XDG_CACHE_HOME/opencode-skills/lit-typographic-motion/`. Every BLOCKED message names that command with the
  installed path, so a first render without the runtime tells the user exactly what to run.
- `LITOPENCODE_MOTION_MIRROR` became `LIT_MOTION_FONT_MIRROR`, `LITOPENCODE_BLENDER` became `LIT_MOTION_BLENDER`
  (`MOTION_PYTHON` stays).
- The Hangul pair used to be read from `../lit-pptx/pretendard-font`. The unmodified Pretendard 1.3.9 Regular and Bold and
  their licence now ship in `fonts/pretendard/`; `fonts/pins.json` calls the pair `pretendardPair`, and the report says
  `Hangul body: bundled`.
- The done check required `.run/image-reads.jsonl`, which only the product's tool hook wrote, so a standalone copy could
  never reach DONE inside OpenCode. The read check now applies only when such a log exists; otherwise the done check
  relies on the look rounds `render.mjs look` stamps with each frame's SHA-256, and the reply names the stills opened.
- Recipe notes and `references/cover.md` named a product QA tool (`tools/qa-cover-recipes.mjs`); they now describe the
  rows as a reference for a re-render with `render.mjs cover`. The recipes keep their measured rows, so their brand
  words (the projects they were first made for) were left as rendered; `cover.md` says to replace them.
- `SKILL.md`, `references/runtime.md`, `THIRD_PARTY_NOTICES` and comments: commands, cache paths, font locations and
  route text updated to match.
- Checked: `runtime.mjs status`, then `runtime.mjs install` into a scratch cache (fonts verified against their pins,
  pinned packages installed), then `render.mjs styles` drew all four house-style boards with `board check PASS`.

## readme-studio

- `SKILL.md`: the product's managed install and doctor line, the `doctor-install` feature id and the banner line are
  replaced by the copy instruction (the whole folder, so the templates run). Everything else was already inside the
  folder.
