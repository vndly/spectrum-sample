Feature: SC-19 — Global error handler
  Unhandled errors SHALL trigger an error toast.

  Scenario: SC-19-01 — Error handler dispatches toast
    Given an unhandled error occurs in any component
    When `app.config.errorHandler` catches it
    Then an error toast appears with a translated error message
    And the error is logged to the console
