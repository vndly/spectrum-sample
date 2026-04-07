Feature: LU-01 — SortDropdown Component

  Scenario: LU-01-01 — SortDropdown rendered in Library
    Given I am on the Library screen
    Then the SortDropdown component is displayed in the header area
    And it contains options for: Date Added, Title, Year, Rating
