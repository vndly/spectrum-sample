Feature: SC-01c-22 — Toast transition CSS
  The app SHALL define .toast-* CSS classes for toast enter/leave animations.
  Note: SC-01c-22-02 and SC-01c-22-03 verify CSS animation behavior. The toast component
  providing the transition wiring is delivered by R-01g (SC-14).

  Scenario: SC-01c-22-01 — Toast transition CSS classes defined
    Given the app CSS is loaded
    Then `.toast-enter-active` is defined with transform and opacity transitions (300ms ease-out)
    And `.toast-leave-active` is defined with opacity transition (200ms ease-in)
    And `.toast-enter-from` sets `transform: translateX(100%)` and `opacity: 0`
    And `.toast-leave-to` sets `opacity: 0`

  Scenario: SC-01c-22-02 — Toast slide-in with opacity fade on enter
    Given transitions are enabled (no `prefers-reduced-motion`)
    When a toast is triggered
    Then it slides in horizontally from off-screen right with simultaneous opacity fade

  Scenario: SC-01c-22-03 — Toast fade-out on dismiss
    Given transitions are enabled (no `prefers-reduced-motion`)
    When a toast is dismissed
    Then it fades out
