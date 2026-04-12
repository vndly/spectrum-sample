Feature: FR-07-04 — Home Section Select

  Background:
    Given the app is running
    And I am on the "/settings" page

  Scenario: FR-07-04-01 — Changing default home section
    Given the default home section is "trending"
    When I select "Search" as the default home section
    Then the setting should persist in localStorage
    And reloading the app should navigate to "/" with the search view active
