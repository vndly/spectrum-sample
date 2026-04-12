Feature: FR-06-03 — Month Navigation

  Background:
    Given the app is running
    And I am on the "/calendar" page

  Scenario Outline: FR-06-03-01 — Navigating between months
    When I click the "<button>" button
    Then the grid should update to show the <target> month
    And a new API request should be made for the <target> month's releases

    Examples:
      | button         | target   |
      | Next Month     | next     |
      | Previous Month | previous |

  Scenario: FR-06-03-02 — Month view persists on reload
    Given I have navigated to the "Next Month"
    When I reload the page
    Then the grid should still show the "Next Month"
