# Verification Scenarios: App Scaffolding — Theme, Transitions & Constants

Feature: App Scaffolding — Theme, Transitions & Constants

### Requirement: SC-21 — Theme additions

The app theme SHALL provide semantic color tokens.

#### Scenario: SC-21-01 — Theme colors available

GIVEN the app is built
WHEN I inspect the CSS custom properties
THEN `--color-success` and `--color-error` CSS custom properties exist

---

### Requirement: Cross-cutting NFRs (SC-09, SC-14, SC-15)

Non-functional requirements related to transitions and animation behavior.

#### Scenario: SC-09-02 — Reduced motion respected

GIVEN the user's OS has `prefers-reduced-motion` enabled
WHEN I navigate between routes
THEN no fade transition occurs (instant swap)

#### Scenario: SC-09-03 — Reduced motion disables toast animations

GIVEN the user's OS has `prefers-reduced-motion` enabled
WHEN a toast is triggered
THEN it appears without slide animation (instant display)

#### Scenario: SC-09-04 — Reduced motion disables modal animations

GIVEN the user's OS has `prefers-reduced-motion` enabled
WHEN the modal is opened
THEN it appears without fade or scale animation (instant display)

#### Scenario: SC-14-04 — Toast slide-in animation

GIVEN transitions are enabled (no `prefers-reduced-motion`)
WHEN a toast is triggered
THEN it slides in from the right and fades out on dismiss

#### Scenario: SC-15-07 — Modal fade and scale animation

GIVEN transitions are enabled (no `prefers-reduced-motion`)
WHEN the modal is opened
THEN the backdrop fades in and the content card scales up slightly
