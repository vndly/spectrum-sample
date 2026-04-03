Feature: R-01b-05 — Detail ID guards
  Non-numeric detail IDs SHALL be rejected before a placeholder screen renders.

  Scenario Outline: R-01b-05-01 — Non-numeric detail IDs redirect to Home
    Given the app is running
    When I navigate directly to "<route>"
    Then the router redirects to `/`
    And the Home placeholder screen is displayed

    Examples:
      | route      |
      | /movie/abc |
      | /show/abc  |
