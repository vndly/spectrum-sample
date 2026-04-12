Feature: FR-07-03 — Region Select

  Background:
    Given the app is running
    And I am on the "/settings" page

  Scenario: FR-07-03-01 — Changing content region
    Given the current region is "US"
    When I select "France" from the region dropdown
    Then the setting should persist in localStorage
    And navigating to the "/calendar" page should show releases for "FR"
