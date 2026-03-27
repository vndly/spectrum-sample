Feature: SC-10 — Document title
  The document title SHALL update to reflect the current page.

  Scenario: SC-10-01 — Title updates on navigation
    Given the app is running
    When I navigate to /library
    Then document.title becomes "Library — Plot Twisted" (where "Plot Twisted" is the value of t('app.title'))

  Scenario: SC-10-02 — Title uses i18n
    Given the app language is set to Spanish
    When I navigate to /settings
    Then document.title becomes "Ajustes — Plot Twisted" (where "Plot Twisted" is the value of t('app.title') — the app name is not translated)
