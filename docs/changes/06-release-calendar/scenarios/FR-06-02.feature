Feature: FR-06-02 — Release Display

  Background:
    Given the app is running
    And I am on the "/calendar" page

  Scenario: FR-06-02-01 — Movies are displayed on correct days
    Given the API returns a movie with release date "2026-04-15"
    Then I should see a release card for that movie in the cell for April 15th
