Feature: LF-02 — Filter by Media Type

  Background:
    Given my library contains both movies and TV shows
    And I am on the Library screen

  Scenario: LF-02-01 — Filter by Movie
    When I select "Movie" in the media type filter
    Then only movies are displayed
    And TV shows are hidden

  Scenario: LF-02-02 — Filter by TV Show
    When I select "TV Show" in the media type filter
    Then only TV shows are displayed
    And movies are hidden
