Feature: SC-25 — Navigation component tests
  Navigation component tests SHALL verify sidebar and bottom nav rendering.

  Scenario: SC-25-01 — Sidebar nav renders items with icons and labels
    Given the SidebarNav test file exists
    When the test suite runs
    Then it verifies all 4 nav items render with correct icons and translated labels

  Scenario: SC-25-02 — Sidebar nav active state highlighting
    Given the SidebarNav test file exists
    When the test suite runs
    Then it verifies the active route item has teal accent classes and home uses exact match

  Scenario: SC-25-03 — Bottom nav renders items
    Given the BottomNav test file exists
    When the test suite runs
    Then it verifies all 4 nav items render with icons and labels

  Scenario: SC-25-04 — Bottom nav active state highlighting
    Given the BottomNav test file exists
    When the test suite runs
    Then it verifies the active route item has teal accent styling
