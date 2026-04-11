Feature: RE-01 — Seed Selection Logic

  Scenario: SC-RE-01-01 — Prioritizing rated entries for recommendation seeds
    Given a library with 10 entries
    And 3 entries have ratings of 5, 4, and 3 stars
    And 7 entries are unrated
    When recommendations are requested for the Recommendations screen
    Then the 3 rated entries are selected as the first seeds
    And the 2 most recently added/watched unrated entries are selected as the remaining seeds
    And exactly 5 seeds are used for fetching recommendations

  Scenario: SC-RE-01-02 — Sorting unrated items by recency
    Given a library with 5 unrated entries added at different times
    When recommendations are requested for the Recommendations screen
    Then the entries are sorted by their most recent activity date (addedAt or watchDates)
    And all 5 entries are selected as seeds

  Scenario: SC-RE-01-03 — Handling small library with fewer than 5 entries
    Given a library with 3 entries
    When recommendations are requested for the Recommendations screen
    Then exactly 3 entries are selected as seeds
