Feature: Basic info
  Display person's name and known-for department

  Scenario: CI-04-01 — Name and department display
    Given the app is running
    And a person named "Tom Hanks" known for "Acting"
    When I view the person page
    Then I see "Tom Hanks" as the name
    And I see "Acting" as the department
