# Verification Scenarios: App Scaffolding — Toast Container & Modal Dialog

Feature: App Scaffolding — Toast Container & Modal Dialog

### Requirement: SC-14 — Toast container component

The toast container SHALL render the toast queue as a fixed overlay.

#### Scenario: SC-14-01 — Multiple toasts stack

GIVEN two toasts are triggered in quick succession
WHEN both are visible
THEN they stack vertically in the top-right corner without overlapping

#### Scenario: SC-14-02 — Toast container positioning

GIVEN a toast is triggered
WHEN the toast container renders
THEN it is fixed to the top-right of the viewport with z-50

---

### Requirement: SC-15 — Modal dialog component

The modal SHALL display a centered dialog with backdrop.

#### Scenario: SC-15-01 — Modal opens and shows content

GIVEN `useModal().open()` is called with title "Confirm Delete"
WHEN the modal appears
THEN a backdrop overlay covers the screen
AND a centered card shows "Confirm Delete" with confirm and cancel buttons

#### Scenario: SC-15-02 — Modal closes on backdrop click

GIVEN the modal is open
WHEN I click on the backdrop (outside the content card)
THEN the modal closes

#### Scenario: SC-15-03 — Modal closes on Escape key

GIVEN the modal is open
WHEN I press the Escape key
THEN the modal closes

#### Scenario: SC-15-04 — Confirm callback

GIVEN the modal is open with `onConfirm` and `onCancel` callbacks
WHEN I click the confirm button
THEN the `onConfirm` callback is invoked and the modal closes

#### Scenario: SC-15-05 — Cancel callback

GIVEN the modal is open with `onConfirm` and `onCancel` callbacks
WHEN I click the cancel button
THEN the `onCancel` callback is invoked and the modal closes

---

### Requirement: SC-24 — UI primitive tests (partial)

UI primitive component tests SHALL verify rendering and behavior.

#### Scenario: SC-24-04 — ToastContainer component test

GIVEN the ToastContainer test file exists
WHEN the test suite runs
THEN it verifies toast queue rendering, dismiss button, and positioning

#### Scenario: SC-24-05 — ModalDialog component test

GIVEN the ModalDialog test file exists
WHEN the test suite runs
THEN it verifies title/body/buttons rendering, backdrop click close, and Escape key close
