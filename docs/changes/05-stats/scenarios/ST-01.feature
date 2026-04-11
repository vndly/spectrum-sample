Feature: Stat Calculations

  As a user, I want to see key metrics about my library.

  Background:
    Given a library with the following watched entries:
      | title    | mediaType | rating | runtime | watchDates   |
      | Inception| movie     | 5      | 148     | 2026-01-15   |
      | Batman   | movie     | 4      | 140     | 2026-02-10   |
      | Friends  | tv        | 3      | 22      | 2026-03-05   |
    And a library with 2 watchlist entries

  Scenario: Displaying total counts and average rating
    When I view the stats screen
    Then I should see "3" as the total watched count
    And I should see "2" as the total watchlist count
    And I should see "4.0" as the average rating

  Scenario: Displaying total watch time
    When I view the stats screen
    Then I should see "5h 10m" as the total watch time
    # (148 + 140 + 22 = 310 minutes = 5h 10m)
