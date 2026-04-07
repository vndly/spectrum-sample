Feature: LU-04 — Empty State

  Scenario: LU-04-01 — Empty state on restrictive filters
    Given I am on the Library screen
    When I set the filters so that no items match (e.g. Rating: 5 and Genre: Horror)
    Then I see the empty state message: "No items match your filters"
    And I see a "Clear All" button to reset the filters
