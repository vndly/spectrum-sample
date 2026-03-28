Feature: SC-13 — Toast composable behavior
  The toast composable SHALL manage a reactive toast queue.

  Scenario Outline: SC-13-01 — Toast appears and auto-dismisses
    When a toast is triggered with message "<message>" and type "<type>"
    Then it is visible in the top-right corner with a <color> accent
    And it automatically disappears after the configured toast dismiss duration

    Examples:
      | type    | color | message            |
      | error   | red   | An error occurred  |
      | success | green | Added to watchlist |
      | info    | teal  | Update available   |

  Scenario: SC-13-02 — Toast can be manually dismissed
    Given a toast is visible
    When I click the dismiss button
    Then the toast is removed immediately

  Scenario: SC-13-03 — Toast with action button
    When a toast is triggered with an action (label: "Retry", handler function)
    Then it shows a "Retry" button alongside the dismiss button
    And clicking "Retry" triggers the associated action

  Scenario: SC-13-04 — Oldest toast evicted when maximum exceeded
    Given 5 toasts are currently visible
    When a 6th toast is triggered
    Then the oldest toast is removed
    And the new toast is added to the stack
    And 5 toasts remain visible

  Scenario: SC-13-05 — Removing a non-existent toast has no effect
    Given the toast queue contains toasts
    When removeToast is called with an ID that does not match any toast
    Then the toast queue is unchanged
