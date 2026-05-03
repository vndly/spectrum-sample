Feature: Loading state
  Show skeleton loader while fetching data

  Scenario: CI-11-01 — Skeleton displays during load
    Given the app is running
    When I navigate to a person page
    And the API request is in progress
    Then a skeleton loader displays
    And the skeleton matches the page layout
    And the loading region has aria-live="polite"

  Scenario: CI-11-02 — Skeleton respects reduced motion
    Given the app is running
    And the browser prefers reduced motion
    When I navigate to a person page
    And the API request is in progress
    Then a skeleton loader displays without pulse or shimmer animation
