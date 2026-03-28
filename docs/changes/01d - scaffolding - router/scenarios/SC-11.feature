Feature: SC-11 — Scroll-to-top
  The page SHALL scroll to the top on every navigation.

  Scenario: SC-11-01 — Scroll resets on forward navigation
    Given I have scrolled down on the current page
    When I navigate to a different route
    Then the page scroll position resets to the top

  Scenario: SC-11-02 — Scroll resets on browser back navigation
    Given I have navigated from /library to /settings
    And I have scrolled down on /settings
    When I press the browser back button
    Then the page scroll position resets to the top
