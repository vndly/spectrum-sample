Feature: FR-07-07 — Sanitization

  Background:
    Given the app is running
    And I am on the "/settings" page

  Scenario: FR-07-07b-01 — Sanitizing malicious payloads in imported data
    Given I have an empty library
    When I upload a backup file containing a library entry note "<script>alert('xss')</script>My Note"
    And I choose the "Merge" strategy
    Then the library entry should be imported
    And its note should be displayed as text, not executed as a script
    And the displayed note should be sanitized or escaped
