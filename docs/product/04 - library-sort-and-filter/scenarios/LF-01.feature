Feature: LF-01 — Filter by Genre

  Background:
    Given my "Watchlist" tab contains the following saved entries with persisted genre snapshots:
      | Title            | Genre IDs | Genre Labels    |
      | "Action Film A"  | 28        | Action          |
      | "Comedy Film B"  | 35        | Comedy          |
      | "Action Comedy"  | 28,35     | Action, Comedy  |
    And I am on the "Watchlist" tab of the Library screen

  Scenario: LF-01-01 — Filter library by a single genre
    When I select the "Action" genre from the FilterBar
    Then "Action Film A" is displayed
    And "Action Comedy" is displayed
    And "Comedy Film B" is hidden

  Scenario: LF-01-02 — Filter library by multiple genres
    When I select the "Action" genre from the FilterBar
    And I select the "Comedy" genre from the FilterBar
    Then "Action Film A" is displayed
    And "Comedy Film B" is displayed
    And "Action Comedy" is displayed
