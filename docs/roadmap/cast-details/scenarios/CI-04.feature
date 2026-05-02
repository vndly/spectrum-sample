Feature: Basic info
  Display person's name and known-for department

  Background:
    Given the app is running

  Scenario: CI-04-01 — Name and department display
    Given a person named "Tom Hanks" known for "Acting"
    When I view the person page
    Then I see "Tom Hanks" as the name
    And I see "Acting" as the department

  Scenario: CI-04-02 — Person request uses active language
    Given my language setting is "fr"
    When I navigate to /person/500
    Then the person API request includes language "fr"
    And the person API request includes append_to_response "combined_credits,external_ids"
    And exactly one person detail API request is made for the navigation
    And localized person data displays when returned by the API
