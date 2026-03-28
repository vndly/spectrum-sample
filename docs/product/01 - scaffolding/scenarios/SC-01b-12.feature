Feature: SC-01b-12 — i18n Keys
  All user-facing labels (navigation, page titles, empty state, error, and toast text)
  shall exist as i18n keys in all three locale files (en.json, es.json, fr.json).
  SC-01b-12-01 and SC-01b-12-02 are @deferred (require downstream components from 01i/01j).
  SC-01b-12-04, SC-01b-12-05, SC-01b-12-06 are @deferred (require vue-i18n runtime rendering).

  # Note: SC-01b-12-01 and SC-01b-12-02 are integration-level scenarios that require UI
  # components from downstream features (01i for navigation, 01j for views).
  # They will be implicitly exercised by 01i and 01j component tests.
  #
  # SC-01b-12-04, SC-01b-12-05, and SC-01b-12-06 are integration-level scenarios requiring
  # vue-i18n runtime rendering. They will be exercised after downstream features
  # provide components that consume the scaffolded keys.

  @deferred
  Scenario Outline: SC-01b-12-01 — Nav labels are translated
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
  Scenario Outline: SC-01b-12-02 — Page header is translated
    Given the app language is set to <language>
    When I navigate to <route>
    Then the page header displays the translated page.<page>.title value: "<expected>"

    Examples:
      | language | route              | page            | expected        |
      | English  | /                  | home            | Home            |
      | Spanish  | /                  | home            | Inicio          |
      | French   | /                  | home            | Accueil         |
      | English  | /recommendations   | recommendations | Recommendations |
      | Spanish  | /recommendations   | recommendations | Recomendaciones |
      | French   | /recommendations   | recommendations | Recommandations |
      | English  | /calendar          | calendar        | Calendar        |
      | Spanish  | /calendar          | calendar        | Calendario      |
      | French   | /calendar          | calendar        | Calendrier      |
      | English  | /library           | library         | Library         |
      | Spanish  | /library           | library         | Biblioteca      |
      | French   | /library           | library         | Bibliothèque    |
      | English  | /settings          | settings        | Settings        |
      | Spanish  | /settings          | settings        | Ajustes         |
      | French   | /settings          | settings        | Paramètres      |

  Scenario: SC-01b-12-03 — i18n key completeness
    Given all locale files for en, es, and fr
    When I compare their key structures
    Then each file contains keys in the following namespaces:
      | namespace      |
      | nav.*          |
      | page.*.title   |
      | common.empty.* |
      | common.error.* |
      | toast.*        |
    And all three locale files contain the identical set of key paths
    And every leaf value in each locale file is a non-empty string
    And the existing "app.title" key is preserved with its original value
    And each locale file is valid JSON
    And every dot-separated segment of each key matches the camelCase pattern "^[a-z][a-zA-Z0-9]*$"

  Scenario: SC-01b-12-04 — Fallback to English on missing key
    Given all locale files contain the full default key set
    And the app language is set to Spanish
    And the es.json locale file has the key "toast.dismiss" removed
    When a component renders the toast.dismiss translation
    # Expected value matches en.json toast.dismiss
    Then the rendered component displays "Dismiss"

  Scenario: SC-01b-12-05 — Fallback when entire namespace missing from non-English locale
    Given all locale files contain the full default key set
    And the app language is set to French
    And the entire "toast" namespace is removed from fr.json
    When a component renders the toast.error translation
    Then the rendered component displays "An error occurred"

  Scenario: SC-01b-12-06 — Raw key path rendered when missing from all locales
    Given all locale files contain the full default key set
    And the app language is set to Spanish
    # fr.json is not consulted because the fallback chain is es → en
    And the key "toast.dismiss" is removed from both es.json and en.json
    When a component renders the toast.dismiss translation
    Then the rendered component displays the raw key path "toast.dismiss"
