Feature: Biography
  Display person's biography with expansion

  Background:
    Given the app is running

  Scenario: CI-05-01 — Long biography truncates with Read more
    Given a person with a long biography (>6 lines)
    When I view the person page
    Then the biography is truncated to 6 lines
    And a "Read more" button is visible

  Scenario: CI-05-02 — Read more expands full biography
    Given a person with a long biography
    And the biography is truncated
    When I click "Read more"
    Then the full biography displays
    And the button text changes to "Read less"

  Scenario: CI-05-03 — Short biography displays fully
    Given a person with a short biography (<6 lines)
    When I view the person page
    Then the full biography displays
    And no "Read more" button is visible

  Scenario: CI-05-04 — Empty biography shows message
    Given a person with no biography
    When I view the person page
    Then I see the localized "person.biographyEmpty" message

  Scenario Outline: CI-05-05 — Biography controls use active locale
    Given my language setting is <locale>
    And a person with a long biography
    When I view the person page
    Then the biography expansion button displays <readMore>
    When I click <readMore>
    Then the biography collapse button displays <readLess>

    Examples:
      | locale | readMore       | readLess       |
      | "en"   | "Read more"    | "Read less"    |
      | "es"   | "Leer más"     | "Leer menos"   |
      | "fr"   | "Lire la suite" | "Lire moins"   |

  Scenario: CI-05-06 — Biography has readable responsive width
    Given a person with a biography
    When I view the person page on a mobile viewport
    Then the biography container has at least 16px horizontal padding
    When I view the person page on a desktop viewport
    Then the biography text width is no wider than max-w-prose or 72ch
