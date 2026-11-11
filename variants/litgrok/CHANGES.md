# variants/litgrok: changes from the unchanged copies

The nine folders here started as unchanged copies of LitGrok's own skill folders at LitGrok commit
`8fd2c96` (the hashes are in `receipts/variants-litgrok.sha256`). Those copies leaned on things that
left LitGrok in the diet or that lived outside the folder: sibling skills' helpers and fonts, the
`.grok/vendor` tree, the `litgrok motion-runtime` command, the project rule, LitGrok's hooks and
installer receipt, and `npm run` scripts of the LitGrok repository. Each folder below now works on
its own in Grok Build with no LitFamily product installed. The references, scripts, engines and QA
gates are all still there; this is adaptation, not slimming.

## How a Grok Build user installs one of them

Each folder carries a one-skill plugin manifest, `.grok-plugin/plugin.json`
(`"skills": ["./"]`), so Grok Build installs exactly that folder:

```bash
grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/<id>" --trust
grok plugin uninstall <id>
```

The line names the folder path. An earlier version of these folders gave the clone with a
`#variants/litgrok/<id>` subfolder suffix; Grok Build 1.0.13 resolves a `#`
subfolder source by copying the whole repository, `.git` included, into its plugin store for every
skill, while a folder path copies only that folder. Every SKILL.md and both `complete-contract.md`
references now give the folder path, the same line LitGrok's moved-skill notes give.

Why this idiom and not a copy into a skills folder:

- LitGrok's installer owns `.grok/skills/<id>/` and `~/.grok/skills/<id>/` for these nine ids (it
  ships a same-name note there) and refuses its next update when a file in an owned folder
  changed. A copy into either path would break the next `litgrok install`.
- `~/.agents/skills/` is also read by Grok Build 1.0.13, but a skill there has the same bare name as
  the note and nothing tells the two apart.
- `grok plugin install` copies into Grok Build's own store (`~/.grok/installed-plugins/`), which no
  LitFamily installer touches, and lists the skill with `source.type: plugin` beside the note, so
  the note can tell the model to load the plugin copy. `grok plugin validate` accepts every manifest
  (1 skill dir, no hooks, commands, agents or MCP servers).

`<skill dir>` in the text means the folder that holds the skill's SKILL.md, the path Grok Build
lists for it. Caches moved from `~/.cache/litgrok/...` to `${XDG_CACHE_HOME:-~/.cache}/lit-skills/...`
with skill-neutral overrides (`LIT_OFFICE_CACHE`, `LIT_MOTION_CACHE`, `LIT_MOTION_FONT_MIRROR`,
`LIT_BLENDER`), because the `LITGROK_*` variables no longer exist in the product.

Common to all nine: `.grok/skills/<id>/` paths became `<skill dir>/`; links to sibling skills
(`../<other>/SKILL.md`) became plain names ("the `lit-schematic` skill"), since each skill is
downloaded on its own; text that leaned on LitGrok's project rule, hooks, `litgrok` skill or
installer now says the skill ships no hook or rule and that its description is the route; and
"Outside Grok Build (Grok Bot, Cursor)" became "Outside the Grok Build CLI (for example Grok Bot)".
Schema ids such as `litgrok.schematic/v1` and `litfamily.design-contract/v1beta2` are kept as
stable identifiers, and worked examples that name LitGrok or LitFamily as their subject are kept.

## frontend-ui-ux

- Added `.grok-plugin/plugin.json` and the one-skill install line in SKILL.md.
- `kit/fonts.json` pointed at `../../lit-diagram-drawer/assets/fonts/` and
  `../../lit-typographic-motion/fonts/`. The four files (Pretendard variable WOFF2, JetBrains Mono
  variable latin WOFF2 and both OFL texts, unmodified) now live in `kit/fonts/`; the recorded
  sha256 values are unchanged and `design-lock.mjs init` copies them from there.
- `scripts/interface-probe-driver.mjs` imported `../../browser-drive/scripts/capability-probe.mjs`.
  That probe is now `scripts/browser-capability-probe.mjs`, with its process helper as
  `scripts/proc.cjs` (copied from LitGrok's own helper); `references/craft-floor.md` names it.
- `references/complete-contract.md`: the prompt and PostToolUse hooks and the hedge guard were
  LitGrok's, so the activation block and prose now say the skill ships no hooks; the install check
  runs the skill's own two verifiers and `grok inspect --json` instead of `npm test` of a checkout.
- `references/craft-floor.md`, `implementation-platforms.md`, `system-foundations.md`,
  `motion-guide.md`: dropped the mode-detecting hook, the `.grok/skills/` path and `npm test`.
- Canonical corpus. The designpowers lane docs (`README`, `routing`, `orchestration`, `lane-a` to
  `lane-d`, `UPSTREAM`) were written for another agent harness: a planner named by command, an
  execution and review command, an `.omo/` state folder. They now speak of the planning pass, the
  execution pass and the final review pass, with design state at `.grok/frontend-design/state.md`,
  and `README.md` defines the three passes for Grok Build. `design/image-to-code-skill.md` was
  written for another coding agent and now says Grok Build; `clone-from-url.md`, `_INDEX.md`,
  `aside.md`, `README.md` (an `open-design` skill is now "when one is installed"),
  `react-dev-tooling-skill.md`, `stitch-skill.md`, `stitch-design-example.md` and
  `ui-ux-db/scripts/search.py` lost their other-harness names. The manifest was re-pinned
  (`references/_canonical-corpus/manifest.json`: 18 file rows, `byte_count` 2,597,205,
  `aggregate_sha256` 5a88d043…, schema `litgrok.canonical-frontend-corpus/v1`) and the verifier's
  EXPECTED block now holds the same values. The legal files, the dataset and `designpowers/vendor/`
  stay byte-identical to upstream; `designpowers/EVIDENCE.md` stays as the original build receipt.
  Brand design-system pages (`claude.md`, `cursor.md`, `opencode.ai.md`, `ollama.md` and the like)
  describe those websites and are kept as written.

## visual-qa

- Added `.grok-plugin/plugin.json`, the install line and the `<skill dir>` meaning in SKILL.md.
- `references/complete-contract.md` called a `scripts/cli.mjs` (validate-evidence, validate-review,
  image-diff, tui-check) and a bundled JSON schema that this copy never had, and its install check
  ran `bin/litgrok.mjs install` and `npm test` from a LitGrok checkout. It now says plainly that
  there is no `cli.mjs` or schema here: `scripts/verify-evidence-manifest.mjs` checks structure and
  containment, and the schema-level, receipt, image-diff and TUI checks are applied by hand in the
  documented shape. The install check is `grok plugin install` plus `grok inspect --json`.

## lit-typographic-motion

- The pre-warm was `npm exec --package @litfamily/litgrok@<version> -- litgrok motion-runtime install`,
  which LitGrok no longer ships. The same code was always this skill's `scripts/prewarm.mjs`, so
  SKILL.md, `references/runtime.md`, `complete-contract.md`, `scene-contract.md`,
  `THIRD_PARTY_NOTICES`, `requirements-audio.txt`, `package.json` and the CLI usage now say
  `node scripts/prewarm.mjs install|status [--audio] [--word-timing]`. `scripts/lib/cache.mjs` no
  longer reads LitGrok's installer receipt to find a release; `PREWARM_COMMAND` is the absolute
  `node "<skill dir>/scripts/prewarm.mjs" install`, so every BLOCKED message prints a command that
  works.
- The Hangul pair was "reused" from `../lit-pptx/pretendard-font/`. Pretendard Regular and Bold and
  their OFL text (unmodified official files, same sha256) now ship in `fonts/pretendard/`, and
  `fonts/pins.json` marks them bundled.
- `../../../lit-pptx/scripts/proc.cjs` and `../../../lit-hijack/scripts/lib/safe-fetch.mjs` are now
  `scripts/proc.cjs` and `scripts/lib/safe-fetch.mjs`.
- Cache `~/.cache/lit-skills/motion-runtime/<lock digest>/`; `LITGROK_MOTION_CACHE`,
  `LITGROK_MOTION_FONT_MIRROR` and `LITGROK_BLENDER` became `LIT_MOTION_CACHE`,
  `LIT_MOTION_FONT_MIRROR` and `LIT_BLENDER`; temp-dir prefixes and the asset fetcher's user agent
  no longer carry the product name; the runtime package is `lit-typographic-motion-runtime`.
- The recipe rows referred to `npm run qa:cover-recipes`, a LitGrok repository script that left with
  the diet; `references/cover.md` and the four `expected.json` notes now say the re-check is a
  manual `motion.mjs cover` render compared with the row. The painted-light recipe's base art was a
  LitGrok test fixture that is not shipped; it now says the user supplies it.
- The project-rule routing in SKILL.md and `complete-contract.md` is gone; the description and
  `/lit-typographic-motion` are the routes. `verify --out <dir>` stays the done gate (it is in the
  folder); there is no Stop hook.

## readme-studio

- Added `.grok-plugin/plugin.json` and the install line; "project or user installed" now reads
  "wherever Grok Build installed it".
- The three template `package.json`/`package-lock.json` names no longer carry the product name.

## lit-diagram-drawer

- `scripts/diagram-metrics.mjs` ran `../lit-humanizer/scripts/detect.mjs`. The detector it needs
  (`detect.mjs`, `core.mjs`, `extract.mjs`, `extract_office_text.py`, `rules.json`, NOTICE) is now
  bundled under `prose-detector/`, and SKILL.md step 7 names that copy.
- `scripts/export.mjs` and `renderer-status.mjs` imported `../../lit-pptx/scripts/proc.cjs`; the
  helper is now `scripts/proc.cjs`.
- Activation block: `resource_root` is `<skill dir>`, the install line is in `discovery`, and the
  "rules without trusted hooks" sentence is replaced by "ships no hook or rule".

## lit-schematic

- `scripts/lib/fonts.mjs` read Pretendard from `../lit-diagram-drawer/assets/fonts/` or
  `../lit-pptx/pretendard-font/`. The variable WOFF2 and its OFL text are now in `assets/fonts/`;
  the system Pretendard search stays as the fallback, and SKILL.md no longer tells the user to
  install the whole tree.
- `scripts/scaffold.mjs` refused to write inside `../../` (the `.grok` tree). It now refuses to write
  inside the installed skill folder itself, which is what the guard protects in a plugin store.
- The rule route (`.grok/rules/00-litgrok.md`) and `.grok/skills/...` resolution are replaced by
  "the folder that holds this SKILL.md".

## lit-scientific-visualization

- SKILL.md and `scripts/verify-canonical-corpus.mjs` reached `../../vendor/scientific-visualization`
  (LitGrok's `.grok/vendor`). That tree (15 corpus files, NOTICE, MIT licence, provenance record)
  is now `vendor/` inside the skill, byte-identical; the verifier passes with the same manifest.
  NOTICE and provenance name the new location.
- Skill-root resolution no longer walks a project `.grok/skills` path; "LitGrok makes that request"
  now reads "this skill makes that request".

## lit-docx

- `scripts/run.mjs` required `../../lit-pptx/scripts/deps.cjs` and `proc.cjs`. Both are now in
  `scripts/`; the docx copy of `deps.cjs` hashes only `requirements.lock` (lit-docx has no Node
  lock), so its office cache is its own.
- Office cache `~/.cache/lit-skills/office/<lock digest>/` with `LIT_OFFICE_CACHE` instead of
  `~/.cache/litgrok/office-docs` and `LITGROK_OFFICE_CACHE`; messages say "office runtime".
- SKILL.md, `references/direction-step.md` and the `docx_gate.py` usage text run
  `node <skill dir>/scripts/run.mjs ...`; the project-rule and hook sentences are replaced; the
  temp prefix and the missing-font marker no longer carry the product name.

## lit-pptx

- Same cache and message changes as lit-docx in `scripts/deps.cjs`; the runtime package is
  `lit-pptx-office-runtime`.
- SKILL.md: install line and `<skill dir>`, no project rule or `/hooks-trust` grant, "This skill
  bundles Pretendard", and the cache path. The eight tonality `pack.yaml` comments and
  `references/direction-step.md`/`layout-families.md` use `<skill dir>`.

## Checked

- Each folder was copied alone into an empty directory and run there: both corpus verifiers PASS,
  `import-design-intelligence.mjs --check` PASS, `design-lock.mjs init` writes the four kit fonts,
  the browser probe answers, `lit-schematic` doctor PASS and a scaffolded P&ID builds,
  `lit-diagram-drawer` `verify-all.mjs` passes with the bundled detector, a DOCX converts and passes
  `docx_gate.py`, a bundled example deck compiles with embedded fonts and passes `qa_deck.py`, and the
  motion pre-warm installs and reports ready.
- Every relative `import`, `require` and `new URL` in the nine folders resolves inside its own folder
  (323 specifiers, 0 problems).
