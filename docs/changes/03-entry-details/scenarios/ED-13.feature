Feature: TMDB Rating Badge

  The TMDB community rating (vote_average) is displayed as a rating badge.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-13-01 - Rating badge displays vote average
    Given the entry has vote_average 8.4
    When the detail page loads
    Then a rating badge displays "8.4"

  Scenario: ED-13-02 - Rating formatted to one decimal
    Given the entry has vote_average 7.856
    When the detail page loads
    Then the rating badge displays "7.9" (rounded)

  Scenario: ED-13-03 - Rating badge styling
    Given the entry has a vote_average
    When the detail page loads
    Then the rating badge uses teal accent styling
    And displays a star icon alongside the number

  Scenario: ED-13-04 - Rating badge handles zero votes
    Given the entry has vote_average 0
    When the detail page loads
    Then the rating badge displays "0.0"
