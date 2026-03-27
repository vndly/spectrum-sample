Feature: SC-27 — Test infrastructure setup and build tooling
  Test infrastructure SHALL be configured and all tooling checks SHALL pass.

  Scenario: SC-27-01 — Type-check passes
    Given all scaffolding files are in place
    When I run `npm run type-check`
    Then zero TypeScript errors are reported

  Scenario: SC-27-02 — Lint passes
    Given all scaffolding files are in place
    When I run `npm run lint`
    Then zero ESLint errors are reported

  Scenario: SC-27-03 — Format check passes
    Given all scaffolding files are in place
    When I run `npm run format:check`
    Then zero formatting issues are reported

  Scenario: SC-27-04 — Production build succeeds
    Given all scaffolding files are in place
    When I run `npm run build`
    Then the build completes with zero errors

  Scenario: SC-27-05 — Test suite passes
    Given all scaffolding files are in place
    When I run `npm run test`
    Then zero test failures are reported
