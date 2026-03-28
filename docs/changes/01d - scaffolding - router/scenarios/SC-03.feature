Feature: SC-03 — Route lazy loading
  All view components SHALL be loaded via dynamic import() for code splitting.

  Scenario: SC-03-01 — Route lazy loading (build verification)
    Given the app is built for production
    When I inspect the build output
    Then the production build output contains separate JavaScript chunk files for HomeScreen, CalendarScreen, LibraryScreen, and SettingsScreen views
