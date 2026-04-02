Feature: SC-26 — Placeholder view tests
  Placeholder view tests SHALL verify each route renders the documented placeholder content.

  Scenario Outline: SC-26-01 — Route view test verifies placeholder content
    Given the `<test_file>` component test exists at `tests/presentation/views/<test_file>`
    And the `<test_file>` component test mounts the `<route>` view with locale `<locale>`
    When the test suite runs
    Then it verifies the placeholder view shows the <icon> icon
    And it verifies the heading is "<empty_title>"
    And it verifies the supporting text is "<description>"

    Examples:
      | test_file                 | route      | icon         | locale | empty_title             | description                      |
      | home-screen.test.ts       | /          | House        | en     | Nothing here yet        | This page is under construction. |
      | home-screen.test.ts       | /          | House        | fr     | Rien ici pour le moment | Cette page est en construction.  |
      | calendar-screen.test.ts   | /calendar  | CalendarDays | en     | Nothing here yet        | This page is under construction. |
      | calendar-screen.test.ts   | /calendar  | CalendarDays | fr     | Rien ici pour le moment | Cette page est en construction.  |
      | library-screen.test.ts    | /library   | Bookmark     | en     | Nothing here yet        | This page is under construction. |
      | library-screen.test.ts    | /library   | Bookmark     | fr     | Rien ici pour le moment | Cette page est en construction.  |
      | settings-screen.test.ts   | /settings  | Settings     | en     | Nothing here yet        | This page is under construction. |
      | settings-screen.test.ts   | /settings  | Settings     | fr     | Rien ici pour le moment | Cette page est en construction.  |
