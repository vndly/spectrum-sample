Feature: HF-08 — URL Sync

  Background:
    Given the home screen is in browse mode
    And trending and popular results are loaded

  Scenario: HF-08-01 — URL updates when filters change
    When I select the "Action" genre
    Then the URL query string includes "genres=action"

  Scenario: HF-08-02 — Filters restore from URL on load
    Given I navigate to the home screen with "genres=action" in the URL
    Then the "Action" genre is automatically selected in the FilterBar
    And results are filtered by the "Action" genre
