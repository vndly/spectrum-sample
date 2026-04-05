Feature: Custom List Management
  As a user
  I want to create, rename, and delete my own lists
  So that I can organize my movies how I want

  Scenario: Creating a new list
    Given the user is on the "Lists" tab
    When the user enters "Horror" in the "New List" input
    And clicks the "Create" button
    Then a new list named "Horror" should be created
    And it should appear in the lists view

  Scenario: Renaming an existing list
    Given a list named "Sci-Fi" exists
    When the user renames "Sci-Fi" to "Science Fiction"
    Then the list should be renamed
    And it should be persisted with the new name

  Scenario: Deleting an empty list
    Given a list named "Temporaries" exists
    When the user deletes the "Temporaries" list
    Then the list should be removed from storage
    And no longer appear in the UI

  Scenario: Attempting to create a list with a duplicate name
    Given a list named "Sci-Fi" exists
    When the user enters "sci-fi" in the "New List" input
    And clicks the "Create" button
    Then a validation error should be shown
    And no new list should be created
