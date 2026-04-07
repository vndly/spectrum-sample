Feature: LF-06 — Filter Badge

  Scenario: LF-06-01 — Filter badge displays active count
    Given I am on the Library screen
    When I select the "Action" genre
    Then the filter badge displays "1"
    When I select the "Comedy" genre
    And I select "Movie" as media type
    Then the filter badge displays "3"
    When I clear all filters
    Then the filter badge is not displayed
