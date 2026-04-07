Feature: LF-02 — Filter by Media Type

  Background:
    Given my library contains "Movie A" and "Show B"
    And I am on the Library screen

  Scenario Outline: LF-02-01 — Filter by media type
    When I select "<Type>" in the media type filter
    Then "<Visible>" is displayed
    And "<Hidden>" is hidden

    Examples:
      | Type     | Visible   | Hidden    |
      | Movie    | "Movie A" | "Show B"  |
      | TV Show  | "Show B"  | "Movie A" |
