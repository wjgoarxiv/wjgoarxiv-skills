---
name: frontend-ui-ux
description: Route authorized UI work to design guidance and rendered review.
---

## #contract.activation

```yaml
schema_version: hermes_skill_contract/v1
host: Hermes Agent
identity: {skill_id: frontmatter.name, invocation: 'skill_view("frontend-ui-ux")'}
install_path: ${HERMES_HOME:-~/.hermes}/skills/frontend-ui-ux
surfaces:
  skill_index: frontend-ui-ux in <available_skills>
  command: /frontend-ui-ux
  measured_probe: ${HERMES_SKILL_DIR}/scripts/probe.mjs
  visual_followup: visual-qa (separate skill folder)
```

Self-contained: probe, kit, fonts, schemas and references sit in `${HERMES_SKILL_DIR}`; no plugin needed.

```json
{"schema_version":"hermes_skill_contract/v1","skill_id":"frontend-ui-ux"}
```

## #contract.inputs

- Build only on request; plan/review are read-only. See `references/complete-contract.md` for scope and trust rules.

## #contract.mode_matrix

| Mode | Trigger | Contract |
|---|---|---|
| Build | Asked to implement | Build on the real stack. |
| Plan/review | Critique or review | Read only. |
| Direction | Choice open | Ask one key question. |
| Verification | A page can be served | Run the installed probe. |

## #contract.procedure

1. Read `references/README.md`, `references/operating-lanes.md`, and `references/production.md`.
2. Preserve design and behavior; check access and responsiveness.
3. Use Design Contract `litfamily.design-contract/v1beta2`; valid `litfamily.design-contract/v1beta1` is evidence-eligible. `litfamily.evidence-manifest/v1beta1` is a separate schema.
4. Resolve material choices and inspect states; source is not rendered evidence.
5. Ask the look first (Hermes clarify), recommended first; skip if named or "you choose". Non-interactive takes it and says so. For `build`, lock the look; probe enforces DS-001/002/003/006/008. Select `build`, `polish`, `audit`, or `harden` per `references/complete-contract.md` and its craft/slop rules. For a served page, set `UI_URL` and `UIUX_EVIDENCE_DIR` in `terminal` and run:

   `node "${HERMES_SKILL_DIR}/scripts/probe.mjs" --url "$UI_URL" --out "$UIUX_EVIDENCE_DIR" --static "$PWD"`

   Inspect its report and screenshots; report HIGH findings or exit 2 BLOCKED.

Route conceptual diagrams to `lit-diagram-drawer`.

## #contract.outputs

```json
{"schema_version":"hermes_skill_contract/v1","skill_id":"frontend-ui-ux","response":{"summary":"requested UI or review","material_gaps":[]}}
```

Return the requested result and material gaps; keep routine evidence labels out of reader-facing UI.

## #contract.output_channels

```yaml
artifact_genre: client_deliverable
limitations_channel: reply
```

## #contract.evidence

- The probe verifies web UI; the `visual-qa` skill (if installed) judges afterward. Dials: variance, motion, density.

## #contract.hard_stops

- Follow the authorization and preservation stops in `references/complete-contract.md`.
- After editing this folder, run `node ${HERMES_SKILL_DIR}/scripts/verify-corpus.mjs` and check an isolated install.

## #contract.anti_patterns

- Follow the anti-pattern table in `references/complete-contract.md`.

## Read map

Read `references/complete-contract.md` and its router; `references/taste-direction.md` is optional, `default-editorial-pixel.json` the fallback.
