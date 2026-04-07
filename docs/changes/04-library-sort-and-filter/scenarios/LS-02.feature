Feature: LS-02 — Sort by Title

  Background:
    Given my library contains "Inception", "The Matrix", and "Alien"
    And I am on the Library screen

  Scenario Outline: LS-02-01 — Sort alphabetically by title
    When I change the sort to "Title" (<Order>)
    Then the entries are displayed in the order: <First>, <Second>, <Third>

    Examples:
      | Order | First        | Second       | Third        |
      | A-Z   | "Alien"      | "Inception"  | "The Matrix" |
      | Z-A   | "The Matrix" | "Inception"  | "Alien"      |
