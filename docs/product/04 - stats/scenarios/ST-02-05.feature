Feature: Advanced Calculations

  Background:
    Given a library with 5 watched items across multiple genres
    And watch dates distributed across the current year

  Scenario: ST-02-01: Genre distribution calculation
    When I view the stats screen
    Then the "Genre Distribution" chart should show counts for all assigned genres
    And "Action" should be the top genre if it has the most entries

  Scenario: ST-03-01: Monthly activity calculation
    When I view the stats screen
    Then the "Monthly Activity" chart should show 12 months
    And the month of "January" should show 1 entry if 1 item was watched then

  Scenario: ST-04-01: Top rated items ranking
    When I view the stats screen
    Then the "Top Rated" list should show a maximum of 10 items
    And the items should be sorted by rating descending
