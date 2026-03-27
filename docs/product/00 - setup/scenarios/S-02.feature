Feature: S-02 — TypeScript configuration

  Strict mode, ES2022 target, bundler module resolution, @/* path alias, project references.

  Background:
    Given the project is scaffolded

  Scenario: S-02-01 — Type-check passes
    When I run `npm run type-check`
    Then `vue-tsc` reports zero TypeScript errors

  Scenario: S-02-02 — Implicit any is rejected
    Given a file contains an untyped variable (implicit `any`)
    When I run `npm run type-check`
    Then TypeScript reports an error for that variable

  Scenario: S-02-03 — Import using path alias
    Given a file imports from `@/domain/constants`
    When I run `npm run build`
    Then the import resolves to `src/domain/constants`
    And the build succeeds
