Feature: S-03 — Vite dev server & build

  HMR dev server, production build, Vue and Tailwind plugins, @ path alias.

  Background:
    Given all dependencies are installed

  Scenario: S-03-01 — App loads in development
    When I run `npm run dev`
    Then Vite starts a local dev server
    And the browser shows a blank dark screen with background color `#0f1923`

  Scenario: S-03-02 — Hot module replacement works
    Given the dev server is running
    When I edit `src/App.vue` and save
    Then the browser reflects the change without a full page reload

  Scenario: S-03-03 — Build completes successfully
    When I run `npm run build`
    Then the build completes with zero errors and zero warnings
    And the output is written to the `dist/` directory
