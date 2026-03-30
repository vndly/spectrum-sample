Feature: SC-19 — Global error handler
  Unhandled errors SHALL trigger an error toast.

  Scenario: SC-19-01 — Error handler dispatches toast
    Given an unhandled error occurs in a component not wrapped by an error boundary
    When the global error handler catches it
    Then an error toast appears with the message from translation key "toast.error"
    And the error is logged to the console

  Scenario: SC-19-02 — Error boundary prevents global handler
    Given an error occurs within a component wrapped by an error boundary
    When the error boundary catches the error
    Then the global error handler is NOT invoked
    And no error toast appears
