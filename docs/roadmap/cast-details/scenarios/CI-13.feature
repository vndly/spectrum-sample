Feature: Back navigation
  Browser and UI back navigation works correctly

  Background:
    Given the app is running
    And I navigated from a movie page to a person page

  Scenario: CI-13-01 — Browser back returns to previous page
    When I click the browser back button
    Then I return to the movie detail page

  Scenario: CI-13-02 — Back arrow button navigates back
    When I click the back arrow in the page header
    Then I return to the previous page
