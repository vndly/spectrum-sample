Feature: SC-01a-02 — Vitest configuration
  The Vitest configuration SHALL be updated with `globals: true`, correct file inclusion,
  setup file reference, and the existing `environment: 'jsdom'` setting preserved.

  Scenario Outline: SC-01a-02-01 — Vitest config properties set correctly
    Given Phase 00 (Setup) is complete
    And `vitest.config.ts` has been updated
    When I inspect the `test` block in the config
    Then `<property>` is set to `<value>`

    Examples:
      | property    | value                  |
      | globals     | true                   |
      | include     | ["tests/**/*.test.ts"] |
      | setupFiles  | ["./tests/setup.ts"]   |
      | environment | 'jsdom'                |

  Scenario: SC-01a-02-02 — Test runner starts without errors
    Given Phase 01a (Dependencies & Test Infrastructure) is complete
    When I run `npm run test`
    Then the Vitest runner starts and exits without configuration errors

  Scenario: SC-01a-02-03 — Full CI check passes
    Given Phase 01a (Dependencies & Test Infrastructure) is complete
    When I run `npm run check`
    Then format passes with zero failures
    And lint passes with zero failures
    And type-check passes with zero failures
    And test passes with zero failures
    And build passes with zero failures

  Scenario: SC-01a-02-04 — testing.md code example uses globals
    Given Phase 01a (Dependencies & Test Infrastructure) is complete
    When I inspect the code example in `docs/technical/testing.md`
    Then the example does NOT contain `import { describe, it, expect } from 'vitest'`
    And the example starts with `import { isHighRated } from '@/domain/movie.logic'`
