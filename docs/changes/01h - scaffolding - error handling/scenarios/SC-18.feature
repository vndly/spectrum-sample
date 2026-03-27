Feature: SC-18 — Error boundary
  The error boundary SHALL catch unhandled component errors.

  Scenario: SC-18-01 — Error boundary shows fallback
    Given a child component throws an unhandled error
    When the error is caught by the error boundary
    Then the normal content is replaced with a fallback UI showing a translated error heading, description, and "Reload" button

  Scenario: SC-18-02 — Reload button refreshes the page
    Given the error boundary fallback is displayed
    When I click the "Reload" button
    Then `window.location.reload()` is called
