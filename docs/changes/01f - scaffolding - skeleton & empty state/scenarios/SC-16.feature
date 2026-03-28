Feature: SC-16 — Empty state component
  The empty state SHALL display a centered placeholder message.
  String props receive pre-translated values from the consuming component.

  Background:
    Given a view renders <EmptyState>

  Scenario: SC-16-01 — Empty state renders with icon and text
    Given the component receives icon, title, and description props
    When the component mounts
    Then the icon, title, and description are centered in the content area

  Scenario: SC-16-02 — Empty state with only title prop
    Given the component receives only a title prop (no icon, no description)
    When the component mounts
    Then the title renders
    And the icon and description are absent

  Scenario: SC-16-03 — Empty state with CTA button
    Given the component receives ctaLabel "Try Again" and ctaAction handler
    When the component mounts
    Then a "Try Again" button is rendered with primary teal styling
    And clicking the button invokes the ctaAction handler

  Scenario: SC-16-04 — Empty state with ctaLabel but no ctaAction
    Given the component receives ctaLabel "Try Again" but no ctaAction handler
    When the component mounts
    Then no CTA button is rendered
