Feature: LS-01 — Sort by Date Added

  Background:
    Given my library contains "Oldest Entry" added on 2021-01-01, "Middle Entry" added on 2023-06-15, and "Newest Entry" added on 2025-12-31
    And I am on the Library screen

  Scenario: LS-01-01 — Sort by date added descending (default)
    Then the entries are displayed in the order: "Newest Entry", "Middle Entry", "Oldest Entry"

  Scenario: LS-01-02 — Sort by date added ascending
    When I change the sort to "Date Added" (Oldest First)
    Then the entries are displayed in the order: "Oldest Entry", "Middle Entry", "Newest Entry"
