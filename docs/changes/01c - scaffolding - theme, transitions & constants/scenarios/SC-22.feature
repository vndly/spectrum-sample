Feature: SC-22 — Toast transition CSS
  The app SHALL define .toast-* CSS classes for toast enter/leave animations.
  Note: SC-22-02 verifies CSS animation behavior. The toast component
  providing the transition wiring is delivered by R-01g (SC-14).

  Scenario: SC-22-01 — Toast transition CSS classes defined
    Given the app CSS is loaded
    Then `.toast-enter-active` is defined with transform and opacity transitions (300ms ease-out)
    And `.toast-leave-active` is defined with opacity transition (200ms ease-in)
    And `.toast-enter-from` sets `transform: translateX(100%)` and `opacity: 0`
    And `.toast-leave-to` sets `opacity: 0`

  Scenario: SC-22-02 — Toast slide-in animation
    Given transitions are enabled (no `prefers-reduced-motion`)
    When a toast is triggered
    Then it slides in horizontally from off-screen right
    And it fades out on dismiss
