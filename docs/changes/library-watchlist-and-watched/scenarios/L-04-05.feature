Feature: List-Entry Association and View
  As a user
  I want to add movies to my lists and view them
  So that I can see my custom collections

  Scenario: Adding an entry to a list
    Given a list named "Favorites" exists
    And the user is on the "The Matrix" detail page
    When the user selects "Favorites" from the list management modal
    Then the movie "The Matrix" should be added to the "Favorites" list

  Scenario: Viewing entries in a list
    Given a list named "Sci-Fi" has 3 movies
    When the user selects the "Sci-Fi" list in the Lists tab
    Then the grid should display those 3 movies
    And only those movies should be visible

  Scenario: Removing an entry from a list
    Given a movie "Inception" is in the "Sci-Fi" list
    When the user deselects "Sci-Fi" from the list management modal for "Inception"
    Then "Inception" should no longer be in the "Sci-Fi" list
