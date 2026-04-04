Feature: Tagline

  The tagline is displayed below the title in the hero area when present and non-empty.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-14-01 - Tagline displays below title
    Given the entry has a non-empty tagline "Mischief. Mayhem. Soap."
    When the detail page loads
    Then the tagline "Mischief. Mayhem. Soap." is displayed below the title
    And the tagline uses muted text styling

  Scenario: ED-14-02 - Tagline omitted when empty
    Given the entry has an empty tagline
    When the detail page loads
    Then no tagline element is rendered

  Scenario: ED-14-03 - Tagline omitted when null
    Given the entry has tagline null
    When the detail page loads
    Then no tagline element is rendered
