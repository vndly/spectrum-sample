Feature: Debounced Search Input

  The SearchBar component debounces user input by 300 ms before initiating
  an API request. This prevents excessive API calls during rapid typing.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-01-01 — Single character typed triggers search after debounce
    When the user types "a" in the SearchBar
    And 300 ms elapse
    Then exactly one API request is made to "/search/multi" with query "a"

  Scenario: HS-01-02 — Rapid typing triggers single API call
    When the user types "inc" in the SearchBar over 100 ms
    And 300 ms elapse after the last keystroke
    Then exactly one API request is made to "/search/multi" with query "inc"

  Scenario: HS-01-03 — Continued typing resets debounce timer
    When the user types "in" in the SearchBar
    And 200 ms elapse
    And the user types "ception" in the SearchBar
    And 300 ms elapse after the last keystroke
    Then exactly one API request is made to "/search/multi" with query "inception"

  Scenario: HS-01-04 — No API call before debounce completes
    When the user types "test" in the SearchBar
    And 100 ms elapse
    Then no API request has been made

  Scenario: HS-01-05 — Clearing input during debounce cancels request
    When the user types "test" in the SearchBar
    And 100 ms elapse
    And the user clears the SearchBar
    And 300 ms elapse
    Then no API request has been made
