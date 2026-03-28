---
name: audit-index
description: MUST be applied whenever any index.md file is created or edited. Formats index files to follow a consistent structure with numbered entries, bold linked titles, and short descriptions.
---

# Format Index

## Trigger Modes

- **Auto-triggered** (no arguments): You detected that a specific `index.md` file was created or edited. Apply the format rules to that file only.
- **Manual** (invoked as `/format-index`): Find **all** `index.md` files in the project using glob `**/index.md`, then read and reformat any that don't conform.

## Standard

Read and apply the rules defined in `docs/standards/index-file.md`.

## Rules

- **Format after editing**: After creating or editing any `index.md` file, run `npm run format` to ensure consistent formatting.
