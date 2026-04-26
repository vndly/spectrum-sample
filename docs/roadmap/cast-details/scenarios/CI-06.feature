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
