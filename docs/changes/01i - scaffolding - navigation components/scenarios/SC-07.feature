Feature: SC-07 — Active route highlighting
  Active navigation items SHALL be visually highlighted.

  Scenario: SC-07-01 — Sidebar highlights the active route
    Given the viewport width is 768px or above
    When I am on the `/library` route
    Then the Library nav item has a teal left border and background tint
    And the other sidebar nav items are muted

  Scenario: SC-07-02 — Home uses exact matching
    Given the viewport width is 768px or above
    When I am on the `/library` route
    Then the Home nav item is not highlighted

  Scenario: SC-07-03 — Bottom nav highlights the active route
    Given the viewport width is below 768px
    When I am on the `/library` route
    Then the Library nav item in the bottom nav uses the teal accent color
    And the other bottom nav items are muted

  Scenario: SC-07-04 — Sidebar highlights Home on the Home route
    Given the viewport width is 768px or above
    When I am on the `/` route
    Then the Home nav item has a teal left border and background tint
    And the other sidebar nav items are muted

  Scenario: SC-07-05 — Bottom nav highlights Home on the Home route
    Given the viewport width is below 768px
    When I am on the `/` route
    Then the Home nav item in the bottom nav uses the teal accent color
    And the other bottom nav items are muted
