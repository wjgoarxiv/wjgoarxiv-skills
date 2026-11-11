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

Families still to move, one per product release: `video-covers` (lit-typographic-motion,
readme-studio) and `design` (frontend-ui-ux, visual-qa).

## Install in Claude Code

From a local clone (today):

```bash
claude plugin marketplace add <path to your wjgoarxiv-skills clone>
claude plugin install decks@wjgoarxiv-skills
claude plugin install documents@wjgoarxiv-skills
claude plugin install figures@wjgoarxiv-skills
```

Inside a session the same thing is `/plugin marketplace add <path>` and then `/plugin install decks@wjgoarxiv-skills`.
After publication the marketplace line becomes `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`.

The skills then answer as `decks:lit-pptx`, `documents:lit-docx`, `figures:lit-diagram-drawer` and
`figures:lit-schematic`. `lit-scientific-visualization` is user-invoked only, as it was in LitClaude: type
`/figures:lit-scientific-visualization <request>`. LitClaude's own `lit` routing for decks, documents and figures keeps
working: the stub it loads points at the moved skill when it is installed.

## Layout

```
.claude-plugin/marketplace.json     one entry per family plugin
plugins/<family>/.claude-plugin/plugin.json
plugins/<family>/skills/<id>/       the skill folder, copied unchanged
plugins/<family>/lib/               the shared runtime files the skill reaches as ../../lib, copied unchanged
plugins/<family>/bin/, vendor/      (figures) the doctor and the canonical source the adapter reaches as ../../bin and ../../vendor
plugins/<family>/LICENSE            the licence the files came under
receipts/<family>.sha256            sha256, source path, destination path for every copied file
test/                               node --test checks for manifests and receipts
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

lit-schematic looks for Pretendard first in `lit-diagram-drawer/assets/fonts/`, which `figures` carries; its second
place, `lit-pptx/fonts/`, is not copied.

## Rules for this repository

- A moved skill is copied byte for byte. Its receipt must match, and `npm test` checks that.
- A family moves in one release of its product, together with the product's stub.
- Each family plugin works without any LitFamily product installed.

## Check

```bash
npm test
claude plugin validate .
claude plugin validate plugins/decks
claude plugin validate plugins/documents
claude plugin validate plugins/figures
```
