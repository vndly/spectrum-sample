Feature: Cross-cutting NFRs (SC-09, SC-14, SC-15)
  Non-functional requirements related to transitions and animation behavior.

  Scenario: SC-09-02 — Reduced motion respected
    Given the user's OS has `prefers-reduced-motion` enabled
    When I navigate between routes
    Then no fade transition occurs (instant swap)

  Scenario: SC-09-03 — Reduced motion disables toast animations
    Given the user's OS has `prefers-reduced-motion` enabled
    When a toast is triggered
    Then it appears without slide animation (instant display)

  Scenario: SC-09-04 — Reduced motion disables modal animations
    Given the user's OS has `prefers-reduced-motion` enabled
    When the modal is opened
    Then it appears without fade or scale animation (instant display)

  Scenario: SC-14-04 — Toast slide-in animation
    Given transitions are enabled (no `prefers-reduced-motion`)
    When a toast is triggered
    Then it slides in from the right and fades out on dismiss

  Scenario: SC-15-07 — Modal fade and scale animation
    Given transitions are enabled (no `prefers-reduced-motion`)
    When the modal is opened
    Then the backdrop fades in and the content card scales up slightly
