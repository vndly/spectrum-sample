Feature: Error Handling

  If the API request fails, the app displays an inline error message
  below the SearchBar with a Retry button.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-08-01 — Network error displays inline error message
    Given the network is offline
    When the user searches for "test"
    Then an inline error message is displayed below the SearchBar
    And the error message text is "Failed to load search results"

  Scenario: HS-08-02 — Error message includes Retry button
    Given the API returns a server error
    When the user searches for "test"
    Then a "Retry" button is displayed with the error message

  Scenario: HS-08-03 — Retry button re-attempts the search
    Given the API returns a server error
    When the user searches for "inception"
    And the error message is displayed
    And the user clicks the "Retry" button
    Then a new API request is made to "/search/multi" with query "inception"

  Scenario: HS-08-04 — Successful retry replaces error with results
    Given the API returns a server error on first attempt
    And the API returns valid results on second attempt
    When the user searches for "matrix"
    And the user clicks the "Retry" button
    Then the error message is hidden
    And search results are displayed

  Scenario: HS-08-05 — Error is not full-page
    Given the API returns a server error
    When the user searches for "test"
    Then the SearchBar is still visible
    And the error message is inline, not full-screen

  Scenario: HS-08-06 — Rate limit triggers exponential backoff
    Given the API returns 429 Too Many Requests
    When the user searches for "popular"
    Then the app retries with exponential backoff (1s, 2s, 4s)
    And up to 3 retry attempts are made automatically

  Scenario: HS-08-07 — Rate limit exhaustion shows error
    Given the API returns 429 Too Many Requests for all retry attempts
    When the user searches for "popular"
    And all automatic retries are exhausted
    Then an inline error message is displayed
    And the "Retry" button is available for manual retry

  Scenario: HS-08-08 — New search clears previous error
    Given an error message is displayed for a failed search
    When the user types a new query in the SearchBar
    And the debounce timer fires
    Then the error message is cleared
    And loading skeleton is displayed

  Scenario: HS-08-09 — Retry uses current query value
    Given the API returns a server error
    When the user searches for "matrix"
    And the error message is displayed
    And the user types "inception" in the SearchBar
    And the user clicks the "Retry" button
    Then a new API request is made to "/search/multi" with query "inception"
    And no API request is made with query "matrix"
