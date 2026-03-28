Feature: SC-01c-24 — Reduced-motion override
  The app SHALL disable all transitions and animations when the user's OS has prefers-reduced-motion enabled.

  Scenario: SC-01c-24-01 — Reduced motion disables route transitions
    Given the user's OS has `prefers-reduced-motion` enabled
    When I navigate between routes
    Then no fade transition occurs (instant swap)

  Scenario: SC-01c-24-02 — Reduced motion disables toast animations
    Given the user's OS has `prefers-reduced-motion` enabled
    When a toast is triggered
    Then it appears without slide animation (instant display)

  Scenario: SC-01c-24-03 — Reduced motion disables modal animations
    Given the user's OS has `prefers-reduced-motion` enabled
    When the modal is opened
    Then it appears without fade or scale animation (instant display)

  Scenario: SC-01c-24-04 — Reduced motion disables pulse animations
    Given the user's OS has `prefers-reduced-motion` enabled
    Then `animate-pulse` animation is disabled

  Scenario: SC-01c-24-05 — No transition duration exceeds 300ms
    Given the app CSS is loaded
    Then all transition durations are 300ms or less
