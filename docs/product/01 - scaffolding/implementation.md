# Implementation: App Scaffolding — Dependencies & Test Infrastructure

## Overview

This phase installs the two remaining runtime and dev dependencies (`vue-router`, `@vue/test-utils`) and configures the Vitest test infrastructure so that all downstream scaffolding phases (01b–01k) can write and run tests immediately.

Additionally, 18 i18n keys across 5 namespaces (`nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*`) were added to all three locale files (`en.json`, `es.json`, `fr.json`). The existing `app.title` key was preserved. A test-first approach was used: a locale key parity test was written before the keys were added, confirming the test failed with only the pre-existing `app.title` key, then passed after all 18 keys were added.

## Files Changed

### Created

- `tests/setup.ts` — Test setup file loaded by Vitest before each test run. Includes `/// <reference types="vitest/globals" />` for TypeScript global recognition and `localStorage.clear()` in `beforeEach` to prevent state leakage between tests.
- `tests/presentation/i18n/locale-keys.test.ts` — Unit test validating locale file structure: key parity across all three locales, non-empty string values, expected 19-key set, `app.title` preservation, and camelCase segment compliance (NFR-01b-01).

### Modified

- `package.json` — Added `vue-router@^5.0.4` to `dependencies` and `@vue/test-utils@^2.4.6` to `devDependencies`.
- `package-lock.json` — Updated lockfile reflecting the two new packages and their transitive dependencies (51 packages added total).
- `vitest.config.ts` — Added `globals: true`, `include: ['tests/**/*.test.ts']`, and `setupFiles: ['./tests/setup.ts']` to the existing `test: {}` block. Preserved the `mergeConfig(viteConfig, defineConfig(...))` pattern and `environment: 'jsdom'`.
- `docs/technical/testing.md` — Removed the `import { describe, it, expect } from 'vitest'` line from the code example in the "Test Pattern" section, aligning the documentation with the `globals: true` convention.
- `src/presentation/i18n/locales/en.json` — Added 18 English translation keys across 5 namespaces.
- `src/presentation/i18n/locales/es.json` — Added 18 Spanish translation keys across 5 namespaces.
- `src/presentation/i18n/locales/fr.json` — Added 18 French translation keys across 5 namespaces.

## Key Decisions

- **No `passWithNoTests` added**: Vitest exits with code 1 when no test files match the `include` pattern. Since this phase creates no test files, `npm run test` and `npm run check` fail. This resolves naturally once downstream phases (01b+) add test files. Adding `passWithNoTests: true` was considered but deferred to avoid config changes outside the plan's scope.
- **Nested JSON structure**: Locale files use nested JSON objects (e.g., `{ "nav": { "home": "Home" } }`) rather than flat dot-notation keys (e.g., `{ "nav.home": "Home" }`). This matches the existing `app.title` structure from Phase 00, the vue-i18n configuration (no `flatJson: true` option), and how `$t('nav.home')` resolves paths in nested message objects.
- **Test uses `fs.readFileSync`**: The test reads locale files directly from disk rather than importing them as modules. This provides explicit file existence validation and avoids potential interference from the `@intlify/unplugin-vue-i18n` Vite plugin that transforms locale files during build.
- **Key path flattening in tests**: A recursive `flattenKeys` helper converts nested JSON to dot-notation paths for assertion, allowing the test to validate key parity and completeness regardless of the JSON nesting depth.

## Deviations from Plan

- **Nested vs flat JSON**: The plan's "Expected flat JSON structure" section showed literal flat dot-notation keys. The implementation uses nested JSON instead, because the existing locale files (from Phase 00) already use nested format and the vue-i18n instance is not configured with `flatJson: true`. The key paths and values are identical — only the JSON structure differs. This is consistent with the project's technical conventions which describe keys as nested by feature area.

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

## Dependencies

- `vue-router@^5.0.4` — Vue Router for SPA routing (runtime dependency, used starting in phase 01d).
- `@vue/test-utils@^2.4.6` — Official Vue test utilities for mounting and interacting with components in tests (dev dependency, used starting in phase 01f+).

## Known Limitations

- `npm run test` and `npm run check` fail until at least one `tests/**/*.test.ts` file exists. This is a transient state resolved by the next phase that introduces tests.
- A dedicated `tsconfig.vitest.json` was added (extending `tsconfig.app.json`) to provide IDE type-checking for test files. It adds `vitest/globals` and `node` types and includes `tests/**/*.ts`. Without this, VS Code cannot resolve `describe`, `it`, `expect`, or Node.js APIs in test files.
- **Translation accuracy**: Spanish and French translations use standard UI terminology but have not been reviewed by native speakers. This is noted as a deferred concern in the requirements.
- **Fallback verification (AC9)**: vue-i18n fallback to English is implicitly satisfied by the `fallbackLocale: 'en'` configuration from Phase 00. Explicit runtime fallback testing is deferred to downstream features (01i, 01j) that provide rendering components to exercise the fallback chain.
