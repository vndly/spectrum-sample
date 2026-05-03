Feature: LBS-05 Query normalization

  Background:
    Given the app is running
    And the active language is English
    And I am on the Library screen
    And the selected Library tab is Watchlist

  Scenario: LBS-05-01 - Leading and trailing whitespace are ignored
    Given the Watchlist contains an entry titled "Batman"
    And the Watchlist contains an entry titled "Arrival"
    When I type " bat " in the Library search input
    And 300ms elapses without more typing
    Then only the entry titled "Batman" is visible

  Scenario: LBS-05-02 - Whitespace-only query behaves like no search
    Given the Watchlist contains an entry titled "Batman"
    And the Watchlist contains an entry titled "Arrival"
    When I type "   " in the Library search input
    And 300ms elapses without more typing
    Then both Watchlist entries are visible

  Scenario: LBS-05-03 - Special characters are matched literally
    Given the Watchlist contains an entry titled "Regex Documentary" with tag ".*"
    And the Watchlist contains an entry titled "Programming Film" with notes "C++ references"
    And the Watchlist contains an entry titled "Arrival" with no tags or notes
    When I type ".*" in the Library search input
    And 300ms elapses without more typing
    Then only the entry titled "Regex Documentary" is visible
    When I replace the Library search query with "C++"
    And 300ms elapses without more typing
    Then only the entry titled "Programming Film" is visible

  Scenario: LBS-05-04 - Internal whitespace is preserved and matched literally
    Given the Watchlist contains an entry titled "Exact Spacing" with notes "deep  space archive"
    And the Watchlist contains an entry titled "Normalized Spacing" with notes "deep space archive"
    When I type a query containing two spaces between "deep" and "space"
    And 300ms elapses without more typing
    Then only the entry titled "Exact Spacing" is visible
