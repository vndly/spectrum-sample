Feature: LBS-09 Tab-state retention

  Background:
    Given the app is running
    And the active language is English
    And I am on the Library screen
    And the Watchlist contains an entry titled "Batman Begins"
    And the Watched list contains an entry titled "The Batman"
    And the Watched list contains an entry titled "Arrival"

  Scenario: LBS-09-01 - Search query remains applied while switching tabs
    Given the selected Library tab is Watchlist
    When I type "batman" in the Library search input
    And 300ms elapses without more typing
    Then only the entry titled "Batman Begins" is visible
    When I switch to the Watched tab
    Then the Library search input value is "batman"
    And only the entry titled "The Batman" is visible

  Scenario: LBS-09-02 - Search query is not retained after reload
    Given the selected Library tab is Watchlist
    And the Library search query is "batman"
    And only entries matching "batman" are visible
    When I reload the page
    Then the Library search input value is empty
    And all entries for the selected Library tab are visible
