Feature: SC-24 — UI primitive tests (partial)
  UI primitive component tests SHALL verify rendering and behavior.

  Scenario: SC-24-01 — EmptyState component test
    Given the EmptyState test file exists
    When the test suite runs
    Then it verifies rendering of icon, title, description, and CTA props

  Scenario: SC-24-02 — SkeletonLoader component test
    Given the SkeletonLoader test file exists
    When the test suite runs
    Then it verifies rendering with width, height, and rounded props
