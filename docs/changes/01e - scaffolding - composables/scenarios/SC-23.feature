Feature: SC-23 — Composable unit tests
  Composable tests SHALL verify toast and modal state management.

  Scenario: SC-23-01 — Toast composable test: add and remove
    Given the toast composable test file exists
    When the test suite runs
    Then it verifies addToast adds a toast to the queue and removeToast removes it

  Scenario: SC-23-02 — Toast composable test: auto-dismiss
    Given the toast composable test file exists
    When the test suite runs
    Then it verifies toasts are automatically dismissed after the timeout

  Scenario: SC-23-03 — Toast composable test: type variants
    Given the toast composable test file exists
    When the test suite runs
    Then it verifies error, success, and info toast types are supported

  Scenario: SC-23-04 — Modal composable test: open and close
    Given the modal composable test file exists
    When the test suite runs
    Then it verifies open(props) sets the modal visible and close() hides it

  Scenario: SC-23-05 — Modal composable test: confirm callback
    Given the modal composable test file exists
    When the test suite runs
    Then it verifies the onConfirm callback is invoked when confirm is triggered

  Scenario: SC-23-06 — Modal composable test: cancel callback
    Given the modal composable test file exists
    When the test suite runs
    Then it verifies the onCancel callback is invoked when cancel is triggered
