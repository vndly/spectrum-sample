Feature: SC-12 — i18n Keys
  All user-facing labels (navigation, page titles, empty state, error, and toast text)
  shall exist as i18n keys in all three locale files (en.json, es.json, fr.json).

  # Note: SC-12-01 and SC-12-02 are integration-level scenarios that require UI
  # components from downstream features (01i for navigation, 01j for views).
  # They will be implicitly exercised by 01i and 01j component tests.
  #
  # SC-12-04, SC-12-05, and SC-12-06 are integration-level scenarios requiring
  # vue-i18n runtime rendering. They will be exercised after downstream features
  # provide components that consume the scaffolded keys.

  @deferred
  Scenario Outline: SC-12-01 — Nav labels are translated
    Given the app language is set to <language>
    When I view the sidebar navigation
    Then the Home nav item displays "<home>"
    And the Recommendations nav item displays "<recommendations>"
    And the Calendar nav item displays "<calendar>"
    And the Library nav item displays "<library>"
    And the Settings nav item displays "<settings>"

    Examples:
      | language | home    | recommendations | calendar   | library      | settings   |
      | English  | Home    | Recommendations | Calendar   | Library      | Settings   |
      | Spanish  | Inicio  | Recomendaciones | Calendario | Biblioteca   | Ajustes    |
      | French   | Accueil | Recommandations | Calendrier | Bibliothèque | Paramètres |

  @deferred
  Scenario Outline: SC-12-02 — Page header is translated
    Given the app language is set to <language>
    When I navigate to <route>
    Then the page header displays the translated page.<page>.title value: "<expected>"

    Examples:
      | language | route              | page            | expected        |
      | English  | /                  | home            | Home            |
      | Spanish  | /                  | home            | Inicio          |
      | English  | /recommendations   | recommendations | Recommendations |
      | French   | /recommendations   | recommendations | Recommandations |
      | English  | /calendar          | calendar        | Calendar        |
      | Spanish  | /calendar          | calendar        | Calendario      |
      | English  | /library           | library         | Library         |
      | French   | /library           | library         | Bibliothèque    |
      | English  | /settings          | settings        | Settings        |
      | Spanish  | /settings          | settings        | Ajustes         |

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
    And every leaf value in each locale file is a non-empty string
    And the existing "app.title" key is preserved with its original value
    And each locale file is valid JSON
    And every key segment matches the camelCase pattern

  Scenario: SC-12-04 — Fallback to English on missing key
    Given the app language is set to Spanish
    And the es.json locale file has the key "toast.dismiss" removed
    When a component renders the toast.dismiss translation
    Then the displayed text falls back to the English value "Dismiss"

  Scenario: SC-12-05 — Fallback when entire namespace missing from non-English locale
    Given the app language is set to French
    And the entire "toast" namespace is removed from fr.json
    When a component renders the toast.error translation
    Then the displayed text falls back to the English value "An error occurred"

  Scenario: SC-12-06 — Raw key path rendered when missing from all locales
    Given the app language is set to Spanish
    And the key "toast.dismiss" is removed from both es.json and en.json
    When a component renders the toast.dismiss translation
    Then the displayed text shows the raw key path "toast.dismiss"
