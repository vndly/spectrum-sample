Feature: LF-07 — Clear Filters

  Background:
    Given I am on the Library screen
    And several filters are active (Genre: Action, Media: Movie, Rating: 4-5)

  Scenario: LF-07-01 — Clear all filters
    When I click "Clear All" in the FilterBar
    Then all filter selections are reset to default
    And all library entries for the current tab are displayed
