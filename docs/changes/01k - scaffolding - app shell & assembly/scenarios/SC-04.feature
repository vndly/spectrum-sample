Feature: SC-04 — App shell layout
  The app shell SHALL provide a responsive layout structure.

  Scenario: SC-04-01 — App shell flexbox layout
    Given the viewport width is 768px or above
    When the app loads
    Then the layout contains a sidebar and a scrollable content area arranged with flexbox

  Scenario: SC-04-02 — Sidebar hides on mobile
    Given the viewport width is 768px or above
    When the viewport is resized to below 768px
    Then the sidebar hides and the bottom nav shows

  Scenario: SC-04-03 — Sidebar restores on desktop
    Given the viewport width is below 768px
    When the viewport is resized to 768px or above
    Then the sidebar shows and the bottom nav hides
