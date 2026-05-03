Feature: Birth info
  Display birthday, place of birth, and death date

  Background:
    Given the app is running

  Scenario: CI-06-01 — Birthday and birthplace display
    Given a person born on "July 9, 1956" in "Concord, California, USA"
    When I view the person page
    Then I see "Born: July 9, 1956 • Concord, California, USA"

  Scenario: CI-06-02 — Death date displays when applicable
    Given a person who died on "January 1, 2020"
    When I view the person page
    Then I see "Died: January 1, 2020"

  Scenario: CI-06-03 — Missing birth info is hidden
    Given a person with no birthday or birthplace
    When I view the person page
    Then the birth info section is not displayed

  Scenario Outline: CI-06-04 — Birth and death labels use active locale
    Given my language setting is <locale>
    And a person born on "1956-07-09" who died on "2020-01-01"
    When I view the person page
    Then the birth label displays <bornLabel>
    And the death label displays <diedLabel>
    And the date month names are formatted for <locale>

    Examples:
      | locale | bornLabel | diedLabel |
      | "en"   | "Born"    | "Died"    |
      | "es"   | "Nacido"  | "Murió"   |
      | "fr"   | "Né"      | "Décédé"  |
