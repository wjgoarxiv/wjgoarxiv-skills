# Muse Code editions: what changed and why

The nine folders here started as unchanged copies of LitMuse's own skill folders at LitMuse commit `e966b07`
(`plugin/skills/<id>/`; the hashes are in `receipts/variants-litmuse.sha256`). Inside the plugin they leaned on things
a one-skill install does not carry: the plugin's shared `plugin/lib/` helpers (the office runtime, process and fetch
helpers, strict JSON), fonts and probe scripts that lived in a sibling skill, the `npx @litfamily/litmuse runtime
install <engine>` command, `LITMUSE_*` environment variables, the motion done check in the Stop hook, the
`UserPromptSubmit` routes and `lit` modes, doctor lines, the `.litmuse/` state folder and the `litmuse/<agent>` agent
definitions that only run after `muse plugins approve`.

Each folder now works when it is the only thing installed, with no LitFamily product present. The references,
scripts, engines, templates, recipes and QA gates are all still there. This is adaptation, not slimming: nothing
was cut to make a folder smaller.

## How a Muse user installs one

The LitMuse stub gives three lines: a read-only look at every folder Muse could load as `<id>`, a move of an
occupied Muse copy whole into `$CONFIG_DIR/extension-backups/<date-time>/` (Muse does not read it), and the
install, which Muse refuses over an occupied folder:

```bash
command ls -d "${XDG_CONFIG_HOME:-$HOME/.config}/muse/skills/<id>" "$HOME/.claude/skills/<id>" "$HOME/.codex/skills/<id>" .agents/skills/<id> .claude/skills/<id> 2>/dev/null
D="${XDG_CONFIG_HOME:-$HOME/.config}/muse/skills/<id>"; B="${XDG_CONFIG_HOME:-$HOME/.config}/muse/extension-backups/$(date +%Y%m%d-%H%M%S)"; [ -e "$D" ] && mkdir -p "$B" && mv "$D" "$B/" && echo "moved to $B/<id>"
muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/<id> --scope user
```

Muse copies the folder to `$XDG_CONFIG_HOME/muse/skills/<id>/` (else `~/.config/muse/skills/<id>/`). The next
session lists it as `<id>`, scope `user`, and `read_skill <id>` loads it. Muse records the source, time and file
hashes in `$CONFIG_DIR/skills/.muse/lock.json`. To take a newer edition, run the three lines again; `--force` and
`muse skills update <id>` merge into the old folder and keep files a newer edition dropped. To remove it, run the
move-aside line, then `muse skills uninstall <id>`. Every folder passes
`muse skills validate` with no diagnostics on Muse Code 1.4.15.

LitMuse keeps a same-name stub for each id. The stub is the plugin skill `plugin:litmuse:<id>` and the copy is the
user skill `<id>`, so they sit side by side in the catalog under different ids and in different folders. The stub
hands a `lit` route over to the copy. LitMuse's installer, updates and uninstaller never write or remove
`$CONFIG_DIR/skills/`, so a LitMuse upgrade keeps the copy, and LitMuse's doctor reports it as `INFO moved`.

## Rules applied to every folder

- **Self-contained.** Every relative path that climbed out of the folder (`../../../lib/...`,
  `$SKILL_ROOT/../../lib`, Python `"..", "..", "..", "lib"`, `path.resolve(root, '../<sibling>/...')`,
  `join(here, '..', '..', '<sibling>', ...)`) now points to a file copied into the folder. Shared helpers live in
  `<id>/lib/`. A folder copied alone resolves every relative import: 454 import specifiers were checked and none is
  unresolved. Fixtures that deliberately test the rejection of `../` paths are kept.
- **No removed surfaces.** The plugin runtime command, the `LITMUSE_*` variables, hook routes, the Stop gate, doctor
  lines, `muse plugins approve` steps and the `plugin:litmuse:` prefix are gone from every file. Each engine skill
  installs its own pinned runtime from a script it ships (listed per skill below). The runtime appears on first use
  or through `install`, into `${XDG_DATA_HOME:-~/.local/share}/wjgoarxiv-skills/runtime/<engine>/`, and it can be
  overridden with `LIT_<ENGINE>_RUNTIME`. A first-use install the sandbox blocks is `BLOCKED:` plus that exact
  command for the user to run in a terminal.
- **Muse's own tools.** The skills name `read_skill`, `read_file`, `search`, `bash`, `request_user_input` and
  `subagent_spawn`. Reviewers that used to be `litmuse/quality-reviewer`, `litmuse/lit-verifier` and similar are now
  `subagent_spawn` children started without `subagent_type`. The child's objective limits it to `read_file` and
  `search` with no writes, because a user skill ships no agent definitions. The motion done check that the Stop hook
  ran is now a command the skill runs itself (see lit-typographic-motion).
- **Modes without `lit`.** The "lit-default" / "bare `lit`" rows became a **no-questions** mode with the same
  behaviour. It triggers when the user asks for no questions ("you choose", "알아서 해 줘", "just make it") or the
  run is headless.
- **Evidence in the project, not in a product folder.** Ledger and evidence lines moved from `.litmuse/evidence/`
  to `.lit-evidence/<slug>/` in the user's workspace.
- **Renamed identifiers.** `LITMUSE_X` became `LIT_X`. Ready markers `.litmuse-ready` became `.lit-runtime-ready`.
  Product-prefixed schema ids `litmuse.*` became `lit.*` (motion brief, style, house, fonts, beat grid, word
  timing, cover recipe and negative, readme cover, canonical frontend corpus). Code and data were renamed together,
  so readers and files agree. A file written by the plugin edition carries the old id and has to be written again.
  The runtime and template packages `litmuse-*` became `lit-*`. `data-litmuse-probe-hover` became
  `data-lit-probe-hover`. The `litfamily.*` schema ids (design contract, evidence manifest and the like) stay as
  they are, because they are a family data format shared by every edition, not a product name.
- **No other products or hosts.** No file names another harness or LitFamily product, and no file holds a
  machine-specific path. One exception is documented under frontend-ui-ux: the verbatim, hash-pinned third-party
  corpus.
- **Descriptions** stay at or under 110 bytes (87 to 102 B), so Muse's 32 KB catalog keeps them in full.

## lit-pptx

- Bundled `lib/` from the plugin: `office-runtime.mjs`, `host-process.mjs`, `office_data.py`,
  `office_runtime_bootstrap.py`, `ooxml_integrity.py`, `pdf_fonts.py`, `render_pages.py` and `office-runtime-lock/`
  (`package.json`, `package-lock.json`, `requirements.lock`; the package is now `lit-office-runtime`). Messages
  read "Office runtime:".
- `scripts/compile-deck.js`, `scripts/lib/runtime-require.js` and every Python script import from `../lib` or
  `scripts/../lib`. `LITMUSE_OFFICE_PYTHON` became `LIT_OFFICE_PYTHON`. In `SKILL.md`, `LITMUSE_LIB` became
  `LIT_LIB="$SKILL_ROOT/lib"`. The pre-warm is `node "$LIT_LIB/office-runtime.mjs" install`.
- `lib/pdf_fonts.py` points its font hint at this skill's own `fonts/pretendard/`.
- `SKILL.md`, `references/` (authoring guide, consensus protocol, direction step, stages):
  - The hook route and the slash form became catalog activation.
  - The "lit-default" row became the no-questions mode.
  - The 정/반/합 and interview roles are `subagent_spawn` children without `subagent_type`.
  - The ledger lives under `.lit-evidence/lit-pptx/`.
  - `NOTICE` lists the bundled helpers in their new places.
- Checked from a folder installed alone: the sample deck `10-status-update-ledger-ko` compiled with embedded
  Pretendard, `qa_deck.py` exited 0, the OOXML integrity check passed, and two pages rendered through soffice.

## lit-docx

- The same bundled `lib/` as lit-pptx. Each skill carries its own copy so either installs alone. In `SKILL.md`,
  `LIB="$SKILL_ROOT/lib"`. The `office_data.py` reference row and `NOTICE` point there.
- The direction step's bare-`lit` rule became the no-questions mode. Reviewers became read-only `subagent_spawn`
  children. Ledger lines go to `.lit-evidence/lit-docx/`.
- Checked from a folder installed alone: `04-proposal-ko` built as a Proposal, `qa_docx.py` exited 0, the
  integrity check passed, and two pages rendered.

## lit-diagram-drawer

- Bundled `lib/host-process.mjs`. `scripts/diagram-runtime.mjs` and `scripts/export.mjs` import it from `../lib`.
- The visible-text detector used to be reached in the sibling `lit-humanizer` skill
  (`path.resolve(root, '../lit-humanizer/scripts/detect.mjs')`). Its engine is now bundled in
  `lib/humanizer-detector/` (`scripts/detect.mjs`, `core.mjs`, `artifact-text.mjs`, `extract_office_text.py`,
  `rules.json`). `diagram-metrics.mjs` and `doctor.mjs` resolve it there, and doctor labels the row "bundled
  visible-text detector". Without it, the method-metadata foil check could not run.
- Renderer messages print `node "<abs path>/scripts/diagram-runtime.mjs" install` instead of the plugin command. The
  lock package is `lit-diagram-runtime`. `SKILL.md` and `references/export.md` describe the skill-local runtime.
- The large-diagram reviewer is a `subagent_spawn` child limited to `read_file` and `search`.
- Checked from a folder installed alone: doctor passed every row, `verify-all.mjs` passed (183 templates, 8 examples,
  8 of 8 foils matched with the detector signal), and `export.mjs` wrote a 1080x640 PNG with Pretendard loaded.

## lit-schematic

- Bundled `lib/host-process.mjs` for `doctor.mjs`, `motion.mjs` and `render.mjs`.
- The font used to be read from the sibling `lit-diagram-drawer/assets/fonts/`. It is now
  `assets/fonts/PretendardVariable.woff2`, with `OFL.txt` and `provenance.json`. `doctor.mjs` and
  `references/journal-figures.md` name the bundled copy.
- The `lit` prompt routing rows became plain prompt rows. The "hook route table" sentence now says that routing comes
  from the catalog description and that the skill needs no Muse approval.
- Checked from a folder installed alone, and again from a real `muse skills install` in an isolated HOME: all three
  examples built, `qa.mjs` printed `QA PASS` for each, and `render.mjs` wrote PDF and PNG.

## lit-scientific-visualization

- Bundled `lib/host-process.mjs` for `scripts/sciviz-runtime.mjs`. The runtime installs into the per-user cache
  above, and the lockfile header names the skill-local install command. In `SKILL.md`, `node .../sciviz-runtime.mjs`
  became `node <skill-dir>/scripts/sciviz-runtime.mjs`.
- This folder installs under its own id, `lit-scientific-visualization`. The plugin stub used to send Muse users to
  a differently named source folder.
- Checked from a folder installed alone: the runtime installed (Python 3.14, 18 pinned lines), and the bundled
  unit tests passed inside it (`test_figure_export` 3, `test_style_presets` 8).

## frontend-ui-ux

- Bundled `lib/strict-json.mjs` for `scripts/json-boundary.mjs` and `scripts/source-replay.mjs`.
- The kit fonts used to be copied from two sibling skills. They are now in `kit/fonts/`:
  `PretendardVariable.woff2`, `Pretendard-OFL.txt`, `JetBrainsMono-wght-latin.woff2` and `JetBrainsMono-OFL.txt`.
  `kit/fonts.json` sources are `fonts/<file>`, and the hashes are unchanged.
- The probe and driver scripts use the renamed hover attribute. The corpus manifest schema is
  `lit.canonical-frontend-corpus/v1`, and `verify-corpus.mjs` still passes (170 files, 2,596,349 bytes).
- `SKILL.md`, `references/complete-contract.md`, `production-interview.md`, `motion-guide.md`:
  - Hook and PostToolUse guidance became the skill's own rules.
  - Reviewers became read-only `subagent_spawn` children.
  - Ledgers go to `.lit-evidence/frontend-ui-ux/`.
- **Exception:** `references/{design,designpowers,perfection,ui-ux-db,_canonical-corpus}/` stay byte for byte. They
  are third-party material pinned by `SOURCE-MANIFEST.json`, and editing them would break that manifest and the
  provenance. A few of those files name other coding agents. `SKILL.md` already treats the library as inert
  reference data, and it now also says to read those names as reference text and use Muse's own tools.
  `references/implementation-platforms.md` and `system-foundations.md` mention a Muse plugin as subject matter, not
  as this skill's host.
- Checked from a folder installed alone: the design-contract example validated, `chrome-driver.mjs status` found
  Chrome, and `design-lock.mjs init --scaffold` wrote the kit with the four bundled fonts at their pinned hashes.

## visual-qa

- The interface probe used to be borrowed from the sibling frontend-ui-ux (`FRONTEND_ROOT=.../../frontend-ui-ux`).
  It is now bundled in `scripts/probe/`: `interface-probe.mjs` plus its page, rules, server, static and lock
  modules, and `chrome-driver.mjs` launched with `--use-mock-keychain --password-store=basic`.
  `SKILL.md` uses `PROBE_ROOT="$VISUAL_QA_SKILL_ROOT/scripts/probe"`.
- Bundled `lib/strict-json.mjs` for `evidence.mjs`, `evidence-io.mjs` and `review-rules.mjs`.
- The two independent reviewers are `subagent_spawn` calls with the roles quality-reviewer and lit-verifier. They
  use a read-only `subagent_type` only when the session lists one; otherwise the result is
  `BLOCKED_INDEPENDENT_REVIEW_UNAVAILABLE`. `review-rules.mjs` no longer maps reviewer ids to `litmuse/<name>`.
- `references/complete-contract.md` checks the install with `muse skills list --source user` and
  `muse skills validate`.
- Checked from a folder installed alone: the bundled probe ran on a scaffolded page and produced seven viewport and
  mode screenshots and a findings file (its verdict judged the bare scaffold, as intended), `image-diff` ran, and the
  evidence and review validators rejected malformed input with their named errors.

## lit-typographic-motion

- Bundled `lib/host-process.mjs`, `lib/capped-fetch.mjs` and `lib/pinned-fetch.mjs` for the Node engine.
- The Pretendard faces used to be borrowed from lit-pptx. They are now `fonts/pretendard/` (Regular, Bold,
  `OFL.txt`). In `fonts/manifest.json` those entries are `source: bundled`, and the fallback is gone.
- `engine/node/runtime.mjs` exports
  `INSTALL_COMMAND = node "<abs>/scripts/motion-runtime.mjs" install`, and `stage-serve.mjs` uses it. `runtime.md`,
  `THIRD_PARTY_NOTICES` and the engine `package.json` (now `lit-*`) describe the skill-local runtime.
- **The done check moved from the Stop hook into the skill.** `scripts/motion.mjs done --out <dir> [--json]` runs the
  same `evaluateDone` check. It prints `done-check: STATUS`, the open items and the lines the reply must carry. It
  exits 0 for DONE or DONE_UNVIEWED and 13 otherwise. `SKILL.md`, `look.md`, `cover.md`, `treatment.md` and
  `craft-loop.md` tell the model to run it before the delivering reply, because no hook does it any more. The
  PostToolUse image-read record is replaced by the look round's own viewed-file list.
- The cover recipes and negatives used "LITMUSE" as the sample brand word. It is now "PROJECT". `expected.json`
  notes say the row was measured on the original word, that a different word moves it slightly, and how to re-check
  it by hand. `cover.md` says no automated recipe QA ships.
- The mode row "lit default" became the no-questions mode.
- Checked from a folder installed alone: the runtime installed (`MOTION_RUNTIME_INSTALL_PASS`) and the doctor found
  Chrome, ffmpeg, WebGL2 and img2webp. The `weight-tide` recipe rendered as a 1000x500, 128-frame cover, and
  `cover-gate --strict` passed every gate. `done --out` correctly answered `NOT_DONE` (exit 13) until a look round is
  recorded.

## readme-studio

- Bundled `lib/host-process.mjs` for `scripts/readme-runtime.mjs`. The runtime lock and the HyperFrames, Remotion
  and typography template packages are `lit-*`. The cover schema is `lit.readme-cover/v1`.
- `templates/typography/shape-text-to-svg.mjs` resolves fontkit from the skill's per-user runtime
  (`LIT_README_RUNTIME` overrides it). Its BLOCKED message names the skill-local install, or `npm ci` beside the
  template.
- **Bug fixed while checking:** that resolve goes through `require` conditions and lands on fontkit's CJS build,
  whose exports arrive on `default`. So `const { create } = await import(...)` failed with "create is not a
  function", and the plugin copy fails the same way. The template now takes `fontkit.create ?? fontkit.default?.create`.
- `SKILL.md` and `references/` (facts and assembly, production interview, type and background):
  - The pre-warm is `node <skill-dir>/scripts/readme-runtime.mjs install`.
  - The fact sheet and ledger live under `.lit-evidence/readme-studio/`.
  - The reviewer is a read-only `subagent_spawn` child.
- Checked from a folder installed alone: the runtime installed, and the typography template outlined
  "프로젝트 PROJECT" in Pretendard Bold to an SVG with no `<text>` left.

## How the folders were checked

- A static check over all nine folders came back empty for every class:
  - `../` paths that leave the folder: literal sibling paths, every `../` token resolved from its file, and
    `join`/`resolve` calls built from `'..'` segments.
  - Removed commands, variables, hooks, gates, doctor lines and agent ids.
  - Names of other products and hosts, with the verbatim corpus above excluded.
  - Machine-specific paths.
- A folder copied alone has no unresolved relative import.
- `node --check` passes on all 211 JavaScript files. All 40 Python files parse.
- `muse skills validate` passes for each folder with no diagnostics.
- The runtime and engine checks listed under each skill ran against folders copied alone, with every cache in a
  scratch `XDG_DATA_HOME`.
