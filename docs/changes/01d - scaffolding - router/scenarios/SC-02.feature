Feature: SC-29/SC-02/SC-03 — Routing
  The router SHALL navigate between all defined routes.

  Scenario: SC-29-01 — Router uses HTML5 history mode
    Given the app is running
    When I navigate to /settings
    Then the URL in the browser address bar is /settings without a hash fragment

  Scenario Outline: SC-02-01 — Navigation between pages
    Given the app is running
    When I click the "<nav_item>" nav item
    Then the URL changes to <route>
    And the <page_name> placeholder view is displayed
    And the page header shows "<page_name>"

    Examples:
      | nav_item | route     | page_name |
      | Home     | /         | Home      |
      | Calendar | /calendar | Calendar  |
      | Library  | /library  | Library   |
      | Settings | /settings | Settings  |

  Scenario: SC-02-02 — Direct URL navigation
    Given the app is running
    When I navigate directly to /settings in the browser address bar
    Then the settings placeholder view is displayed
    And the sidebar highlights the Settings nav item

  Scenario: SC-02-03 — Catch-all redirect
    Given the app is running
    When I navigate to /nonexistent
    Then the router redirects to /
    And the home placeholder view is displayed

  Scenario: SC-03-01 — Route lazy loading (build verification)
    Given the app is built for production
    When I inspect the build output
    Then the production build output contains at least 4 separate JavaScript chunk files corresponding to route views
