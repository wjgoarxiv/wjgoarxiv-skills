# AGENTS.md — variants/

`variants/<product>/<id>/` holds another product's own edition of a moved skill (Codex, OpenCode, Grok Build,
Antigravity, Muse, Hermes), installed by copying the folder, not as a Claude Code plugin. The parent `AGENTS.md`
still applies; this file covers what differs.

## How an edition changes

1. It first lands byte for byte from the product commit that last shipped it, committed together with
   `receipts/variants-<product>.sha256` (three fields per row: sha256, source path, destination path).
   Do not edit the receipt afterwards; `npm test` checks it against the files at the commit that last touched it.
2. Changes that make it run on its own come in later, separate commits (`fix(variants/<product>): ...`) and are
   recorded in `variants/<product>/CHANGES.md`. An edition that differs from its receipt must have that file.
3. Unlike `plugins/<family>/`, there is no `plugin.json` version to bump here.

## What an edition must not do

- Reach outside its own folder: every `../` that leaves `<id>/` must point to a file copied inside it
  (`test/variants-self-contained.test.mjs`).
- Depend on the product's plugin-only surfaces (hooks, runtime commands, doctor, vendor folder, managed marketplace),
  or assume a sibling skill is installed. Name siblings by bare id with "when installed".
- Use `rm -r`, `cp -R` into an existing skills folder, or a `<clone>#<subfolder>` source in any install line.

Keep the `litfamily.*` / `<product>.*` schema ids and the env knobs the skill's code reads as they are.

## Verify

```bash
npm test
```

When install lines change, follow the parent rule: `test/stub-install-lines.json`, both READMEs and the matching
`CHANGES.md` move in the same commit.
