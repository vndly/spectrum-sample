Feature: SC-16 — Empty state component
  The empty state SHALL display a centered placeholder message.

  Scenario: SC-16-01 — Empty state renders with icon and text
    Given a view renders <EmptyState> with icon, title, and description
    When the component mounts
    Then the icon, title, and description are centered in the content area

  Scenario: SC-16-02 — Empty state with only title prop
    Given a view renders <EmptyState> with only a title prop (no icon, no description)
    When the component mounts
    Then the title renders
    And the icon and description are absent

  Scenario: SC-16-03 — Empty state with CTA button
    Given a view renders <EmptyState> with ctaLabel "Try Again" and ctaAction handler
    When the component mounts
    Then a "Try Again" button is rendered
    And clicking the button invokes the ctaAction handler
