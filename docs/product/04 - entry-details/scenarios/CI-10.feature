Feature: Filmography navigation
  Clicking filmography items navigates to detail pages

  Background:
    Given the app is running
    And I am on a person page with filmography

  Scenario: CI-10-01 — Click movie credit navigates to movie page
    When I click a movie credit
    Then I am navigated to /movie/{movieId}

  Scenario: CI-10-02 — Click TV credit navigates to show page
    When I click a TV credit
    Then I am navigated to /show/{showId}

  Scenario: CI-10-03 — Keyboard activates filmography credit
    When I Tab to a filmography credit
    And I press Enter
    Then I am navigated to the credit detail page

  Scenario: CI-10-04 — Filmography credit has mobile touch target
    When I view the person page on a mobile viewport
    Then each filmography credit link has a touch target at least 44x44px
