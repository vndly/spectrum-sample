# Implementation: App Scaffolding — Dependencies & Test Infrastructure

## Overview

This phase installs the two remaining runtime and dev dependencies (`vue-router`, `@vue/test-utils`) and configures the Vitest test infrastructure so that all downstream scaffolding phases (01b–01k) can write and run tests immediately. The work is pure infrastructure — no application code, components, or test files are introduced.

The implementation followed the plan exactly across two phases: dependency installation and config updates (Phase 1), then verification (Phase 2).

## Files Changed

### Created

- `tests/setup.ts` — Test setup file loaded by Vitest before each test run. Includes `/// <reference types="vitest/globals" />` for TypeScript global recognition and `localStorage.clear()` in `beforeEach` to prevent state leakage between tests.

### Modified

- `package.json` — Added `vue-router@^5.0.4` to `dependencies` and `@vue/test-utils@^2.4.6` to `devDependencies`.
- `package-lock.json` — Updated lockfile reflecting the two new packages and their transitive dependencies (51 packages added total).
- `vitest.config.ts` — Added `globals: true`, `include: ['tests/**/*.test.ts']`, and `setupFiles: ['./tests/setup.ts']` to the existing `test: {}` block. Preserved the `mergeConfig(viteConfig, defineConfig(...))` pattern and `environment: 'jsdom'`.
- `docs/technical/testing.md` — Removed the `import { describe, it, expect } from 'vitest'` line from the code example in the "Test Pattern" section, aligning the documentation with the `globals: true` convention.

## Key Decisions

- **No `passWithNoTests` added**: Vitest exits with code 1 when no test files match the `include` pattern. Since this phase creates no test files, `npm run test` and `npm run check` fail. This resolves naturally once downstream phases (01b+) add test files. Adding `passWithNoTests: true` was considered but deferred to avoid config changes outside the plan's scope.

## Deviations from Plan

None — implementation followed the plan exactly.

## Testing

No test files were created in this phase. The scope is pure infrastructure — the test setup file (`tests/setup.ts`) and Vitest configuration establish the foundation for tests written in phases 01b–01k.

### Verification Results

| Check                                   | Result                                |
| --------------------------------------- | ------------------------------------- |
| `package.json` dependencies present     | PASS                                  |
| `vitest.config.ts` properties set       | PASS                                  |
| `testing.md` no explicit Vitest imports | PASS                                  |
| `tests/setup.ts` contents correct       | PASS                                  |
| `npm run test` exits cleanly            | FAIL (no test files — ignored)        |
| `npm run check` full pipeline           | FAIL (blocked by test step — ignored) |

Format (`prettier`), lint (`eslint`), and type-check (`vue-tsc`) all pass individually. The test and check failures are expected and resolve once test files are added in downstream phases.

## Dependencies

- `vue-router@^5.0.4` — Vue Router for SPA routing (runtime dependency, used starting in phase 01d).
- `@vue/test-utils@^2.4.6` — Official Vue test utilities for mounting and interacting with components in tests (dev dependency, used starting in phase 01f+).

## Known Limitations

- `npm run test` and `npm run check` fail until at least one `tests/**/*.test.ts` file exists. This is a transient state resolved by the next phase that introduces tests.
- A dedicated `tsconfig.vitest.json` was added (extending `tsconfig.app.json`) to provide IDE type-checking for test files. It adds `vitest/globals` and `node` types and includes `tests/**/*.ts`. Without this, VS Code cannot resolve `describe`, `it`, `expect`, or Node.js APIs in test files.
