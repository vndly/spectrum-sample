Feature: RE-11 — Rate Limit Handling

  Scenario: RE-11-01 — Handling TMDB API rate limits for recommendations
    Given 5 recommendation seeds
    And the API returns a 429 status for the first 3 seeds
    And the API returns a 200 status for the remaining 2 seeds
    When the Recommendations screen is loaded
    Then the first 3 carousels SHALL show an error state with a "Retry" button
    And the remaining 2 carousels SHALL display their results
    And an error toast SHALL be displayed because multiple carousels failed
