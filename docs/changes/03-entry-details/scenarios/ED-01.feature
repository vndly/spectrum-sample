Feature: Hero Backdrop

  The HeroBackdrop component displays the backdrop image with a gradient overlay
  and the movie/show title overlaid for visual impact.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-01-01 - Backdrop image displays with gradient overlay
    Given the entry has a backdrop image
    When the detail page loads
    Then the backdrop image is displayed full-width
    And a gradient overlay fades from transparent to the page background color

  Scenario: ED-01-02 - Title displays over backdrop
    Given the entry has a backdrop image
    When the detail page loads
    Then the title is displayed over the gradient area
    And the title has sufficient contrast for readability

  Scenario: ED-01-03 - Fallback gradient when no backdrop
    Given the entry has no backdrop image (backdrop_path is null)
    When the detail page loads
    Then a solid dark gradient matching the app background is displayed
    And the title is still visible with proper contrast
