---
id: R-01a
title: App Scaffolding — Dependencies & Test Infrastructure
status: released
type: infrastructure
importance: critical
tags: [dependencies, testing, dx]
---

## Intent

Install vue-router and @vue/test-utils, configure the Vitest test infrastructure so all subsequent scaffolding phases can write and run tests.

## Context & Background

### Problem Statement

Downstream scaffolding features (01b through 01k) need test infrastructure and routing/test-utils dependencies before they can write or validate code. Without a configured Vitest setup and the required npm packages, no tests can be authored in subsequent phases.

### User Stories

- As a developer working on phases 01b–01k, I need Vitest globals and `@vue/test-utils` available so I can write component and unit tests without additional setup.
- As a developer working on phase 01d (Router), I need `vue-router` installed so I can configure routing without additional dependency setup.

### Dependencies

- Phase 00 ([R-00](../../product/00%20-%20setup/requirements.md)) complete — Vue 3, Vite, TypeScript, Tailwind v4, vue-i18n, lucide-vue-next all installed.

## Decisions

| Decision         | Choice                                  | Rationale                                                                                                                                                                          |
| :--------------- | :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testing approach | Unit + component tests (Vitest + jsdom) | Conformance with existing project standard ([docs/technical/testing.md](../../technical/testing.md)). Vitest already configured with jsdom; this phase extends that configuration. |
| Vitest globals   | `globals: true`                         | Enables `describe`, `it`, `expect`, `beforeEach` in test files without explicit imports. Reduces boilerplate across all test files in downstream phases.                           |

## Scope

### In Scope

- Install `vue-router@^4.5` as a runtime dependency.
- Install `@vue/test-utils@^2.4` as a dev dependency.
- Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block.
- Create `tests/setup.ts` with `localStorage.clear()` in `beforeEach` and `/// <reference types="vitest/globals" />` for TypeScript global recognition.

### Out of Scope

- Router configuration and route definitions (handled in 01d).
- No composables or components are introduced in this phase.
- No application tests are written in this phase — only the test infrastructure is set up.

> All subsequent scaffolding features (01b through 01k) depend on the infrastructure established here.

## Functional Requirements

> Requirement IDs use a feature-scoped prefix (`SC-01a-`) to avoid collisions with IDs in sibling features that share the scaffolding numbering space.

| ID        | Requirement             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Priority |
| :-------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| SC-01a-01 | Dependency installation | `vue-router@^4.5` installed as runtime dependency; `@vue/test-utils@^2.4` installed as dev dependency.                                                                                                                                                                                                                                                                                                                                                              | P0       |
| SC-01a-02 | Vitest configuration    | Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, and `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block. Update the code example in `docs/technical/testing.md` to remove explicit Vitest imports, aligning with the `globals: true` convention.                                                                                                                                                             | P0       |
| SC-01a-03 | Test setup file         | Create `tests/setup.ts` with `/// <reference types="vitest/globals" />` at the top for TypeScript global recognition and `localStorage.clear()` in `beforeEach`. Note: `localStorage.clear()` is a direct call, intentionally exempt from the [conventions.md](../../technical/conventions.md) guardrail requiring all localStorage access to go through the typed storage service (section 6) — this is test-infrastructure teardown, not application data access. | P0       |

## Non-Functional Requirements

### Testing

- **NFR-01a-01 (CI integration):** `npm run check` must pass with zero failures. This script runs the following sub-commands in sequence: `format`, `lint:fix`, `type-check`, `test`, `build`. It applies auto-formatting and auto-linting before type-check, test, and build — it mutates files on disk rather than performing read-only verification.
- **NFR-01a-02 (File naming):** All test files must use the `*.test.ts` naming convention under a dedicated `tests/` directory at the project root, mirroring the `src/` directory structure.

## Risks & Assumptions

### Assumptions

- Phase 00 (Setup) is fully released and the base tooling is stable.
- `vitest.config.ts` uses the `mergeConfig(viteConfig, defineConfig({ test: {} }))` pattern and the `test: {}` block can be extended with additional properties.
- The `@` path alias (`@ → ./src`) configured in `vite.config.ts` is inherited by Vitest via `mergeConfig` and does not need separate configuration.

### Risks

- **`globals: true` may conflict with explicit Vitest imports:** If a downstream test file explicitly imports `describe`/`it`/`expect` from `vitest` while globals are enabled, TypeScript may flag duplicate declarations. Likelihood: Low. Impact: Medium (TypeScript compile errors in downstream tests). Mitigation: project convention should mandate using globals without imports; the code example in `docs/technical/testing.md` will be updated as part of this phase to remove the explicit import and align with this convention.
- **TypeScript global type recognition:** Enabling `globals: true` in Vitest does not automatically make `describe`/`it`/`expect` visible to the TypeScript compiler. Likelihood: Low. Impact: High (all downstream test files would fail type-checking). Mitigation: add `/// <reference types="vitest/globals" />` directive at the top of `tests/setup.ts` (specified in SC-01a-03).

## Acceptance Criteria

- [ ] [SC-01a-01] `package.json` lists `vue-router@^4.5` under `dependencies`
- [ ] [SC-01a-01] `package.json` lists `@vue/test-utils@^2.4` under `devDependencies`
- [ ] [SC-01a-02] `vitest.config.ts` updated with `globals: true`, `include`, and `setupFiles` inside the existing `test: {}` block
- [ ] [SC-01a-03] `tests/setup.ts` exists with `localStorage.clear()` in `beforeEach`
- [ ] [SC-01a-03] `tests/setup.ts` includes `/// <reference types="vitest/globals" />` for TypeScript global recognition
- [ ] [SC-01a-02] `npm run test` runs without config errors
- [ ] [SC-01a-02, NFR-01a-01] `npm run check` passes with zero failures (note: the `check` script runs `format` and `lint:fix` which may auto-fix files — this is inherited behavior from Phase 00, not introduced by this phase)
- [ ] [SC-01a-02] `docs/technical/testing.md` code example updated to use Vitest globals without explicit imports, aligning with the `globals: true` convention

## Constraints

- **Runtime dependencies:** No new runtime dependencies beyond `vue-router@^4.5`. All other tools (Tailwind, vue-i18n, lucide-vue-next, Zod) are already installed from Phase 00.
- **Dev dependencies:** `@vue/test-utils@^2.4` is the only new dev dependency.
