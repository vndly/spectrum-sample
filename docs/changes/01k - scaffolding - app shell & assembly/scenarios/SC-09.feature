Feature: SC-09 — Route transitions
  Views SHALL fade in and out during navigation.

  Scenario: SC-09-01 — Fade transition on navigate
    Given the app is running with transitions enabled
    When I navigate from one route to another
    Then the outgoing view fades out and the incoming view fades in over ~200ms
