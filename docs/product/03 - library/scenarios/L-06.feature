Feature: List Deletion Integrity
  As a user
  I want my library to remain intact when I delete a list
  So that I don't lose movies I've saved

  Scenario: Deleting a non-empty list
    Given a list named "To Watch Soon" contains 5 movies
    When the user deletes the "To Watch Soon" list
    Then the list itself should be removed
    And the 5 movies should still exist in the library
    And the 5 movies should no longer have the "To Watch Soon" list ID in their lists array
