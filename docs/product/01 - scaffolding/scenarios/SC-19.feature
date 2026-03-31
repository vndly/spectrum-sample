Feature: SC-19 — Global error handler
  Unhandled Vue component/render errors outside the ErrorBoundary SHALL dispatch an error toast.
  API request failures continue to use their request-specific handling.

  Scenario: SC-19-01 — Error handler dispatches toast
    Given an uncaught Vue component/render error occurs outside the ErrorBoundary
    When the global error handler catches it
    Then an error toast is dispatched to the shared toast queue with the message from translation key "toast.error"
    And the error is logged to the console
