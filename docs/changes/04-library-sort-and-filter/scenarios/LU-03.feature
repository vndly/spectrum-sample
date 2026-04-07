Feature: LU-03 — FilterBar Customization

  Scenario: LU-03-01 — Library filters are context-specific
    Given I am on the Library screen
    Then I see "Rating" and "Custom List" filters in the FilterBar
    When I am on the Home screen
    Then I do not see "Rating" or "Custom List" filters in the FilterBar
