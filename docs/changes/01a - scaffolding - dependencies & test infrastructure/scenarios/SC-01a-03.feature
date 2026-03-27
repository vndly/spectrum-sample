Feature: SC-01a-03 — Test setup file
  The test setup file SHALL clear `localStorage` between tests
  and provide TypeScript global recognition for Vitest.

  Background:
    Given Phase 00 (Setup) is complete

  Scenario: SC-01a-03-01 — localStorage cleared between tests
    Given `tests/setup.ts` exists
    And `vitest.config.ts` includes `setupFiles: ["./tests/setup.ts"]`
    When a test suite with two tests runs in sequence where the first writes to `localStorage`
    Then `localStorage.length` is 0 before the second test body executes

  Scenario: SC-01a-03-02 — TypeScript recognizes Vitest globals
    Given `tests/setup.ts` includes `/// <reference types="vitest/globals" />`
    When a `.test.ts` file uses `describe`, `it`, `expect`, and `beforeEach` without explicit imports from `vitest`
    Then the file compiles with zero TypeScript errors

  Scenario: SC-01a-03-03 — Without setup file, localStorage state leaks between tests
    Given `vitest.config.ts` does NOT include `setupFiles: ["./tests/setup.ts"]`
    When two tests run in sequence where the first writes to `localStorage` and the second reads from it
    Then the second test observes the first test's `localStorage` data (state leaks between tests)
