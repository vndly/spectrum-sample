Feature: FR-06-05 — Region Filtering

  Background:
    Given the app is running
    And I am on the "/calendar" page

  Scenario: SC-06-05-01 — Calendar uses preferred region from settings
    Given my preferred region in settings is "ES"
    Then the API request for upcoming movies should include `region=ES`
