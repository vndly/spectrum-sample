Feature: RE-04 — Library Exclusion

  Scenario: SC-RE-04-01 — Excluding library entries from recommendations
    Given a movie "Movie D" that is already in the user's library
    And a recommendation seed "Movie A" that returns "Movie D" as a recommendation
    When the recommendations are fetched for display on the Recommendations screen
    Then "Movie D" SHALL NOT appear in the recommendations list
