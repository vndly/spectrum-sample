Feature: S-04 — ESLint + Prettier

  Flat config with strict TypeScript rules, Vue block order, no-any, Prettier integration.

  Background:
    Given the project is scaffolded

  Scenario: S-04-01 — Linting passes
    When I run `npm run lint`
    Then ESLint reports zero errors

  Scenario: S-04-02 — Formatting passes
    When I run `npm run format:check`
    Then Prettier reports zero formatting issues
