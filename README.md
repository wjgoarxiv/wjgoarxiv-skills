# wjgoarxiv-skills

Content-production skills that used to ship inside the LitFamily products. Each family is one Claude Code plugin
in this marketplace, so you install only the ones you use. The products keep a small same-name stub for each moved
skill that says what it did and how to install it here.

This is a local pilot. It has no remote yet; the GitHub install form arrives when the repository is published.

## Plugins

| Plugin | Skills | What it makes | Moved from |
| --- | --- | --- | --- |
| `decks` | `lit-pptx` | A finished PowerPoint deck (.pptx): a design direction for the audience and content, Markdown slide source, native editable charts, embedded Pretendard fonts, a QA gate and rendered-page review | LitClaude `fc0fe5d` (1.0.48) |

Families still to move, one per product release: `documents` (lit-docx), `video-covers` (lit-typographic-motion,
readme-studio), `design` (frontend-ui-ux, visual-qa) and `figures` (lit-diagram-drawer, lit-schematic,
lit-scientific-visualization, scientific-visualization).

## Install in Claude Code

From a local clone (today):

```bash
claude plugin marketplace add <path to your wjgoarxiv-skills clone>
claude plugin install decks@wjgoarxiv-skills
```

Inside a session the same thing is `/plugin marketplace add <path>` and then `/plugin install decks@wjgoarxiv-skills`.
After publication the marketplace line becomes `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`.

The skill then answers as `decks:lit-pptx`. LitClaude's own `lit` routing for decks keeps working: the stub it
loads points at this skill when it is installed.

## Layout

```
.claude-plugin/marketplace.json     one entry per family plugin
plugins/<family>/.claude-plugin/plugin.json
plugins/<family>/skills/<id>/       the skill folder, copied unchanged
plugins/<family>/lib/               the shared runtime files the skill reaches as ../../lib, copied unchanged
plugins/<family>/LICENSE            the licence the files came under
receipts/<family>.sha256            sha256, source path, destination path for every copied file
test/                               node --test checks for manifests and receipts
```

`decks` carries 16 files of LitClaude's office runtime under `lib/`: the first-use installer
(`office-runtime.mjs` and its lockfiles), the Python bootstrap, the data, integrity, render and mark helpers, and
the modules they import. LitClaude keeps its own copy for lit-docx. The pinned runtime installs on first use into
`${XDG_CACHE_HOME:-~/.cache}/litclaude/office-runtime`, the same cache LitClaude uses, so a machine with both does
not install it twice.

## Rules for this repository

- A moved skill is copied byte for byte. Its receipt must match, and `npm test` checks that.
- A family moves in one release of its product, together with the product's stub.
- Each family plugin works without any LitFamily product installed.

## Check

```bash
npm test
claude plugin validate .
claude plugin validate plugins/decks
```
