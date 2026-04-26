Feature: Filmography grid
  Display combined movie and TV credits as a grid

  Background:
    Given the app is running
    And a person with movie and TV credits

  Scenario: CI-08-01 — Filmography displays as responsive grid
    When I view the person page on desktop
    Then the filmography displays as a 6-column grid

  Scenario Outline: CI-08-02 — Grid columns adapt to viewport
    When I view the person page at <viewport> width
    Then the filmography displays as a <columns>-column grid

    Examples:
      | viewport | columns |
      | desktop  | 6       |
      | lg       | 4       |
      | md       | 3       |
      | sm       | 2       |

  Scenario: CI-08-03 — Credit card shows required info
    When I view the person page
    Then each filmography item shows:
      | field       |
      | poster      |
      | title       |
      | year        |
      | media badge |
      | character   |

  Scenario: CI-08-04 — Movie badge displays in teal
    Given a person with movie credits
    When I view the filmography
    Then movie items have a teal "Movie" badge

  Scenario: CI-08-05 — TV badge displays in violet
    Given a person with TV credits
    When I view the filmography
    Then TV items have a violet "TV" badge

  Scenario: CI-08-06 — Duplicate credits are deduplicated
    Given a person who played multiple roles in the same movie
    When I view the filmography
    Then the movie appears only once
    And the character shown is from the highest billing
