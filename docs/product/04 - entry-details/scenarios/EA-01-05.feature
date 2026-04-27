Feature: User Actions

  As a user, I want to manage my library and share titles with others.

  Background:
    Given I navigate to "/movie/550" (Fight Club)
    And the page finishes loading

  Scenario: EA-01-01: Adding to watchlist
    Given the movie is not in my library
    When I click the watchlist button (bookmark icon)
    Then the button should show as active (filled)
    And the movie should be saved to my library with status "watchlist"

  Scenario: EA-01-02: Removing from watchlist
    Given the movie is in my watchlist
    When I click the watchlist button
    Then the button should show as inactive (outline)
    And the movie status should be set to "none"

  Scenario: EA-02-01: Marking as watched
    Given the movie is not marked as watched
    When I click the watched button (eye icon)
    Then the button should show as active (filled)
    And the movie should be saved with status "watched"

  Scenario: EA-02-02: Unmarking as watched
    Given the movie is marked as watched
    When I click the watched button
    Then the button should show as inactive (outline)
    And the movie status should be set to "none"

  Scenario: EA-03-01: Sharing via native share API (mobile)
    Given the device supports the native Share API
    When I click the share button
    Then the native share dialog should open
    And the share URL should be the current page URL

  Scenario: EA-03-02: Sharing via clipboard (desktop)
    Given the device does not support the native Share API
    When I click the share button
    Then the URL should be copied to the clipboard
    And I should see a toast notification confirming the copy

  Scenario: EA-04-01: Persisting status changes
    When I click the watchlist button
    And I refresh the page
    Then the watchlist button should still show as active

  Scenario: EA-05-01: Syncing metadata on page load
    Given the movie exists in my library with outdated metadata
    When I view the detail page
    Then the library entry should be updated with current metadata
    And the poster path should be synced
    And the vote average should be synced
    And the release date should be synced
