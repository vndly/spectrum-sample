Feature: FR-07-03 — Region Select

  Background:
    Given the app is running
    And I am on the "/settings" page

  Scenario: FR-07-03-01 — Changing content region
    Given the current region is "US"
    When I select "France" from the region dropdown
    And I reload the page
    Then the setting should still be "FR"
    And navigating to the "/calendar" page should show "Premiere: [Date] (France)" in the release card
