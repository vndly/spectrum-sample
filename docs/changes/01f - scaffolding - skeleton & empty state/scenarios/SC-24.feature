Feature: SC-24 — UI primitive tests (partial)
  UI primitive component tests SHALL verify rendering and behavior.
  This feature covers SC-24-01 and SC-24-02; sibling features 01g and 01h cover remaining scenarios.

  Scenario: SC-24-01 — EmptyState renders all prop combinations correctly
    Given the EmptyState component is mounted with all props (icon, title, description, ctaLabel, ctaAction)
    When the component renders
    Then the icon, title, description, and CTA button are all visible
    And mounting with only a title prop renders the title without icon, description, or CTA

  Scenario: SC-24-02 — SkeletonLoader renders with configurable dimensions
    Given the SkeletonLoader component is mounted with width "50%" and height "3rem"
    When the component renders
    Then the placeholder div reflects the specified width and height
    And the animate-pulse and bg-surface classes are applied
