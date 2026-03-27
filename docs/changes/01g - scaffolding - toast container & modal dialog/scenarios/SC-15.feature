Feature: SC-15 — Modal dialog component
  The modal SHALL display a centered dialog with backdrop.

  Scenario: SC-15-01 — Modal opens and shows content
    Given useModal().open() is called with title "Confirm Delete"
    When the modal appears
    Then a backdrop overlay covers the screen
    And a centered card shows "Confirm Delete" with confirm and cancel buttons

  Scenario: SC-15-02 — Modal closes on backdrop click
    Given the modal is open
    When I click on the backdrop (outside the content card)
    Then the modal closes

  Scenario: SC-15-03 — Modal closes on Escape key
    Given the modal is open
    When I press the Escape key
    Then the modal closes

  Scenario: SC-15-04 — Confirm callback
    Given the modal is open with onConfirm and onCancel callbacks
    When I click the confirm button
    Then the onConfirm callback is invoked and the modal closes

  Scenario: SC-15-05 — Cancel callback
    Given the modal is open with onConfirm and onCancel callbacks
    When I click the cancel button
    Then the onCancel callback is invoked and the modal closes
