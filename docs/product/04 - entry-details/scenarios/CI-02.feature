Feature: Person route
  New route /person/:id with navigation guard

  Background:
    Given the app is running

  Scenario: CI-02-01 — Valid numeric ID renders person page
    When I navigate to /person/500
    Then the person detail page loads

  Scenario: CI-02-02 — Non-numeric ID redirects to Home
    When I navigate to /person/abc
    Then I am redirected to /

  Scenario: CI-02-03 — Special characters in ID redirect to Home
    When I navigate to /person/123abc
    Then I am redirected to /

  Scenario: CI-02-04 — Person route uses route metadata and lazy loading
    When I inspect the person route configuration
    Then the route name is "person"
    And the route title key is "page.person.title"
    And the route component is lazy-loaded with a dynamic import
