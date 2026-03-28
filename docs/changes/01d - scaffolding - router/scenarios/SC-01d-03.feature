Feature: SC-01d-03 — Route lazy loading
  All view components SHALL be loaded via dynamic import() for code splitting.

  Scenario Outline: SC-01d-03-01 — Route lazy loading (build verification)
    Given the app is built for production
    When I inspect the build output
    Then the production build output contains a separate JavaScript chunk file for the <view> view

    Examples:
      | view           |
      | HomeScreen     |
      | CalendarScreen |
      | LibraryScreen  |
      | SettingsScreen |
