# plan.md

## Plan Structure

- **Organization**: Organized into phases with numbered steps and checkboxes. Steps are in a logical sequence — no step depends on something that hasn't happened yet. Each phase should be independently verifiable; the project must not be left in a broken state between phases. Flag phases where partial completion would break the build or tests.
- **Granularity**: Steps should be small enough to complete in one pass but not trivially small. Flag steps that bundle unrelated work into a single checkbox, or steps that are just "create a file" with no detail.

## Step Quality

- **Specification depth**: Steps must be actionable and concrete, not vague. Steps that create files must include enough detail (props, types, behavior, config values) that two developers would produce the same result. Flag vague creation steps (e.g., "create a toast component" with no spec).

## Completeness

- **Traceability**: Every functional requirement from `requirements.md` maps to at least one step. Flag any requirement with no corresponding step, and any step that introduces work outside the defined scope.
- **Verification & testing**: Plan must end with a verification phase listing concrete, runnable pass/fail checks (e.g., `npm run test`, `npm run build`). Flag if missing or if checks are vague (e.g., "verify it works"). Plan must include a testing phase with test files mapped to the components or logic they validate. Test approach must follow patterns defined in `docs/technical/testing.md`. Flag if testing is absent or deferred without justification.
- **Dependency management**: Steps that install packages must specify version ranges. Flag any dependency added without a version constraint.
- **Rollback safety**: Destructive steps (replacing files, changing config, data migrations) must note a rollback path or be flagged as irreversible.

## Standards Compliance

Plan steps must be consistent with the project's technical reference docs. Flag any step that contradicts or ignores these sources:

- **Architecture**: Steps that create or move files must respect the 4-layer dependency rules in `docs/technical/architecture.md` — Presentation imports Application only, Application imports Domain + Infrastructure, Domain has no app imports, Infrastructure imports Domain only. New components must land in the correct `components/` subdirectory, composables must return the standard `{ data, loading, error, refresh? }` shape, and no raw `localStorage` access outside `storage.service.ts`. Flag any layer violation.
- **Security**: Steps that handle user input, API tokens, or localStorage must follow the defenses in `docs/technical/security.md` — no `v-html`, Zod validation on storage reads, tokens only in `.env`, input trimming before storage or API use. Flag steps that introduce new attack surface (new user input flows, new storage keys, new external API calls) without documenting mitigations.
- **UI/UX**: Steps that create or modify UI components must follow `docs/technical/ui-ux.md` — Tailwind-only styling (no inline styles or separate CSS), correct theme color tokens, skeleton loaders (no spinners), desktop-first responsive breakpoints, and standard component patterns (MovieCard, Hero Banner, etc.). Flag deviations with no justification.
- **Data model**: Steps that add or modify persisted data (localStorage entries, Zod schemas, settings fields) must match the models in `docs/technical/data-model.md`. New storage keys must be placed under the documented top-level schema. Breaking shape changes require a `schemaVersion` bump and an idempotent migration in `storage.service.ts`. Flag schema changes with no migration plan.
- **API**: Steps that add or modify API calls must use the endpoints, parameters, and response types documented in `docs/technical/api.md`. Responses must be validated through Zod schemas. Pagination is page-1-only — no infinite scroll or multi-page fetching. Rate-limit handling (exponential backoff for 429) and error behavior must follow the documented table. Image URLs must use `buildImageUrl()`, not raw string concatenation. Flag undocumented endpoints or parameter usage.
- **Conventions**: Referenced file paths must be realistic — existing paths must actually exist, new paths must follow the naming and structure conventions in `docs/technical/conventions.md`. References to other docs must point to documents that exist and be consistent with their content. Flag steps that assume different patterns without justification.
- **Testing**: Steps specifying test strategies or creating test files must align with `docs/technical/testing.md`. Flag steps that contradict the defined test runner, file structure, layer mocking strategy, or coverage expectations.
- **Tech stack**: Steps must only assume technologies listed in `docs/technical/tech-stack.md`, or explicitly justify new ones.
