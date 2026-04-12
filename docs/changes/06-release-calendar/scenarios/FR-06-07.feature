Feature: FR-06-07 — Detail Navigation

  Background:
    Given the app is running
    And I am on the "/calendar" page

  Scenario: FR-06-07-01 — Navigation to movie detail
    Given I see a release card for "The Batman"
    When I click on the card
    Then I should be navigated to the detail page for "The Batman"
