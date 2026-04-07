Feature: LF-03 — Filter by Rating Range

  Background:
    Given I have rated some movies in my library (2, 4, and 5 stars)
    And I am on the Library screen

  Scenario: LF-03-01 — Filter library by rating range
    When I set the rating filter range to 4-5 stars
    Then only movies with a 4 or 5 star rating are displayed
    And the movie with 2 stars is hidden
