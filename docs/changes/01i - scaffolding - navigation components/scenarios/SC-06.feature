Feature: SC-04/SC-06/SC-07 — Mobile bottom navigation
  The bottom nav SHALL replace the sidebar on small viewports.

  Background:
    Given the viewport width is below 768px

  Scenario: SC-06-01 — Bottom nav appears on mobile
    When the app loads
    Then the sidebar is hidden
    And a bottom navigation bar is visible with 4 items

  Scenario: SC-07-03 — Active route highlighting in bottom nav
    When I am on the `/library` route
    Then the Library icon in the bottom nav uses the teal accent color
    And the other icons are muted

  Scenario: SC-06-02 — Content not hidden by bottom nav
    When I scroll to the bottom of any page
    Then all content is visible and not obscured by the fixed bottom navigation bar
