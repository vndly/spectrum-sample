Feature: SC-22 — Router unit tests
  Router tests SHALL verify route definitions and navigation behavior.

  Scenario: SC-22-01 — Router test verifies named routes
    Given the router test file exists
    When the test suite runs
    Then it verifies all 4 named routes exist with correct paths

  Scenario: SC-22-02 — Router test verifies catch-all redirect
    Given the router test file exists
    When the test suite runs
    Then it verifies the catch-all route redirects to /

  Scenario: SC-22-03 — Router test verifies scroll behavior
    Given the router test file exists
    When the test suite runs
    Then it verifies scrollBehavior returns { top: 0 }

  Scenario: SC-22-04 — Router test verifies document title
    Given the router test file exists
    When the test suite runs
    Then it verifies afterEach sets document.title using i18n
