Feature: SC-15 — Modal composable behavior
  The modal composable SHALL manage single-instance modal state.

  Scenario: SC-15-06 — Single-instance replacement
    Given the modal is open with title "First"
    When useModal().open() is called again with title "Second"
    Then only one modal is visible
    And it displays the title "Second"
