Feature: SC-15 — Modal composable behavior
  The modal composable SHALL manage single-instance modal state.

  Scenario: SC-15-01 — Modal opens with provided props
    Given no modal is currently visible
    When a modal is opened with title "Confirm Action" and content "Are you sure?"
    Then the modal is visible
    And it displays the provided title and content

  Scenario: SC-15-02 — Modal closes and clears state
    Given a modal is open with title "Confirm Action"
    When the modal is closed
    Then no modal is visible
    And the stored modal props are cleared

  Scenario: SC-15-03 — Single-instance replacement
    Given a modal is open with title "First"
    When a second modal is opened with title "Second"
    Then only one modal is visible
    And it displays the title "Second"
