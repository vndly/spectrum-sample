Feature: HF-03 — Year Range Inputs

  Background:
    Given the home screen is in browse mode
    And trending and popular results are loaded

  Scenario: HF-03-01 — Filter by year range
    When I set the year range from 2020 to 2025
    Then only items released between 2020 and 2025 are displayed
