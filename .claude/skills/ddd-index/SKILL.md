---
name: ddd-index
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

## Filesystem Sync

After formatting, verify that the index entries are in sync with the actual filesystem. Use glob to list sibling files and directories next to the `index.md` (excluding `index.md` itself), then apply these rules:

1. **Remove stale entries**: If an entry links to a file or directory that does not exist on disk, remove it from the list.
2. **Add missing entries**: If a file (`.md`) or subdirectory exists as a sibling of the `index.md` but has no corresponding entry, add it to the list following the required entry format. Derive the title from the filename (strip numbering prefixes, extensions, and convert kebab-case/snake_case to title case). Write a concise description by reading the file's heading or contents.
3. **Fix out-of-sync entries**: For each existing entry, verify:
   - **Path**: The relative link resolves to an existing file or directory. Fix if incorrect (e.g., renamed file).
   - **Title**: The entry title reasonably matches the file's `h1` heading (if present). Update the title to match the heading if they differ.
   - **Description**: The description accurately reflects the file's content. Update if it is misleading or stale.
