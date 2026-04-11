Feature: RE-09 — Empty Result Handling

  Scenario: RE-09-01 — Handling seeds with no recommendations
    Given a recommendation seed that returns zero results from the API
    When the recommendations are processed for display on the Recommendations screen
    Then the carousel section for that seed SHALL NOT be rendered
