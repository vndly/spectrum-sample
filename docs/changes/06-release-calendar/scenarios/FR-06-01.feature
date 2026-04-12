Feature: FR-06-01 — Calendar Grid

  Background:
    Given the app is running
    And I am on the "/calendar" page

  Scenario: SC-06-01-01 — Grid rendering for the current month
    Then I should see a monthly grid
    And the grid should have cells for all days of the current month
    And the current day should be highlighted
