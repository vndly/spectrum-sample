# Verification Scenarios: App Scaffolding — Dependencies & Test Infrastructure

Feature: App Scaffolding — Dependencies & Test Infrastructure

### Requirement: SC-01 — Dependency installation

The project SHALL have `vue-router@^4` as a runtime dependency and `@vue/test-utils@^2` as a dev dependency.

#### Scenario: SC-01-01 — vue-router listed in dependencies

GIVEN Phase 00 (Setup) is complete
WHEN `vue-router@^4` is installed as a runtime dependency
THEN `package.json` lists `vue-router` with a version satisfying `^4` under `dependencies`

#### Scenario: SC-01-02 — @vue/test-utils listed in devDependencies

GIVEN Phase 00 (Setup) is complete
WHEN `@vue/test-utils@^2` is installed as a dev dependency
THEN `package.json` lists `@vue/test-utils` with a version satisfying `^2` under `devDependencies`

---

### Requirement: SC-27 — Test infrastructure setup

The test infrastructure SHALL be configured with `globals: true`, correct file inclusion, setup file, and `localStorage` isolation.

#### Scenario: SC-27-01 — Vitest globals enabled

GIVEN `vitest.config.ts` has been updated
WHEN I inspect the `test` block in the config
THEN `globals` is set to `true`

#### Scenario: SC-27-02 — Test file inclusion pattern

GIVEN `vitest.config.ts` has been updated
WHEN I inspect the `test` block in the config
THEN `include` is set to `["tests/**/*.test.ts"]`

#### Scenario: SC-27-03 — Setup file configured

GIVEN `vitest.config.ts` has been updated
WHEN I inspect the `test` block in the config
THEN `setupFiles` is set to `["./tests/setup.ts"]`

#### Scenario: SC-27-04 — localStorage cleared between tests

GIVEN `tests/setup.ts` exists
WHEN a test suite runs
THEN `localStorage.clear()` is called in a `beforeEach` hook before each test

#### Scenario: SC-27-05 — Test runner starts without errors

GIVEN all Phase 1 steps are complete
WHEN I run `npm run test`
THEN the Vitest runner starts and exits without configuration errors

#### Scenario: SC-27-06 — Full CI check passes

GIVEN all Phase 1 steps are complete
WHEN I run `npm run check`
THEN format, lint, type-check, test, and build all pass with zero failures

---

### Negative Scenarios

#### Scenario: SC-27-07 — Missing setup file causes localStorage leaks

GIVEN `vitest.config.ts` does NOT include `setupFiles: ["./tests/setup.ts"]`
WHEN two tests run in sequence where the first writes to `localStorage` and the second reads from it
THEN the second test observes the first test's `localStorage` data (state leaks between tests)
