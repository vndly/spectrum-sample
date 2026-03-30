Feature: SC-24 — UI primitive tests (partial)
  UI primitive component tests SHALL verify rendering and behavior.

  Note: SC-24-01 and SC-24-02 cover other UI primitives in separate change docs.

  Scenario: SC-24-03 — ErrorBoundary renders slot in normal state
    Given the ErrorBoundary component wraps child content
    When no error occurs
    Then the child content is displayed normally

  Scenario: SC-24-04 — ErrorBoundary shows fallback on error
    Given the ErrorBoundary component wraps a failing child
    When the child throws an error
    Then the fallback UI is displayed with error heading, description, and reload button
