Feature: LF-01 — Filter by Genre

  Background:
    Given my library contains "Action Film A" and "Comedy Film B"
    And I am on the Library screen

  Scenario: LF-01-01 — Filter library by genre
    When I select the "Action" genre from the FilterBar
    Then "Action Film A" is displayed
    And "Comedy Film B" is hidden
