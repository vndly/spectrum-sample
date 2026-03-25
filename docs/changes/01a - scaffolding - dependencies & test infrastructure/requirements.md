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

## Context & Background

### Dependencies

- Phase 00 (Setup) complete — Vue 3, Vite, TypeScript, Tailwind v4, vue-i18n, lucide-vue-next all installed.

## Decisions

| Decision         | Choice                                  | Rationale                                                                                                                                           |
| :--------------- | :-------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testing approach | Unit + component tests (Vitest + jsdom) | Conformance with existing project standard (`docs/technical/testing.md`). Vitest already configured with jsdom; this phase extends that configuration. |
| Vitest globals   | `globals: true`                         | Enables `describe`, `it`, `expect`, `beforeEach` in test files without explicit imports. Reduces boilerplate across all test files in downstream phases. |

## Scope

### In Scope

- Install `vue-router@^4` as a runtime dependency.
- Install `@vue/test-utils@^2` as a dev dependency.
- Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block.
- Create `tests/setup.ts` with `localStorage.clear()` in `beforeEach`.

### Out of Scope

- Router configuration and route definitions (handled in 01d).
- No composables or components are introduced in this phase.
- No application tests are written in this phase — only the test infrastructure is set up.

## Functional Requirements

| ID    | Requirement               | Description                                                                                                                                                                                                                                                                                                                                             | Priority |
| :---- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| SC-01 | Dependency installation   | `vue-router@^4` installed as runtime dependency; `@vue/test-utils@^2` installed as dev dependency.                                                                                                                                                                                                                                                      | P0       |
| SC-27 | Test infrastructure setup | Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, and `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block. Create `tests/setup.ts` with `localStorage.clear()` in `beforeEach`. Note: `localStorage.clear()` is a direct call, intentionally exempt from the raw-localStorage prohibition in conventions.md — it is test-infrastructure teardown, not application data access. | P0       |

## Non-Functional Requirements

### Testing

- **Framework:** Vitest with jsdom environment. Additional configuration required this phase: `globals: true`, `include`, `setupFiles`, and `tests/setup.ts`.
- **Test types:** This phase installs the infrastructure that enables unit tests (for composables and router logic) and component tests (using `@vue/test-utils`) in downstream phases. No tests are written in this phase.
- **File naming:** `*.test.ts` files in a dedicated `tests/` folder at the project root, mirroring the `src/` directory structure.
- **Coverage target:** Not applicable — no composables or components are introduced in this phase.
- **CI integration:** `npm run check` (format with auto-fix, lint with auto-fix, type-check, test, build) must pass with zero failures. Note: this script applies auto-formatting and auto-fixing, not read-only verification.

## Risks & Assumptions

### Assumptions

- Phase 00 (Setup) is fully released and the base tooling is stable.
- `vitest.config.ts` uses the `mergeConfig(viteConfig, defineConfig({ test: {} }))` pattern and the `test: {}` block can be extended with additional properties.
- The `@` path alias (`@ → ./src`) configured in `vite.config.ts` is inherited by Vitest via `mergeConfig` and does not need separate configuration.

### Risks

- **`globals: true` may conflict with explicit Vitest imports:** If a downstream test file explicitly imports `describe`/`it`/`expect` from `vitest` while globals are enabled, TypeScript may flag duplicate declarations. Mitigation: project convention should mandate using globals without imports.
- **TypeScript global type recognition:** Enabling `globals: true` in Vitest does not automatically make `describe`/`it`/`expect` visible to the TypeScript compiler. A `/// <reference types="vitest/globals" />` directive in `tests/setup.ts` or a `types: ["vitest/globals"]` entry in tsconfig may be needed. Mitigation: verify during implementation and add the necessary type configuration.

## Acceptance Criteria

- [ ] [SC-01] `package.json` lists `vue-router@^4` under `dependencies`
- [ ] [SC-01] `package.json` lists `@vue/test-utils@^2` under `devDependencies`
- [ ] [SC-27] `vitest.config.ts` updated with `globals: true`, `include`, and `setupFiles` inside the existing `test: {}` block
- [ ] [SC-27] `tests/setup.ts` exists with `localStorage.clear()` in `beforeEach`
- [ ] [SC-27] `npm run test` runs without config errors
- [ ] [SC-27] `npm run check` passes with zero failures

## Constraints

- **Runtime dependencies:** No new runtime dependencies beyond `vue-router@^4`. All other tools (Tailwind, vue-i18n, lucide-vue-next) are already installed from Phase 00.
- **Dev dependencies:** `@vue/test-utils@^2` is the only new dev dependency.
