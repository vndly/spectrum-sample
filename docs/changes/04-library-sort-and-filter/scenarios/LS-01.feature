Feature: LS-01 — Sort by Date Added

  Background:
    Given I have several entries in my library with different addition dates
    And I am on the Library screen

  Scenario: LS-01-01 — Sort by date added descending (default)
    Then the entries are sorted by "Date Added" (Newest First)

  Scenario: LS-01-02 — Sort by date added ascending
    When I change the sort to "Date Added" (Oldest First)
    Then the entries are sorted with the earliest added items first
