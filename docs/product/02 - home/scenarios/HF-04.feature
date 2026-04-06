Feature: HF-04 — Composite Filtering

  Background:
    Given the home screen is in browse mode
    And trending and popular results are loaded

  Scenario: HF-04-01 — Composite filtering (AND)
    When I select "Action" genre
    And I select "Movies" media type
    Then only action movies are displayed
