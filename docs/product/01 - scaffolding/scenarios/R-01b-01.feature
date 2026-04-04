Feature: R-01b-01 — Recommendations route
  The router SHALL expose Recommendations as a lazy-loaded named route inside the existing shell.

  Scenario: R-01b-01-01 — Router unit tests verify the Recommendations route contract
    Given the router test suite runs
    When it inspects the named route definitions
    Then it confirms a named `recommendations` route exists at `/recommendations`
    And it confirms the route component is lazy-loaded
    And it confirms the route title key is `page.recommendations.title`

  Scenario: R-01b-01-02 — Direct URL navigation renders the Recommendations placeholder
    Given the app is running
    When I navigate directly to /recommendations
    Then the Recommendations placeholder screen is displayed inside the shared app shell
    And the page header shows "Recommendations"
