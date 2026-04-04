Feature: Error Handling

  The detail view handles API errors gracefully with inline error messages
  and retry functionality.

  Background:
    Given the app is running

  Scenario: ED-12-01 - Network error displays error message
    Given the network is unavailable
    When the user navigates to a detail page
    Then an inline error message "Something went wrong" is displayed
    And a "Retry" button is visible

  Scenario: ED-12-02 - Retry button re-attempts API call
    Given an error message is displayed
    When the user clicks the "Retry" button
    Then a new API request is initiated
    And the loading skeleton is displayed

  Scenario: ED-12-03 - 404 displays not found message
    Given the entry ID does not exist
    When the user navigates to that detail page
    Then a "Not found" message with text "This title doesn't exist or has been removed." is displayed
    And a "Back to Home" link is provided

  Scenario: ED-12-04 - Server error displays retry option
    Given the API returns a 500 error
    When the user navigates to a detail page
    Then an inline error message is displayed
    And a "Retry" button is visible

  Scenario: ED-12-05 - Successful retry replaces error with content
    Given an error message is displayed
    And the network becomes available
    When the user clicks "Retry"
    Then the error message is replaced with content
