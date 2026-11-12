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
  <b>LitFamily extensions for seven coding agents.</b><br>
  Decks, documents, figures, interfaces, films and READMEs, installed one family or one folder at a time.<br>
  <sub>Silent cover film: <a href="docs/assets/cover/cover-dark.mp4">dark MP4</a> · <a href="docs/assets/cover/cover-light.mp4">light MP4</a></sub>
</p>

# wjgoarxiv-skills

These nine skills are extensions for LitFamily, my set of add-ons that brings one way of working (plans, loops, goals,
reviews) to seven coding agents. LitFamily's core is complete on its own and needs nothing
from this repository. The skills here grew up inside LitFamily, and over time they turned into the heaviest part of
every product: a deck builder with its own office runtime, a document studio, three kinds of figure, an interface kit
and a film engine. Most people did not need all of that on every install. So I kept the core light and
moved these skills out here, unchanged. Each LitFamily product kept only a small stub with the same name, which tells
you what the skill does and how to install it from this shelf.

Install the extensions you want alongside your LitFamily product and you get the full LitFamily experience. Ask for a
deck, a document, a figure, an interface, a film or a README, and LitFamily finds the extension by its name and hands the
work to it. Pick the ones you need for the agent you already use, and leave the rest on the shelf. If one skill is all
you are after, it also works without any LitFamily product.

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
decks and documents, and a built interface flows into its check. An arrow appears only where a skill's own `SKILL.md`
names the handoff. The dashed one is the exception: it is just a pairing that happens to suit a README.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/skill-map.en.dark.png">
    <img src="docs/assets/diagrams/skill-map.en.light.png" width="900" alt="Map of nine skills in five families and what each produces. lit-scientific-visualization hands chart PNGs to lit-docx and lit-pptx, lit-diagram-drawer hands diagram PNGs to lit-pptx, frontend-ui-ux hands a built interface to visual-qa, and a lit-typographic-motion cover loop pairs with readme-studio.">
  </picture>
</p>

The pictures on this page are samples too. The cover at the top is a silent, seamless README cover loop, exactly the
kind of thing `video-covers` makes. The big picture, the skill map and the install paths come from
`lit-diagram-drawer`, and the plant and the manifold from `lit-schematic`.

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

Find the extension in the left column. Claude Code installs the family plugin named next to it, straight from GitHub.
The other six harnesses copy that skill's own edition for their harness, `variants/<product>/<id>/`, from a local clone:
run `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills` once, then replace `<path to your wjgoarxiv-skills clone>`
with that folder.

| Skill | Family | Claude Code installs | The other six install |
| --- | --- | --- | --- |
| `lit-pptx` | `decks` | `decks@wjgoarxiv-skills` | `variants/<product>/lit-pptx/` |
| `lit-docx` | `documents` | `documents@wjgoarxiv-skills` | `variants/<product>/lit-docx/` |
| `lit-diagram-drawer` | `figures` | `figures@wjgoarxiv-skills` | `variants/<product>/lit-diagram-drawer/` |
| `lit-schematic` | `figures` | `figures@wjgoarxiv-skills` | `variants/<product>/lit-schematic/` |
| `lit-scientific-visualization` | `figures` | `figures@wjgoarxiv-skills` | `variants/<product>/lit-scientific-visualization/` |
| `frontend-ui-ux` | `design` | `design@wjgoarxiv-skills` | `variants/<product>/frontend-ui-ux/` |
| `visual-qa` | `design` | `design@wjgoarxiv-skills` | `variants/<product>/visual-qa/` |
| `lit-typographic-motion` | `video-covers` | `video-covers@wjgoarxiv-skills` | `variants/<product>/lit-typographic-motion/` |
| `readme-studio` | `video-covers` | `video-covers@wjgoarxiv-skills` | `variants/<product>/readme-studio/` |

Claude Code installs the whole family plugin because LitClaude's copies reach into shared files next to them (`lib/`,
`vendor/`, support folders). Still, only that one family gets installed. Every other harness installs one folder: its
product's own edition of the skill, which carries everything it reads inside the folder. Grok Build takes the folder
path as a one-skill plugin and copies only that folder into its plugin store. (Give it a `#` subfolder of the
repository instead and it copies the whole repository, `.git` included, for each skill.) Muse Code installs it through
`muse skills install`, and Codex CLI, OpenCode, Antigravity CLI and Hermes Agent copy it into their skills folder. On
OpenCode the copy takes the place of the LitOpenCode pointer folder of the same name. On the other harnesses it sits
next to its product's stub under a different name, and each product's installer leaves it alone on upgrade.

An install should never mix a new copy into an old one, or lose files you kept next to a skill, so every harness's
lines begin by looking. The first line only reads: it names each folder with the same name that the harness would also
load, because two same-name skills compete and the harness quietly keeps one of them. Where the lines copy a folder
themselves, the next line moves an existing copy whole into a dated `extension-backups/` folder in that harness's own
home. That folder sits outside every folder the harness reads skills from, so your files survive there and the backup
never loads as a second skill. The copy then lands in an empty place, and a last line writes a small receipt inside
it, `.litfamily-extension.json` (id, source, edition and install time). Grok Build and Muse Code keep their own
install records and refuse to install over a name they already hold, so their lines look, move a competing copy aside
and install. No line deletes a folder. Updating means running the same lines again, and removing a copy means moving
it aside.

The lines for each harness are under [Per-harness notes](#per-harness-notes), shown for `lit-pptx`. They are the lines
that harness's LitFamily stub gives, copied as they are, so the stub and this page always say the same thing. For
another skill, put its id where `lit-pptx` stands (and, on Claude Code, its family where `decks` stands). The stub of
that skill prints the same lines with its name already filled in.

`lit-scientific-visualization` is an adapter for the scientific-visualization source. The family plugin keeps that
source in `plugins/figures/vendor/scientific-visualization/`. Every edition under `variants/` carries its own copy
inside the skill folder, so one install brings both. The Antigravity stubs also give a workspace-only form of the same
copy into `.agents/skills/`, and the OpenCode film stub adds one runtime step after the copy:
`node ~/.config/opencode/skills/lit-typographic-motion/runtime.mjs install`. The other editions install their engines on
first use.

`npm test` checks this table against the marketplace (one row for every skill a family plugin ships), checks the
per-harness lines below word for word against `test/stub-install-lines.json`, which holds the lines each stub gives,
and checks that every folder those lines name, for every skill, really exists here.

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

A skill of your own with the same name gets in the way. A `lit-pptx` folder in `~/.claude/skills` or in a project's
`.claude/skills` loads beside `decks:lit-pptx` and competes with it. So before installing, look for one. The first line
below only lists such a folder; the next two move a personal or a project copy whole into a dated
`extension-backups/` folder beside its `.claude` folder, which Claude Code does not read:

```bash
ls -d ~/.claude/skills/lit-pptx .claude/skills/lit-pptx 2>/dev/null
d="$HOME/.claude/extension-backups/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$d" && mv ~/.claude/skills/lit-pptx "$d"/
d=".claude/extension-backups/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$d" && mv .claude/skills/lit-pptx "$d"/
```

Updating takes two lines, in this order. The first refreshes the marketplace, and the second compares the plugin's
version against what it fetched. Claude Code installs a new copy only when that version has changed, and the new copy
loads after `/reload-plugins`:

```bash
claude plugin marketplace update wjgoarxiv-skills
claude plugin update decks@wjgoarxiv-skills
```

After that the skills answer as `decks:lit-pptx`, `documents:lit-docx`, `figures:lit-diagram-drawer`,
`figures:lit-schematic`, `design:frontend-ui-ux`, `design:visual-qa`, `video-covers:lit-typographic-motion` and
`video-covers:readme-studio`. `lit-scientific-visualization` is user-invoked only, same as it was in LitClaude, so you
type `/figures:lit-scientific-visualization <request>`. LitClaude's own `lit` routing for decks, documents, figures,
interfaces, films and READMEs keeps working: when the moved skill is installed, the stub it loads points there.

### The six other harnesses (`variants/`)

The family plugins hold LitClaude's copies, which were written for Claude Code. Before the move, the six other products
each shipped their own edition of the same nine skills, written for their own harness. It is easiest to picture the
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

### Codex CLI

Codex reads skills from its own `skills` folder, from `~/.agents/skills`, and from a project's `.agents/skills` and
`.codex/skills`, and it lists a same-name skill once for every folder that holds it. It also lists a `SKILL.md` nested
inside another skill folder, which is why the copy never goes into an occupied folder. Run the four lines from your
project folder: check, move aside, copy, receipt. Each line sets its own paths, so one pasted on its own still works.

```bash
cx="${CODEX_HOME:-$HOME/.codex}"; p="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"; for d in "$cx/skills" "$HOME/.agents/skills" "$p/.agents/skills" "$p/.codex/skills"; do [ -e "$d/lit-pptx" ] && echo "found: $d/lit-pptx"; done; echo "check done"
cx="${CODEX_HOME:-$HOME/.codex}"; if [ -e "$cx/skills/lit-pptx" ]; then b="$cx/extension-backups/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$b" && [ ! -e "$b/lit-pptx" ] && mv "$cx/skills/lit-pptx" "$b/lit-pptx" && echo "moved aside: $b/lit-pptx"; fi
cx="${CODEX_HOME:-$HOME/.codex}"; if [ -e "$cx/skills/lit-pptx" ]; then echo "stopped: $cx/skills/lit-pptx still exists"; else mkdir -p "$cx/skills" && cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-pptx" "$cx/skills/lit-pptx"; fi
cx="${CODEX_HOME:-$HOME/.codex}"; [ -f "$cx/skills/lit-pptx/SKILL.md" ] && printf '{"id":"lit-pptx","source":"%s","variant":"litcodex","installed_at":"%s"}\n' "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$cx/skills/lit-pptx/.litfamily-extension.json"
```

A `found:` line under `${CODEX_HOME:-$HOME/.codex}/skills` is the old copy, and the second line moves it whole to
`${CODEX_HOME:-$HOME/.codex}/extension-backups/<date-time>/lit-pptx`, which Codex does not read. A `found:` line
anywhere else is a second same-name skill that Codex would also list, so move that folder out yourself. The copy line
stops on an occupied folder. Start a new Codex session afterwards. To update, pull the clone and run the four lines
again; to remove the copy, run only the move-aside line.

### OpenCode

OpenCode reads `~/.config/opencode/skills`, `~/.agents/skills` and `~/.claude/skills`, plus a project's `.opencode/`,
`.agents/` and `.claude/` skills, and keeps one skill per name. The extension therefore takes the place of
LitOpenCode's pointer folder of the same name. The first line lists the same-name folders OpenCode reads; move any
outside `~/.config/opencode/skills` out of the way yourself. The second moves the pointer folder whole into a dated
backup, the third copies the extension in, and the fourth writes its receipt.

```bash
ls -d ~/.config/opencode/skills/lit-pptx ~/.agents/skills/lit-pptx ~/.claude/skills/lit-pptx 2>/dev/null
d=~/.config/opencode/extension-backups/$(date +%Y%m%d-%H%M%S); [ ! -e ~/.config/opencode/skills/lit-pptx ] || { mkdir -p "$d" && mv ~/.config/opencode/skills/lit-pptx "$d/"; }
mkdir -p ~/.config/opencode/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-pptx" ~/.config/opencode/skills/lit-pptx
printf '{"id":"%s","source":"%s","variant":"litopencode","installed_at":"%s"}\n' lit-pptx "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > ~/.config/opencode/skills/lit-pptx/.litfamily-extension.json
```

With `XDG_CONFIG_HOME` set, use `$XDG_CONFIG_HOME/opencode/` in place of `~/.config/opencode/`. No skill loads from
`extension-backups/`. To update, run the four lines again and start a new session. To remove the copy, run the second
line; `litopencode install` then brings the pointer back.

### Grok Build

Grok Build installs each edition as a one-skill plugin into its own plugin store and records there where it came
from, so these lines write no receipt. A second install of the same folder stops with `already installed`, and
`grok plugin update` does not copy a local folder again. Run the two read-only checks from the project root, then the
install line:

```bash
git clone https://github.com/wjgoarxiv/wjgoarxiv-skills
grok plugin list --json | grep -cF '"name": "lit-pptx"'
grep -L '^description: "Moved: lit-pptx ' {.grok,.agents,.claude,.cursor,~/.grok,~/.agents,~/.claude,~/.cursor}/skills/lit-pptx/SKILL.md 2>/dev/null
grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-pptx" --trust
```

The first check counts installed copies; above 0, skip the install. The second prints any personal copy in a skills
folder Grok reads, which would take the bare `/lit-pptx` name ahead of LitGrok's note (the note itself is skipped).
Move that folder out whole first, dropping `/SKILL.md` from the printed path:

```bash
mkdir -p ~/.grok/extension-backups && mv "<that folder>" "$(mktemp -d ~/.grok/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXXXX)/"
```

To update, pull the clone, uninstall once for each counted copy, then install again. `grok plugin uninstall lit-pptx`
on its own removes the plugin, and the clone keeps the source.

```bash
git -C "<path to your wjgoarxiv-skills clone>" pull
grok plugin uninstall lit-pptx
grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-pptx" --trust
```

### Muse Code

Muse refuses to install over a folder that is already there, and its `--force` merges new files into the old ones, so
the lines move an occupied folder aside first. Muse records the source, the time and each file's hash in its own lock,
`$CONFIG_DIR/skills/.muse/lock.json`, so it needs no other receipt. The first line only reads and prints each folder
Muse could load as `lit-pptx`: your Muse user skills, `~/.claude/skills` and `~/.codex/skills` (Muse loads those too),
and the project's `.agents/skills` and `.claude/skills`. The second moves your Muse copy aside into
`extension-backups/` beside Muse's skills, and the third installs.

```bash
command ls -d "${XDG_CONFIG_HOME:-$HOME/.config}/muse/skills/lit-pptx" "$HOME/.claude/skills/lit-pptx" "$HOME/.codex/skills/lit-pptx" .agents/skills/lit-pptx .claude/skills/lit-pptx 2>/dev/null
D="${XDG_CONFIG_HOME:-$HOME/.config}/muse/skills/lit-pptx"; B="${XDG_CONFIG_HOME:-$HOME/.config}/muse/extension-backups/$(date +%Y%m%d-%H%M%S)"; [ -e "$D" ] && mkdir -p "$B" && mv "$D" "$B/" && echo "moved to $B/lit-pptx"
muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-pptx --scope user
```

A personal copy in `~/.claude/skills` or `~/.codex/skills` ranks below the installed extension and shows as shadowed.
A project copy in `.agents/skills` or `.claude/skills` ranks above it inside that project, so move or rename that one
to use the extension there. To update, run the three lines again, and leave out `--force` and
`muse skills update lit-pptx`, which both keep files a newer edition dropped. To remove the copy, run the second line,
then `muse skills uninstall lit-pptx`.

### Antigravity CLI

agy loads skills from the workspace's `.agents/skills` and `_agents/skills`, then `~/.gemini/config/skills` and
`~/.gemini/skills`, and keeps one same-name skill without a word. A backup left inside a skills folder can even win
over the real copy, so backups go to `~/.gemini/extension-backups/`, which agy never loads. Paste the four lines one at
a time in the workspace you use agy in. They put the skill in agy's user skills, which every workspace sees:

```bash
find .agents/skills _agents/skills ~/.gemini/config/skills ~/.gemini/skills -maxdepth 2 -name SKILL.md -exec grep -l -E '^name: *"?lit-pptx"? *$' {} + 2>/dev/null
if [ -e ~/.gemini/config/skills/lit-pptx ] || [ -L ~/.gemini/config/skills/lit-pptx ]; then b=~/.gemini/extension-backups/$(date +%Y%m%d-%H%M%S); mkdir -p "$b" && mv ~/.gemini/config/skills/lit-pptx "$b/" && echo "moved to $b/lit-pptx"; fi
mkdir -p ~/.gemini/config/skills && [ ! -e ~/.gemini/config/skills/lit-pptx ] && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" ~/.gemini/config/skills/lit-pptx
printf '{"id":"%s","source":"%s","variant":"litgravity","installed_at":"%s"}\n' lit-pptx "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > ~/.gemini/config/skills/lit-pptx/.litfamily-extension.json
```

For one workspace only, run line one, then these three in the workspace root:

```bash
if [ -e .agents/skills/lit-pptx ] || [ -L .agents/skills/lit-pptx ]; then b=~/.gemini/extension-backups/$(date +%Y%m%d-%H%M%S)-project; mkdir -p "$b" && mv .agents/skills/lit-pptx "$b/" && echo "moved to $b/lit-pptx"; fi
mkdir -p .agents/skills && [ ! -e .agents/skills/lit-pptx ] && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" .agents/skills/lit-pptx
printf '{"id":"%s","source":"%s","variant":"litgravity","installed_at":"%s"}\n' lit-pptx "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > .agents/skills/lit-pptx/.litfamily-extension.json
```

Start a new conversation, or type `/skills reload`. To update, run the same lines again: the old copy moves to a new
dated backup and the receipt is rewritten. To remove the copy, run the second line alone. Clear old backups out of
`~/.gemini/extension-backups/` when you no longer need them.

### Hermes Agent

Hermes reads skills from the profile's `skills/` folder (category folders inside it included), from a trusted
project's `.hermes/skills` and `.agents/skills`, and from any `external_dirs` you set. Two different copies of one name
under `skills/` tie, and Hermes then loads neither. The first line sets the three names the others use, so paste the
lines together, from the project's top folder, in bash or zsh. The check line only reads; the move-aside line acts
only when the folder exists and moves it into `extension-backups/<date-time>/` of the profile; the copy lands in an
empty `skills/lit-pptx/`; and the last line writes the receipt.

```bash
H="${HERMES_HOME:-$HOME/.hermes}"; ID=lit-pptx; SRC="<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-pptx"
[ -e "$H/skills/${ID:?}" ] && echo "taken: $H/skills/$ID" || echo "free: $H/skills/$ID"; grep -rlE --include=SKILL.md "^name: *[\"']?${ID}[\"']? *\$" "$H/skills" .hermes/skills .agents/skills 2>/dev/null; grep -A3 -E '^ *(external_dirs|create_dir):' "$H/config.yaml" 2>/dev/null
if [ -e "$H/skills/${ID:?}" ]; then mkdir -p "$H/extension-backups" && B=$(mktemp -d "$H/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXX") && mv "$H/skills/$ID" "$B/" && echo "moved aside: $B/$ID"; fi
if [ -e "$H/skills/${ID:?}" ]; then echo "stopped: $H/skills/$ID is still there"; else mkdir -p "$H/skills" && cp -R "$SRC" "$H/skills/$ID" && echo "copied: $H/skills/$ID"; fi
printf '{"id":"%s","source":"%s","variant":"lithermes","installed_at":"%s"}\n' "${ID:?}" "$SRC" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$H/skills/$ID/.litfamily-extension.json"
```

To update, pull the clone and paste the same lines again. To remove the copy, paste the first line, then this one. It
moves the folder into the backups and deletes nothing:

```bash
[ -e "$H/skills/${ID:?}" ] && mkdir -p "$H/extension-backups" && B=$(mktemp -d "$H/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXX") && mv "$H/skills/$ID" "$B/" && echo "moved aside: $B/$ID"
```

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
- The pre-warm used to be `litclaude-ai motion-runtime install`, which LitClaude 1.0.50 removed. The plugin now runs
  it by itself: `node <plugin>/skills/lit-typographic-motion/scripts/motion-runtime.mjs install` (or `status`), and
  `scripts/motion-doctor.mjs` prints the probes that `litclaude doctor` used to print. Every BLOCKED 14 and 15 message
  gives that line with the absolute path of the installed script. It installs into
  `${XDG_CACHE_HOME:-~/.cache}/litclaude/motion-runtime`, the cache LitClaude used, so a machine that pre-warmed it with
  LitClaude 1.0.49 or earlier needs nothing new. See "Edited after the move" below.
- `recipes/painted-light/expected.json` names a test fixture from the LitClaude repository. That fixture did not come
  along, so the recipe's reference image is only a description.

lit-schematic looks for Pretendard first in `lit-diagram-drawer/assets/fonts/`, which `figures` carries. Its second
place, `lit-pptx/fonts/`, was not copied.

### Edited after the move

A moved file stays as it came, with one exception: a line that tells you (or the model) to run a LitFamily product
command the product has since removed. Such a line is changed to a command the installed plugin runs by itself, and
nothing else in the file changes. The edited files keep their receipt row, which then carries the current sha256 first
and `edited-from:<sha256 of the unchanged copy>` as a fourth field; `npm test` checks both and checks that this list
names every edited file. The cache paths stay the same, so a runtime an older product release installed is reused.

`video-covers` (LitClaude 1.0.50 removed `litclaude-ai motion-runtime` and the motion doctor lines):
- `skills/lit-typographic-motion/engine/node/runtime.mjs`: `INSTALL_COMMAND`, which every BLOCKED 14 and 15 message,
  the status and the doctor print, is `node "<absolute skill dir>/scripts/motion-runtime.mjs" install`.
- `skills/lit-typographic-motion/engine/node/stage-serve.mjs`: its two stage-font BLOCKED messages print that command.
- `skills/lit-typographic-motion/scripts/motion-runtime.mjs`: the usage text names the script itself.
- `skills/lit-typographic-motion/SKILL.md`: the exit 14 row.
- `skills/lit-typographic-motion/references/runtime.md`: the install table, the pre-warm section (pre-warm, doctor and
  status by script), the exit 14 row and the audio warning.
- `skills/lit-typographic-motion/engine/audio/beat_grid.py`, `skills/lit-typographic-motion/fonts/manifest.json`,
  `skills/lit-typographic-motion/engine/models/word-timing.json` and
  `skills/lit-typographic-motion/engine/THIRD_PARTY_NOTICES`: the line that names the installer.

Two files still name the old command on purpose: `engine/package.json` and `engine/audio/requirements.lock`. Their
bytes are hashed into the cache folder names (`node-<lockdigest>-...` and `audio-<digest>`), so editing them would
throw away every cache already on disk.

`figures` (LitClaude 1.0.50 removed the scientific-visualization doctor from `litclaude doctor`):
- `skills/lit-scientific-visualization/SKILL.md`: step 4 runs only the bundled doctor and no longer offers
  `litclaude doctor`.

`decks` and `documents` need no edit: the office runtime installs itself on first use from `lib/office-runtime.mjs`,
and its `status` runs from the plugin. The editions under `variants/` were already made to run on their own (see each
`CHANGES.md`); none of them names a command its product removed.

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

- A moved skill is copied byte for byte. Its receipt must match, and `npm test` checks that. The one exception is a line
  that runs a product command the product later removed; it is listed under "Edited after the move" and its receipt row
  carries `edited-from:<sha256>`.
- A harness edition under `variants/` first goes in byte for byte from the product commit that last shipped it, with a
  receipt row per file, committed together with its receipt. Changes that make it run on its own come in later,
  separate commits and are listed in that product's `CHANGES.md`.
- When a product stub's install lines change, the pick-one table and the per-harness notes change in the same commit,
  and so does `test/stub-install-lines.json`, which `npm test` checks them against.
- Every content change to a family plugin bumps `version` in its `plugins/<family>/.claude-plugin/plugin.json`.
  `claude plugin update` installs a new copy only when that version changes, so an unbumped change never reaches
  anyone who already has the plugin. If the family's marketplace entry ever carries a `version`, it changes with it.

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
