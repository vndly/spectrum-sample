Feature: HF-01 — Home Screen Filtering

  Filter browse results by genre, media type, and year range.

  Background:
    Given the home screen is in browse mode
    And trending and popular results are loaded

  Scenario: HF-01-01 — Filter by genre
    When I select the "Action" genre from the FilterBar
    Then only items with the "Action" genre are displayed
    And items without the "Action" genre are hidden

  Scenario: HF-01-02 — Filter by media type
    When I select "Movies" from the media type toggle
    Then only movie items are displayed
    And TV show items are hidden

  Scenario: HF-01-03 — Filter by year range
    When I set the year range from 2020 to 2025
    Then only items released between 2020 and 2025 are displayed

  Scenario: HF-01-04 — Composite filtering (AND)
    When I select "Action" genre
    And I select "Movies" media type
    Then only action movies are displayed

  Scenario: HF-01-05 — Clear filters
    Given filters are active
    When I click "Clear All"
    Then all trending and popular results are displayed again
