Feature: HF-05 — Client-Side Filtering

  Background:
    Given the home screen is in browse mode
    And trending and popular results are loaded

  Scenario: HF-05-01 — Filtering happens client-side
    When I select the "Action" genre from the FilterBar
    Then no network request is sent to the media provider
    And the results are filtered instantaneously
