Feature: HF-02 — Media Type Toggle

  Background:
    Given the home screen is in browse mode
    And trending and popular results are loaded

  Scenario: HF-02-01 — Filter by media type
    When I select "Movies" from the media type toggle
    Then only movie items are displayed
    And TV show items are hidden
