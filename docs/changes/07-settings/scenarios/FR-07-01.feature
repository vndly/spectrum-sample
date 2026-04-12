Feature: FR-07-01 — Theme Toggle

  Background:
    Given the app is running
    And I am on the "/settings" page

  Scenario: FR-07-01-01 — Switching to light mode
    Given the current theme is "dark"
    When I click the "Light" theme option
    Then the app's visual style should update to light mode
    And I reload the page
    Then the theme should still be "light"
