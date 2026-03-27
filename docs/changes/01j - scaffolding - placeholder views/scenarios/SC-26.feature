Feature: SC-26 — Placeholder view tests
  Placeholder view tests SHALL verify each view renders an empty state.

  Scenario: SC-26-01 — Home view renders EmptyState
    Given the home-screen test file exists
    When the test suite runs
    Then it verifies the view renders `<EmptyState>` with the Home icon and translated title

  Scenario: SC-26-02 — Calendar view renders EmptyState
    Given the calendar-screen test file exists
    When the test suite runs
    Then it verifies the view renders `<EmptyState>` with the CalendarDays icon and translated title

  Scenario: SC-26-03 — Library view renders EmptyState
    Given the library-screen test file exists
    When the test suite runs
    Then it verifies the view renders `<EmptyState>` with the Bookmark icon and translated title

  Scenario: SC-26-04 — Settings view renders EmptyState
    Given the settings-screen test file exists
    When the test suite runs
    Then it verifies the view renders `<EmptyState>` with the Settings icon and translated title
