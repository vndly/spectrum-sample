Feature: Search Mode

  When the user types a non-empty query into the SearchBar, the home screen
  hides the browse sections and displays only the SearchResults grid.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-10-01 — Browse sections hidden when query entered
    When the user types "inception" in the SearchBar
    Then the TrendingCarousel section is not visible
    And the PopularGrid section is not visible
    And the FilterBar section is not visible
    And the ViewToggle section is not visible

  Scenario: HS-10-02 — SearchResults displayed when query entered
    When the user types "matrix" in the SearchBar
    And the API returns results
    Then the SearchResults grid is visible below the SearchBar

  Scenario: HS-10-03 — SearchBar remains visible in search mode
    When the user types "test" in the SearchBar
    Then the SearchBar is still visible at the top
    And the user can continue editing the query

  Scenario: HS-10-04 — Single character triggers search mode
    When the user types "a" in the SearchBar
    Then the browse sections are hidden
    And the search mode is active

  Scenario: HS-10-05 — Whitespace-only query stays in browse mode
    When the user types "   " in the SearchBar
    Then the browse sections remain visible
    And the SearchResults component is not rendered
