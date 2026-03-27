Feature: Cross-cutting NFRs
  Non-functional requirements that span multiple functional requirements.

  Scenario: SC-06-03 — Mobile touch targets
    Given the viewport width is below 768px
    When I inspect the bottom nav items
    Then each item has a minimum touch target of 44x44px

  Scenario: SC-08-03 — Sticky page header
    Given I am on a page with scrollable content
    When I scroll down
    Then the page header remains visible at the top of the content area
