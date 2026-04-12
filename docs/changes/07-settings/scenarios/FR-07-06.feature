Feature: FR-07-06 — Import Data

  Background:
    Given the app is running
    And I am on the "/settings" page

  Scenario: FR-07-06-01 — Importing data with overwrite strategy
    Given I have "2" movies in my library
    When I upload a backup file with "10" movies
    And I choose the "Overwrite" strategy
    And I confirm the destructive action
    Then my library should now contain only the "10" movies from the file

  Scenario: FR-07-06-02 — Importing data with merge strategy
    Given I have "2" movies in my library
    When I upload a backup file with "3" DIFFERENT movies
    And I choose the "Merge" strategy
    Then my library should now contain "5" movies

  Scenario: FR-07-06-03 — Canceling overwrite strategy
    Given I have "2" movies in my library
    When I upload a backup file with "10" movies
    And I choose the "Overwrite" strategy
    And I cancel the destructive action
    Then my library should still contain "2" movies
