Feature: SC-04 — App shell layout
  The app shell SHALL provide a responsive layout for the current scaffolded route set.

  Background:
    Given the app is running

  Scenario: SC-04-01 — Desktop shell offsets routed content from the fixed sidebar
    Given the viewport width is 768px or above
    When the shell renders a routed view
    Then the layout shows a fixed left sidebar and a scrollable content column
    And the routed content does not render beneath the fixed sidebar

  Scenario: SC-04-02 — Sidebar hides on mobile
    Given the viewport width is 768px or above
    When the viewport is resized to below 768px
    Then the sidebar hides and the bottom nav shows

  Scenario: SC-04-03 — Sidebar restores on desktop
    Given the viewport width is below 768px
    When the viewport is resized to 768px or above
    Then the sidebar shows and the bottom nav hides

  Scenario: SC-04-04 — Content clears the mobile bottom nav
    Given the viewport width is below 768px
    When I scroll to the end of the routed content
    Then the final content remains visible above the fixed bottom nav
