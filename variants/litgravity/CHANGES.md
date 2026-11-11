# Antigravity CLI (agy) variants: what changed and why

Each folder here is one skill for agy, installed on its own. The source is the copy that shipped inside the
product's plugin before the diet. These folders are adaptations, not trimmed copies. Every reference,
script, engine lock, example and corpus file is still here. The changes do two things: make each folder run
with nothing outside it, and remove what only worked when the product plugin was installed.

## Install

The product's pointer stub gives these lines. Pick one scope and replace the placeholder with the path of
your local clone:

```sh
# every workspace (user scope)
mkdir -p ~/.gemini/config/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/<id>" ~/.gemini/config/skills/
# this workspace only (run in the workspace root)
mkdir -p .agents/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/<id>" .agents/skills/
```

Start a new conversation or type `/skills reload`. The skill then answers as `/<id>`, with no namespace. To
update, delete the folder and copy it again. The product installer owns only
`~/.gemini/config/plugins/<product>/` (or `.agents/plugins/<product>/`). It never reads or writes these skill
folders, so upgrading or uninstalling the product leaves the copied skill alone. The product's stub keeps its
namespaced name (`<product>:<id>`), so the two names never collide.

## Changes made in every folder

- **Activation.** The product hooks are gone: the router that named a route before the first model call, the
  session route table, the `lit` keyword forms and the activation note that gave the skill's path. Each
  SKILL.md now says how agy reaches it (`/<id>`, or agy matching the description) and finds its own folder
  from the path agy listed or `read_file` opened. The `lit` default mode is now a *delegated request*: the
  user says "알아서" / "you choose", or the run is headless (`agy -p`). The behaviour is the same: ask
  nothing and label each default.
- **Runtime engines.** The product command that installed engines (`runtime install <name>`) is gone. Each
  engine's own script installs it: `node "<skill>/scripts/<name>-runtime.mjs" install`, and the motion skill
  uses `scripts/motion-runtime.mjs`. Error messages, `status` output and the doctors now print that line.
  The cache moved from the product's data folder to `$XDG_DATA_HOME/lit-skills/runtime/<name>`. The ready
  marker is now `.lit-skills-ready`, and environment overrides lost the product prefix (`LIT_*`).
- **Shared helpers.** The plugin-level `host-exec.mjs` (Windows-safe spawn) and `python-pick.mjs` (Python
  3.10+ discovery) used to be imported through `../../../lib/`. Each skill that needs them now has its own
  copy under `scripts/lib/` (`engine/lib/` for motion, `scripts/probe/lib/` for visual-qa), and the imports
  are local. `host-exec.mjs` is byte-identical to the product file; `python-pick.mjs` differs only in its product name and variable prefix.
- **Ledger, goals, reviewers.** The product ledger, goal store and agent roster no longer exist. Evidence goes
  to `.lit-skills/evidence/<slug>/ledger.jsonl`. Success criteria come from the request or from
  `plans/<slug>.md`. A second look runs through `invoke_subagent` with a read-only `TypeName` that
  `agy agents` lists, or with a child briefed to read only. The product's named agents are not assumed.
- **Names.** Product names, `/<product>:<id>` slash forms, product-prefixed file names and schema ids were
  replaced (`lit.<name>/v1`, `lit-…`). The house style names (`litfamily.*` schema ids for the design
  contract, the brand style guide, recipe names) stay, because they name a design vocabulary and not the
  product.
- **Hand-offs to other skills.** A pointer such as `../lit-pptx/SKILL.md` used to reach a sibling inside the
  same plugin. It now names the skill and says "when it is installed beside this one". No path leaves the
  folder.
- **Tool names.** Every instruction uses agy's own tools: `read_file`, `write_file`, `run_command`,
  `ask_question`, `invoke_subagent`, `browser_subagent`, `generate_image`. The leftovers from other hosts
  (Read, Write, Bash, the Agent tool, AskUserQuestion) are gone.
- **Licence.** Folders that relied on the plugin's root licence now carry an MIT `LICENSE`.
- **Size.** agy loads only the first 24,000 B of a SKILL.md. All nine are under it, between 15,459 B and
  23,859 B. Detail that did not fit was already in `references/` and is still there.

## Per skill

### lit-pptx
- Python scripts put their own folder on `sys.path` instead of the plugin `lib/`. The Node scripts import
  `scripts/lib/host-exec.mjs` and `python-pick.mjs` locally.
- `references/stages/{interview,autopilot,plan}.md` and `consensus-protocol.md` use agy tool names.
- The theme-first gate keeps its question round, now only when a user is present. A delegated request skips
  it as before.
- `LICENSE` added; `NOTICE` points to it.

### lit-docx
- Used to borrow the office runtime, OOXML integrity check, page renderer and data helpers from the deck
  skill's folder. It now ships byte-identical copies in `scripts/office/`, with the engine lock and `lib/`.
  `OFFICE="$SKILL_ROOT/scripts/office"` replaces the old cross-folder path in SKILL.md, `build-loop.md` and
  `page-composition.md`.
- The Python scripts' `sys.path` points to `scripts/office`. `NOTICE` lists the copied files.
- SKILL.md was tightened to stay under 24,000 B after the route and install text changed. No rule was
  dropped.
- Smoke: a Korean Markdown report converts to `.docx` and passes `qa_docx.py`, with the office runtime
  installed by `scripts/office/office-runtime.mjs install`.

### lit-diagram-drawer
- The diagram doctor and `diagram-metrics.mjs` called the prose detector of the product's humanizer skill
  through a sibling path. The detector (`rules.json`, `detect.mjs`, `core.mjs`, `artifact-text.mjs`,
  `extract_office_text.py`) is now copied into `humanizer/`, so the copy-quality gate works without that
  skill.
- `export.mjs` and `doctor.mjs` print the in-folder runtime install line.
- `failure-codes`, `export` and the playbooks use the new install line and tool names. `LICENSE` added.
- Smoke: `scripts/verify-all.mjs` passes with no failures.

### lit-schematic
- The Pretendard font came from a sibling skill's folder. It now ships in `assets/fonts/` (the unmodified
  official variable font, its OFL and provenance), and `scripts/lib/fonts.mjs` looks there first.
- `scripts/scaffold.mjs` used to check that it ran inside the plugin. It now checks the skill root, and
  computes the example-relative import path instead of hard-coding the plugin layout.
- SKILL.md states the standalone surface: no automatic hook injection. `LICENSE` added.

### lit-scientific-visualization
- `sciviz-runtime.mjs` prints its own `install` line, and the comment about the read-only folder now
  describes the skill folder.
- Local `scripts/lib/` helpers. SKILL.md routes and ledger text updated as above.

### frontend-ui-ux
- The kit's Pretendard and JetBrains Mono fonts came from the plugin's shared font folder. They now ship in
  `kit/fonts/` with their OFL licences, and `kit/fonts.json` points there.
- `complete-contract`, `house-styles`, `craft-floor`, `implementation-platforms`, `production-interview`,
  `inclusive-interface` and `visual-reconstruction` lost product routes, product agents and sibling paths.
- The canonical design library is kept byte for byte (`verify-corpus.mjs` still passes: 170 files,
  2,596,349 bytes). Some vendored files in it were written for other agent hosts or name brands and tools
  as design subjects. They are left untouched. SKILL.md now says to read their browser and image tools as
  agy's `browser_subagent`, `generate_image` and `run_command`, and never to install another host's
  tooling for them.

### visual-qa
- The interface probe and Chrome driver lived in the plugin's shared `lib/`. They are now copied into
  `scripts/probe/` with their lock and helpers, and `PROBE_ROOT` points there.
- `scripts/review-rules.mjs` accepts a reviewer id with any one `<namespace>/` prefix, so a user-defined or
  plugin-provided agent type still matches the two charter roles (`quality-reviewer`, `lit-verifier`).
  Those role ids stay as written in the receipts.
- The breakage catalogue, reviewer charters and complete contract use agy tools and no product agents.
  `LICENSE` added.

### lit-typographic-motion
- **The done gate is now a command.** The product's tool-use hook recorded each render and each opened image,
  and its stop hook ran the done-check before the turn could end. With no hooks, the check runs as a new
  subcommand: `node "$SKILL_ROOT/scripts/motion.mjs" done <dir> [--json]`. It runs the same
  `engine/node/done.mjs`, exits 13 while the film is not done, and prints the reasons, downgrades, open look
  items and generated-asset labels. SKILL.md, `look.md` and `cover.md` say to run it before calling the
  work finished, to fix what it names at most twice, and then to say plainly what is left. The viewed list
  comes from `look.json`, so only frames that `read_file` opened belong there.
- The runtime install line is `scripts/motion-runtime.mjs install`. `engine/node/runtime.mjs` exports it, and
  `stage-serve.mjs` uses it in its blocked message.
- Pretendard Regular and Bold came from the plugin's font folder. They now ship in `fonts/pretendard/`
  (unmodified official OTFs and their OFL), marked `bundled` in `fonts/manifest.json`.
- `runtime.md`, `cover.md`, `craft-loop.md`, `engine-contract.md`, `type-craft.md`, `studio.md`, `sound.md`,
  `style-bibles.md`, `THIRD_PARTY_NOTICES`, `engine/package.json` and `beat_grid.py` were updated for the
  routes, install line and tool names. The sample recipes' brand word is now a neutral `TYPEMOTION`.
  `LICENSE` added.

### readme-studio
- `readme-runtime.mjs` and `shape-text-to-svg.mjs` print the in-folder install line. The npm pre-warm line is
  gone.
- `production-interview`, `facts-and-assembly` and `type-and-background` use agy tools and the delegated
  request in place of the `lit` routes. Local `scripts/lib/host-exec.mjs`. `LICENSE` added.

## Checked

- `node --check` passes for every `.mjs` and `.js` file, every `.py` file parses, and every `.json` file
  parses.
- Each runtime's `status`, the diagram and schematic doctors, `verify-all.mjs`, `verify-corpus.mjs` and the
  design lock list run from inside the folder. A deck compiles from a bundled example, embeds Pretendard and
  passes `qa_deck.py`.
- A path scan resolves every `../` against its own file. Only one stays outside its folder: the text
  `../../components` in the vendored design dataset (`frontend-ui-ux/data/design-intelligence.json`). It is
  an example of a bad import inside a guideline record, not a path the skill opens.
- A word scan finds no product name, no removed command, hook or variable, no other host's tool name and no
  machine path outside the vendored corpus. The corpus is exempt because it is published upstream byte for
  byte: `frontend-ui-ux/references/{design,designpowers,perfection,ui-ux-db,_canonical-corpus}/` and
  `frontend-ui-ux/data/`.
- agy 1.5.5 lists a copied folder under its bare id (`lit-pptx`) next to the product stub's namespaced name.

## Not changed here

The extras repository's install table test, and the receipts under `receipts/`, describe the earlier
plugin-per-family install and the files as they were. They are outside this folder and need their own
update.
