Feature: Profile hero
  Display person's profile image prominently

  Background:
    Given the app is running

  Scenario: CI-03-01 — Profile image displays when available
    Given a person with a profile image
    When I view the person page
    Then the profile image displays in a circular frame
    And the image is 200x200px on desktop

  Scenario: CI-03-02 — Placeholder displays when no profile image
    Given a person without a profile image
    When I view the person page
    Then a placeholder user icon displays
    And the placeholder maintains the same dimensions
