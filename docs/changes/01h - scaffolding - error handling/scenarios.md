# Verification Scenarios: App Scaffolding — Error Handling

Feature: App Scaffolding — Error Handling

### Requirement: SC-18 — Error boundary

The error boundary SHALL catch unhandled component errors.

#### Scenario: SC-18-01 — Error boundary shows fallback

GIVEN a child component throws an unhandled error
WHEN the error is caught by the error boundary
THEN the normal content is replaced with a fallback UI showing a translated error heading, description, and "Reload" button

#### Scenario: SC-18-02 — Reload button refreshes the page

GIVEN the error boundary fallback is displayed
WHEN I click the "Reload" button
THEN `window.location.reload()` is called

---

### Requirement: SC-19 — Global error handler

Unhandled errors SHALL trigger an error toast.

#### Scenario: SC-19-01 — Error handler dispatches toast

GIVEN an unhandled error occurs in any component
WHEN `app.config.errorHandler` catches it
THEN an error toast appears with a translated error message
AND the error is logged to the console

---

### Requirement: SC-24 — UI primitive tests (partial)

UI primitive component tests SHALL verify rendering and behavior.

#### Scenario: SC-24-03 — ErrorBoundary component test

GIVEN the ErrorBoundary test file exists
WHEN the test suite runs
THEN it verifies slot rendering in normal state and fallback UI on error
