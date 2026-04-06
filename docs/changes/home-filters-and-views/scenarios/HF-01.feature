Feature: HF-01 — Genre Multi-Select

  Background:
    Given the home screen is in browse mode
    And trending and popular results are loaded

  Scenario: HF-01-01 — Filter by genre
    When I select the "Action" genre from the FilterBar
    Then only currently visible items with the "Action" genre are displayed
    And items without the "Action" genre are hidden
