Feature: Person route
  New route /person/:id with navigation guard

  Scenario: CI-02-01 — Valid numeric ID renders person page
    Given the app is running
    When I navigate to /person/500
    Then the person detail page loads

  Scenario: CI-02-02 — Non-numeric ID redirects to Home
    Given the app is running
    When I navigate to /person/abc
    Then I am redirected to /

  Scenario: CI-02-03 — Special characters in ID redirect to Home
    Given the app is running
    When I navigate to /person/123abc
    Then I am redirected to /
