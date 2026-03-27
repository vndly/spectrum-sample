Feature: S-05 — Tailwind CSS v4 dark theme

  CSS-based @theme config with custom color variables and font stack.

  Scenario: S-05-01 — Theme colors are applied
    Given `src/assets/main.css` defines `--color-bg-primary: #0f1923`
    When a component uses the class `bg-bg-primary`
    Then the element renders with background color `#0f1923`
