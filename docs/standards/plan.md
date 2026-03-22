# plan.md

## Review Checks

- **Structure**: Organized into phases with numbered steps and checkboxes.
- **Ordering**: Steps are in a logical sequence. No step depends on something that hasn't happened yet.
- **File impact map**: Referenced file paths are realistic — existing paths must actually exist, new paths must follow the naming and structure conventions in `docs/technical/conventions.md`.
- **Feasibility**: Steps are actionable and concrete, not vague.
- **Traceability**: Every functional requirement from `requirements.md` maps to at least one step. Flag any requirement with no corresponding step, and any step that introduces work outside the defined scope.
- **Verification phase**: Plan must end with a verification phase listing concrete, runnable pass/fail checks (e.g., `npm run test`, `npm run build`). Flag if missing or if checks are vague (e.g., "verify it works").
- **Testing coverage**: Plan must include a testing phase with test files mapped to the components or logic they validate. Test approach must follow patterns defined in `docs/technical/testing.md`. Flag if testing is absent or deferred without justification.
- **Dependency management**: Steps that install packages must specify version ranges. Flag any dependency added without a version constraint.
- **Specification depth**: Steps that create files must include enough detail (props, types, behavior, config values) that two developers would produce the same result. Flag vague creation steps (e.g., "create a toast component" with no spec).
- **Phase boundaries**: Each phase should be independently verifiable — the project must not be left in a broken state between phases. Flag phases where a partial completion would break the build or tests.
- **Cross-references**: References to other docs (`architecture.md`, `conventions.md`, `tech-stack.md`, etc.) must point to documents that exist and be consistent with their content.
- **Granularity**: Steps should be small enough to complete in one pass but not trivially small. Flag steps that bundle unrelated work into a single checkbox, or steps that are just "create a file" with no detail.
- **Rollback safety**: Destructive steps (replacing files, changing config, data migrations) must note a rollback path or be flagged as irreversible.
