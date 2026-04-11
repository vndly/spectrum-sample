Feature: LS-04 — Sort by User Rating

  Background:
    Given my library contains:
      | Title   | Rating |
      | "Film A"| 2      |
      | "Film B"| 5      |
      | "Film C"| 4      |
    And I am on the Library screen

  Scenario Outline: LS-04-01 — Sort by user rating
    When I change the sort to "User Rating" (<Order>)
    Then the entries are displayed in the order: <First>, <Second>, <Third>

    Examples:
      | Order   | First    | Second   | Third    |
      | Highest | "Film B" | "Film C" | "Film A" |
      | Lowest  | "Film A" | "Film C" | "Film B" |
