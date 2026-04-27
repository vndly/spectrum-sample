Feature: Data Display

  As a user, I want to see comprehensive metadata about movies and TV shows.

  Scenario: ED-01-01: Displaying movie metadata
    Given I navigate to "/movie/550" (Fight Club)
    When the page finishes loading
    Then I should see the title "Fight Club"
    And I should see the tagline "Mischief. Mayhem. Soap."
    And I should see the release year "1999"
    And I should see the runtime "139m"
    And I should see the original language "English"
    And I should see genres including "Drama"
    And I should see the director "David Fincher"

  Scenario: ED-02-01: Displaying show metadata
    Given I navigate to "/show/1399" (Game of Thrones)
    When the page finishes loading
    Then I should see the name "Game of Thrones"
    And I should see the first air date year "2011"
    And I should see the number of seasons
    And I should see the number of episodes
    And I should see the original language "English"
    And I should see genres including "Drama"

  Scenario: ED-03-01: Displaying synopsis
    Given I navigate to "/movie/550" (Fight Club)
    When the page finishes loading
    Then I should see the overview text starting with "A ticking-Loss"

  Scenario: ED-04-01: Displaying provider rating
    Given I navigate to a movie with vote_average > 0
    When the page finishes loading
    Then I should see a rating badge with the TMDB score
    And the rating should be formatted to one decimal place

  Scenario: ED-04-02: Hiding rating when zero
    Given I navigate to a movie with vote_average = 0
    When the page finishes loading
    Then I should not see a rating badge

  Scenario: ED-05-01: Displaying content rating for user region
    Given my preferred region is "US"
    And I navigate to "/movie/550" (Fight Club)
    When the page finishes loading
    Then I should see the content rating "R"

  Scenario: ED-06-01: Displaying box office for movies
    Given I navigate to a movie with budget > 0 and revenue > 0
    When the page finishes loading
    Then I should see the budget formatted as currency
    And I should see the revenue formatted as currency

  Scenario: ED-06-02: Hiding box office when no data
    Given I navigate to a movie with budget = 0 and revenue = 0
    When the page finishes loading
    Then I should not see the box office section
