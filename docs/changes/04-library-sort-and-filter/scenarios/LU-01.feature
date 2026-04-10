Feature: LU-01 — SortDropdown Component

  Scenario: LU-01-01 — SortDropdown rendered in Library
    Given I am on the Library screen
    Then I see a sort control in the library header
    And the sort control offers: Date Added, Title, Release Year, User Rating
