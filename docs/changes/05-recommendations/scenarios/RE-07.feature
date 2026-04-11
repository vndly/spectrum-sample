Feature: RE-07 — Fallback Behavior

  Scenario: SC-RE-07-01 — Empty library fallback on Recommendations screen
    Given an empty user library
    When the Recommendations screen is loaded
    Then the "Recommended for You" section SHALL NOT be displayed
    And the "Trending" section SHALL be displayed
    And the "Popular" section SHALL be displayed
