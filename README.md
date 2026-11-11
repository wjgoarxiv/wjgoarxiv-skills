# wjgoarxiv-skills

Content-production skills that used to ship inside the LitFamily products. Each family is one Claude Code plugin
in this marketplace, so you install only the ones you use. The products keep a small same-name stub for each moved
skill that says what it did and how to install it here.

This is a local pilot. It has no remote yet; the GitHub install form arrives when the repository is published.

## Plugins

| Plugin | Skills | What it makes | Moved from |
| --- | --- | --- | --- |
| `decks` | `lit-pptx` | A finished PowerPoint deck (.pptx): a design direction for the audience and content, Markdown slide source, native editable charts, embedded Pretendard fonts, a QA gate and rendered-page review | LitClaude `fc0fe5d` (1.0.48) |
| `documents` | `lit-docx` | A finished Word document (.docx): report, brief, manual, proposal, memo or journal manuscript in a tonality chosen for the content or a named publisher profile, DOCX/PDF to Markdown, in-place edits of an existing .docx, PDF render, and a QA gate with rendered pages | LitClaude `8c736ce` (1.0.49 plus the decks move) |
| `figures` | `lit-diagram-drawer`, `lit-schematic`, `lit-scientific-visualization` | Conceptual and technical diagrams as HTML/SVG with PNG and Office-safe SVG export; physical schematics (P&ID, PFD, BFD, equipment layout, apparatus figure, isometric cutaway) as millimetre-sized SVG with a QA gate and 600 dpi render; publication plots of measured data from the scientific-visualization source the plot skill adapts | LitClaude `2381bfe` (files identical to 1.0.49) |
| `design` | `frontend-ui-ux`, `visual-qa` | Interfaces built and inspected from one locked house style, layout family and design kit, with a design contract, a design-intelligence database and an interface probe across the responsive matrix; verification of a built interface with captured screenshots at several viewports and states, an evidence manifest and a blocker contract | LitClaude `aaea364` (files identical to 1.0.49) |
| `video-covers` | `lit-typographic-motion`, `readme-studio` | Finished short films (kinetic type, lyric or quote videos, title sequences, stage films) and silent, seamless README cover loops, planned as a treatment with a storyboard board round, scored, look-checked and gated; factual READMEs built from the repository with an inspected cover, outlined title type and an optional motion cover | LitClaude `4d03ca8` (files identical to 1.0.49) |

## Install in Claude Code

From a local clone (today):

```bash
claude plugin marketplace add <path to your wjgoarxiv-skills clone>
claude plugin install decks@wjgoarxiv-skills
claude plugin install documents@wjgoarxiv-skills
claude plugin install figures@wjgoarxiv-skills
claude plugin install design@wjgoarxiv-skills
claude plugin install video-covers@wjgoarxiv-skills
```

Inside a session the same thing is `/plugin marketplace add <path>` and then `/plugin install decks@wjgoarxiv-skills`.
After publication the marketplace line becomes `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`.

The skills then answer as `decks:lit-pptx`, `documents:lit-docx`, `figures:lit-diagram-drawer`,
`figures:lit-schematic`, `design:frontend-ui-ux`, `design:visual-qa`, `video-covers:lit-typographic-motion` and
`video-covers:readme-studio`. `lit-scientific-visualization` is user-invoked only, as it was in LitClaude: type
`/figures:lit-scientific-visualization <request>`. LitClaude's own `lit` routing for decks, documents, figures, interfaces, films and READMEs keeps
working: the stub it loads points at the moved skill when it is installed.

## Pick one skill for one harness

Find the skill in the left column and your harness along the top. The cell holds the install lines that harness's
LitFamily stub gives for that skill, unchanged, so the stub and this table say the same thing. Replace
`<path to your wjgoarxiv-skills clone>` with your local clone; the repository has no public address yet.

Claude Code installs the whole family plugin, because LitClaude's copies reach shared files beside them (`lib/`,
`vendor/`, support folders); only that family installs. Every other harness installs one folder: its product's own
edition of that skill from `variants/<product>/<id>/`, which carries everything it reads inside the folder. Grok Build
takes the folder as a one-skill plugin, Muse Code through `muse skills install`, and Codex CLI, OpenCode, Antigravity
CLI and Hermes Agent by copying it into their skills folder. The OpenCode line replaces the LitOpenCode stub folder of
the same name; the other copies sit beside their product's stub under a different name, and each product's installer
leaves them alone on upgrade.

| Skill | Family | Claude Code | Codex CLI | OpenCode | Grok Build | Muse Code | Antigravity CLI | Hermes Agent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `lit-pptx` | `decks` | `claude plugin marketplace add <path to your wjgoarxiv-skills clone>`<br>`claude plugin install decks@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-pptx" "${CODEX_HOME:-$HOME/.codex}/skills/lit-pptx"` | `rm -r ~/.config/opencode/skills/lit-pptx`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-pptx" ~/.config/opencode/skills/lit-pptx` | `grok plugin install "<path to your wjgoarxiv-skills clone>#variants/litgrok/lit-pptx" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-pptx --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-pptx" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `lit-docx` | `documents` | `claude plugin marketplace add <path to your wjgoarxiv-skills clone>`<br>`claude plugin install documents@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-docx" "${CODEX_HOME:-$HOME/.codex}/skills/lit-docx"` | `rm -r ~/.config/opencode/skills/lit-docx`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-docx" ~/.config/opencode/skills/lit-docx` | `grok plugin install "<path to your wjgoarxiv-skills clone>#variants/litgrok/lit-docx" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-docx --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-docx" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-docx" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `lit-diagram-drawer` | `figures` | `claude plugin marketplace add <path to your wjgoarxiv-skills clone>`<br>`claude plugin install figures@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-diagram-drawer" "${CODEX_HOME:-$HOME/.codex}/skills/lit-diagram-drawer"` | `rm -r ~/.config/opencode/skills/lit-diagram-drawer`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-diagram-drawer" ~/.config/opencode/skills/lit-diagram-drawer` | `grok plugin install "<path to your wjgoarxiv-skills clone>#variants/litgrok/lit-diagram-drawer" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-diagram-drawer --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-diagram-drawer" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-diagram-drawer" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `lit-schematic` | `figures` | `claude plugin marketplace add <path to your wjgoarxiv-skills clone>`<br>`claude plugin install figures@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-schematic" "${CODEX_HOME:-$HOME/.codex}/skills/lit-schematic"` | `rm -r ~/.config/opencode/skills/lit-schematic`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-schematic" ~/.config/opencode/skills/lit-schematic` | `grok plugin install "<path to your wjgoarxiv-skills clone>#variants/litgrok/lit-schematic" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-schematic --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-schematic" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-schematic" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `lit-scientific-visualization` | `figures` | `claude plugin marketplace add <path to your wjgoarxiv-skills clone>`<br>`claude plugin install figures@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-scientific-visualization" "${CODEX_HOME:-$HOME/.codex}/skills/lit-scientific-visualization"` | `rm -r ~/.config/opencode/skills/lit-scientific-visualization`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-scientific-visualization" ~/.config/opencode/skills/lit-scientific-visualization` | `grok plugin install "<path to your wjgoarxiv-skills clone>#variants/litgrok/lit-scientific-visualization" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-scientific-visualization --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-scientific-visualization" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-scientific-visualization" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `frontend-ui-ux` | `design` | `claude plugin marketplace add <path to your wjgoarxiv-skills clone>`<br>`claude plugin install design@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/frontend-ui-ux" "${CODEX_HOME:-$HOME/.codex}/skills/frontend-ui-ux"` | `rm -r ~/.config/opencode/skills/frontend-ui-ux`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/frontend-ui-ux" ~/.config/opencode/skills/frontend-ui-ux` | `grok plugin install "<path to your wjgoarxiv-skills clone>#variants/litgrok/frontend-ui-ux" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/frontend-ui-ux --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/frontend-ui-ux" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/frontend-ui-ux" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `visual-qa` | `design` | `claude plugin marketplace add <path to your wjgoarxiv-skills clone>`<br>`claude plugin install design@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/visual-qa" "${CODEX_HOME:-$HOME/.codex}/skills/visual-qa"` | `rm -r ~/.config/opencode/skills/visual-qa`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/visual-qa" ~/.config/opencode/skills/visual-qa` | `grok plugin install "<path to your wjgoarxiv-skills clone>#variants/litgrok/visual-qa" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/visual-qa --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/visual-qa" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/visual-qa" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `lit-typographic-motion` | `video-covers` | `claude plugin marketplace add <path to your wjgoarxiv-skills clone>`<br>`claude plugin install video-covers@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-typographic-motion" "${CODEX_HOME:-$HOME/.codex}/skills/lit-typographic-motion"` | `rm -r ~/.config/opencode/skills/lit-typographic-motion`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-typographic-motion" ~/.config/opencode/skills/lit-typographic-motion` | `grok plugin install "<path to your wjgoarxiv-skills clone>#variants/litgrok/lit-typographic-motion" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-typographic-motion --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-typographic-motion" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-typographic-motion" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `readme-studio` | `video-covers` | `claude plugin marketplace add <path to your wjgoarxiv-skills clone>`<br>`claude plugin install video-covers@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/readme-studio" "${CODEX_HOME:-$HOME/.codex}/skills/readme-studio"` | `rm -r ~/.config/opencode/skills/readme-studio`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/readme-studio" ~/.config/opencode/skills/readme-studio` | `grok plugin install "<path to your wjgoarxiv-skills clone>#variants/litgrok/readme-studio" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/readme-studio --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/readme-studio" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/readme-studio" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |

`lit-scientific-visualization` is an adapter for the scientific-visualization source. The family plugin keeps that
source in `plugins/figures/vendor/scientific-visualization/`; every edition under `variants/` carries its own copy
inside the skill folder, so one line installs both. The Antigravity stubs also give a workspace-only form of the same
copy into `.agents/skills/`, and the OpenCode film stub adds one runtime step after the copy:
`node ~/.config/opencode/skills/lit-typographic-motion/runtime.mjs install`. The other editions install their engines
on first use.

`npm test` checks this table against the marketplace: one row for every skill a family plugin ships, the lines each
stub gives, and that every folder a line names exists here.

## Harness editions (`variants/`)

The family plugins hold LitClaude's copies, written for Claude Code. Six other products shipped their own edition of
the same nine skills, in their own harness's words, before they moved them out. Each edition first went in unchanged
under `variants/<product>/<id>/`, copied byte for byte from the product commit that last shipped it, with one receipt
per product in `receipts/variants-<product>.sha256`.

| Folder | Harness | Copied from |
| --- | --- | --- |
| `variants/litcodex/` | Codex CLI | LitCodex `b82ad1c` (1.0.38 plus the skills lock), `plugins/litcodex/skills/<id>/` |
| `variants/litopencode/` | OpenCode | LitOpenCode `dc56845` (1.0.43 plus the skills lock), `skills/<id>/` |
| `variants/litgrok/` | Grok Build | LitGrok `8fd2c96` (1.0.34 plus the skills lock), `.grok/skills/<id>/` |
| `variants/litgravity/` | Antigravity CLI | LitGravity `9f2533c` (0.1.8 plus the skills lock), `plugin/skills/<id>/` |
| `variants/litmuse/` | Muse Code | LitMuse `e966b07` (0.1.11 plus the skills lock), `plugin/skills/<id>/` |
| `variants/lithermes/` | Hermes Agent | LitHermes `a2466f2` (1.0.39 plus the skills lock), `packages/lithermes-installer/assets/lithermes-plugin/skills/<id>/` |

Inside its product, each edition leaned on parts of that product a one-folder install does not bring: runtime
commands, environment variables, hooks and done gates, doctor lines, agent definitions, and files in sibling skills or
the product's shared `lib/` and `vendor/` folders. A later commit per product made each folder work on its own: it
copies the files it reads into the folder, replaces product commands with scripts inside the folder, and drops every
path that leaves the folder. `variants/<product>/CHANGES.md` lists each change and its reason. The procedures,
references, engines and QA gates stay; the Codex edition dropped the tests that drove LitCodex's plugin internals.

Some internal names stay on purpose, because measured expectations or saved files depend on them: schema ids such as
`litfamily.*` and the product-prefixed ones, the brand word in sample cover recipes, and (in the Codex edition) the
`LITCODEX_*` knobs and error codes of its own scripts. Third-party corpora pinned by hash, such as frontend-ui-ux's
`references/_canonical-corpus/`, are unchanged and may name other coding agents.

## Layout

```
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

`decks` carries 16 files of LitClaude's office runtime under `lib/`: the first-use installer
(`office-runtime.mjs` and its lockfiles), the Python bootstrap, the data, integrity, render and mark helpers, and
the modules they import. `documents` carries the same 16 files for lit-docx; LitClaude no longer ships the office
runtime itself. The pinned runtime installs on first use into
`${XDG_CACHE_HOME:-~/.cache}/litclaude/office-runtime`, the cache older LitClaude releases used, so a machine with
`decks`, `documents` and an older LitClaude installs it once. The two copies differ only in `office-runtime.mjs`: in
`documents` its status reads `ready` once the Python half lit-docx uses is installed.

`figures` carries what its three skills reach outside their own folders, unchanged, at the same relative places:
- `lib/`: the mark helper and the modules it imports, and `npm-invocation.mjs` for the diagram renderer;
- `skills/lit-humanizer/`: only `rules.json` and four scripts, which the diagram verifier and doctor run on visible
  text. It has no `SKILL.md`, so it is not a skill here; the full lit-humanizer stays in the LitFamily products;
- `vendor/scientific-visualization/`: the 16-file source `lit-scientific-visualization` reads before plotting, with
  its provenance and MIT licence;
- `bin/litclaude-scientific-visualization-doctor.js` and `lib/bundled-skills-integrity.mjs`: the read-only doctor.
  Its integrity check also covers `vendor/handoff/` (4 files, with provenance and licence), so that copy is here too,
  unused by anything else.

`design` carries what frontend-ui-ux and visual-qa reach outside their own folders, unchanged, at the same relative
places:
- `lib/`: `strict-json.mjs`, `rename-aliases.mjs` and `secret-shapes.mjs`, which the probe, the evidence checker and the
  review rules import;
- `skills/browser-drive/scripts/capability-probe.mjs`: the interface probe finds and checks the browser driver with it.
  There is no `SKILL.md` beside it; browser-drive itself stays in the LitFamily products;
- `skills/lit-diagram-drawer/assets/fonts/` and `skills/lit-typographic-motion/fonts/jetbrains-mono/`: the Pretendard
  and JetBrains Mono fonts with their OFL licences, which the design kit's `kit/fonts.json` copies by path and checks by
  sha256. These folders have no `SKILL.md` either.

frontend-ui-ux's own `LICENSE` (MIT) and `THIRD-PARTY-NOTICE.txt` cover its design data, and its
`references/_canonical-corpus/legal/` holds the Apache-2.0 licence of the reference corpus, so the plugin declares
`MIT AND Apache-2.0`. LitClaude keeps a copy of the interface probe scripts in its frontend-ui-ux stub, because its
lit workflows check web-interface edits with that probe.

`video-covers` carries what lit-typographic-motion and readme-studio reach outside their own folders, unchanged, at
the same relative places:
- `lib/`: the mark helper (`mark.mjs`, `mark-logo.png`, `output_mark.py`) that draws the cover mark and the end card,
  and `project-state-root.mjs` with the three `rules/` modules it imports;
- `skills/lit-pptx/fonts/pretendard/`: Pretendard Regular and Bold with their OFL licence, which the film engine's
  `fonts/manifest.json` reads by path and checks by sha256. There is no `SKILL.md` there; lit-pptx itself is in
  `decks`. The OFL fonts are why the plugin declares `MIT AND OFL-1.1`.

The moved lit-typographic-motion text was written for LitClaude, and a few of its lines describe LitClaude parts
that do not come with this plugin:
- `SKILL.md`, `references/look.md` and `references/cover.md` say a Stop hook checks the done list and holds the turn.
  That check was a LitClaude hook and does not run outside LitClaude; the skill's own `motion.mjs gate` and its done
  list still apply, and nothing ends the turn for you.
- The text and the BLOCKED 14 message name `litclaude-ai motion-runtime install`. Outside LitClaude, and in
  LitClaude releases after 1.0.49, run the same installer straight from the plugin:
  `node <plugin>/skills/lit-typographic-motion/scripts/motion-runtime.mjs install` (or `status`). It installs into
  `${XDG_CACHE_HOME:-~/.cache}/litclaude/motion-runtime`, the cache LitClaude used, so a machine that pre-warmed it
  with LitClaude 1.0.49 or earlier needs nothing new.
- `recipes/painted-light/expected.json` names a test fixture from the LitClaude repository; that fixture is not
  carried, so the recipe's reference image is a description only.

lit-schematic looks for Pretendard first in `lit-diagram-drawer/assets/fonts/`, which `figures` carries; its second
place, `lit-pptx/fonts/`, is not copied.

## Rules for this repository

- A moved skill is copied byte for byte. Its receipt must match, and `npm test` checks that.
- A harness edition under `variants/` first goes in byte for byte from the product commit that last shipped it, with a
  receipt row per file, committed together with its receipt. Changes that make it run on its own come in later,
  separate commits and are listed in that product's `CHANGES.md`.
- When a product stub's install line changes, the pick-one table changes in the same commit.
- A family moves in one release of its product, together with the product's stub.
- Each family plugin works without any LitFamily product installed.

## Check

```bash
npm test
claude plugin validate .
claude plugin validate plugins/decks
claude plugin validate plugins/documents
claude plugin validate plugins/figures
claude plugin validate plugins/design
claude plugin validate plugins/video-covers
```
