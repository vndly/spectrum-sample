Feature: LF-03 — Filter by Rating Range

  Background:
    Given my library contains "Two Star Film" rated 2 stars, "Unrated Film" rated 0 stars, "Four Star Film" rated 4 stars, and "Five Star Film" rated 5 stars
    And I am on the "Watchlist" tab of the Library screen

  Scenario: LF-03-01 — Filter library by rating range
    When I set the rating filter range to 4-5 stars
    Then "Four Star Film" is displayed
    And "Five Star Film" is displayed
    And "Two Star Film" is hidden
    And "Unrated Film" is hidden

  Scenario: LF-03-02 — Include unrated entries when the lower bound is 0
    When I set the rating filter range to 0-2 stars
    Then "Unrated Film" is displayed
    And "Two Star Film" is displayed
    And "Four Star Film" is hidden
