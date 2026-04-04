Feature: Result Navigation

  Tapping a MovieCard in search results navigates to the appropriate
  detail page based on the media type.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-05-01 — Tapping movie card navigates to movie detail page
    Given the API returns a movie with id 550 and media_type "movie"
    When the user searches for "fight club"
    And the user taps the MovieCard for id 550
    Then the app navigates to "/movie/550"

  Scenario: HS-05-02 — Tapping TV show card navigates to show detail page
    Given the API returns a TV show with id 1396 and media_type "tv"
    When the user searches for "breaking bad"
    And the user taps the MovieCard for id 1396
    Then the app navigates to "/show/1396"

  Scenario: HS-05-03 — Navigation preserves search state on back
    Given the user has searched for "inception"
    And search results are displayed
    When the user taps a MovieCard
    And the user navigates back
    Then the search query "inception" is still in the SearchBar
    And the search results are still displayed

  Scenario: HS-05-04 — Keyboard navigation works on MovieCard
    Given the API returns search results
    When the user focuses a MovieCard using Tab key
    And the user presses Enter
    Then the app navigates to the detail page for that item
