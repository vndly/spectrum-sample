Feature: SC-24 — UI primitive tests (partial)
  UI primitive component tests SHALL verify rendering and behavior.

  Scenario: SC-24-03 — ErrorBoundary component test
    Given the ErrorBoundary test file exists
    When the test suite runs
    Then it verifies slot rendering in normal state and fallback UI on error
