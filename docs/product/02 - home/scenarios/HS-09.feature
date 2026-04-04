Feature: Browse Mode

  When the search query is empty, the home screen displays the browse
  sections: TrendingCarousel, PopularGrid, FilterBar, and ViewToggle.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-09-01 — Browse sections visible on initial load
    Given the search query is empty
    Then the TrendingCarousel section is visible
    And the PopularGrid section is visible
    And the FilterBar section is visible
    And the ViewToggle section is visible

  Scenario: HS-09-02 — SearchBar visible in browse mode
    Given the search query is empty
    Then the SearchBar is visible at the top of the content area
    And the browse sections are below the SearchBar

  Scenario: HS-09-03 — No search results in browse mode
    Given the search query is empty
    Then the SearchResults component is not rendered
    And no loading skeleton is displayed in the search area

  Scenario: HS-09-04 — Browse sections maintain state
    Given the user has scrolled down in the TrendingCarousel
    And the search query is empty
    When the user views the home screen
    Then the TrendingCarousel maintains its scroll position
