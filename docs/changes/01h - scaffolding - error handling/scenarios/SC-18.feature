Feature: SC-18 — Error boundary
  The error boundary SHALL catch unhandled component errors.

  Scenario: SC-18-01 — Error boundary shows fallback
    Given a child component throws an unhandled error
    When the error is caught by the error boundary
    Then the normal content is replaced with a fallback UI showing a translated error heading, description, and "Reload" button

  Scenario: SC-18-02 — Reload button refreshes the page
    Given the error boundary fallback is displayed
    When I click the "Reload" button
    Then the page is refreshed

  Scenario: SC-18-03 — Error boundary prevents propagation
    Given the error boundary wraps a child component
    And the global error handler is registered
    When the child component throws an unhandled error
    Then the error boundary catches the error
    And the global error handler is NOT invoked
    And no error toast appears
