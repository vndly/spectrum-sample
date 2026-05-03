Feature: LBS-02 Debounced filtering

  Background:
    Given the app is running
    And the active language is English
    And I am on the Library screen
    And the selected Library tab is Watchlist

  Scenario: LBS-02-01 - Debounced search applies after 300ms of idle typing
    Given the Watchlist contains an entry titled "Batman Begins"
    And the Watchlist contains an entry titled "Arrival"
    When I type "batman" in the Library search input
    Then both Watchlist entries remain visible before 300ms elapses
    When 300ms elapses without more typing
    Then only the entry titled "Batman Begins" is visible

  Scenario: LBS-02-02 - Search runs before projection and matches tags and notes
    Given the Watchlist contains an entry titled "Arrival" with tag "language-study"
    And the Watchlist contains an entry titled "Moon" with notes "quiet isolation film"
    And the Watchlist contains an entry titled "Heat" with no tags or notes
    When I type "language-study" in the Library search input
    And 300ms elapses without more typing
    Then only the entry titled "Arrival" is visible
    When I replace the Library search query with "quiet isolation"
    And 300ms elapses without more typing
    Then only the entry titled "Moon" is visible

  Scenario: LBS-02-03 - Search computation meets the 500-entry performance threshold
    Given the Watchlist contains 500 entries including one entry titled "Batman Benchmark"
    When I type "batman" in the Library search input
    And 300ms elapses without more typing
    Then the pure search/filter computation completes in less than 50ms
    And the composable recomputation completes in less than 50ms
    And only the entry titled "Batman Benchmark" is visible
