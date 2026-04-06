Feature: HF-06 — Layout Toggle

  Background:
    Given the home screen is in browse mode
    And trending and popular results are loaded

  Scenario: HF-06-01 — Switch to List view
    Given the default layout is "Grid"
    When I click the "List" layout toggle
    Then browse results are displayed as compact rows
    And the movie cards show title, year, and key metadata horizontally

  Scenario: HF-06-02 — Switch back to Grid view
    Given the current layout is "List"
    When I click the "Grid" layout toggle
    Then browse results are displayed as a responsive grid of poster cards
