Feature: SC-01d-29 — Vue Router setup
  The router SHALL be configured with HTML5 history mode and registered in the app.

  Scenario: SC-01d-29-01 — Router uses HTML5 history mode
    Given the app is running
    When I navigate to /settings
    Then the URL in the browser address bar is /settings without a hash fragment

  Scenario: SC-01d-29-02 — Router is registered in main.ts
    Given the app is running
    When I navigate to any route
    Then route navigation is functional and the correct view is rendered
