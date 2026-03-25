# Verification Scenarios: App Scaffolding — Skeleton & Empty State

Feature: App Scaffolding — Skeleton & Empty State

### Requirement: SC-16 — Empty state component

The empty state SHALL display a centered placeholder message.

#### Scenario: SC-16-01 — Empty state renders with icon and text

GIVEN a view renders `<EmptyState>` with icon, title, and description
WHEN the component mounts
THEN the icon, title, and description are centered in the content area

#### Scenario: SC-16-02 — Empty state with only title prop

GIVEN a view renders `<EmptyState>` with only a title prop (no icon, no description)
WHEN the component mounts
THEN the title renders
AND the icon and description are absent

#### Scenario: SC-16-03 — Empty state with CTA button

GIVEN a view renders `<EmptyState>` with ctaLabel "Try Again" and ctaAction handler
WHEN the component mounts
THEN a "Try Again" button is rendered
AND clicking the button invokes the ctaAction handler

---

### Requirement: SC-17 — Skeleton loader

The skeleton loader SHALL render an animated placeholder.

#### Scenario: SC-17-01 — Skeleton renders with pulse animation

GIVEN a `<SkeletonLoader>` is rendered with width "100%" and height "2rem"
WHEN the component mounts
THEN a pulsing placeholder div is visible with the specified dimensions

#### Scenario: SC-17-02 — Skeleton with rounded prop

GIVEN a `<SkeletonLoader>` is rendered with rounded "rounded-full"
WHEN the component mounts
THEN the placeholder div has fully rounded corners applied (using the `rounded-full` Tailwind class)

---

### Requirement: SC-24 — UI primitive tests (partial)

UI primitive component tests SHALL verify rendering and behavior.

#### Scenario: SC-24-01 — EmptyState component test

GIVEN the EmptyState test file exists
WHEN the test suite runs
THEN it verifies rendering of icon, title, description, and CTA props

#### Scenario: SC-24-02 — SkeletonLoader component test

GIVEN the SkeletonLoader test file exists
WHEN the test suite runs
THEN it verifies rendering with width, height, and rounded props
