Feature: LF-07 — Clear Filters

  Background:
    Given the Library filter controls use these documented defaults:
      | Filter        | Default     |
      | Genre         | No selection |
      | Media Type    | All         |
      | Rating Range  | 0.0 to 5.0  |
      | Watch Status  | All         |
      | Custom List   | All Lists   |

  Scenario: LF-07-01 — Clear all filters on the Watchlist tab
    Given I am on the "Watchlist" tab of the Library screen
    And the following visible filters are active:
      | Filter       | Value            |
      | Genre        | Action           |
      | Media Type   | Movie            |
      | Rating Range | 4.0 to 5.0       |
      | Custom List  | Action Favorites |
    When I click "Clear All" in the FilterBar
    Then the "Watchlist" tab remains selected
    And the Genre filter is reset to no selection
    And the Media Type filter is reset to "All"
    And the rating inputs are reset to "0.0" and "5.0"
    And the Custom List filter is reset to "All Lists"
    And all Watchlist entries are displayed

  Scenario: LF-07-02 — Clear all filters on the Lists view
    Given I am on the "Lists" view of the Library screen
    And the selected custom list is "Favorites"
    And the following visible filters are active:
      | Filter        | Value      |
      | Genre         | Action     |
      | Media Type    | Movie      |
      | Rating Range  | 4.0 to 5.0 |
      | Watch Status  | Watched    |
    When I click "Clear All" in the FilterBar
    Then the selected custom list "Favorites" remains active
    And the Genre filter is reset to no selection
    And the Media Type filter is reset to "All"
    And the rating inputs are reset to "0.0" and "5.0"
    And the Watch Status filter is reset to "All"
    And all entries from "Favorites" are displayed
