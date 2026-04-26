Feature: Biography
  Display person's biography with expansion

  Background:
    Given the app is running

  Scenario: CI-05-01 — Long biography truncates with Read more
    Given a person with a long biography (>6 lines)
    When I view the person page
    Then the biography is truncated to 6 lines
    And a "Read more" button is visible

  Scenario: CI-05-02 — Read more expands full biography
    Given a person with a long biography
    And the biography is truncated
    When I click "Read more"
    Then the full biography displays
    And the button text changes to "Read less"

  Scenario: CI-05-03 — Short biography displays fully
    Given a person with a short biography (<6 lines)
    When I view the person page
    Then the full biography displays
    And no "Read more" button is visible

  Scenario: CI-05-04 — Empty biography shows message
    Given a person with no biography
    When I view the person page
    Then I see "No biography available."
