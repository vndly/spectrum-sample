Feature: Language refresh
  Re-fetch person details when the active language changes

  Background:
    Given the app is running
    And I am viewing /person/500
    And the current language setting is "en"

  Scenario: CI-15-01 — Changing language refreshes active person details
    When I change the language setting to "fr"
    Then the person API request is attempted again for /person/500
    And the person API request includes language "fr"
    And the current route remains /person/500
    And localized person data displays when returned by the API
