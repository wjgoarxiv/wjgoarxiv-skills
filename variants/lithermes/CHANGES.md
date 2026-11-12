# Hermes Agent editions: what changed and why

These nine folders are the Hermes Agent editions of the skills that left the LitHermes
plugin in the 2026-11 diet. Each one started as a byte copy of the plugin's own port at
LitHermes commit `a2466f2` (`packages/lithermes-installer/assets/lithermes-plugin/`), so
the body, the scripts and the measured expectations are the Hermes port the plugin
shipped, not the generic bodies under `plugins/`. `receipts/variants-lithermes.sha256`
records the SHA-256 of every file of that unchanged copy and its source path at that
commit; files edited, added or bundled from elsewhere in the plugin afterwards are
listed below.

## How a folder is installed and found

The LitHermes stub gives five lines, pasted together from the project's top folder: names, a
read-only check, a move of an old copy whole into `extension-backups/<date-time>-XXXX/` of the
profile (outside every folder Hermes reads skills from), the copy into the now-empty
`skills/<id>/`, and a receipt, `.litfamily-extension.json`, inside the copy:

```sh
H="${HERMES_HOME:-$HOME/.hermes}"; ID=<id>; SRC="<path to your wjgoarxiv-skills clone>/variants/lithermes/<id>"
[ -e "$H/skills/${ID:?}" ] && echo "taken: $H/skills/$ID" || echo "free: $H/skills/$ID"; grep -rlE --include=SKILL.md "^name: *[\"']?${ID}[\"']? *\$" "$H/skills" .hermes/skills .agents/skills 2>/dev/null; grep -A3 -E '^ *(external_dirs|create_dir):' "$H/config.yaml" 2>/dev/null
if [ -e "$H/skills/${ID:?}" ]; then mkdir -p "$H/extension-backups" && B=$(mktemp -d "$H/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXX") && mv "$H/skills/$ID" "$B/" && echo "moved aside: $B/$ID"; fi
if [ -e "$H/skills/${ID:?}" ]; then echo "stopped: $H/skills/$ID is still there"; else mkdir -p "$H/skills" && cp -R "$SRC" "$H/skills/$ID" && echo "copied: $H/skills/$ID"; fi
printf '{"id":"%s","source":"%s","variant":"lithermes","installed_at":"%s"}\n' "${ID:?}" "$SRC" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$H/skills/$ID/.litfamily-extension.json"
```

Updating means pasting the same lines again. Removing means the first line, then:

```sh
[ -e "$H/skills/${ID:?}" ] && mkdir -p "$H/extension-backups" && B=$(mktemp -d "$H/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXX") && mv "$H/skills/$ID" "$B/" && echo "moved aside: $B/$ID"
```

Hermes lists `<id>` in `<available_skills>`, loads it with `skill_view("<id>")`, and gives
it the slash command `/<id>`. Hermes replaces `${HERMES_SKILL_DIR}` inside `SKILL.md`
with the absolute folder path when it loads the skill, so every command in a `SKILL.md`
names its scripts through that token. Reference files are not substituted; they say
`<skill dir>` and mean the same folder.

## Decisions that apply to every folder

- **Self-contained.** In the plugin, several skills reached into each other or into the
  plugin root (`parents[3]`, `join(root, '..', 'lit-pptx', ...)`, `../../lit-diagram-drawer/...`).
  Each folder now carries its own copy of what it used, and no path climbs out of it.
  The bundled copies are listed per skill below.
- **No plugin surfaces.** The plugin's route context, route banners (`LIT IGNITED`,
  `▲ LIT · ...`), bare `lit` routes, `core_contract` blocks, the post-write prose hook,
  the motion receipt hooks, `payload-version.json`, `sync-plugin`, the installer's
  `doctor`/`check`/`status` lines and `hermes lithermes ...` commands are gone. Where the
  plugin enforced a step through one of them, the body now names the in-folder command
  or the manual step that replaces it, so no check silently disappeared.
- **Contract schema.** `lithermes_llm_contract/v1` became `hermes_skill_contract/v1`,
  and each activation block now describes a local skill (`skill_view`, install path,
  `<available_skills>`, `/<id>`).
- **Environment variables.** `LITHERMES_OFFICE_BOOTSTRAP_PYTHON` → `LIT_OFFICE_BOOTSTRAP_PYTHON`,
  `LITHERMES_OFFICE_PYTHON` → `LIT_OFFICE_PYTHON`, `LITHERMES_MOTION_*` → `LIT_MOTION_*`,
  `LITHERMES_BLENDER` → `LIT_MOTION_BLENDER`. The old names belonged to the plugin.
- **Caches and package names.** The office runtime caches under `<cache>/lit-office/<digest>`
  and the motion runtime under `<cache>/lit-typographic-motion/<digest>`. Runtime package
  names became `lit-office-runtime`, `lit-typographic-motion-runtime` and
  `readme-studio-{html-motion,motion,type}`; temp prefixes became `lit-docx-soffice-`,
  `lit-docx-pages-` and `lit-motion-webp-`.
- **Kept on purpose.** Internal machine identifiers that other files compare byte for byte
  keep their names: schema strings such as `lithermes.stills/v1`, `lithermes.cover-recipe/v1`,
  `lithermes.cover-negative/v1`, `lithermes.look/v1`, `lithermes.browser-drive-origin/v1`,
  `lithermes.frontend-ui-ux-ab/v1`, and the motion manifest key `manifest.lithermes`.
  Renaming them would break the recipes' measured expectations and existing evidence
  without changing behaviour. The sample cover recipes keep the word `LITHERMES` they were
  measured on.
- **Third-party text verbatim.** `frontend-ui-ux/references/_canonical-corpus/` and
  `lit-scientific-visualization/vendor/scientific-visualization/` are licensed upstream
  sources pinned by hash. They were not edited, even where they name other hosts.

## Per skill

### lit-pptx
- `SKILL.md`: new Hermes header and local-skill contract, mode matrix for `skill_view` and
  `/lit-pptx`, runtime and cache text with `LIT_OFFICE_BOOTSTRAP_PYTHON`, a disclaimer step
  in place of the prose hook, an examples-rebuild evidence line, and handoffs to lit-docx
  and lit-scientific-visualization only when those folders are installed.
- `bin/office.mjs` serves `doctor|pptx|qa|integrity|learn`. The `docx` targets left with
  the plugin; asking for one prints a pointer to the lit-docx skill.
- `NOTICE`, `references/direction-step.md`, `references/anti-slop-checklist.md`,
  `scripts/integrity.py`, `scripts/lib/render-adapter-pptx.js`, `scripts/lib/slide-ast.js`:
  plugin wording removed.

### lit-docx
- Bundles its own `bin/office.mjs`, `bin/hostexec.mjs` and `runtime/` locks (copied from
  lit-pptx) and the Pretendard Regular/Bold OTFs with their licence in `fonts/`.
- `bin/office.mjs` serves `doctor|docx|edit|pdf|audit|gate|lint` from `scripts/` and
  points deck commands at lit-pptx.
- `SKILL.md` header, contract and runtime text as for lit-pptx; `NOTICE`,
  `scripts/docx_gate.py`, `scripts/convert_md_to_pdf.py` and
  `references/direction-step.md` (the bare `lit` row) reworded.

### lit-diagram-drawer
- Bundles the visible-text detector (`scripts/humanizer_detector.py`) and its rules
  (`references/humanizer-rules.json`), which the plugin read from another skill.
- `scripts/diagram_checks.py` imports from its own `scripts/`; the detector's office
  branch, which needed the plugin, raises a clear error.
- `SKILL.md`, `scripts/diagram_cli.py` and `references/verifier-guide.md`: run-from-folder
  commands and evidence text. `python3 scripts/verify-all.py` checks 183 templates and 8
  examples from an installed copy.

### lit-schematic
- Bundles `assets/fonts/PretendardVariable.woff2` and its OFL, which it found in
  lit-diagram-drawer before.
- `scripts/lib/fonts.mjs` looks for the font in its own folder; `scripts/scaffold.mjs`
  guards writes against the skill root instead of the plugin root.
- `SKILL.md`: header, contract, `SKILL_ROOT="${HERMES_SKILL_DIR}"`, handoffs and hard stops.

### lit-scientific-visualization
- Bundles the vendored scientific-visualization source with its MIT licence, provenance
  and notice under `vendor/`; the per-file hashes in `ORIGIN.json` still match.
- The plugin module `scientific_visualization.py` became the standalone
  `scripts/preflight.py`: it imports each dependency for real and reports `READY` (exit 0),
  `DEGRADED` (exit 3) or missing source files (exit 2), with `--json`.
- `SKILL.md` rewritten for the local skill: no route banner or natural routes; the
  rich-figure guidance is kept in full.

### frontend-ui-ux
- Bundles `scripts/uiux_runtime_common.py`, the browser-drive probe
  (`scripts/browser-drive/`: `ORIGIN.json`, `capability_probe.py`, `redaction.py`) and
  the kit fonts (`kit/fonts/pretendard/`, `kit/fonts/jetbrains-mono/`).
- New `scripts/verify-corpus.mjs`: a dependency-free check of the canonical corpus
  manifest. It replaces the installer's doctor and package checks, which enforced the
  same bytes inside the plugin.
- `scripts/probe.mjs`, `capability_probe.py`, `design_intelligence.py`,
  `import_design_intelligence.py` and `design_contract_validation.py` resolve everything
  from their own folder; `kit/fonts.json` points at `kit/fonts/`; `kit/styles/field-notes.json`
  drops another product's name.
- `SKILL.md` and `references/complete-contract.md`: local-skill contract, the `/frontend-ui-ux`
  command (the plugin version said there was none), Hermes tools for implementation, and an
  install-verification section that copies the folder into an isolated `HERMES_HOME`
  instead of the installer transcript. The four references that told the reader to sync
  plugin payload hashes now say to rerun `verify-corpus.mjs`.

### visual-qa
- Bundles `scripts/uiux_runtime_common.py`; `scripts/visual_qa.py` imports from its own
  folder.
- `SKILL.md` and `references/complete-contract.md`: local-skill contract and
  `/visual-qa`, payload-sync steps replaced by a cleanup receipt, the delegation table
  written as Hermes needs rather than as translations of another host's tool names, and
  the same isolated-install verification as frontend-ui-ux.

### lit-typographic-motion
- Bundles the Pretendard OTFs in `fonts/pretendard/`; the `lit-pptx:` font token in the
  styles resolves there.
- `bin/runtime.mjs`: warm-up command, font path, cache marker and messages point at this
  folder; `bin/motion.mjs` usage header; comments in the engine.
- The plugin ran cover-recipe QA and wrote hook receipts; `references/cover.md` makes the
  recipe check a manual step and the receipts optional. `references/runtime.md`,
  `craft-loop.md`, `style-bibles.md`, `stage.md`, `type-craft.md` and `treatment.md`
  reworded; `recipes/painted-light/expected.json` no longer points at a file in the
  plugin repository.

### readme-studio
- `SKILL.md`: local-skill contract with `/readme-studio`; helpers resolve from
  `${HERMES_SKILL_DIR}` instead of a path the plugin registered. The `lit readme-studio`
  route and its banner line are gone.

## Checks run on this edition

- `node --check` on every JS/MJS file and `py_compile` on every Python file: clean.
- From copies in a temporary skills directory: both `office.mjs` usages and their
  refusals, `verify-all.py` (183 templates, 8 examples, no issues), `preflight.py`,
  `verify-corpus.mjs` (167 files, 3 legal), `probe.mjs` against a local page with a real
  browser, `visual_qa.py --help`, `runtime.mjs status`, `check_facts.py --help`.
- A static scan finds no `../` path or `parents[n]`/`'..'` climb that leaves its folder,
  and no removed plugin command, variable or product name outside the third-party trees.
