Feature: FR-06-06 — Empty State

  Background:
    Given the app is running
    And I am on the "/calendar" page

  Scenario: SC-06-06-01 — Empty month message
    Given the API returns no movies for the current month
    Then I should see a "No upcoming releases" message
