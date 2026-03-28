Feature: SC-24 — Reduced-motion override
  The app SHALL disable all transitions and animations when the user's OS has prefers-reduced-motion enabled.

  Background:
    Given the user's OS has `prefers-reduced-motion` enabled

  Scenario: SC-24-01 — Reduced motion disables route transitions
    When I navigate between routes
    Then no fade transition occurs (instant swap)

  Scenario: SC-24-02 — Reduced motion disables toast animations
    When a toast is triggered
    Then it appears without slide animation (instant display)

  Scenario: SC-24-03 — Reduced motion disables modal animations
    When the modal is opened
    Then it appears without fade or scale animation (instant display)

  Scenario: SC-24-04 — Duration cap respected
    Given the app CSS is loaded
    Then all transition durations are 300ms or less
