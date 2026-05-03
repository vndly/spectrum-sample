Feature: LBS-10 Keyboard support

  Background:
    Given the app is running
    And the active language is English
    And I am on the Library screen
    And the selected Library tab is Watchlist
    And the Watchlist contains an entry titled "Batman"
    And the Watchlist contains an entry titled "Arrival"

  Scenario: LBS-10-01 - Enter does not submit or navigate
    Given the Library search input is focused
    And the current route is "/library"
    When I type "batman" in the Library search input
    And I press Enter in the Library search input
    Then the current route remains "/library"
    And no form submission occurs

  Scenario: LBS-10-02 - Escape clears immediately and cancels pending debounce
    When I type "batman" in the Library search input
    And I press Escape in the Library search input before 300ms elapses
    Then the Library search input value is empty
    And both Watchlist entries are visible
    When 300ms elapses without more typing
    Then both Watchlist entries remain visible

  Scenario: LBS-10-03 - Escape preserves active filters
    Given the Watchlist contains an entry titled "Heat" with user rating 5
    And the entry titled "Batman" has user rating 5
    And the entry titled "Arrival" has user rating 2
    And the minimum rating filter is 4
    When I type "batman" in the Library search input
    And 300ms elapses without more typing
    Then only the entry titled "Batman" is visible
    When I press Escape in the Library search input
    Then the Library search input value is empty
    And the minimum rating filter remains 4
    And the entries titled "Batman" and "Heat" are visible
    And the entry titled "Arrival" is not visible
