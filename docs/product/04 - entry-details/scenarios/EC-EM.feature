Feature: Cast and Media

  As a user, I want to browse cast, watch trailers, and view image galleries.

  Background:
    Given I navigate to "/movie/550" (Fight Club)
    And the page finishes loading

  Scenario: EC-01-01: Displaying cast carousel
    Then I should see a cast carousel
    And the cast should show up to 20 members
    And the cast should be sorted by billing order

  Scenario: EC-02-01: Displaying cast member information
    Then each cast member should show a profile image
    And each cast member should show the actor name
    And each cast member should show the character name

  Scenario: EC-03-01: Scrolling the cast carousel
    Given the cast carousel has more than the visible members
    When I click the right scroll button
    Then the carousel should scroll smoothly to show more cast

  Scenario: EC-04-01: Handling missing profile images
    Given a cast member has no profile image
    Then I should see a placeholder icon for that cast member

  Scenario: EM-01-01: Displaying trailer thumbnail
    Given the movie has an official YouTube trailer
    Then I should see a trailer section
    And I should see a thumbnail with a play overlay

  Scenario: EM-02-01: Playing the trailer
    Given the movie has an official YouTube trailer
    When I click on the trailer thumbnail
    Then the YouTube player should be embedded
    And the video should use privacy-enhanced mode (youtube-nocookie.com)

  Scenario: EM-01-02: Hiding trailer when unavailable
    Given the movie has no YouTube trailer
    Then I should not see a trailer section

  Scenario: EM-03-01: Displaying image gallery tabs
    Then I should see an images gallery section
    And I should see tabs for "Posters" and "Backdrops"

  Scenario: EM-04-01: Opening lightbox from gallery
    When I click on a gallery thumbnail
    Then a lightbox modal should open
    And I should see the full-size image

  Scenario: EM-05-01: Navigating lightbox with keyboard
    Given the lightbox is open
    When I press the right arrow key
    Then I should see the next image
    When I press the left arrow key
    Then I should see the previous image
    When I press Escape
    Then the lightbox should close
