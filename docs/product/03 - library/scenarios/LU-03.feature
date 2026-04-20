Feature: LU-03 — FilterBar Customization

  Scenario Outline: LU-03-01 — Watchlist and Watched tabs expose the tab-specific library filters
    Given I am on the "<Tab>" tab of the Library screen
    Then I see the "Genre", "Media Type", and "Rating" filters in the FilterBar

    Examples:
      | Tab       |
      | Watchlist |
      | Watched   |

  Scenario: LU-03-02 — Home keeps its existing browse filter contract
    Given I am on the Home screen
    Then I see the "Genre", "Media Type", and "From Year/To Year" filters in the FilterBar
    And I do not see the "Rating" filter in the FilterBar
