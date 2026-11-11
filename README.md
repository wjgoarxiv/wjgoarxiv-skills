<p align="right"><b>English</b> · <a href="README_ko-KR.md">한국어</a></p>

<p align="center">
  <a href="docs/assets/cover/cover-dark.mp4">
    <picture>
      <source media="(prefers-reduced-motion: reduce) and (prefers-color-scheme: dark)" srcset="docs/assets/cover/poster-dark.webp">
      <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/cover/poster-light.webp">
      <source media="(prefers-color-scheme: dark)" srcset="docs/assets/cover/cover-dark.webp">
      <source media="(prefers-color-scheme: light)" srcset="docs/assets/cover/cover-light.webp">
      <img src="docs/assets/cover/cover-dark.webp" width="960" alt="A shelf of nine skills (decks, documents, figures, design, video covers) sends one skill at a time along a wire to one of seven coding agents: Claude Code, Codex CLI, OpenCode, Grok Build, Muse Code, Antigravity and Hermes Agent.">
    </picture>
  </a>
</p>

<p align="center">
  <b>One shelf of skills for seven coding agents.</b><br>
  Decks, documents, figures, interfaces, films and READMEs, installed one family or one folder at a time.<br>
  <sub>Silent cover film: <a href="docs/assets/cover/cover-dark.mp4">dark MP4</a> · <a href="docs/assets/cover/cover-light.mp4">light MP4</a></sub>
</p>

# wjgoarxiv-skills

These nine skills grew up inside LitFamily, my set of add-ons that brings one way of working (plans, loops, goals,
reviews) to seven coding agents. Over time they turned into the heaviest part of every product: a deck builder with its
own office runtime, a document studio, three kinds of figure, an interface kit and a film engine. Most people did not
need all of that on every install, and some wanted just one of them without the rest of LitFamily. So I kept LitFamily
itself light and moved the skills out here, unchanged. Each LitFamily product kept only a small stub with the same name,
which tells you what the skill does and how to install it from this shelf. You can use everything here without any
LitFamily product. Pick the one skill you want, for the agent you already use, and leave the rest on the shelf.

The repository is public at https://github.com/wjgoarxiv/wjgoarxiv-skills.

## The big picture

Every LitFamily product kept its core, plus one stub for each skill that moved out, and every stub points to one place
in this repository. Which place depends on the harness. LitClaude's copies lean on shared files sitting next to them
(`lib/`, `vendor/`, support folders), so on Claude Code you install a whole family plugin. The six other products each
had their own edition of the same nine skills, written for their own harness. Those editions now live under
`variants/<product>/<id>/`, one self-contained folder per skill.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/big-picture.en.dark.png">
    <img src="docs/assets/diagrams/big-picture.en.light.png" width="900" alt="Seven LitFamily products, each keeping its core and nine stubs, point into the wjgoarxiv-skills repository: LitClaude to five family plugins, the six others to their own edition folder under variants.">
  </picture>
</p>

## Inside: one request, five units, five gates

Here is the same shelf again, drawn as a process plant. A request comes in on the left and goes to the family that makes
that kind of file. Each family has its own quality gate, built from the checks its skills already run: overflow and
contrast for decks, integrity and prose lint for documents, the schematic QA gate and a look at the render for figures,
a viewport matrix for interfaces, and a flash audit and a seam check for films. A draft that passes leaves as the
deliverable. A draft that fails goes back for another pass. The stream table underneath is the whole repository in one
grid: which plugin, which skills, and what comes out.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/schematic/skill-plant.en.dark.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/assets/schematic/skill-plant.en.png">
    <img src="docs/assets/schematic/skill-plant.en.png" width="900" alt="Process flow diagram of wjgoarxiv-skills as a plant: a request is split to five family units. Each draft passes a QA analyser whose diverter valve sends it to the deliverable or back for rework. A stream table below lists each family's skills and outputs.">
  </picture>
</p>

## The five families

Each skill makes one kind of file, and some of them hand their output on to another skill. Charts and diagrams flow into
decks and documents, and a built interface flows into its check. I drew an arrow only where a skill's own `SKILL.md`
names the handoff. The dashed one is the exception: it is just a pairing that happens to suit a README.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/skill-map.en.dark.png">
    <img src="docs/assets/diagrams/skill-map.en.light.png" width="900" alt="Map of nine skills in five families and what each produces. lit-scientific-visualization hands chart PNGs to lit-docx and lit-pptx, lit-diagram-drawer hands diagram PNGs to lit-pptx, frontend-ui-ux hands a built interface to visual-qa, and a lit-typographic-motion cover loop pairs with readme-studio.">
  </picture>
</p>

The pictures on this page are samples too. The cover at the top is a silent, seamless README cover loop, exactly the
kind of thing `video-covers` makes. I drew and exported the big picture, the skill map and the install paths with
`lit-diagram-drawer`, and the plant and the manifold with `lit-schematic`.

### `decks`: slides people can still edit

`lit-pptx` builds a finished PowerPoint deck from a request, notes or source files. It picks a design direction for the
audience and the content first, then writes the slides in Markdown and compiles them with native, editable charts and
embedded Pretendard fonts. A QA gate looks for overflow, weak contrast and sparse or blank slides, and the rendered
pages get a review before the deck counts as done. Charts can come in from `lit-scientific-visualization`, and diagrams
from `lit-diagram-drawer`.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/decks.en.dark.png">
    <img src="docs/assets/families/decks.en.light.png" width="640" alt="Slice of the skill map: lit-diagram-drawer sends a diagram PNG and lit-scientific-visualization a chart PNG into lit-pptx, which makes a .pptx deck.">
  </picture>
</p>

Moved from LitClaude `fc0fe5d` (1.0.48).

### `documents`: Word files that look designed

`lit-docx` makes a finished Word document: a report, brief, manual, proposal, memo or journal manuscript. It picks a
tonality for the content, or follows a publisher profile you name (Elsevier, ACS, IEEE, Nature, or a Korean generic
style). It can also turn DOCX or PDF into clean Markdown, edit an existing .docx in place and render a PDF. At the end
it gates the result with integrity, prose and design checks on the rendered pages.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/documents.en.dark.png">
    <img src="docs/assets/families/documents.en.light.png" width="640" alt="Slice of the skill map: lit-scientific-visualization sends a chart PNG into lit-docx, which makes a .docx document.">
  </picture>
</p>

Moved from LitClaude `8c736ce` (1.0.49 plus the decks move).

### `figures`: three skills for three kinds of picture

Every figure starts with the same question: what is the reader actually looking at? Measured data becomes a plot, an
idea or a system becomes a diagram, and real hardware becomes a schematic. `lit-scientific-visualization` makes
publication plots of measured data, built on the scientific-visualization source it adapts. `lit-diagram-drawer` draws
conceptual and technical diagrams as HTML/SVG and exports PNG and Office-safe SVG for slides and documents.
`lit-schematic` draws physical equipment (P&ID, PFD, BFD, equipment layouts, apparatus figures, isometric cutaways) as
millimetre-sized SVG, with a QA gate and a 600 dpi render.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/figures.en.dark.png">
    <img src="docs/assets/families/figures.en.light.png" width="640" alt="Slice of the skill map: the figures family with lit-scientific-visualization, lit-diagram-drawer and lit-schematic, and the chart and diagram PNGs they hand to lit-docx and lit-pptx.">
  </picture>
</p>

Moved from LitClaude `2381bfe` (files identical to 1.0.49).

### `design`: build an interface, then check it

`frontend-ui-ux` builds and inspects interfaces from one locked house style, layout family and design kit. Behind it sit
a design contract, a design-intelligence database and an interface probe that runs across the responsive matrix. Once a
page exists, `visual-qa` takes over and verifies it. It exercises the page's states at several viewport sizes, captures
screenshots and writes an evidence manifest, and when something blocks a check, it names exactly what.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/design.en.dark.png">
    <img src="docs/assets/families/design.en.light.png" width="340" alt="Slice of the skill map: frontend-ui-ux builds an interface and hands the built interface to visual-qa, which writes a visual QA report.">
  </picture>
</p>

Moved from LitClaude `aaea364` (files identical to 1.0.49).

### `video-covers`: short films and the README they sit in

`lit-typographic-motion` directs a finished short film from a one-line request. It writes a treatment first, then runs a
storyboard round you can see before the full render, and then comes an original score, look rounds and a QA gate (flash
audit, legibility, determinism, sound). It handles kinetic type, lyric or quote videos, title sequences and stage films.
Its cover mode makes a silent, seamless README cover loop, like the one at the top of this page. `readme-studio` writes
factual READMEs from the repository itself, with an inspected cover, outlined title type and, if you want one, a motion
cover.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/video-covers.en.dark.png">
    <img src="docs/assets/families/video-covers.en.light.png" width="340" alt="Slice of the skill map: lit-typographic-motion makes films and cover loops, and a cover loop pairs with readme-studio, which makes a README.">
  </picture>
</p>

Moved from LitClaude `4d03ca8` (files identical to 1.0.49).

## Pick one skill for one harness

There are two ways in, and your agent decides which one you take. On Claude Code you add this marketplace and install
the family plugin. On every other harness you clone the repository once and copy a single folder.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/install-paths.en.dark.png">
    <img src="docs/assets/diagrams/install-paths.en.light.png" width="900" alt="Flowchart: pick a skill, then Claude Code adds the marketplace and installs the family plugin, while the six other harnesses clone the repository once and copy one folder with the command shown for Codex CLI, OpenCode, Grok Build, Muse Code, Antigravity CLI and Hermes Agent.">
  </picture>
</p>

Find your skill in the left column and your harness along the top. Each cell holds the install lines that harness's
LitFamily stub gives for that skill, copied as they are, so the stub and this table always say the same thing. Claude
Code installs straight from GitHub. The other harnesses copy from a local clone: run
`git clone https://github.com/wjgoarxiv/wjgoarxiv-skills` once, then replace `<path to your wjgoarxiv-skills clone>`
with that folder. The Grok Build cells carry the clone line because LitGrok's notes give it.

Claude Code installs the whole family plugin because LitClaude's copies reach into shared files next to them (`lib/`,
`vendor/`, support folders). Still, only that one family gets installed. Every other harness installs one folder: its
product's own edition of the skill from `variants/<product>/<id>/`, which carries everything it reads inside the folder.
Grok Build takes the folder path as a one-skill plugin and copies only that folder into its plugin store. (Give it a `#`
subfolder of the repository instead and it copies the whole repository, `.git` included, for each skill.) Muse Code
installs it through `muse skills install`, and Codex CLI, OpenCode, Antigravity CLI and Hermes Agent simply copy it into
their skills folder. The OpenCode line replaces the LitOpenCode stub folder of the same name. On the other harnesses the
copy sits next to its product's stub under a different name, and each product's installer leaves it alone on upgrade.

| Skill | Family | Claude Code | Codex CLI | OpenCode | Grok Build | Muse Code | Antigravity CLI | Hermes Agent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `lit-pptx` | `decks` | `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`<br>`claude plugin install decks@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-pptx" "${CODEX_HOME:-$HOME/.codex}/skills/lit-pptx"` | `rm -r ~/.config/opencode/skills/lit-pptx`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-pptx" ~/.config/opencode/skills/lit-pptx` | `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`<br>`grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-pptx" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-pptx --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-pptx" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `lit-docx` | `documents` | `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`<br>`claude plugin install documents@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-docx" "${CODEX_HOME:-$HOME/.codex}/skills/lit-docx"` | `rm -r ~/.config/opencode/skills/lit-docx`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-docx" ~/.config/opencode/skills/lit-docx` | `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`<br>`grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-docx" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-docx --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-docx" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-docx" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `lit-diagram-drawer` | `figures` | `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`<br>`claude plugin install figures@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-diagram-drawer" "${CODEX_HOME:-$HOME/.codex}/skills/lit-diagram-drawer"` | `rm -r ~/.config/opencode/skills/lit-diagram-drawer`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-diagram-drawer" ~/.config/opencode/skills/lit-diagram-drawer` | `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`<br>`grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-diagram-drawer" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-diagram-drawer --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-diagram-drawer" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-diagram-drawer" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `lit-schematic` | `figures` | `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`<br>`claude plugin install figures@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-schematic" "${CODEX_HOME:-$HOME/.codex}/skills/lit-schematic"` | `rm -r ~/.config/opencode/skills/lit-schematic`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-schematic" ~/.config/opencode/skills/lit-schematic` | `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`<br>`grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-schematic" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-schematic --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-schematic" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-schematic" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `lit-scientific-visualization` | `figures` | `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`<br>`claude plugin install figures@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-scientific-visualization" "${CODEX_HOME:-$HOME/.codex}/skills/lit-scientific-visualization"` | `rm -r ~/.config/opencode/skills/lit-scientific-visualization`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-scientific-visualization" ~/.config/opencode/skills/lit-scientific-visualization` | `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`<br>`grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-scientific-visualization" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-scientific-visualization --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-scientific-visualization" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-scientific-visualization" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `frontend-ui-ux` | `design` | `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`<br>`claude plugin install design@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/frontend-ui-ux" "${CODEX_HOME:-$HOME/.codex}/skills/frontend-ui-ux"` | `rm -r ~/.config/opencode/skills/frontend-ui-ux`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/frontend-ui-ux" ~/.config/opencode/skills/frontend-ui-ux` | `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`<br>`grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/frontend-ui-ux" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/frontend-ui-ux --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/frontend-ui-ux" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/frontend-ui-ux" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `visual-qa` | `design` | `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`<br>`claude plugin install design@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/visual-qa" "${CODEX_HOME:-$HOME/.codex}/skills/visual-qa"` | `rm -r ~/.config/opencode/skills/visual-qa`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/visual-qa" ~/.config/opencode/skills/visual-qa` | `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`<br>`grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/visual-qa" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/visual-qa --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/visual-qa" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/visual-qa" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `lit-typographic-motion` | `video-covers` | `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`<br>`claude plugin install video-covers@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-typographic-motion" "${CODEX_HOME:-$HOME/.codex}/skills/lit-typographic-motion"` | `rm -r ~/.config/opencode/skills/lit-typographic-motion`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-typographic-motion" ~/.config/opencode/skills/lit-typographic-motion` | `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`<br>`grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-typographic-motion" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-typographic-motion --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-typographic-motion" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-typographic-motion" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |
| `readme-studio` | `video-covers` | `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`<br>`claude plugin install video-covers@wjgoarxiv-skills` | `mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/readme-studio" "${CODEX_HOME:-$HOME/.codex}/skills/readme-studio"` | `rm -r ~/.config/opencode/skills/readme-studio`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/readme-studio" ~/.config/opencode/skills/readme-studio` | `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`<br>`grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/readme-studio" --trust` | `muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/readme-studio --scope user` | `mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/readme-studio" ~/.gemini/config/skills/` | `mkdir -p "${HERMES_HOME:-$HOME/.hermes}/skills"`<br>`cp -R "<path to your wjgoarxiv-skills clone>/variants/lithermes/readme-studio" "${HERMES_HOME:-$HOME/.hermes}/skills/"` |

`lit-scientific-visualization` is an adapter for the scientific-visualization source. The family plugin keeps that
source in `plugins/figures/vendor/scientific-visualization/`. Every edition under `variants/` carries its own copy
inside the skill folder, so one line installs both. The Antigravity stubs also give a workspace-only form of the same
copy into `.agents/skills/`, and the OpenCode film stub adds one runtime step after the copy:
`node ~/.config/opencode/skills/lit-typographic-motion/runtime.mjs install`. The other editions install their engines on
first use.

`npm test` checks this table against the marketplace: one row for every skill a family plugin ships, the exact lines
each stub gives, and that every folder a line names really exists here.

## Per-harness notes

### Claude Code

Claude Code takes each family as a plugin from this marketplace, so you only install the families you actually use:

```bash
claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills
claude plugin install decks@wjgoarxiv-skills
claude plugin install documents@wjgoarxiv-skills
claude plugin install figures@wjgoarxiv-skills
claude plugin install design@wjgoarxiv-skills
claude plugin install video-covers@wjgoarxiv-skills
```

Inside a session it is `/plugin marketplace add wjgoarxiv/wjgoarxiv-skills` and then
`/plugin install decks@wjgoarxiv-skills`. Offline, you can point the marketplace line at a local clone instead:
`claude plugin marketplace add <path to your wjgoarxiv-skills clone>`.

After that the skills answer as `decks:lit-pptx`, `documents:lit-docx`, `figures:lit-diagram-drawer`,
`figures:lit-schematic`, `design:frontend-ui-ux`, `design:visual-qa`, `video-covers:lit-typographic-motion` and
`video-covers:readme-studio`. `lit-scientific-visualization` is user-invoked only, same as it was in LitClaude, so you
type `/figures:lit-scientific-visualization <request>`. LitClaude's own `lit` routing for decks, documents, figures,
interfaces, films and READMEs keeps working: when the moved skill is installed, the stub it loads points there.

### The six other harnesses (`variants/`)

The family plugins hold LitClaude's copies, which were written for Claude Code. Before the move, the six other products
each shipped their own edition of the same nine skills, written for their own harness. I find it easiest to picture the
repository as a tank and each harness as a branch off one header. Claude Code draws the whole family, and every other
branch draws one folder from its own edition.

<p align="center">
  <picture>
    <source media="(prefers-reduced-motion: reduce) and (prefers-color-scheme: dark)" srcset="docs/assets/schematic/editions-manifold.en.dark.png">
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/schematic/editions-manifold.en.png">
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/schematic/editions-manifold-loop.en.dark.webp">
    <source media="(prefers-color-scheme: light)" srcset="docs/assets/schematic/editions-manifold-loop.en.webp">
    <img src="docs/assets/schematic/editions-manifold-loop.en.webp" width="900" alt="Isometric cutaway of a manifold: a tank labelled wjgoarxiv-skills repo, holding five family layers, feeds a vertical header with seven valved branches. The large red top branch is Claude Code (whole family plugin). The six smaller branches are Codex CLI, OpenCode, Grok Build, Muse Code, Antigravity CLI and Hermes Agent, each fed from its variants folder.">
  </picture>
</p>

Each edition first came in unchanged under `variants/<product>/<id>/`, copied byte for byte from the product commit that
last shipped it, with one receipt per product in `receipts/variants-<product>.sha256`.

| Folder | Harness | Copied from |
| --- | --- | --- |
| `variants/litcodex/` | Codex CLI | LitCodex `b82ad1c` (1.0.38 plus the skills lock), `plugins/litcodex/skills/<id>/` |
| `variants/litopencode/` | OpenCode | LitOpenCode `dc56845` (1.0.43 plus the skills lock), `skills/<id>/` |
| `variants/litgrok/` | Grok Build | LitGrok `8fd2c96` (1.0.34 plus the skills lock), `.grok/skills/<id>/` |
| `variants/litgravity/` | Antigravity CLI | LitGravity `9f2533c` (0.1.8 plus the skills lock), `plugin/skills/<id>/` |
| `variants/litmuse/` | Muse Code | LitMuse `e966b07` (0.1.11 plus the skills lock), `plugin/skills/<id>/` |
| `variants/lithermes/` | Hermes Agent | LitHermes `a2466f2` (1.0.39 plus the skills lock), `packages/lithermes-installer/assets/lithermes-plugin/skills/<id>/` |

Inside its product, though, each edition leaned on things a one-folder install does not bring along: runtime commands,
environment variables, hooks and done gates, doctor lines, agent definitions, and files in sibling skills or in the
product's shared `lib/` and `vendor/` folders. So each product got one more commit that makes its folders work on their
own. It copies the files a skill reads into its folder, swaps product commands for scripts inside the folder, and drops
every path that leads outside the folder. `variants/<product>/CHANGES.md` lists each change and the reason for it. The
procedures, references, engines and QA gates all stay; the Codex edition dropped the tests that drove LitCodex's plugin
internals.

Some internal names stay on purpose, because measured expectations or saved files depend on them: schema ids such as
`litfamily.*` and the product-prefixed ones, the brand word in sample cover recipes, and (in the Codex edition) the
`LITCODEX_*` knobs and error codes of its own scripts. Third-party corpora pinned by hash, such as frontend-ui-ux's
`references/_canonical-corpus/`, are left as they came and may name other coding agents.

### Why the skills keep their `lit-` names

The `lit-` prefix is just a name tag that records where a skill came from. You can use the skill without anything called
lit installed. The ids stay exactly as they were because each LitFamily product's stub carries the same name. With a
LitFamily product installed, its routing finds the moved skill by that name; without one, the name is just a name.
Renaming the skills here would break that link, and the receipts that prove each copy is unchanged would stop matching.

## Layout

```
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

`decks` carries 16 files of LitClaude's office runtime under `lib/`: the first-use installer (`office-runtime.mjs` and
its lockfiles), the Python bootstrap, the data, integrity, render and mark helpers, and the modules they import.
`documents` carries the same 16 files for lit-docx. LitClaude itself no longer ships the office runtime. The pinned
runtime installs on first use into `${XDG_CACHE_HOME:-~/.cache}/litclaude/office-runtime`, the same cache older
LitClaude releases used, so a machine with `decks`, `documents` and an older LitClaude installs it only once. The two
copies differ only in `office-runtime.mjs`: in `documents`, its status reads `ready` once the Python half that lit-docx
uses is installed.

`figures` carries what its three skills reach outside their own folders, unchanged and at the same relative places:
- `lib/`: the mark helper and the modules it imports, plus `npm-invocation.mjs` for the diagram renderer;
- `skills/lit-humanizer/`: only `rules.json` and four scripts, which the diagram verifier and doctor run on visible
  text. There is no `SKILL.md`, so it is not a skill here; the full lit-humanizer stays in the LitFamily products;
- `vendor/scientific-visualization/`: the 16-file source `lit-scientific-visualization` reads before plotting, with its
  provenance and MIT licence;
- `bin/litclaude-scientific-visualization-doctor.js` and `lib/bundled-skills-integrity.mjs`: the read-only doctor. Its
  integrity check also covers `vendor/handoff/` (4 files, with provenance and licence), so that copy is here too, even
  though nothing else uses it.

`design` carries what frontend-ui-ux and visual-qa reach outside their own folders, unchanged and at the same relative
places:
- `lib/`: `strict-json.mjs`, `rename-aliases.mjs` and `secret-shapes.mjs`, which the probe, the evidence checker and the
  review rules import;
- `skills/browser-drive/scripts/capability-probe.mjs`: the interface probe uses it to find and check the browser driver.
  There is no `SKILL.md` next to it; browser-drive itself stays in the LitFamily products;
- `skills/lit-diagram-drawer/assets/fonts/` and `skills/lit-typographic-motion/fonts/jetbrains-mono/`: the Pretendard
  and JetBrains Mono fonts with their OFL licences, which the design kit's `kit/fonts.json` copies by path and checks by
  sha256. These folders have no `SKILL.md` either.

LitClaude keeps a copy of the interface probe scripts in its frontend-ui-ux stub, because its lit workflows check
web-interface edits with that probe.

`video-covers` carries what lit-typographic-motion and readme-studio reach outside their own folders, unchanged and at
the same relative places:
- `lib/`: the mark helper (`mark.mjs`, `mark-logo.png`, `output_mark.py`) that draws the cover mark and the end card,
  plus `project-state-root.mjs` and the three `rules/` modules it imports;
- `skills/lit-pptx/fonts/pretendard/`: Pretendard Regular and Bold with their OFL licence, which the film engine's
  `fonts/manifest.json` reads by path and checks by sha256. There is no `SKILL.md` there; lit-pptx itself lives in
  `decks`.

The moved lit-typographic-motion text was written for LitClaude, so a few of its lines describe LitClaude parts that do
not come with this plugin:
- `SKILL.md`, `references/look.md` and `references/cover.md` say a Stop hook checks the done list and holds the turn.
  That check was a LitClaude hook and does not run outside LitClaude. The skill's own `motion.mjs gate` and its done
  list still apply, and nothing ends the turn for you.
- The text and the BLOCKED 14 message name `litclaude-ai motion-runtime install`. Outside LitClaude, and in LitClaude
  releases after 1.0.49, run the same installer straight from the plugin:
  `node <plugin>/skills/lit-typographic-motion/scripts/motion-runtime.mjs install` (or `status`). It installs into
  `${XDG_CACHE_HOME:-~/.cache}/litclaude/motion-runtime`, the cache LitClaude used, so a machine that pre-warmed it with
  LitClaude 1.0.49 or earlier needs nothing new.
- `recipes/painted-light/expected.json` names a test fixture from the LitClaude repository. That fixture did not come
  along, so the recipe's reference image is only a description.

lit-schematic looks for Pretendard first in `lit-diagram-drawer/assets/fonts/`, which `figures` carries. Its second
place, `lit-pptx/fonts/`, was not copied.

## Licences

This repository has no single licence of its own. Each family plugin carries the licence its files came under, in
`plugins/<family>/LICENSE`, and declares it in its `plugin.json`:

| Plugin | Declared licence | Where it comes from |
| --- | --- | --- |
| `decks` | MIT | LitClaude's own files |
| `documents` | MIT | LitClaude's own files |
| `figures` | MIT | LitClaude's own files; the copies under `vendor/` keep their own provenance and licence files |
| `design` | MIT AND Apache-2.0 | frontend-ui-ux's `LICENSE` (MIT) and `THIRD-PARTY-NOTICE.txt` cover its design data, and its `references/_canonical-corpus/legal/` holds the Apache-2.0 licence of the reference corpus |
| `video-covers` | MIT AND OFL-1.1 | LitClaude's own files, plus the Pretendard fonts under their OFL licence |

The Pretendard and JetBrains Mono fonts travel unmodified, each with its OFL licence file. The editions under
`variants/` keep the licence and font-licence files their products shipped inside each skill folder. The images in
`docs/assets/` were made for this page, and the fonts in them appear only as rendered pixels.

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
