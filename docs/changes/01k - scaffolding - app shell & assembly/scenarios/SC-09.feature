Feature: SC-09 — Route transitions
  Scaffolded views SHALL transition with the shared fade contract.

  Background:
    Given the app is running on the Home route

  Scenario: SC-09-01 — Route changes use the shared fade contract
    Given `prefers-reduced-motion` is not enabled
    When I navigate from Home to Library
    Then the outgoing view fades out with opacity-only easing over 200ms
    And the incoming view fades in with opacity-only easing over 200ms

  Scenario: SC-09-02 — Reduced motion removes the animated fade
    Given `prefers-reduced-motion` is enabled
    When I navigate from Home to Library
    Then the route changes without a fade animation
