Feature: Clickable cast cards
  Cast member cards in CastCarousel navigate to /person/:id

  Background:
    Given the app is running
    And I am on a movie detail page with cast members

  Scenario: CI-01-01 — Click cast member navigates to person page
    When I click on a cast member card
    Then I am navigated to /person/{personId}
    And the person detail page loads

  Scenario: CI-01-02 — Cast member card is focusable via keyboard
    When I Tab to a cast member card
    And I press Enter
    Then I am navigated to /person/{personId}
