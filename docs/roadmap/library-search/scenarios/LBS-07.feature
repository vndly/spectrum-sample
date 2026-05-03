Feature: LBS-07 Filter integration

  Background:
    Given the app is running
    And the active language is English
    And I am on the Library screen
    And the selected Library tab is Watchlist

  Scenario: LBS-07-01 - Search combines with genre and media type filters
    Given the Watchlist contains a movie titled "Action Comedy" with genre "Comedy"
    And the Watchlist contains a movie titled "Action Thriller" with genre "Thriller"
    And the Watchlist contains a TV show titled "Action Sitcom" with genre "Comedy"
    When I set the genre filter to "Comedy"
    And I set the media type filter to "movie"
    And I type "action" in the Library search input
    And 300ms elapses without more typing
    Then only the entry titled "Action Comedy" is visible

  Scenario: LBS-07-02 - Search combines with user rating filters
    Given the Watchlist contains an entry titled "Action Classic" with user rating 5
    And the Watchlist contains an entry titled "Action Miss" with user rating 2
    When I set the minimum rating filter to 4
    And I type "action" in the Library search input
    And 300ms elapses without more typing
    Then only the entry titled "Action Classic" is visible
