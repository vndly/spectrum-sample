Feature: SC-01d-02 — Route definitions
  The router SHALL define 4 named routes and a catch-all redirect.

  # Note: Scenarios SC-01d-02-01 and SC-01d-02-02 require navigation components from 01i
  # and placeholder views from 01j. They are integration-level scenarios verifiable
  # after those changes are complete.

  Scenario Outline: SC-01d-02-01 — Navigation between pages
    Given the app is running
    When I click the "<nav_item>" nav item
    Then the URL changes to "<route>"
    And the "<page_name>" placeholder view is displayed
    And the page header shows "<page_name>"

    Examples:
      | nav_item | route     | page_name |
      | Home     | /         | Home      |
      | Calendar | /calendar | Calendar  |
      | Library  | /library  | Library   |
      | Settings | /settings | Settings  |

  Scenario Outline: SC-01d-02-02 — Direct URL navigation
    Given the app is running
    When I navigate directly to "<route>" in the browser address bar
    Then the "<page_name>" placeholder view is displayed
    And the sidebar highlights the "<nav_item>" nav item
    And the page header shows "<page_name>"

    Examples:
      | route     | page_name | nav_item |
      | /         | Home      | Home     |
      | /calendar | Calendar  | Calendar |
      | /settings | Settings  | Settings |
      | /library  | Library   | Library  |

  Scenario: SC-01d-02-03 — Catch-all redirect
    Given the app is running
    When I navigate to /nonexistent
    Then the router redirects to /
    And the "Home" placeholder view is displayed
