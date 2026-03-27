Feature: SC-13/SC-14 — Toast composable behavior
  The toast composable SHALL manage a reactive toast queue.

  Scenario Outline: SC-13-01 — Toast appears and auto-dismisses
    Given a toast is triggered with message "<message>" and type "<type>"
    When the toast appears
    Then it is visible in the top-right corner with a <color> accent
    And it automatically disappears after approximately 4 seconds

    Examples:
      | type    | color  | message            |
      | error   | red    | An error occurred  |
      | success | green  | Added to watchlist |
      | info    | accent | Update available   |

  Scenario: SC-13-02 — Toast can be manually dismissed
    Given a toast is visible
    When I click the dismiss button
    Then the toast is removed immediately

  Scenario: SC-13-03 — Toast with action button
    Given a toast is triggered with an action (label: "Retry", handler function)
    When the toast appears
    Then it shows a "Retry" button alongside the dismiss button
    And clicking "Retry" invokes the handler function

  Scenario: SC-14-03 — Oldest toast evicted when maximum exceeded
    Given 5 toasts are currently visible
    When a 6th toast is triggered
    Then the oldest toast is removed
    And the new toast is added to the stack
    And 5 toasts remain visible
