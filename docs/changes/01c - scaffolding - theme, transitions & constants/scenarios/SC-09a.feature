Feature: SC-09a — Fade transition CSS
  The app SHALL define .fade-* CSS classes for a 200ms opacity route transition with ease-in-out easing.

  Scenario: SC-09a-01 — Fade transition CSS classes defined
    Given the app CSS is loaded
    Then `.fade-enter-active` is defined with `transition: opacity 0.2s ease-in-out`
    And `.fade-leave-active` is defined with `transition: opacity 0.2s ease-in-out`
    And `.fade-enter-from` sets `opacity: 0`
    And `.fade-leave-to` sets `opacity: 0`
