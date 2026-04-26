Feature: Empty filmography
  Handle empty filmography gracefully

  Scenario: CI-14-01 — Empty filmography shows message
    Given the app is running
    And a person with no credits
    When I view the person page
    Then I see "No credits available."
