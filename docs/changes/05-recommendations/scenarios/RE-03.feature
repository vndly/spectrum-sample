Feature: RE-03 — Deduplication

  Scenario: SC-RE-03-01 — Deduplicating results across multiple seeds
    Given recommendation seeds "Movie A" and "Movie B"
    And "Movie A" returns "Movie C" as a recommendation
    And "Movie B" returns "Movie C" as a recommendation
    When recommendations are processed for display on the Recommendations screen
    Then "Movie C" SHALL appear only once across all recommendation sections
    And "Movie A" and "Movie B" SHALL NOT appear as recommendations (if they were already in the seed list)
