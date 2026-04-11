Feature: RE-06 — Dedicated View

  Scenario: SC-RE-06-01 — Accessing recommendations via navigation
    Given the app is running
    When the user clicks the "Recommendations" item in the sidebar/bottom nav
    Then the app SHALL navigate to the "/recommendations" route
    And the Recommendations screen SHALL be displayed

  Scenario: SC-RE-06-02 — Document title for the Recommendations screen
    Given the app is on the Recommendations screen
    And the user's language is "en-US"
    Then the document title SHALL be "Recommendations — Plot Twisted"
