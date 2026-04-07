Feature: LS-03 — Sort by Release Year

  Background:
    Given my library contains:
      | Title     | Year |
      | "Alien"   | 1979 |
      | "Matrix"  | 1999 |
      | "Dune"    | 2021 |
    And I am on the Library screen

  Scenario Outline: LS-03-01 — Sort by release year
    When I change the sort to "Release Year" (<Order>)
    Then the entries are displayed in the order: <First>, <Second>, <Third>

    Examples:
      | Order | First    | Second   | Third    |
      | Newest| "Dune"   | "Matrix" | "Alien"  |
      | Oldest| "Alien"  | "Matrix" | "Dune"   |
