Feature: LF-07 — Clear Filters

  Background:
    Given the Library filter controls use these documented defaults:
      | Filter        | Default     |
      | Genre         | No selection |
      | Media Type    | All         |
      | Rating Range  | 0.0 to 5.0  |

  Scenario: LF-07-01 — Clear all filters on the Watchlist tab
    Given I am on the "Watchlist" tab of the Library screen
    And the following visible filters are active:
      | Filter       | Value            |
      | Genre        | Action           |
      | Media Type   | Movie            |
      | Rating Range | 4.0 to 5.0       |
    When I click "Clear All" in the FilterBar
    Then the "Watchlist" tab remains selected
    And the Genre filter is reset to no selection
    And the Media Type filter is reset to "All"
    And the rating inputs are reset to "0.0" and "5.0"
    And all Watchlist entries are displayed

  Scenario: LF-07-02 — Clear all filters on the Watched tab
    Given I am on the "Watched" tab of the Library screen
    And the following visible filters are active:
      | Filter        | Value      |
      | Genre         | Action     |
      | Media Type    | Movie      |
      | Rating Range  | 4.0 to 5.0 |
    When I click "Clear All" in the FilterBar
    Then the "Watched" tab remains selected
    And the Genre filter is reset to no selection
    And the Media Type filter is reset to "All"
    And the rating inputs are reset to "0.0" and "5.0"
    And all Watched entries are displayed
