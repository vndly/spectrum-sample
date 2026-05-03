Feature: Profile hero
  Display person's profile image prominently

  Background:
    Given the app is running

  Scenario: CI-03-01 — Profile image displays when available
    Given a person with a profile image
    And I am using a desktop viewport
    When I view the person page
    Then the profile image displays in a circular frame
    And the image source is the Application-provided URL built from profile_path with IMAGE_SIZES.profile.medium
    And the image has localized alt text containing the person's name
    And the image is 200x200px on desktop

  Scenario: CI-03-02 — Placeholder displays when no profile image
    Given a person without a profile image
    And I am using a mobile viewport
    When I view the person page
    Then a placeholder user icon displays
    And the placeholder is 160x160px on mobile
