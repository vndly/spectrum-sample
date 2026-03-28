# Implementation: App Scaffolding

## Overview

This implementation covers the foundational scaffolding layers for the application. It installs the two remaining runtime and dev dependencies (`vue-router`, `@vue/test-utils`), configures the Vitest test infrastructure, and adds 18 i18n keys across 5 namespaces to all three locale files. It also establishes the visual foundation with Tailwind theme color tokens for success/error states, Vue `<Transition>` CSS classes for route fades, toast notifications, and modal dialogs, a `prefers-reduced-motion` override for accessibility, and the `TOAST_DISMISS_MS` domain constant. All CSS is centralized in `src/assets/main.css` as an acknowledged exception to the Tailwind-only rule, since Vue's `<Transition>` component requires class-based CSS.

## Files Changed

### Created

- `tests/setup.ts` — Test setup file loaded by Vitest before each test run. Includes `/// <reference types="vitest/globals" />` for TypeScript global recognition and `localStorage.clear()` in `beforeEach` to prevent state leakage between tests.
- `tests/presentation/i18n/locale-keys.test.ts` — Unit test validating locale file structure: key parity across all three locales, non-empty string values, expected 19-key set, `app.title` preservation, and camelCase segment compliance (NFR-01b-01).
- `src/domain/constants.ts` — Exports `TOAST_DISMISS_MS = 4000`, the auto-dismiss timeout for toast notifications. Located in the Domain layer as a pure TypeScript constant consumed by downstream composables (R-01e) and components (R-01g).
- `tests/domain/constants.test.ts` — Unit tests verifying `TOAST_DISMISS_MS` is exported with value `4000` and is of type `number`.

### Modified

- `package.json` — Added `vue-router@^5.0.4` to `dependencies` and `@vue/test-utils@^2.4.6` to `devDependencies`.
- `package-lock.json` — Updated lockfile reflecting the two new packages and their transitive dependencies (51 packages added total).
- `vitest.config.ts` — Added `globals: true`, `include: ['tests/**/*.test.ts']`, and `setupFiles: ['./tests/setup.ts']` to the existing `test: {}` block. Preserved the `mergeConfig(viteConfig, defineConfig(...))` pattern and `environment: 'jsdom'`.
- `docs/technical/testing.md` — Removed the `import { describe, it, expect } from 'vitest'` line from the code example in the "Test Pattern" section, aligning the documentation with the `globals: true` convention.
- `src/presentation/i18n/locales/en.json` — Added 18 English translation keys across 5 namespaces.
- `src/presentation/i18n/locales/es.json` — Added 18 Spanish translation keys across 5 namespaces.
- `src/presentation/i18n/locales/fr.json` — Added 18 French translation keys across 5 namespaces.
- `src/assets/main.css` — Added `--color-success: #22c55e` and `--color-error: #ef4444` to the existing `@theme` block. Added `.fade-*` transition classes (200ms opacity, ease-in-out), `.toast-*` transition classes (300ms enter with translateX slide + opacity, 200ms leave fade), `.modal-*` transition classes (200ms enter with scale + opacity, 150ms leave), and a `@media (prefers-reduced-motion: reduce)` block disabling all transitions and `animate-pulse` animation.
- `tsconfig.vitest.json` — Added `src/**/*` and `src/**/*.vue` to the `include` array so that test files can import source modules without TypeScript project boundary errors.

## Key Decisions

- **No `passWithNoTests` added**: Vitest exits with code 1 when no test files match the `include` pattern. Since this phase creates no test files, `npm run test` and `npm run check` fail. This resolves naturally once downstream phases (01b+) add test files. Adding `passWithNoTests: true` was considered but deferred to avoid config changes outside the plan's scope.
- **Flat JSON structure**: Locale files use flat dot-notation keys (e.g., `{ "nav.home": "Home" }`) with `flatJson: true` in the vue-i18n configuration. The `$t('nav.home')` calls work identically — vue-i18n resolves dot-separated paths in flat key maps when `flatJson` is enabled.
- **Test uses `fs.readFileSync`**: The test reads locale files directly from disk rather than importing them as modules. This provides explicit file existence validation and avoids potential interference from the `@intlify/unplugin-vue-i18n` Vite plugin that transforms locale files during build.
- **Theme colors appended to existing `@theme` block**: Kept all theme tokens in a single block rather than creating a separate one, maintaining the existing pattern established in R-00.
- **Modal leave duration at 150ms**: Intentionally below the UI/UX spec's 200–300ms guideline for a snappier leave feel, as documented in NFR-01c-05.

## Deviations from Plan

- **tsconfig.vitest.json fix**: The vitest TypeScript config only included `tests/**/*.ts` in its `include` array, which meant source files imported by tests were outside the project boundary. Added `src/**/*` and `src/**/*.vue` to fix TS error 6307. This was a pre-existing config issue that surfaced when the first test importing from `src/` was introduced.

## Testing

### Dependencies & Test Infrastructure

No test files were created for this sub-phase. The scope is pure infrastructure — the test setup file (`tests/setup.ts`) and Vitest configuration establish the foundation for tests written in phases 01b–01k.

#### Verification Results

| Check                                   | Result                                |
| --------------------------------------- | ------------------------------------- |
| `package.json` dependencies present     | PASS                                  |
| `vitest.config.ts` properties set       | PASS                                  |
| `testing.md` no explicit Vitest imports | PASS                                  |
| `tests/setup.ts` contents correct       | PASS                                  |
| `npm run test` exits cleanly            | FAIL (no test files — ignored)        |
| `npm run check` full pipeline           | FAIL (blocked by test step — ignored) |

Format (`prettier`), lint (`eslint`), and type-check (`vue-tsc`) all pass individually. The test and check failures are expected and resolve once test files are added in downstream phases.

### i18n Keys

- **Test file**: `tests/presentation/i18n/locale-keys.test.ts` — 6 test cases covering:
  - File existence and valid JSON parsing (AC5)
  - Identical key paths across all three locales (AC2)
  - Non-empty string values in all locales (AC3)
  - Exactly 19 expected keys present (AC1, AC7)
  - `app.title` preserved with original value (AC4)
  - camelCase segment compliance for all key paths (AC6, NFR-01b-01)
- **Test-first verification**: Tests failed before implementation (1 of 6 failed — "contains exactly the expected 19 keys"), then all 6 passed after locale files were updated.
- **Verification results**: All automated checks passed — vitest, prettier, tsc, build.

### Theme, Transitions & Constants

- `tests/domain/constants.test.ts` — 2 tests covering SC-01c-25-01: value assertion (`4000`) and type assertion (`number`). Both pass.
- CSS structural verification performed manually against `src/assets/main.css` content: all theme tokens, transition classes, and reduced-motion overrides confirmed present and correct.
- Behavioral scenarios (SC-01c-22-02, SC-01c-22-03, SC-01c-23-02, SC-01c-24-01 through SC-01c-24-03) are deferred to R-01g and R-01k integration testing, as they require the toast component, modal component, and app shell wiring that those phases deliver.

## Verification Results

- `npx vitest run` — PASS (2 files, 8 tests)
- `npm run check` — PASS (format, lint, type-check, test, build all clean)

## Dependencies

- `vue-router@^5.0.4` — Vue Router for SPA routing (runtime dependency, used starting in phase 01d).
- `@vue/test-utils@^2.4.6` — Official Vue test utilities for mounting and interacting with components in tests (dev dependency, used starting in phase 01f+).

## Requirement Coverage

| Requirement                  | Implementation                                                                              |
| :--------------------------- | :------------------------------------------------------------------------------------------ |
| SC-01c-21 (Theme additions)  | `--color-success` and `--color-error` added to `@theme` block in `src/assets/main.css:9-10` |
| SC-01c-09a (Fade transition) | `.fade-*` classes at `src/assets/main.css:13-21`                                            |
| SC-01c-22 (Toast transition) | `.toast-*` classes at `src/assets/main.css:23-37`                                           |
| SC-01c-23 (Modal transition) | `.modal-*` classes at `src/assets/main.css:39-53`                                           |
| SC-01c-24 (Reduced-motion)   | `@media (prefers-reduced-motion: reduce)` block at `src/assets/main.css:55-68`              |
| SC-01c-25 (Domain constants) | `TOAST_DISMISS_MS` exported from `src/domain/constants.ts:2`                                |

## Known Limitations

- `npm run test` and `npm run check` fail until at least one `tests/**/*.test.ts` file exists. This is a transient state resolved by the next phase that introduces tests.
- A dedicated `tsconfig.vitest.json` was added (extending `tsconfig.app.json`) to provide IDE type-checking for test files. It adds `vitest/globals` and `node` types and includes `tests/**/*.ts`. Without this, VS Code cannot resolve `describe`, `it`, `expect`, or Node.js APIs in test files.
- **Translation accuracy**: Spanish and French translations use standard UI terminology but have not been reviewed by native speakers. This is noted as a deferred concern in the requirements.
- **Fallback verification (AC9)**: vue-i18n fallback to English is implicitly satisfied by the `fallbackLocale: 'en'` configuration from Phase 00. Explicit runtime fallback testing is deferred to downstream features (01i, 01j) that provide rendering components to exercise the fallback chain.
- Theme colors target the dark theme only; light-theme counterparts are deferred to a future theme-switching feature phase.
- Behavioral verification of transitions requires downstream components (R-01g, R-01k) and is deferred to those phases.
