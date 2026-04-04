Feature: Share Button

  The share button uses the Web Share API when available, falling back to
  clipboard copy with a toast notification.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-10-01 - Web Share API invoked when supported
    Given the browser supports the Web Share API
    And the entry title is "Fight Club"
    And the URL is "/movie/550"
    When the user clicks the share button
    Then navigator.share() is called with title "Fight Club" and URL

  Scenario: ED-10-02 - Clipboard fallback when Web Share not supported
    Given the browser does not support the Web Share API
    And the URL is "/movie/550"
    When the user clicks the share button
    Then the URL is copied to the clipboard
    And a success toast "Link copied to clipboard" is displayed

  Scenario: ED-10-03 - Share button has accessibility label
    When the detail page loads
    Then the share button has aria-label="Share"

  Scenario: ED-10-04 - Clipboard fallback toast in non-default language
    Given the browser does not support the Web Share API
    And the app language is set to "es"
    When the user clicks the share button
    Then the URL is copied to the clipboard
    And a success toast with localized text is displayed
