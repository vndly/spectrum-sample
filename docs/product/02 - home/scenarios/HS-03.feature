Feature: Person Result Filtering

  The app filters API results to include only items where media_type is
  "movie" or "tv", discarding "person" results before rendering.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-03-01 — Movie results are displayed
    Given the API returns results with media_type "movie"
    When the user searches for "inception"
    Then movie results are displayed in the SearchResults grid

  Scenario: HS-03-02 — TV show results are displayed
    Given the API returns results with media_type "tv"
    When the user searches for "breaking bad"
    Then TV show results are displayed in the SearchResults grid

  Scenario: HS-03-03 — Person results are filtered out
    Given the API returns results including:
      | title           | media_type |
      | Inception       | movie      |
      | Leonardo DiCaprio | person   |
      | Breaking Bad    | tv         |
    When the user searches for "leo"
    Then only "Inception" and "Breaking Bad" are displayed
    And "Leonardo DiCaprio" is not displayed

  Scenario: HS-03-04 — All person results yields empty state
    Given the API returns only person results
    When the user searches for "tom hanks"
    Then the empty state is displayed
    And no MovieCard components are rendered

  Scenario: HS-03-05 — Mixed results show correct count
    Given the API returns 10 movie results, 5 TV results, and 5 person results
    When the user searches for "star"
    Then exactly 15 MovieCard components are rendered
