Feature: Error handling
  Show appropriate error states

  Background:
    Given the app is running

  Scenario: CI-12-01 — 404 shows person not found
    When I navigate to /person/999999999
    And the API returns 404
    Then I see "Person not found"
    And a link to Home is displayed

  Scenario: CI-12-02 — Network error shows toast
    When I navigate to a person page
    And a network error occurs
    Then an error toast appears
    And the toast has a "Retry" action
