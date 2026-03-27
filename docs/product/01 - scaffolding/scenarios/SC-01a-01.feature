Feature: SC-01a-01 — Dependency installation
  The project SHALL have `vue-router@^4.5` as a runtime dependency
  and `@vue/test-utils@^2.4` as a dev dependency.

  Background:
    Given Phase 00 (Setup) is complete

  Scenario: SC-01a-01-01 — vue-router listed in dependencies
    When I inspect `package.json`
    Then `vue-router` is listed under `dependencies` with a version satisfying `^4.5`
    And `vue-router` is NOT listed under `devDependencies`

  Scenario: SC-01a-01-02 — @vue/test-utils listed in devDependencies
    When I inspect `package.json`
    Then `@vue/test-utils` is listed under `devDependencies` with a version satisfying `^2.4`
    And `@vue/test-utils` is NOT listed under `dependencies`
