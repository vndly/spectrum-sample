Feature: RE-08 — Independent Loading and Error States

  Scenario: SC-RE-08-01 — Handling partial API failure for one seed
    Given 5 recommendation seeds
    And the API request for the first seed fails
    And the API requests for the other 4 seeds succeed
    When the recommendations are loaded on the Recommendations screen
    Then the carousel for the first seed displays an error message or is hidden
    And the other 4 carousels display their results normally
