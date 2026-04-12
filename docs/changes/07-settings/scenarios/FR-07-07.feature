Feature: FR-07-07 — Validation

  Background:
    Given the app is running
    And I am on the "/settings" page

  Scenario: FR-07-07-01 — Importing malformed JSON
    When I upload a file named "invalid.json" with content "not a json"
    Then an error message "Invalid file format" should be displayed
    And no changes should be applied to the library

  Scenario: FR-07-07-02 — Importing file with invalid schema
    When I upload a JSON file with missing "library" field
    Then an error message "Invalid schema" should be displayed
    And no changes should be applied to the library

  Scenario: FR-07-07-03 — Displaying processing state for large files
    When I upload a very large valid backup file
    Then a "Processing your library..." loading indicator should be visible
    And the loading indicator should disappear once validation completes
