Feature: FR-07-01b — Layout Mode

  Background:
    Given the app is running
    And I am on the "/settings" page

  Scenario: FR-07-01b-01 — Switching to list layout
    Given the current layout mode is "grid"
    When I click the "List" layout option
    Then the library view should update to list layout
    And I reload the page
    Then the layout mode should still be "list"
