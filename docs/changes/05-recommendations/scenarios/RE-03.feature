Feature: RE-03 — Deduplication and Library Exclusion

  Scenario: SC-RE-03-01 — Deduplicating results across multiple seeds
    Given recommendation seeds "Movie A" and "Movie B"
    And "Movie A" returns "Movie C" as a recommendation
    And "Movie B" returns "Movie C" as a recommendation
    And "Movie D" is already in the user's library
    When recommendations are processed for display
    Then "Movie C" appears only once in the recommendations sections
    And "Movie D" does not appear in any recommendation section
    And "Movie A" and "Movie B" do not appear as recommendations
