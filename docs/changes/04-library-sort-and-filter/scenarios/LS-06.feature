Feature: LS-06 — Sort Persistence

  Scenario: LS-06-01 — Sort preference survives page reload
    Given I am on the Library screen
    When I change the sort to "Title" (Z-A)
    And I reload the page
    Then the sort selection remains "Title" (Z-A)
    And entries are still sorted alphabetically (Z-A)
