Feature: RE-07 — Fallback Behavior

  Scenario: SC-RE-07-01 — Empty library fallback on home screen
    Given an empty user library
    When the home screen is loaded
    Then the "Recommended for You" section is not displayed
    And the "Trending" section is displayed
    And the "Popular" section is displayed
