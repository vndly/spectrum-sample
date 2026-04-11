Feature: Component Display and Schema

  Scenario: SU-01-04: Displaying all UI components
    Given I have "watched" items in my library
    When I view the stats screen
    Then I should see the "Stat Cards"
    And I should see the "Genre Distribution" chart
    And I should see the "Monthly Activity" chart
    And I should see the "Top Rated Items" list

  Scenario: SD-01-01: Runtime capture in metadata
    Given I am on a movie detail screen for a movie with runtime 120 minutes
    When I add the movie to my "watched" list
    Then the library entry in storage should contain "runtime: 120"
