Feature: SC-12 — i18n Keys
  Navigation labels, page titles, empty state text, error text, and toast labels
  SHALL exist as i18n keys in all three locale files.

  # Note: SC-12-01 and SC-12-02 are integration-level scenarios that require UI
  # components from downstream features (01i for navigation, 01j for views).
  # They are fully testable only after those features are implemented.

  Scenario Outline: SC-12-01 — Nav labels are translated
    Given the app language is set to <language>
    When I view the sidebar navigation
    Then the Home nav item displays "<home>"
    And the Calendar nav item displays "<calendar>"
    And the Library nav item displays "<library>"
    And the Settings nav item displays "<settings>"

    Examples:
      | language | home    | calendar   | library      | settings   |
      | English  | Home    | Calendar   | Library      | Settings   |
      | Spanish  | Inicio  | Calendario | Biblioteca   | Ajustes    |
      | French   | Accueil | Calendrier | Bibliothèque | Paramètres |

  Scenario Outline: SC-12-02 — Page header is translated
    Given the app language is set to <language>
    When I navigate to <route>
    Then the page header displays the translated page.<page>.title value: "<expected>"

    Examples:
      | language | route     | page     | expected     |
      | English  | /         | home     | Home         |
      | Spanish  | /library  | library  | Biblioteca   |
      | French   | /calendar | calendar | Calendrier   |

  Scenario: SC-12-03 — i18n key completeness
    Given all locale files for en, es, and fr
    When I compare their key structures
    Then each file contains keys in the following namespaces:
      | namespace      |
      | app.title      |
      | nav.*          |
      | page.*.title   |
      | common.empty.* |
      | common.error.* |
      | toast.*        |
    And all three locale files contain the identical set of key paths

  Scenario: SC-12-04 — Fallback to English on missing key
    Given the app language is set to Spanish
    And the key "toast.dismiss" is missing from es.json
    When a component renders the toast.dismiss translation
    Then the displayed text falls back to the English value "Dismiss"
