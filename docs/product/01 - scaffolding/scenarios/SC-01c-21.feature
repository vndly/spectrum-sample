Feature: SC-01c-21 — Tailwind theme color tokens
  The app theme SHALL provide --color-success and --color-error CSS custom properties in the @theme block.

  Scenario: SC-01c-21-01 — Theme colors available with correct values
    Given the app CSS is loaded
    Then `--color-success` has value `#22c55e`
    And `--color-error` has value `#ef4444`
