Feature: LBS-06 Clear search

  Background:
    Given the app is running
    And the active language is English
    And I am on the Library screen
    And the selected Library tab is Watchlist
    And the Watchlist contains an entry titled "Batman"
    And the Watchlist contains an entry titled "Arrival"

  Scenario: LBS-06-01 - Clear button clears immediately and returns focus
    Given the Library search query is "batman"
    And only the entry titled "Batman" is visible
    When the Library search controls are displayed
    Then the Library search clear button is visible
    And the Library search clear button has accessible name "Clear search"
    And the Library search clear button touch target is at least 44 by 44 pixels
    When I click the Library search clear button
    Then the Library search input value is empty
    And the Library search clear button is not visible
    And both Watchlist entries are visible
    And keyboard focus remains in the Library search input

  Scenario: LBS-06-02 - Clear cancels a pending debounce
    When I type "batman" in the Library search input
    And I click the Library search clear button before 300ms elapses
    Then the Library search input value is empty
    And both Watchlist entries are visible
    When 300ms elapses without more typing
    Then both Watchlist entries remain visible

  Scenario: LBS-06-03 - Clear preserves active filters
    Given the Watchlist contains an entry titled "Heat" with user rating 5
    And the entry titled "Batman" has user rating 5
    And the entry titled "Arrival" has user rating 2
    And the minimum rating filter is 4
    And the Library search query is "batman"
    And only the entry titled "Batman" is visible
    When I click the Library search clear button
    Then the Library search input value is empty
    And the minimum rating filter remains 4
    And the entries titled "Batman" and "Heat" are visible
    And the entry titled "Arrival" is not visible
