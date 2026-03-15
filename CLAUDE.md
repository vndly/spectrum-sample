# CLAUDE.md

## Planning

- **Plan & Pause**: Propose a clear, step-by-step plan before making any code changes. Stop after planning and proceed only after I verify.
- **Ambiguity Handling**: If any requirement is ambiguous, risky, or unclear, state your assumptions explicitly and ask for confirmation before proceeding.

## Rules

- **Strict Scope**: Do not add features, refactor, or reorganize beyond what was explicitly requested.
- **UI/UX**: Always use the `frontend-design` skill when changing the UI.
- **Code Review**: After completing code changes, run `/delta-review` before responding.
- **Doc Maintenance**: After changes, check if `CLAUDE.md` needs updating.
- **Index Files**: When editing any `index.md` file, automatically apply the `format-index` skill to ensure consistent formatting.
