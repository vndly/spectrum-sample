Feature: LU-02 — FilterBar Integration

  Scenario: LU-02-01 — FilterBar rendered in Library
    Given I am on the Library screen
    Then the FilterBar component is displayed below the header tabs
    And it contains all active library filters
    And it remains sticky when scrolling content
