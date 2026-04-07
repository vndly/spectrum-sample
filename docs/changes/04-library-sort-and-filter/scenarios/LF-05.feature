Feature: LF-05 — Filter by Custom List

  Background:
    Given I have a movie in both "Watchlist" and the "Action Favorites" list
    And I have another movie only in "Watchlist"
    And I am on the "Watchlist" tab

  Scenario: LF-05-01 — Filter library tab by custom list
    When I select the "Action Favorites" list from the filter
    Then only movies from the "Action Favorites" list are displayed
    And the movie only in "Watchlist" is hidden
