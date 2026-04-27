Feature: Loading and Error States

  As a user, I want clear feedback while pages load and when errors occur.

  Scenario: EL-01-01: Displaying loading skeleton
    Given I navigate to "/movie/550"
    When the page is still loading
    Then I should see a skeleton UI
    And the skeleton should show placeholders for:
      | backdrop |
      | title    |
      | metadata |
      | synopsis |
      | cast     |

  Scenario: EL-02-01: Handling 404 for invalid movie ID
    Given I navigate to "/movie/999999999" (non-existent ID)
    When the API returns a 404 error
    Then I should see a "Movie Not Found" message
    And I should see a "Go Home" button

  Scenario: EL-02-02: Handling 404 for invalid show ID
    Given I navigate to "/show/999999999" (non-existent ID)
    When the API returns a 404 error
    Then I should see a "Show Not Found" message
    And I should see a "Go Home" button

  Scenario: EL-03-01: Handling API errors with retry
    Given I navigate to "/movie/550"
    When the API returns a 500 error
    Then I should see an error message
    And I should see a "Retry" button
    When I click "Retry"
    Then the page should attempt to fetch data again

  Scenario: EL-04-01: Redirecting for non-numeric IDs
    Given I navigate to "/movie/abc" (non-numeric ID)
    Then I should be redirected to the home page

  Scenario: EL-04-02: Redirecting for empty IDs
    Given I navigate to "/movie/" (no ID)
    Then I should be redirected to the home page

  Scenario: ES-01-01: Displaying streaming providers
    Given my preferred region is "US"
    And I navigate to a movie with streaming availability in US
    When the page finishes loading
    Then I should see streaming provider logos
    And hovering a logo should show the provider name

  Scenario: ES-02-01: Filtering to flatrate providers only
    Given a movie has flatrate, rent, and buy providers
    When I view the detail page
    Then I should only see flatrate (subscription) providers

  Scenario: ES-03-01: Displaying external links
    Given a movie has IMDb ID and social media links
    When I view the detail page
    Then I should see an IMDb link
    And I should see social media links (Facebook, Instagram, Twitter)
    When I click the IMDb link
    Then it should open the IMDb page in a new tab
