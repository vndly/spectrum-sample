Feature: SC-11 — Scroll-to-top
  The page SHALL scroll to the top on every navigation.

  Scenario: SC-11-01 — Scroll resets on navigate
    Given I have scrolled down on the current page
    When I navigate to a different route
    Then the page scroll position resets to the top
