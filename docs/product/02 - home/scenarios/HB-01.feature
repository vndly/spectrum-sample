Feature: HB-01 — Home Screen Browse Mode

  Surface trending and popular movies and TV shows when not searching.

  Background:
    Given the home screen is not in search mode
    And search query is empty

  Scenario: HB-01-01 — Display Trending Carousel
    When the home screen loads
    Then the "Trending Today" carousel is displayed
    And it contains up to 10 items with poster or backdrop and title

  Scenario: HB-01-02 — Display Popular Movies
    When the home screen loads
    Then the "Popular Movies" grid is displayed
    And it contains up to 20 movie items

  Scenario: HB-01-03 — Display Popular TV Shows
    When the home screen loads
    Then the "Popular TV Shows" grid is displayed
    And it contains up to 20 TV show items

  Scenario: HB-01-04 — Navigate to Item Detail
    When I tap on a trending or popular item
    Then I am navigated to its detail screen

  Scenario: HB-01-05 — Switch to Search Mode
    When I type a query into the SearchBar
    Then browse sections (Trending and Popular) are hidden
    And search results are displayed
