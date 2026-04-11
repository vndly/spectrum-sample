Feature: RE-02 — Recommendations API

  Scenario: SC-RE-02-01 — Calling TMDB recommendations API for movies
    Given a movie seed with ID 123
    And the user's preferred language is "en-US"
    When recommendations are requested for the seed
    Then the app SHALL call "GET /movie/123/recommendations?language=en-US"

  Scenario: SC-RE-02-02 — Calling TMDB recommendations API for TV shows
    Given a TV show seed with ID 456
    And the user's preferred language is "fr-FR"
    When recommendations are requested for the seed
    Then the app SHALL call "GET /tv/456/recommendations?language=fr-FR"
