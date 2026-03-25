# Verification Scenarios: App Scaffolding — Composables

Feature: App Scaffolding — Composables

### Requirement: SC-13/SC-14 — Toast composable behavior

The toast composable SHALL manage a reactive toast queue.

#### Scenario Outline: SC-13-01 — Toast appears and auto-dismisses

GIVEN a toast is triggered with message "<message>" and type "<type>"
WHEN the toast appears
THEN it is visible in the top-right corner with a <color> accent
AND it automatically disappears after approximately 4 seconds

Examples:
| type    | color | message              |
| error   | red   | An error occurred    |
| success | green | Added to watchlist   |
| info    | accent| Update available     |

#### Scenario: SC-13-02 — Toast can be manually dismissed

GIVEN a toast is visible
WHEN I click the dismiss button
THEN the toast is removed immediately

#### Scenario: SC-13-03 — Toast with action button

GIVEN a toast is triggered with an action (label: "Retry", handler function)
WHEN the toast appears
THEN it shows a "Retry" button alongside the dismiss button
AND clicking "Retry" invokes the handler function

#### Scenario: SC-14-03 — Oldest toast evicted when maximum exceeded

GIVEN 5 toasts are currently visible
WHEN a 6th toast is triggered
THEN the oldest toast is removed
AND the new toast is added to the stack
AND 5 toasts remain visible

---

### Requirement: SC-15 — Modal composable behavior

The modal composable SHALL manage single-instance modal state.

#### Scenario: SC-15-06 — Single-instance replacement

GIVEN the modal is open with title "First"
WHEN `useModal().open()` is called again with title "Second"
THEN only one modal is visible
AND it displays the title "Second"

---

### Requirement: SC-23 — Composable unit tests

Composable tests SHALL verify toast and modal state management.

#### Scenario: SC-23-01 — Toast composable test: add and remove

GIVEN the toast composable test file exists
WHEN the test suite runs
THEN it verifies `addToast` adds a toast to the queue and `removeToast` removes it

#### Scenario: SC-23-02 — Toast composable test: auto-dismiss

GIVEN the toast composable test file exists
WHEN the test suite runs
THEN it verifies toasts are automatically dismissed after the timeout

#### Scenario: SC-23-03 — Toast composable test: type variants

GIVEN the toast composable test file exists
WHEN the test suite runs
THEN it verifies error, success, and info toast types are supported

#### Scenario: SC-23-04 — Modal composable test: open and close

GIVEN the modal composable test file exists
WHEN the test suite runs
THEN it verifies `open(props)` sets the modal visible and `close()` hides it

#### Scenario: SC-23-05 — Modal composable test: confirm callback

GIVEN the modal composable test file exists
WHEN the test suite runs
THEN it verifies the `onConfirm` callback is invoked when confirm is triggered

#### Scenario: SC-23-06 — Modal composable test: cancel callback

GIVEN the modal composable test file exists
WHEN the test suite runs
THEN it verifies the `onCancel` callback is invoked when cancel is triggered
