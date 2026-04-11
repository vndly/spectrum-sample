Feature: RE-05 — Labeled Sections

  Scenario: RE-05-01 — Displaying "Because you liked" label for high ratings
    Given a movie seed "Inception" with a rating of 4 stars
    When the recommendations are displayed on the Recommendations screen
    Then the carousel section label SHALL be "Because you liked Inception"

  Scenario: RE-05-02 — Displaying "Because you watched" label for low ratings
    Given a movie seed "The Room" with a rating of 1 star
    When the recommendations are displayed on the Recommendations screen
    Then the carousel section label SHALL be "Because you watched The Room"

  Scenario: RE-05-03 — Displaying "Because you watched" label for unrated seeds
    Given a movie seed "Interstellar" with no rating
    When the recommendations are displayed on the Recommendations screen
    Then the carousel section label SHALL be "Because you watched Interstellar"
