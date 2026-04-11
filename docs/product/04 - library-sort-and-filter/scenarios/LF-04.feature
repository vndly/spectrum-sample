Feature: LF-04 — Filter by Watch Status

  Background:
    Given I am on the "Lists" view of the Library screen
    And I have selected the custom list "Favorites"
    And "Favorites" contains "Watchlist Pick" with status "Watchlist"
    And "Favorites" contains "Watched Favorite" with status "Watched"
    And "Favorites" contains "Untracked Discovery" with status "Untracked"

  Scenario Outline: LF-04-01 — Filter selected list by watch status
    When I select the "<Status>" watch-status filter
    Then the selected custom list "Favorites" remains active
    And the Library screen shows the expected "Favorites" items for "<Status>"

    Examples:
      | Status      |
      | Watchlist   |
      | Watched     |
      | Untracked   |
      | All         |

  Scenario Outline: LF-04-02 — Watch-status filter is hidden when the tab already defines status
    Given I am on the "<Tab>" tab of the Library screen
    Then I do not see the "Watch Status" filter in the FilterBar

    Examples:
      | Tab       |
      | Watchlist |
      | Watched   |
