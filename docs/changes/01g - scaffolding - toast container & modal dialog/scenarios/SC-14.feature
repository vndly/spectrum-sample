Feature: SC-14 — Toast container component
  The toast container SHALL render the toast queue as a fixed overlay.

  Scenario: SC-14-01 — Multiple toasts stack
    Given two toasts are triggered in quick succession
    When both are visible
    Then they stack vertically in the top-right corner without overlapping

  Scenario: SC-14-02 — Toast container positioning
    Given a toast is triggered
    When the toast container renders
    Then it is fixed to the top-right of the viewport with z-50
