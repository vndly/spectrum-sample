Feature: SC-06 — Mobile bottom navigation
  The mobile bottom nav SHALL expose the scaffolded primary routes on small viewports.

  Background:
    Given the viewport width is below 768px

  Scenario: SC-06-01 — Bottom nav renders on mobile
    When the bottom navigation component is rendered
    Then a fixed bottom navigation bar is visible
    And exactly 4 navigation links are visible
    And navigation links for Home, Calendar, Library, and Settings are visible in the documented order
    And no navigation link is shown for Recommendations
    And no navigation link is shown for Stats
    And no navigation link is shown for detail routes
    And each nav item shows its mapped icon
    And each nav item shows its translated label

  Scenario: SC-06-03 — Bottom nav touch targets meet the mobile minimum
    When I inspect the bottom nav items
    Then each item has a minimum touch target of 44x44px
