Feature: SC-08 — Page header
  The page header SHALL display the translated name of the current page.

  Scenario: SC-08-01 — Header shows current page
    Given the app is running
    When I navigate to `/calendar`
    Then the page header displays "Calendar" (or the translated equivalent)

  Scenario: SC-08-02 — Header updates on navigation
    Given I am on the Home page
    When I click the "Settings" nav item
    Then the page header updates from "Home" to "Settings"
