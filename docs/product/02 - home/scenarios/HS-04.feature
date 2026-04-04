Feature: Search Results Display

  Search results are displayed as MovieCard components in a responsive grid,
  showing poster, title, year, and vote average for each result.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-04-01 — MovieCard displays poster image
    Given the API returns a movie with poster_path "/abc123.jpg"
    When the user searches for "test movie"
    Then the MovieCard displays a poster image from the TMDB image URL

  Scenario: HS-04-02 — MovieCard displays title
    Given the API returns a movie with title "The Matrix"
    When the user searches for "matrix"
    Then the MovieCard displays the title "The Matrix"

  Scenario: HS-04-03 — MovieCard displays release year for movies
    Given the API returns a movie with release_date "1999-03-31"
    When the user searches for "matrix"
    Then the MovieCard displays the year "1999"

  Scenario: HS-04-04 — MovieCard displays first air year for TV shows
    Given the API returns a TV show with first_air_date "2008-01-20"
    When the user searches for "breaking bad"
    Then the MovieCard displays the year "2008"

  Scenario: HS-04-05 — MovieCard displays vote average
    Given the API returns a movie with vote_average 8.7
    When the user searches for "inception"
    Then the MovieCard displays the rating "8.7"

  Scenario: HS-04-06 — MovieCard handles missing poster gracefully
    Given the API returns a movie with poster_path null
    When the user searches for "rare movie"
    Then the MovieCard displays a placeholder image

  Scenario: HS-04-07 — Grid displays responsive columns on desktop
    Given the viewport width is 1440px
    When the user searches for "popular"
    And the API returns 10 results
    Then the grid displays 5 or 6 columns

  Scenario: HS-04-08 — Grid displays 2 columns on mobile
    Given the viewport width is 375px
    When the user searches for "popular"
    And the API returns 10 results
    Then the grid displays 2 columns
