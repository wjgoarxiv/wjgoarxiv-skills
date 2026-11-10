# AGENTS.md — wjgoarxiv-skills

This repository holds the content-production skills that moved out of the LitFamily products. It is a Claude Code
marketplace: one plugin per family under `plugins/<family>/`. Read `README.md` for the layout and install lines.

## Moving a family in

1. Copy each skill folder, and any shared runtime file it reaches, byte for byte from the product commit that last
   shipped it. Do not edit the copies; a fix goes into a later, separate commit with its own note.
2. Write `receipts/<family>.sha256`, one line per file: `sha256  <source path at commit>  <destination path>`.
3. Add `plugins/<family>/.claude-plugin/plugin.json`, the family's `LICENSE`, and one entry in
   `.claude-plugin/marketplace.json`.
4. Add the family row to the README table and remove it from the "still to move" list.
5. Run `npm test`, `claude plugin validate .` and `claude plugin validate plugins/<family>`.

The product side of the move (the same-name stub, routes, pins and docs) lives in the product repo, in the same
product release.

## Rules

- Each family plugin works with no LitFamily product installed.
- No machine-specific paths in tracked files: write `<path to your wjgoarxiv-skills clone>` instead.
- No push, publish, tag or remote creation without the maintainer's explicit yes.
