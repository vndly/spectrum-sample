Feature: SC-01c-23 — Modal transition CSS
  The app SHALL define .modal-* CSS classes for the modal content card enter/leave animations.
  Note: SC-01c-23-02 verifies CSS animation behavior. The modal component
  providing the backdrop and transition wiring is delivered by R-01g (SC-15).
  Backdrop fade is managed separately by R-01g.

  Scenario: SC-01c-23-01 — Modal transition CSS classes defined
    Given the app CSS is loaded
    Then `.modal-enter-active` is defined with opacity and transform transitions (200ms ease-out)
    And `.modal-leave-active` is defined with opacity and transform transitions (150ms ease-in)
    And `.modal-enter-from` sets `opacity: 0` and `transform: scale(0.95)`
    And `.modal-leave-to` sets `opacity: 0` and `transform: scale(0.95)`

  Scenario: SC-01c-23-02 — Modal content card animation
    Given transitions are enabled (no `prefers-reduced-motion`)
    When the modal is opened
    Then the content card scales up slightly
    And the content card fades in
