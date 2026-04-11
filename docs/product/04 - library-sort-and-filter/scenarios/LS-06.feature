Feature: LS-06 — Sort Persistence

  Scenario: LS-06-01 — Sort preference survives page reload
    Given my library contains "Alien", "Inception", and "The Matrix"
    And I am on the Library screen
    When I change the sort to "Title" (Z-A)
    And I reload the page
    Then the sort selection remains "Title" (Z-A)
    And the entries are displayed in the order: "The Matrix", "Inception", "Alien"
