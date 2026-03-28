Feature: SC-10 — Document title
  The document title SHALL update to reflect the current page.

  Scenario: SC-10-01 — Title updates on navigation
    Given the app is running
    When I navigate to /library
    # document.title format: "${t(meta.titleKey)} — ${t('app.title')}"
    Then document.title becomes "Library — Plot Twisted"

  Scenario: SC-10-02 — Title uses i18n in non-default locale
    Given the app language is set to Spanish
    When I navigate to /settings
    # Uses t('page.settings.title') for the page name; app name is not translated
    # Value "Ajustes" depends on the Spanish locale file
    Then document.title becomes "Ajustes — Plot Twisted"

  Scenario: SC-10-03 — Home route title
    Given the app is running
    When I navigate to /
    Then document.title becomes "Home — Plot Twisted"
