Feature: LU-02 — FilterBar Integration

  Scenario: LU-02-01 — FilterBar is rendered directly below the Library tabs and stays sticky
    Given I am on the Library screen
    Then I see the library filter controls directly below the header tabs
    And I see the active library filter controls for the current view
    And the filter controls remain sticky when the library content scrolls

  Scenario: LU-02-02 — Library controls stay responsive and touch-friendly on mobile
    Given I am on the Library screen on a mobile viewport
    Then the filter controls wrap without horizontal scrolling
    And each interactive filter control exposes at least a 44x44 touch target
