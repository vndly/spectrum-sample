Feature: FR-07-02 — Language Select

  Background:
    Given the app is running
    And I am on the "/settings" page

  Scenario: SC-07-02-01 — Changing UI language
    Given the current language is "en"
    When I select "Español" from the language dropdown
    Then all UI text should update to Spanish translations
    And the setting should persist in localStorage
