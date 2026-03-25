# Verification Scenarios: App Scaffolding — Dependencies & Test Infrastructure

Feature: App Scaffolding — Dependencies & Test Infrastructure
  Install runtime and dev dependencies, and configure Vitest test infrastructure
  so all subsequent scaffolding phases can write and run tests.

### Requirement: SC-01 — Dependency installation

The project SHALL have `vue-router@^4` as a runtime dependency and `@vue/test-utils@^2` as a dev dependency.

#### Scenario: SC-01-01 — vue-router listed in dependencies

GIVEN Phase 00 (Setup) is complete AND `vue-router@^4` has been installed
WHEN I inspect `package.json`
THEN `vue-router` is listed under `dependencies` with a version satisfying `^4`

#### Scenario: SC-01-02 — @vue/test-utils listed in devDependencies

GIVEN Phase 00 (Setup) is complete AND `@vue/test-utils@^2` has been installed
WHEN I inspect `package.json`
THEN `@vue/test-utils` is listed under `devDependencies` with a version satisfying `^2`

---

### Requirement: SC-27 — Vitest configuration

The Vitest configuration SHALL be updated with `globals: true`, correct file inclusion, and setup file reference.

Background:
  GIVEN `vitest.config.ts` has been updated
  WHEN I inspect the `test` block in the config

#### Scenario: SC-27-01 — Vitest globals enabled

THEN `globals` is set to `true`

#### Scenario: SC-27-02 — Test file inclusion pattern

THEN `include` is set to `["tests/**/*.test.ts"]`

#### Scenario: SC-27-03 — Setup file configured

THEN `setupFiles` is set to `["./tests/setup.ts"]`

#### Scenario: SC-27-05 — Test runner starts without errors

GIVEN all Phase 01a (Dependencies & Test Infrastructure) steps are complete
WHEN I run `npm run test`
THEN the Vitest runner starts and exits without configuration errors

#### Scenario: SC-27-06 — Full CI check passes

GIVEN all Phase 01a (Dependencies & Test Infrastructure) steps are complete
WHEN I run `npm run check`
THEN format passes with zero failures
AND lint passes with zero failures
AND type-check passes with zero failures
AND test passes with zero failures
AND build passes with zero failures

---

### Requirement: SC-28 — Test setup file

The test setup file SHALL clear `localStorage` between tests and provide TypeScript global recognition for Vitest.

#### Scenario: SC-28-01 — localStorage cleared between tests

GIVEN `tests/setup.ts` exists AND `vitest.config.ts` includes `setupFiles: ["./tests/setup.ts"]`
WHEN a test suite runs
THEN localStorage is empty at the start of each test

#### Scenario: SC-28-02 — TypeScript recognizes Vitest globals

GIVEN `tests/setup.ts` includes `/// <reference types="vitest/globals" />`
WHEN I open a `.test.ts` file in the editor
THEN `describe`, `it`, `expect`, and `beforeEach` are recognized without explicit imports from `vitest`

#### Scenario: SC-28-03 — Missing setup file causes localStorage leaks

GIVEN `vitest.config.ts` does NOT include `setupFiles: ["./tests/setup.ts"]`
WHEN two tests run in sequence where the first writes to `localStorage` and the second reads from it
THEN the second test observes the first test's `localStorage` data (state leaks between tests)
