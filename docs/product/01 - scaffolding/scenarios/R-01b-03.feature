Feature: R-01b-03 — Stats placeholder route
  Stats SHALL be directly reachable as a shell-contained placeholder route.

  Scenario: R-01b-03-00 — Router unit tests verify the Stats route contract
    Given the router test suite runs
    When it inspects the named route definitions
    Then it confirms a named `stats` route exists at `/stats`
    And it confirms the route component is lazy-loaded
    And it confirms the route title key is `page.stats.title`

  Scenario: R-01b-03-01 — Direct URL navigation renders the Stats placeholder
    Given the app is running
    When I navigate directly to /stats
    Then the Stats placeholder screen is displayed inside the shared app shell
    And the page header shows "Stats"
    And Stats is not shown in the primary navigation

  Scenario: R-01b-03-02 — Locale key tests verify Stats title coverage
    Given the locale key parity test suite runs
    When it inspects the supported locale files
    Then it confirms `page.stats.title` exists in `en.json`, `es.json`, and `fr.json`
    And it confirms the three locale files expose identical key paths
