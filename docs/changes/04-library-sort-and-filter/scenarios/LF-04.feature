Feature: LF-04 — Filter by Watch Status

  Background:
    Given I am in a custom list named "Favorites"
    And "Favorites" contains both "Watchlist" and "Watched" items

  Scenario: LF-04-01 — Filter list by Watchlist status
    When I select the "Watchlist" status from the filter
    Then only items with "Watchlist" status are displayed

  Scenario: LF-04-02 — Filter list by Watched status
    When I select the "Watched" status from the filter
    Then only items with "Watched" status are displayed
