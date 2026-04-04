Feature: Empty State

  When the API returns zero results after filtering, the app displays
  an empty state message with helpful guidance.

  Implements HS-06.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-06-01 — Empty state displays for zero results
    Given the API returns zero results for the query
    When the user searches for "xyznonexistent123"
    Then the empty state is displayed
    And the heading "No results found" is visible

  Scenario: HS-06-02 — Empty state shows helpful subtitle
    Given the API returns zero results for the query
    When the user searches for "asdfghjkl"
    Then the subtitle "Try different keywords or check your spelling" is visible

  Scenario: HS-06-03 — Empty state is centered in results area
    Given the API returns zero results for the query
    When the user searches for "noresults"
    Then the empty state message is vertically and horizontally centered

  Scenario: HS-06-04 — Empty state does not show when query is empty
    Given the search query is empty
    Then the empty state is not displayed
    And the browse sections are visible

  Scenario: HS-06-05 — Empty state after filtering person-only results
    Given the API returns only person results for the query
    When the user searches for "famous actor"
    Then the empty state is displayed
    And no MovieCard components are rendered

  Scenario: HS-06-06 — User can type new query from empty state
    Given the empty state is displayed for query "noresults"
    When the user types "inception" in the SearchBar
    And the API returns results
    Then the empty state is replaced by search results

  Scenario: HS-06-07 — Empty state displays translated text in Spanish locale
    Given the user's language setting is "es"
    And the API returns zero results for the query
    When the user searches for "xyznonexistent123"
    Then the empty state heading is displayed in Spanish
    And the empty state subtitle is displayed in Spanish
