Feature: LS-02 — Sort by Title

  Background:
    Given my library contains the following saved entries with persisted title snapshots:
      | Media Type | Snapshot Title |
      | Movie      | "Alien"        |
      | TV Show    | "Andor"        |
      | Movie      | "The Matrix"   |
    And I am on the Library screen

  Scenario Outline: LS-02-01 — Sort alphabetically by normalized snapshot title
    When I change the sort to "Title" (<Order>)
    Then the entries are displayed in the order: <First>, <Second>, <Third>

    Examples:
      | Order | First        | Second     | Third        |
      | A-Z   | "Alien"      | "Andor"    | "The Matrix" |
      | Z-A   | "The Matrix" | "Andor"    | "Alien"      |
