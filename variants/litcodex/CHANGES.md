# Codex editions: what changed and why

Each folder here is one skill rewritten for Codex CLI so it works on its own. A user installs it with the four
lines the LitCodex stub gives, run from the project folder: a read-only check for same-name skills Codex would also
list, a move of an old copy whole into `${CODEX_HOME:-$HOME/.codex}/extension-backups/<date-time>/`, the copy into
the now-empty folder, and a receipt, `.litfamily-extension.json`, inside the copy:

```bash
cx="${CODEX_HOME:-$HOME/.codex}"; p="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"; for d in "$cx/skills" "$HOME/.agents/skills" "$p/.agents/skills" "$p/.codex/skills"; do [ -e "$d/<id>" ] && echo "found: $d/<id>"; done; echo "check done"
cx="${CODEX_HOME:-$HOME/.codex}"; if [ -e "$cx/skills/<id>" ]; then b="$cx/extension-backups/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$b" && [ ! -e "$b/<id>" ] && mv "$cx/skills/<id>" "$b/<id>" && echo "moved aside: $b/<id>"; fi
cx="${CODEX_HOME:-$HOME/.codex}"; if [ -e "$cx/skills/<id>" ]; then echo "stopped: $cx/skills/<id> still exists"; else mkdir -p "$cx/skills" && cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/<id>" "$cx/skills/<id>"; fi
cx="${CODEX_HOME:-$HOME/.codex}"; [ -f "$cx/skills/<id>/SKILL.md" ] && printf '{"id":"<id>","source":"%s","variant":"litcodex","installed_at":"%s"}\n' "<path to your wjgoarxiv-skills clone>/variants/litcodex/<id>" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$cx/skills/<id>/.litfamily-extension.json"
```

Updating means running the four lines again; removing means running the move-aside line alone.

Codex then lists it by its bare id (`lit-pptx`, not `litcodex:lit-pptx`), and nothing else has to be
installed for it to work. The originals were written to run inside the LitCodex plugin. They relied on its
hooks and its runtime commands, its doctor, the plugin's vendor folder and fonts, and paths that climbed out
of the skill folder with `../`. This file records, per skill, what had to change to remove those ties, and
why. The skill's own procedures, references, engines and quality gates are kept. Nothing was cut to make a
folder smaller.

## Rules applied to every folder

- **Registration.** `registration_surface` now names `${CODEX_HOME:-$HOME/.codex}/skills/<id>/SKILL.md`.
  Invocation is `$<id>` or the skill picker. The `$litcodex:<id>` form belongs to the plugin stub, so it is
  not used here. `agents/openai.yaml` default prompts use the same bare `$<id>`.
- **No plugin-only surfaces.** These were removed or rewritten wherever they appeared: the
  `UserPromptSubmit` hook routes and hook-mode markers, the bare-`lit` routing rows, Stop-hook completion
  checks, `litcodex office-runtime` and `litcodex motion-runtime`, the pre-warm after install, doctor lines,
  and the managed marketplace. Each folder now prepares its own pinned runtime with a script it ships, and the
  model is told that no hook does this on its behalf.
- **No path out of the folder.** Every `../` that left the skill folder now points to a file copied into it,
  so a folder copied alone still works. Fixtures that deliberately test rejection of `../` paths are kept.
- **No other products.** Where a passage pointed to a sibling skill, it now names that skill by bare id and
  adds "when installed". It never assumes the sibling is present. No other harness or product is named, and
  no machine-specific path appears.
- **Kept on purpose.** The `litfamily.*` and `litcodex.*` schema ids in receipts, and the `LITCODEX_*` knobs
  the skill's own code reads (`LITCODEX_BLENDER`, `LITCODEX_MOTION_*`), are left as they were. They are data
  formats and settings that belong to this edition, not removed product commands. Renaming them would break
  existing receipts and saved settings for no gain.
- **Tests.** Tests that import plugin internals were deleted: the hook driver, the catalog, the route
  tables, the installer, and the marketplace scenario driver. They tested how the plugin wires the skill in,
  and that wiring no longer exists. Tests that need only the skill folder are kept, and their imports now
  point inside it.

## lit-pptx

- `scripts/office-run.mjs` now serves only the deck runtime. `install` builds the pinned Python venv and Node
  helpers from `runtime/` into `${XDG_CACHE_HOME:-~/.cache}/lit-office/pptx/<lock hash>`, and `doctor`
  reports it. `pptx <compile|qa|render|...>` runs inside it. If the runtime is missing, the script names the
  exact install command and exits 78. Before, the same file served both office skills and lived under a
  plugin-managed cache, and the plugin's `office-runtime` command filled that cache.
- SKILL.md: the "Host and runtime" and "Codex enrollment" passages are rewritten around
  `OFFICE=<this skill>/scripts/office-run.mjs`. The `$litcodex:lit-pptx` route is now `$lit-pptx`. The Word
  report hand-off to `lit-docx` is now conditional on that skill being installed.
- `runtime/package.json` and the lockfile are renamed to `lit-pptx-runtime`, which keeps the plugin
  command's name out of the folder. NOTICE says this is the Codex edition.

## lit-docx

- New `scripts/office-run.mjs`: the document half of the office runner. It needs Python only, hashes
  `runtime/requirements.lock`, and uses the same cache root and the same `install | doctor | docx ...` shape.
- SKILL.md, NOTICE and `agents/openai.yaml` are updated the same way as lit-pptx. The deck hand-off is
  conditional.

## lit-diagram-drawer

- SKILL.md: the registration, invocation (`$lit-diagram-drawer`, the picker or an implicit diagram request) and package-claims
  bullet now describe a copied skill, not a plugin payload. The bundled fonts were already inside the
  folder (`assets/fonts`).
- `scripts/diagram-metrics.mjs` and `scripts/doctor.mjs` ran the visible-text detector from
  `../lit-humanizer/scripts/detect.mjs`, a sibling skill that a one-folder copy does not bring, so the
  verifiers threw and the doctor reported the detector missing. The detector is now bundled in `humanizer/`,
  copied unchanged from LitCodex `b82ad1c` `plugins/litcodex/skills/lit-humanizer/`: `scripts/detect.mjs`,
  `scripts/core.mjs`, `scripts/extract_office_text.py`, `rules.json` and `NOTICE`. Both scripts point
  there, and the doctor line now reads `bundled visible-text detector`.

## lit-schematic

- The Pretendard variable font, its OFL and a provenance file are bundled in `assets/fonts/`.
  `scripts/lib/fonts.mjs` loads them from there and reports the source as `bundled`. Before, the font came
  from the plugin's shared font folder, outside the skill.
- `scripts/scaffold.mjs` resolves the skill root through `realpathSync`, so it works from
  `$CODEX_HOME/skills/lit-schematic` or from a symlink to it. It no longer looks for the plugin tree.
- SKILL.md: the hook surface, the hook-route row and paragraph, and the organic-enrollment evidence bullet
  are rewritten for a copied skill. `doctor.mjs` passes on the bundled font.

## lit-scientific-visualization

- The authored scientific-visualization source, which the adapter reads, is copied into
  `vendor/scientific-visualization/` (16 files), with its license, provenance and a NOTICE. Before, the
  adapter reached it through `../../vendor/`, which only resolved inside the plugin and needed a second copy
  command. One copy now installs everything.
- `scripts/dependency-preflight.py` reads the source from `vendor/scientific-visualization` and reports
  `sourcePayloadComplete: true` against the manifest. The provenance note no longer names a personal folder
  path.
- SKILL.md: the hook route and hook-mode lines are gone. Invocation is `$lit-scientific-visualization` or the
  picker, with implicit invocation off. Install and marketplace wording now describe a copied skill. Diagram
  and schematic hand-offs are conditional.
- The two tests that drove the plugin's hook route and runtime command were deleted.

## frontend-ui-ux

- `scripts/capability-probe.mjs` is copied from the plugin's browser-drive skill, and `probe.mjs` and
  `design-lock` import it locally. Before, they reached into a sibling skill folder.
- The kit fonts (Pretendard variable, JetBrains Mono latin, with both OFLs) are bundled in `kit/fonts/`, and
  `kit/fonts.json` points to them.
- SKILL.md and `references/complete-contract.md`, `canonical-library.md` and `house-styles.md` now describe
  a copied skill. `scripts/verify-canonical-corpus.mjs` resolves `references/_canonical-corpus` inside the
  folder.
- `references/_canonical-corpus` is a pinned, digest-checked third-party design corpus. Some of its file
  names are brand names, which are subjects of design study. It is left byte-for-byte as it was, because
  changing it would break the digest check.
- Four tests that loaded the plugin catalog, hook driver or runtime command contract were deleted.

## visual-qa

- The skill root is `VISUAL_QA_ROOT="${CODEX_HOME:-$HOME/.codex}/skills/visual-qa"` everywhere, replacing
  the plugin-relative root.
- The reviewer passage now asks the session for a reviewer role. LitCodex provides
  `litcodex-litwork-reviewer`; when none exists, the check returns BLOCKED and does not invent one. The
  managed-marketplace and package-verification passages are rewritten for a copied skill.
- The design-contract validator is copied into `test/uiux-design-contract.mjs`, and the adversarial test
  imports it from there. The fixture no longer exports the plugin's reviewer TOML, and `visual-qa.test.ts`
  no longer asserts on it.
- The marketplace scenario driver and the entrypoint-symlink test were deleted, because both drove the
  plugin install.

## lit-typographic-motion

- Pretendard Regular and Bold (official, unmodified OTFs) and their license are bundled in
  `fonts/pretendard/`. `engine/fonts.mjs` reads them there and tags them `copied`, so the font budget test
  still holds.
- `engine/constants.mjs` builds `INSTALL_COMMAND` from the skill's own `scripts/runtime.mjs`.
  `engine/runtime.mjs` and `scripts/runtime.mjs` cache under `~/.cache/lit-typographic-motion/runtime`. Usage
  text, log prefix and lock message no longer name the plugin's `motion-runtime` command.
- New `scripts/qa-cover-recipes.mjs` is ported from the plugin's cover QA tool and resolves the skill from
  its own location. The credit and cover tests use it instead of a repository root.
- SKILL.md: procedure step 1 sets `SKILL_DIR` and runs `runtime.mjs status`. The hard stop runs
  `node "$SKILL_DIR/scripts/runtime.mjs" install`. The evidence section says no hook runs the film check for
  you. The references `runtime.md` (commands, cache path, no pre-warm), `cover.md`, `quality-gate.md`,
  `stage.md` and `type-and-timing.md` follow the same change.
- The notices, comments, fixture font path and recipe notes are updated to match. The runtime package is
  renamed `lit-typographic-motion-runtime`. The motion-3d guard regex now rejects `../`, `plugins/` and
  `marketplaces/` paths.
- Five tests deleted: enrollment, runtime command, launch, routing and Stop guard. They tested the plugin's
  wiring.

## readme-studio

- SKILL.md: registration and selection lines describe a copied skill. `references/facts-and-assembly.md`
  wording follows. Its own pinned Remotion or HyperFrames renderer path is unchanged, so it needs no other
  skill.

## How this was checked

- A static grep over all nine folders checks five things: `../` escapes, removed plugin commands and
  hooks, other harness or product names, machine paths and cross-skill paths. The digest-pinned corpus is
  excluded only from the product-name check. That grep looked for literal `../` text and missed the
  diagram detector path, which climbed from a variable holding the skill root. `npm test` now follows the
  paths each script builds from its own location (`path.resolve`/`join`, `new URL`, relative imports,
  `Path(__file__)`) in every edition, and runs the diagram detector and doctor from a folder copied alone.
- The kept tests run green from a copy outside any repository. The office and motion runtimes install from
  the folders' own scripts. A deck compiled and passed `qa`, a document converted and passed `qa`, the
  schematic doctor passed on the bundled font, and the visualization preflight reported its source complete.
