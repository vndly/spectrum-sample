Feature: LU-04 — Empty State

  Scenario: LU-04-01 — Empty state on restrictive filters
    Given I am on the "Watchlist" tab of the Library screen
    And the current Watchlist view contains "Action Hit" and "Comedy Favorite"
    When I set Genre to "Horror" and Rating Range to "5-5"
    Then I see the empty state message "No items match your filters"
    And I do not see the Watchlist base empty-state copy
    And I see a "Clear All" button to reset the filters
    When I click "Clear All" in the FilterBar
    Then "Action Hit" and "Comedy Favorite" are displayed again
