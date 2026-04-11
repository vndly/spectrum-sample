Feature: LF-02 — Filter by Media Type

  Background:
    Given my "Watchlist" tab contains "Movie A" and "Show B"
    And "Movie A" is a movie
    And "Show B" is a TV show
    And I am on the "Watchlist" tab of the Library screen

  Scenario Outline: LF-02-01 — Filter by media type without leaving the active tab
    When I select "<Type>" in the media type filter
    Then the "Watchlist" tab remains selected
    And the Library screen displays <Displayed>
    And the Library screen hides <Hidden>

    Examples:
      | Type     | Displayed                | Hidden       |
      | Movie    | "Movie A"                | "Show B"     |
      | TV Show  | "Show B"                 | "Movie A"    |
      | All      | "Movie A" and "Show B"   | nothing else |
