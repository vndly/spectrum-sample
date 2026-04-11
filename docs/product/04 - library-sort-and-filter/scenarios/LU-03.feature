Feature: LU-03 — FilterBar Customization

  Scenario Outline: LU-03-01 — Watchlist and Watched tabs expose the tab-specific library filters
    Given I am on the "<Tab>" tab of the Library screen
    Then I see "Rating" and "Custom List" filters in the FilterBar
    And I do not see the "Watch Status" filter in the FilterBar

    Examples:
      | Tab       |
      | Watchlist |
      | Watched   |

  Scenario: LU-03-02 — Lists view exposes watch-status filtering instead of custom-list filtering
    Given I am on the "Lists" view of the Library screen
    Then I see "Rating" and "Watch Status" filters in the FilterBar
    And I do not see the "Custom List" filter in the FilterBar

  Scenario: LU-03-03 — Home keeps its existing browse filter contract
    Given I am on the Home screen
    Then I see the "Genre", "Media Type", and "From Year/To Year" filters in the FilterBar
    And I do not see the "Rating", "Watch Status", or "Custom List" filters in the FilterBar
