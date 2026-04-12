Feature: FR-06-01 — Calendar Grid

  Background:
    Given the app is running
    And I am on the "/calendar" page

  Scenario: FR-06-01-01 — Grid rendering for the current month
    Then I should see a monthly grid
    And the grid should have cells for all days of the current month
    And the current day should be highlighted

  Scenario: FR-06-01-02 — Grid handles month boundaries correctly
    Given the date is "2026-02-28"
    Then I should see 28 cells in the grid
    When I click the "Next Month" button
    Then the grid should update to "2026-03" and show 31 cells

  Scenario: FR-06-01-03 — Grid handles leap years correctly
    Given the date is "2024-02-01"
    Then the grid should show 29 cells for February
