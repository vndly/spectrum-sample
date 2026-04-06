Feature: HF-09 — Clear All Filters

  Background:
    Given the home screen is in browse mode
    And trending and popular results are loaded

  Scenario: HF-09-01 — Clear filters manually
    Given filters are active
    When I click "Clear All"
    Then all trending and popular results are displayed again

  Scenario: HF-09-02 — Reset filters on search
    Given filters are active
    When I type "Inception" into the search bar
    Then active filters are cleared
    And search results for "Inception" are displayed
