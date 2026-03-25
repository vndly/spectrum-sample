---
id: R-01a
title: App Scaffolding — Dependencies & Test Infrastructure
status: draft
type: infrastructure
importance: critical
tags: [dependencies, testing, dx]
---

## Intent

Install vue-router and @vue/test-utils, configure the Vitest test infrastructure so all subsequent scaffolding phases can write and run tests.

## Prerequisites

- Phase 00 (Setup) complete — Vue 3, Vite, TypeScript, Tailwind v4, vue-i18n, lucide-vue-next all installed.

## Decisions

| Decision         | Choice                                  | Rationale                                                                                                                                                                     |
| :--------------- | :-------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testing approach | Unit + component tests (Vitest + jsdom) | Vitest already configured with jsdom. Unit tests for composables and router logic; component tests for UI components using `@vue/test-utils`. |

## Scope

- Install `vue-router@^4` as a runtime dependency.
- Install `@vue/test-utils@^2` as a dev dependency.
- Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block.
- Create `tests/setup.ts` with `localStorage.clear()` in `beforeEach`.

## Functional Requirements

| ID    | Requirement                | Description                                                                                                                                                                     | Priority |
| :---- | :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| SC-01 | Vue Router setup           | `vue-router@^4` installed; `@vue/test-utils@^2` installed as dev dependency.                                                                                                    | P0       |
| SC-27 | Test infrastructure setup  | Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, and `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block. Create `tests/setup.ts` with `localStorage.clear()` in `beforeEach`. | P0       |

## Non-Functional Requirements

### Testing

- **Framework:** Vitest with jsdom environment. Additional configuration required this phase: `globals: true`, `include`, `setupFiles`, and `tests/setup.ts`.
- **Test types:** Unit tests for composables and router logic; component tests for Vue components using `@vue/test-utils`.
- **File naming:** `*.test.ts` files in a dedicated `tests/` folder at the project root, mirroring the `src/` directory structure.
- **Coverage target:** All composables and all components introduced in this phase must have tests.
- **CI integration:** `npm run check` (format, lint, type-check, test, build) must pass with zero failures.

## Acceptance Criteria

- [ ] `npm install` succeeds with new deps (`vue-router@^4`, `@vue/test-utils@^2`)
- [ ] `vitest.config.ts` updated with `globals: true`, `include`, and `setupFiles`
- [ ] `tests/setup.ts` exists with `localStorage.clear()` in `beforeEach`
- [ ] `npm run test` runs without config errors

## Constraints

- **Runtime dependencies:** No new runtime dependencies beyond `vue-router@^4`. All other tools (Tailwind, vue-i18n, lucide-vue-next) are already installed from Phase 00.
- **Dev dependencies:** `@vue/test-utils@^2` is the only new dev dependency.
