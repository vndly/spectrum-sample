Feature: Empty State

  As a user, I want to be informed when there are no stats to display.

  Scenario: Displaying empty state when no watched entries exist
    Given I have no "watched" entries in my library
    When I view the stats screen
    Then I should see a "No watched items" message
    And I should see a call to action to start adding and rating content
    And the charts should not be visible
