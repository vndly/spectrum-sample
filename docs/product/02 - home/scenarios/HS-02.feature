Feature: Multi-Search API Call

  When the debounce timer fires with a non-empty query, the app calls
  GET /search/multi with the trimmed query string and current language setting.

  Implements HS-02.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-02-01 — API call includes trimmed query parameter
    Given the user's language setting is "en"
    When the user types "  inception  " in the SearchBar
    And the debounce timer fires
    Then an API request is made to "/search/multi" with query parameter "inception"

  Scenario: HS-02-02 — API call includes language parameter
    Given the user's language setting is "es"
    When the user types "matrix" in the SearchBar
    And the debounce timer fires
    Then an API request is made to "/search/multi" with language parameter "es"

  Scenario: HS-02-03 — API call uses page 1
    Given the user's language setting is "en"
    When the user types "avatar" in the SearchBar
    And the debounce timer fires
    Then an API request is made to "/search/multi" with page parameter "1"

  Scenario: HS-02-04 — API call excludes adult content
    Given the user's language setting is "en"
    When the user types "titanic" in the SearchBar
    And the debounce timer fires
    Then an API request is made to "/search/multi" with include_adult parameter "false"

  Scenario: HS-02-05 — Empty query after trim does not trigger API call
    When the user types "   " in the SearchBar
    And the debounce timer fires
    Then no API request is made

  Scenario: HS-02-06 — API call includes all required parameters
    Given the user's language setting is "fr"
    When the user types "amélie" in the SearchBar
    And the debounce timer fires
    Then an API request is made to "/search/multi" with:
      | parameter     | value   |
      | query         | amélie  |
      | language      | fr      |
      | page          | 1       |
      | include_adult | false   |
