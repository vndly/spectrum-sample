---
name: audit-documentation
description: Audit project documentation for accuracy, consistency, completeness, and quality by cross-referencing against the codebase.
user-invocable: true
---

# Audit Documentation

Audit the project's documentation for accuracy, consistency, completeness, and quality by cross-referencing against the actual codebase.

## Trigger

On-demand only, invoked via `/audit-documentation`.

## Scope

- Read all files inside `docs/`, **excluding** `docs/product/` and `docs/roadmap/`.
- Cross-reference documentation claims against the actual codebase (source files, configs, folder structure).

## Checks

### 1. Factual Accuracy vs Code

Verify that what the docs describe matches reality:

- Folder structure and file paths mentioned in docs actually exist.
- Tech stack, dependencies, and versions match `package.json` and config files.
- Data models, types, and interfaces match actual TypeScript definitions.
- Composables, functions, and modules referenced in docs exist in the codebase.
- CLI commands (dev, build, test, etc.) match `package.json` scripts.
- Environment variables documented match what the code actually reads.
- Deployment steps and config match actual setup (e.g., `firebase.json`).

### 2. Internal Consistency

- Terms, entity names, and descriptions are used consistently across all docs (e.g., "LibraryEntry" should not appear as "library entry" or "Library Entry" inconsistently).
- When a concept is described in multiple docs, the descriptions should not contradict each other.

### 3. Glossary Coverage

- Flag terms used in docs that are not defined in `glossary.md`.
- Flag terms defined in `glossary.md` that are never referenced in any other doc.

### 4. Cross-References

- Links between docs point to files that exist.
- Docs that discuss related topics reference each other where appropriate.
- Anchor links (if any) resolve to valid headings.

### 5. Completeness

Flag topics that should be documented but aren't:

- Env vars used in code but not documented.
- Exported functions/composables without corresponding doc coverage.
- Config files that exist but aren't explained.
- Architectural decisions implied by code but not captured in docs.
- Any section that is a stub or placeholder (e.g., empty sections, "TBD" markers).

### 6. Correctness

- Outdated information (features described that no longer exist, old patterns).
- Contradictions between different docs.
- Inaccurate descriptions of how something works vs how the code actually behaves.

### 7. Clarity & Quality

- Ambiguous or vague sections that could confuse a new developer.
- Incomplete explanations (steps missing from a process, options not fully described).
- Structural issues (missing headings, inconsistent formatting across docs).

## Output Format

Produce a report with two parts:

### Part 1: Findings by File

For each file that has findings, list them grouped under the file path. Each finding includes:

- **Category** — one of: Accuracy, Consistency, Glossary, Cross-Reference, Completeness, Correctness, Clarity.
- **Location** — the section or line where the issue is (if applicable).
- **Issue** — what's wrong.
- **Fix** — what should be done to resolve it.

If a file has no findings, omit it from the report.

### Part 2: Missing Documentation

A list of topics or documents that should exist but don't, with a brief justification for each.

## Behavior

- **Report only** — do not modify any files.
- Read the codebase as needed to verify claims (source files, configs, `package.json`, folder structure, TypeScript types, etc.).
- Be specific in findings — cite the exact doc text and the actual code state.
- Do not flag stylistic preferences or subjective opinions — only actionable issues.
