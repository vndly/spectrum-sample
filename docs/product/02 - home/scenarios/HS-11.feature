Feature: Mode Transition

  Clearing the search query restores the browse sections. There is no
  intermediate state where both search results and browse sections
  are visible simultaneously.

  Background:
    Given the app is running
    And the user is on the home screen
    And the search query is empty

  Scenario: HS-11-01 — Clearing query restores browse sections
    Given the user has searched for "inception"
    And search results are displayed
    When the user clears the SearchBar
    Then the TrendingCarousel section is visible
    And the PopularGrid section is visible
    And the FilterBar section is visible
    And the ViewToggle section is visible

  Scenario: HS-11-02 — Backspace to empty restores browse mode
    Given the user has typed "abc" in the SearchBar
    When the user presses backspace 3 times
    Then the search query is empty
    And the browse sections are visible
    And the SearchResults component is not rendered

  Scenario: HS-11-03 — Clear button restores browse mode
    Given the user has typed "test" in the SearchBar
    When the user clicks the clear button in the SearchBar
    Then the search query is empty
    And the browse sections are visible

  Scenario: HS-11-04 — No mixed state during transition
    Given the user has searched for "matrix"
    And search results are displayed
    When the user clears the SearchBar
    Then at no point are both SearchResults and TrendingCarousel visible simultaneously

  Scenario: HS-11-05 — Mode transition is instant
    Given the user has searched for "inception"
    When the user clears the SearchBar
    Then the browse sections appear immediately
    And there is no fade or slide animation between modes

  Scenario: HS-11-06 — Previous search results cleared on transition
    Given the user has searched for "matrix"
    And 5 MovieCards are displayed
    When the user clears the SearchBar
    And the user types "inception" in the SearchBar
    Then the previous "matrix" results are not displayed
    And loading skeleton is shown while the new search is in progress
