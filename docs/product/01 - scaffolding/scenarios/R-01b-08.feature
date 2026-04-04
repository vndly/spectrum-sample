Feature: R-01b-08 — Verification coverage
  Automated coverage SHALL prove the new route surface works.

  Scenario: R-01b-08-01 — Router tests cover the new route surface
    Given the router test file exists at `tests/presentation/router.test.ts`
    When the router test suite runs
    Then it verifies the Recommendations, Stats, Movie, and Show route definitions
    And it verifies lazy-loading and route title metadata for the new routes
    And it verifies non-numeric movie and show IDs redirect to `/`

  Scenario: R-01b-08-02 — Layout tests cover nav composition and shell behavior
    Given layout test files exist for the sidebar, bottom nav, page header, and app shell
    When the layout test suites run
    Then they verify Recommendations nav order and active-state behavior
    And they verify Stats and detail routes remain absent from primary navigation
    And they verify the shared shell and route-transition contract for the new routes

  Scenario Outline: R-01b-08-03 — Placeholder view tests mirror source paths and use AAA
    Given the `<test_file>` component test exists at `tests/presentation/views/<test_file>`
    When I compare it with `src/presentation/views/<view_file>`
    Then the test path mirrors the source path
    And the test follows the Arrange-Act-Assert structure

    Examples:
      | test_file                      | view_file                   |
      | recommendations-screen.test.ts | recommendations-screen.vue |
      | stats-screen.test.ts           | stats-screen.vue           |
      | movie-screen.test.ts           | movie-screen.vue           |
      | show-screen.test.ts            | show-screen.vue            |

  Scenario: R-01b-08-04 — Locale key tests cover the new page-title keys
    Given the locale key parity test suite runs
    When it inspects the supported locale files
    Then it verifies `page.stats.title`, `page.movie.title`, and `page.show.title`
    And it does not rely on fallback output to satisfy missing keys

  Scenario: R-01b-08-05 — Project verification commands pass after implementation
    Given the feature implementation is complete
    When I run `npm run type-check`, `npm run lint`, `npm run format:check`, and `npm run test`
    Then each command exits successfully
