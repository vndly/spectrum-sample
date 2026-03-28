Feature: SC-01c-25 — Domain constants
  The app SHALL provide a TOAST_DISMISS_MS constant for toast auto-dismiss timing.

  Scenario: SC-01c-25-01 — TOAST_DISMISS_MS constant defined
    Given the domain constants module is loaded
    Then `TOAST_DISMISS_MS` is exported with value `4000`
    And it is of type number
