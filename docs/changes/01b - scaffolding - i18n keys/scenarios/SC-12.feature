Feature: SC-12 — i18n
  All user-facing text SHALL be translated via vue-i18n.

  Scenario: SC-12-01 — Nav labels are translated
    Given the app language is set to French
    When I view the sidebar navigation
    Then the nav items display "Accueil", "Calendrier", "Bibliothèque", "Paramètres"

  Scenario: SC-12-02 — Page header is translated
    Given the app language is set to Spanish
    When I navigate to /library
    Then the page header displays "Biblioteca"

  Scenario: SC-12-03 — i18n key completeness
    Given all locale files for en, es, and fr
    When I inspect their contents
    Then each file contains keys in the app.title, nav.*, page.*.title, common.empty.*, common.error.*, and toast.* namespaces
    And all three locale files contain the identical set of key paths
