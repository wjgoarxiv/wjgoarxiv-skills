# AGENTS.md — wjgoarxiv-skills

This repository holds the content-production skills that moved out of the LitFamily products. It is a Claude Code
marketplace: one plugin per family under `plugins/<family>/`. Read `README.md` for the install lines and `docs/reference.md` for the layout.

## Moving a family in

1. Copy each skill folder, and any shared runtime file it reaches, byte for byte from the product commit that last
   shipped it. Do not edit the copies; a fix goes into a later, separate commit with its own note. The only edit a
   family plugin takes is a line that runs a product command the product later removed: swap it for a command the
   plugin runs by itself, keep the cache paths, mark the receipt row `edited-from:<sha256>` and list the file under
   "Edited after the move" in README.md.
2. Write `receipts/<family>.sha256`, one line per file: `sha256  <source path at commit>  <destination path>`.
3. Add `plugins/<family>/.claude-plugin/plugin.json`, the family's `LICENSE`, and one entry in
   `.claude-plugin/marketplace.json`.
4. Add the family to the family sections of both READMEs (`What you can make`) and both `docs/reference*.md`
   files (`What each family carries`), English and Korean.
5. Run `npm test`, `claude plugin validate .` and `claude plugin validate plugins/<family>`.

The product side of the move (the same-name stub, routes, pins and docs) lives in the product repo, in the same
product release.

## Rules

- Each family plugin works with no LitFamily product installed.
- No machine-specific paths in tracked files: write `<path to your wjgoarxiv-skills clone>` instead.
- Every content change to a family plugin (any file under `plugins/<family>/`) bumps `version` in
  `plugins/<family>/.claude-plugin/plugin.json` in the same commit. `claude plugin marketplace update` followed by
  `claude plugin update <family>@wjgoarxiv-skills` installs a new copy only when that version changes; without the
  bump, users who already have the plugin keep the old files and are told they are on the latest version. The
  marketplace entries carry no `version` today; if one ever does, it changes together with `plugin.json`. Bumping is
  part of a release, so it still needs the maintainer's yes.
- When a product stub's install lines change, update `test/stub-install-lines.json`, the README pick-one table and
  the per-harness notes (both languages) and the matching `variants/<product>/CHANGES.md` in the same commit.
- No push, publish, tag or remote creation without the maintainer's explicit yes.
