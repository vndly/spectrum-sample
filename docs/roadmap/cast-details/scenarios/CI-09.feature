Feature: Filmography sorting
  Sort filmography by release date descending

  Background:
    Given the app is running

  Scenario: CI-09-01 — Credits sorted by date descending
    Given a person with credits from 2020, 2022, and 2018
    When I view the filmography
    Then the credits appear in order: 2022, 2020, 2018

  Scenario Outline: CI-09-02 — Null dates appear last with localized fallback
    Given my language setting is <locale>
    And a person with a credit having no release date
    When I view the filmography
    Then that credit appears at the end of the list
    And the year displays as <fallback>

    Examples:
      | locale | fallback |
      | "en"   | "TBA"    |
      | "es"   | "TBA"    |
      | "fr"   | "À venir" |
