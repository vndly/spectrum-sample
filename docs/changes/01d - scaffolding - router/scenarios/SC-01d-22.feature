Feature: SC-01d-22 — Router unit tests
  These are test specification scenarios that define what the router test file
  must verify. They are satisfied by the test cases in tests/presentation/router.test.ts.

  Background:
    Given the router test file exists

  Scenario: SC-01d-22-01 — Router test verifies named routes
    When the test suite runs
    Then the test confirms all 4 named routes exist with correct paths

  Scenario: SC-01d-22-02 — Router test verifies catch-all redirect
    When the test suite runs
    Then the test confirms the catch-all route redirects to /

  Scenario: SC-01d-22-03 — Router test verifies scroll behavior
    When the test suite runs
    Then the test confirms scrollBehavior returns { top: 0 }

  Scenario: SC-01d-22-04 — Router test verifies document title
    When the test suite runs
    Then the test confirms afterEach sets document.title using i18n
