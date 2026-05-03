Feature: Filmography grid
  Display combined movie and TV cast credits as a grid

  Background:
    Given the app is running
    And a person with movie and TV cast credits

  Scenario: CI-08-01 — Filmography displays as responsive grid
    When I view the person page on desktop
    Then the filmography displays as a 6-column grid

  Scenario Outline: CI-08-02 — Grid columns adapt to viewport
    When I view the person page at <viewport> width
    Then the filmography displays as a <columns>-column grid

    Examples:
      | viewport | columns |
      | mobile   | 2       |
      | md       | 3       |
      | lg       | 4       |
      | xl       | 6       |

  Scenario: CI-08-03 — Credit card shows required info
    When I view the person page
    Then each filmography item shows a poster
    And each filmography item shows a title
    And each filmography item shows a year or "TBA"
    And each filmography item shows a media badge
    And each filmography item shows a character name from combined_credits.cast

  Scenario Outline: CI-08-04 — Movie badge displays in teal with active locale
    Given a person with movie credits
    And my language setting is <locale>
    When I view the filmography
    Then movie items have a teal <label> badge

    Examples:
      | locale | label      |
      | "en"   | "Movie"    |
      | "es"   | "Película" |
      | "fr"   | "Film"     |

  Scenario Outline: CI-08-05 — TV badge displays in violet with active locale
    Given a person with TV credits
    And my language setting is <locale>
    When I view the filmography
    Then TV items have a violet <label> badge

    Examples:
      | locale | label |
      | "en"   | "TV"  |
      | "es"   | "TV"  |
      | "fr"   | "TV"  |

  Scenario: CI-08-06 — Duplicate credits are deduplicated
    Given a person who played multiple roles in the same movie
    When I view the filmography
    Then the movie appears only once
    And the character shown is from the highest billing

  Scenario: CI-08-07 — Large filmography remains usable
    Given a person with 120 unique combined movie and TV cast credits
    When I view the filmography
    Then 120 filmography credit links are rendered
    And the credits remain sorted by release date descending
    And no duplicate media entries are displayed
    When I Tab through the first 10 filmography credit links
    Then focus moves sequentially through those 10 links without leaving the filmography grid

  Scenario: CI-08-08 — Filmography poster images use view-model URLs and lazy loading
    When I view the person page
    Then each filmography poster source is the Application-provided URL built from poster_path with IMAGE_SIZES.poster.small
    And each filmography poster image uses loading="lazy"
    And each filmography poster image has localized alt text containing the credit title
