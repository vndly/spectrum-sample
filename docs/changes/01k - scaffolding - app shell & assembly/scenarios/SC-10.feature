Feature: SC-10 — Root shell assembly
  The application SHALL assemble routed content and global overlays inside a recoverable shell.

  Background:
    Given the app is running on the Home route

  Scenario: SC-10-01 — Routed view renders inside the shared shell
    When the initial shell renders
    Then the page header is visible above the routed Home content
    And the shared navigation chrome is visible around the routed content

  Scenario: SC-10-02 — Current scaffolded nav set renders in both shell navs
    When the shell navigation renders
    Then the desktop sidebar and mobile bottom nav expose Home, Calendar, Library, and Settings in the documented order
    And neither navigation renders a Recommendations destination before its route and view feature exists

  Scenario: SC-10-03 — Global overlays stack above shell chrome
    Given a modal dialog is open
    And a toast notification is visible
    When the assembled shell is rendered
    Then the modal overlays the page content and navigation chrome
    And the toast remains visible above the modal
