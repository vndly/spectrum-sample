Feature: RE-03 — Deduplication

  Scenario: RE-03-01 — Deduplicating results across multiple seeds and browse sections
    Given recommendation seeds "Movie A" and "Movie B"
    And "Movie A" returns "Movie C" as a recommendation
    And "Movie B" returns "Movie C" as a recommendation
    And "Movie D" is in the "Trending" section
    And "Movie A" returns "Movie D" as a recommendation
    When recommendations are processed for display on the Recommendations screen
    Then "Movie C" SHALL appear only once across all recommendation sections
    And "Movie D" SHALL appear only once across the entire screen
    And "Movie A" and "Movie B" SHALL NOT appear as recommendations (if they were already in the seed list)
