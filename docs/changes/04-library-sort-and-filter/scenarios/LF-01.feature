Feature: LF-01 — Filter by Genre

  Background:
    Given my library contains "Action" and "Comedy" movies
    And I am on the Library screen

  Scenario: LF-01-01 — Filter library by genre
    When I select the "Action" genre from the FilterBar
    Then only library entries with the "Action" genre are displayed
    And "Comedy" entries without the "Action" genre are hidden
