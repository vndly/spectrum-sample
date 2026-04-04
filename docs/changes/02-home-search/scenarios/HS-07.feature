Feature: Loading Skeleton

  While the API request is in flight, the app displays skeleton placeholders
  matching the MovieCard grid layout.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-07-01 — Skeleton displays during API request
    Given the API response is delayed
    When the user searches for "slow query"
    Then skeleton placeholders are displayed in the results area

  Scenario: HS-07-02 — Skeleton matches MovieCard grid layout
    Given the API response is delayed
    And the viewport width is 1440px
    When the user searches for "test"
    Then skeleton placeholders display in a responsive grid with 5-6 columns

  Scenario: HS-07-03 — Skeleton has correct aspect ratio
    Given the API response is delayed
    When the user searches for "test"
    Then each skeleton placeholder has a 2:3 aspect ratio matching poster dimensions

  Scenario: HS-07-04 — Skeleton includes shimmer animation
    Given the API response is delayed
    When the user searches for "test"
    Then skeleton placeholders have an animated shimmer effect

  Scenario: HS-07-05 — SearchBar remains interactive during loading
    Given the API response is delayed
    When the user searches for "first query"
    And skeleton placeholders are displayed
    Then the user can type a new query in the SearchBar
    And the SearchBar is not disabled

  Scenario: HS-07-06 — Skeleton replaced by results on API success
    Given the API response takes 500ms
    When the user searches for "inception"
    Then skeleton placeholders display for approximately 500ms
    And skeleton placeholders are replaced by MovieCard components

  Scenario: HS-07-07 — Mobile displays fewer skeleton cards
    Given the API response is delayed
    And the viewport width is 375px
    When the user searches for "test"
    Then the skeleton grid displays 2 columns

  Scenario: HS-07-08 — Keyboard navigation works during loading
    Given the API response is delayed
    When the user searches for "test"
    And skeleton placeholders are displayed
    Then the user can press Tab to move focus away from SearchBar
    And the user can press Escape to blur the SearchBar

  Scenario: HS-07-09 — Skeleton displays exactly 8 placeholder cards
    Given the API response is delayed
    When the user searches for "test"
    Then exactly 8 skeleton placeholder cards are displayed
