---
name: format-index
description: MUST be applied whenever any index.md file is created or edited. Formats index files to follow a consistent structure with numbered entries, bold linked titles, and short descriptions.
---

# Format Index

## Trigger Modes

- **Auto-triggered** (no arguments): You detected that a specific `index.md` file was created or edited. Apply the format rules to that file only.
- **Manual** (invoked as `/format-index`): Find **all** `index.md` files in the project using glob `**/index.md`, then read and reformat any that don't conform.

## Required Structure

```markdown
# Section Title

## Contents

1. **[Entry Title](./path-to-file-or-dir)**: Short one-line description.
2. **[Entry Title](./path-to-file-or-dir)**: Short one-line description.
```

## Rules

1. The file must start with an `h1` heading describing the section.
2. A `## Contents` heading introduces the list.
3. Each entry is a numbered list item with:
   - A **bold linked title**: `**[Title](./relative-path)**`
   - Followed by a colon and a short description (one sentence, no period-less fragments).
4. Each entry is on a single line — no multi-line entries or blank lines between items.
5. Links use relative paths (e.g., `./file.md`, `./subdirectory/`).
6. Descriptions should be concise (under ~15 words) and describe the content, not repeat the title.
7. Do not add any other content or sections beyond the heading and the numbered list unless the file already has additional content below the list — in that case, leave it intact.
