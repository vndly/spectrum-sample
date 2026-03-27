# plan.md

## Plan Structure

- **Organization**: Organized into phases with numbered steps and checkboxes. Steps are in a logical sequence — no step depends on something that hasn't happened yet. Each phase should be independently verifiable; the project must not be left in a broken state between phases. Flag phases where partial completion would break the build or tests.
- **Granularity**: Steps should be small enough to complete in one pass but not trivially small. Flag steps that bundle unrelated work into a single checkbox, or steps that are just "create a file" with no detail.

## Step Quality

- **Specification depth**: Steps must be actionable and concrete, not vague. Steps that create files must include enough detail (props, types, behavior, config values) that two developers would produce the same result. Flag vague creation steps (e.g., "create a toast component" with no spec).

## Completeness

- **Traceability**: Every functional requirement from `requirements.md` maps to at least one step. Flag any requirement with no corresponding step, and any step that introduces work outside the defined scope.
- **Verification & testing**: Plan must end with a verification phase listing concrete, runnable pass/fail checks (e.g., `npm run test`, `npm run build`). Flag if missing or if checks are vague (e.g., "verify it works"). Plan must include a testing phase that specifies test-first order: tests are written before implementation code, derived from `scenarios/`, and run to confirm failure before the corresponding implementation is written. Test files must be mapped to the components or logic they validate. Flag if testing is absent, deferred without justification, or does not specify test-first order.
- **Scenario traceability**: Each test file in the testing phase must list the scenario IDs from `scenarios/` that it covers (e.g., `covering: SC-04-01, SC-04-02, SC-04-03`). Tests that verify implementation details not tied to a specific scenario (e.g., schema parsing edge cases, migration logic) should be marked as `(implementation detail)` instead. Flag test steps with no scenario references and no implementation-detail justification.
- **Dependency management**: Steps that install packages must specify version ranges. Flag any dependency added without a version constraint.
- **Rollback safety**: Destructive steps (replacing files, changing config, data migrations) must note a rollback path or be flagged as irreversible.

## Standards Compliance

Plan steps must be consistent with the project's technical reference docs. Flag any step that contradicts or ignores these sources:

- **Architecture**: Steps that create or move files must respect the layer boundaries and dependency rules in `docs/technical/architecture.md`. Flag any layer violation.
- **Security**: Steps that handle user input, API tokens, or storage must follow the defenses in `docs/technical/security.md`. Flag steps that expand the attack surface without documenting mitigations.
- **UI/UX**: Steps that create or modify UI components must follow `docs/technical/ui-ux.md`. Flag deviations with no justification.
- **Data model**: Steps that add or modify persisted data must match the schemas in `docs/technical/data-model.md`. Breaking shape changes require a migration plan. Flag schema changes with no migration plan.
- **API**: Steps that add or modify API calls must use the endpoints, parameters, and error-handling behavior documented in `docs/technical/api.md`. Flag undocumented endpoint usage.
- **Conventions**: Referenced file paths must be realistic — existing paths must actually exist, new paths must follow the conventions in `docs/technical/conventions.md`. References to other docs must point to documents that exist and be consistent with their content. Flag steps that assume different patterns without justification.
- **Testing**: Steps specifying test strategies or creating test files must align with `docs/technical/testing.md`. Flag steps that contradict the defined testing patterns.
- **Tech stack**: Steps must only assume technologies listed in `docs/technical/tech-stack.md`, or explicitly justify new ones.
