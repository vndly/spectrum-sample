Feature: R-01b-06 — Placeholder view rendering
  Shared EmptyState placeholders SHALL be used for the new routes.

  Scenario Outline: R-01b-06-01 — Placeholder views render shared translated content
    Given the active locale is `<locale>`
    And I navigate to `<route>`
    When the view loads
    Then the placeholder empty state shows the `<icon>` icon
    And the heading is "<empty_title>"
    And the supporting text is "<description>"

    Examples:
      | route            | icon        | locale | empty_title             | description                      |
      | /recommendations | Compass     | en     | Nothing here yet        | This page is under construction. |
      | /stats           | ChartColumn | en     | Nothing here yet        | This page is under construction. |
      | /movie/550       | Film        | en     | Nothing here yet        | This page is under construction. |
      | /show/1396       | Tv          | en     | Nothing here yet        | This page is under construction. |
      | /recommendations | Compass     | fr     | Rien ici pour le moment | Cette page est en construction.  |

  Scenario Outline: R-01b-06-02 — Placeholder view source files use shared translation bindings
    Given the `<view_file>` source file exists at `src/presentation/views/<view_file>`
    When I inspect the placeholder bindings
    Then the heading uses the `common.empty.title` translation key
    And the supporting text uses the `common.empty.description` translation key
    And the file contains no hardcoded locale-specific placeholder copy

    Examples:
      | view_file                   |
      | recommendations-screen.vue |
      | stats-screen.vue           |
      | movie-screen.vue           |
      | show-screen.vue            |
