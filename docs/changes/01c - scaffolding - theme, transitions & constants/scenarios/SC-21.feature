Feature: SC-21 — Theme additions
  The app theme SHALL provide semantic color tokens.

  Scenario: SC-21-01 — Theme colors available
    Given the app is built
    When I inspect the CSS custom properties
    Then `--color-success` and `--color-error` CSS custom properties exist
