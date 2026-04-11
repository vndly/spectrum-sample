Feature: RE-10 — Lazy Loading

  Scenario: RE-10-01 — Lazy loading carousels on the Recommendations screen
    Given 5 recommendation seeds
    When the Recommendations screen is loaded
    Then the carousels SHALL NOT immediately fetch their data if they are off-screen
    And each carousel SHALL only initiate its API call when it enters or approaches the viewport
