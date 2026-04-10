Feature: LU-02 — FilterBar Integration

  Scenario: LU-02-01 — FilterBar rendered in Library
    Given I am on the Library screen
    Then I see the library filter controls directly below the header tabs
    And I see the active library filter controls for the current view
    And the filter controls remain sticky when the library content scrolls
