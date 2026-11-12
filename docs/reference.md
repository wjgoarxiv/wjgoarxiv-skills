<p align="right"><b>English</b> · <a href="reference_ko-KR.md">한국어</a></p>

# Reference

These are the maintainer inventories behind the [README](../README.md): where every file lives, what each family plugin
carries beyond its skills, and the rules a change follows. A first-time user does not need any of it.

## Repository layout

Every path below is relative to the repository root.

```text
README.md, README_ko-KR.md          this page in English and Korean
docs/assets/                        the cover, diagrams, schematics and family slices shown on this page
.claude-plugin/marketplace.json     one entry per family plugin
plugins/<family>/.claude-plugin/plugin.json
plugins/<family>/skills/<id>/       the skill folder, copied unchanged
plugins/<family>/lib/               the shared runtime files the skill reaches as ../../lib, copied unchanged
plugins/<family>/bin/, vendor/      (figures) the doctor and the canonical source the adapter reaches as ../../bin and ../../vendor
plugins/<family>/LICENSE            the licence the files came under
receipts/<family>.sha256            sha256, source path, destination path for every copied file
variants/<product>/<id>/            another product's own edition of a moved skill, made to run on its own
variants/<product>/CHANGES.md       what changed in that edition after the unchanged copy, and why
receipts/variants-<product>.sha256  sha256, source path at that product's commit, destination path of the unchanged copy
test/                               node --test checks for manifests, receipts and the pick-one table
```

In that tree, "this page" means the README, and `docs/` now also holds this reference page and its Korean twin.

## What each family carries

A LitClaude skill often reads files outside its own folder, so each family plugin carries those files too, unchanged and
at the same relative places. Folders listed here without a `SKILL.md` are support folders; none of them is a skill.

### `decks` and `documents`

`decks` carries 16 files of LitClaude's office runtime under `lib/`: the first-use installer (`office-runtime.mjs` and
its lockfiles), the Python bootstrap, the data, integrity, render and mark helpers, and the modules they import.
`documents` carries the same 16 files for lit-docx. LitClaude itself no longer ships the office runtime.

| Fact | Detail |
| --- | --- |
| Install place | The pinned runtime installs on first use into `${XDG_CACHE_HOME:-~/.cache}/litclaude/office-runtime` |
| Shared cache | The same cache older LitClaude releases used, so a machine with `decks`, `documents` and an older LitClaude installs it only once |
| The one difference | `office-runtime.mjs`: in `documents`, its status reads `ready` once the Python half that lit-docx uses is installed |

### `figures`

`figures` carries what its three skills reach outside their own folders:
- **`lib/`:** the mark helper and the modules it imports, plus `npm-invocation.mjs` for the diagram renderer.
- **`skills/lit-humanizer/`:** only `rules.json` and four scripts, which the diagram verifier and doctor run on visible
  text. There is no `SKILL.md`, so it is not a skill here; the full lit-humanizer stays in the LitFamily products.
- **`vendor/scientific-visualization/`:** the 16-file source `lit-scientific-visualization` reads before plotting, with
  its provenance and MIT licence.
- **`bin/litclaude-scientific-visualization-doctor.js` and `lib/bundled-skills-integrity.mjs`:** the read-only doctor.
  Its integrity check also covers `vendor/handoff/` (4 files, with provenance and licence), so that copy is here too,
  even though nothing else uses it.

lit-schematic looks for Pretendard first in `lit-diagram-drawer/assets/fonts/`, which `figures` carries. Its second
place, `lit-pptx/fonts/`, was not copied.

### `design`

`design` carries what frontend-ui-ux and visual-qa reach outside their own folders:
- **`lib/`:** `strict-json.mjs`, `rename-aliases.mjs` and `secret-shapes.mjs`, which the probe, the evidence checker and
  the review rules import.
- **`skills/browser-drive/scripts/capability-probe.mjs`:** the interface probe uses it to find and check the browser
  driver. There is no `SKILL.md` next to it; browser-drive itself stays in the LitFamily products.
- **`skills/lit-diagram-drawer/assets/fonts/` and `skills/lit-typographic-motion/fonts/jetbrains-mono/`:** the
  Pretendard and JetBrains Mono fonts with their OFL licences, which the design kit's `kit/fonts.json` copies by path and
  checks by sha256. These folders have no `SKILL.md` either.

LitClaude keeps a copy of the interface probe scripts in its frontend-ui-ux stub, because its lit workflows check
web-interface edits with that probe.

### `video-covers`

`video-covers` carries what lit-typographic-motion and readme-studio reach outside their own folders:
- **`lib/`:** the mark helper (`mark.mjs`, `mark-logo.png`, `output_mark.py`) that draws the cover mark and the end card,
  plus `project-state-root.mjs` and the three `rules/` modules it imports.
- **`skills/lit-pptx/fonts/pretendard/`:** Pretendard Regular and Bold with their OFL licence, which the film engine's
  `fonts/manifest.json` reads by path and checks by sha256. There is no `SKILL.md` there; lit-pptx itself lives in
  `decks`.

The parts of the moved lit-typographic-motion text that describe LitClaude-only pieces are listed in the README under
[Running the film skill outside LitClaude](../README.md#video-covers).

## Rules for this repository

These rules keep every copy provable against its source, and keep users on the newest copy.

- **Byte-for-byte skills.** A moved skill is copied byte for byte. Its receipt must match, and `npm test` checks that.
  The one exception is a line that runs a product command the product later removed; it is listed under
  [Edited after the move](../README.md#edited-after-the-move) and its receipt row carries `edited-from:<sha256>`.
- **Byte-for-byte editions first.** A harness edition under `variants/` first goes in byte for byte from the product
  commit that last shipped it, with a receipt row per file, committed together with its receipt. Changes that make it
  run on its own come in later, separate commits and are listed in that product's `CHANGES.md`.
- **Stub lines move together.** When a product stub's install lines change, the pick-one table and the per-harness
  notes change in the same commit, and so does `test/stub-install-lines.json`, which `npm test` checks them against.
- **Every content change bumps the version.** Every content change to a family plugin bumps `version` in its
  `plugins/<family>/.claude-plugin/plugin.json`. `claude plugin update` installs a new copy only when that version
  changes, so an unbumped change never reaches anyone who already has the plugin. If the family's marketplace entry ever
  carries a `version`, it changes with it.
- **One release per family move.** A family moves in one release of its product, together with the product's stub.
- **No product needed.** Each family plugin works without any LitFamily product installed.
