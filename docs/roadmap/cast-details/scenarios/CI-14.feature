Feature: Empty filmography
  Handle empty filmography gracefully

  Scenario: CI-14-01 — Empty filmography shows message
    Given the app is running
    And a person with no credits
    When I view the person page
    Then I see the localized "person.creditsEmpty" message

  Scenario Outline: CI-14-02 — Empty filmography message uses active locale
    Given the app is running
    And my language setting is <locale>
    And a person with no credits
    When I view the person page
    Then the empty filmography message displays <message>

    Examples:
      | locale | message                   |
      | "en"   | "No credits available."   |
      | "es"   | "No hay créditos."        |
      | "fr"   | "Aucun crédit disponible." |
