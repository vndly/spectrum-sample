Feature: Watchlist and Watched Tabs
  As a user
  I want to switch between my watchlist and watched movies
  So that I can manage my viewing progress

  Scenario: Switching to Watchlist tab
    Given the user has 2 items in "watchlist" and 1 item in "watched"
    When the user selects the "Watchlist" tab
    Then the grid should display 2 items
    And each item should have "watchlist" status

  Scenario: Switching to Watched tab
    Given the user has 2 items in "watchlist" and 1 item in "watched"
    When the user selects the "Watched" tab
    Then the grid should display 1 item
    And the item should have "watched" status

  Scenario: Empty Watchlist
    Given the user has no items in the library
    When the user selects the "Watchlist" tab
    Then the empty state should be displayed
    And it should encourage adding movies to the watchlist
