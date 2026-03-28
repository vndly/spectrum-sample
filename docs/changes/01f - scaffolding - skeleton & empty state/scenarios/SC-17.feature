Feature: SC-17 — Skeleton loader
  The skeleton loader SHALL render an animated placeholder.

  Scenario: SC-17-01 — Skeleton renders with pulse animation
    Given a <SkeletonLoader> is rendered with width "100%" and height "2rem"
    When the component mounts
    Then a pulsing placeholder div is visible with the specified dimensions
    And the div has the animate-pulse and bg-surface classes applied

  Scenario: SC-17-02 — Skeleton with rounded prop
    Given a <SkeletonLoader> is rendered with rounded "rounded-full"
    When the component mounts
    Then the placeholder div has fully rounded corners applied (using the rounded-full Tailwind class)

  Scenario: SC-17-03 — Skeleton renders with default prop values
    Given a <SkeletonLoader> is rendered with no props
    When the component mounts
    Then the placeholder div has width "100%", height "1rem", and rounded-md corners
