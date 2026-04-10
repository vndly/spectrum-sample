Feature: LF-06 — Filter Badge

  Scenario: LF-06-01 — Filter badge counts active categories
    Given I am on the Library screen
    When I select the "Action" genre
    Then the filter badge displays "1"
    When I select the "Comedy" genre
    Then the filter badge still displays "1"
    When I select "Movie" as media type
    Then the filter badge displays "2"

  Scenario: LF-06-02 — Filter badge disappears after clearing all filters
    Given I am on the Library screen
    And the Genre and Media Type filters are active
    When I click "Clear All" in the FilterBar
    Then the filter badge is not displayed
