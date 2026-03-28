Feature: SC-29 — Vue Router setup
  The router SHALL be configured with HTML5 history mode and registered in the app.

  Scenario: SC-29-01 — Router uses HTML5 history mode
    Given the app is running
    When I navigate to /settings
    Then the URL in the browser address bar is /settings without a hash fragment

  Scenario: SC-29-02 — Router is registered in main.ts
    Given the application entry point
    Then the router is registered with app.use(router) before the app is mounted
