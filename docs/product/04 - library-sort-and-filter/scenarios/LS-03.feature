Feature: LS-03 — Sort by Release Year

  Background:
    Given my library contains the following saved entries with persisted release-date snapshots:
      | Media Type | Title     | Snapshot Release Date |
      | Movie      | "Alien"   | 1979-05-25            |
      | TV Show    | "Andor"   | 2022-09-21            |
      | Movie      | "Dune"    | 2021-10-22            |
    And I am on the Library screen

  Scenario Outline: LS-03-01 — Sort by release year from persisted snapshots
    When I change the sort to "Release Year" (<Order>)
    Then the entries are displayed in the order: <First>, <Second>, <Third>

    Examples:
      | Order  | First     | Second   | Third    |
      | Newest | "Andor"   | "Dune"   | "Alien"  |
      | Oldest | "Alien"   | "Dune"   | "Andor"  |
