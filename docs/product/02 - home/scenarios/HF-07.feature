Feature: HF-07 — Preference Persistence

  Scenario: HF-07-01 — Persistence in localStorage
    Given the home screen is in browse mode
    When I switch to "List" layout
    And I reload the page
    Then the "List" layout is still active
