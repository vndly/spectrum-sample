Feature: SC-04/SC-05/SC-07 — Desktop sidebar navigation
  The sidebar SHALL be visible on desktop and provide navigation to all 4 routes.

  Background:
    Given the viewport width is 768px or above

  Scenario: SC-05-01 — Sidebar renders on desktop
    When the app loads
    Then the sidebar is visible on the left with app title and 4 nav items

  Scenario: SC-07-01 — Active route highlighting in sidebar
    When I am on the `/library` route
    Then the Library nav item has a teal left border and background tint
    And the other 3 nav items are muted gray

  Scenario: SC-07-02 — Home exact matching
    When I am on the `/library` route
    Then the Home nav item is NOT highlighted (exact match only for `/`)
