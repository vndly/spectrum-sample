Feature: FR-07-05 — Export Data

  Background:
    Given the app is running
    And I am on the "/settings" page

  Scenario: FR-07-05-01 — Exporting library data
    Given I have "5" movies in my library
    When I click the "Export Data" button
    Then a file named "plot-twisted-backup.json" should be downloaded
    And the file should contain the "5" library entries and current settings
