Feature: LF-05 — Filter by Custom List

  Background:
    Given I have "Action Movie" in both "Watchlist" and the "Action Favorites" list
    And I have "Action Movie" in both "Watched" and the "Action Favorites" list
    And I have "Other Watchlist Movie" only in "Watchlist"
    And I have "Other Watched Movie" only in "Watched"

  Scenario Outline: LF-05-01 — Filter active library tab by custom list membership
    Given I am on the "<Tab>" tab of the Library screen
    When I select the "Action Favorites" list from the filter
    Then the "<Tab>" tab remains selected
    And only items from the "Action Favorites" list are displayed for the "<Tab>" tab

    Examples:
      | Tab       |
      | Watchlist |
      | Watched   |

  Scenario: LF-05-02 — Custom-list filter is hidden on the Lists view
    Given I am on the "Lists" view of the Library screen
    Then I do not see the "Custom List" filter in the FilterBar
