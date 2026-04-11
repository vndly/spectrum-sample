Feature: LF-03 — Filter by Rating Range

  Background:
    Given my library contains "Two Star Film" rated 2.0 stars, "Unrated Film" rated 0.0 stars, "Four and a Half Star Film" rated 4.5 stars, and "Five Star Film" rated 5.0 stars
    And I am on the "Watchlist" tab of the Library screen

  Scenario: LF-03-01 — Rating inputs update results immediately at the upper boundary
    When I enter "4.5" as the minimum rating
    And I enter "5.0" as the maximum rating
    Then the Library results update immediately
    And "Four and a Half Star Film" is displayed
    And "Five Star Film" is displayed
    And "Two Star Film" is hidden
    And "Unrated Film" is hidden

  Scenario: LF-03-02 — Include unrated entries when the lower bound is 0.0
    When I enter "0.0" as the minimum rating
    And I enter "2.0" as the maximum rating
    Then the Library results update immediately
    And "Unrated Film" is displayed
    And "Two Star Film" is displayed
    And "Four and a Half Star Film" is hidden
    And "Five Star Film" is hidden
