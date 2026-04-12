Feature: FR-06-04 — Data Fetching

  Background:
    Given the app is running
    And I am on the "/calendar" page

  Scenario: SC-06-04-01 — Loading state while fetching
    When the API request for upcoming movies is pending
    Then I should see skeleton loaders in the calendar cells

  Scenario: SC-06-04-02 — Error state on API failure
    When the API request for upcoming movies fails
    Then I should see an error toast with a "Retry" button
