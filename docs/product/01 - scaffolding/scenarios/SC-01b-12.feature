Feature: SC-01b-12 — i18n Keys
  All user-facing labels (navigation, page titles, empty state, error, and toast text)
  shall exist as i18n keys in all three locale files (en.json, es.json, fr.json).
  SC-01b-12-01 and SC-01b-12-02 are @deferred (require downstream layout components from 01i for the 4 currently scaffolded routes).
  SC-01b-12-07 and SC-01b-12-08 are @deferred (require the future Recommendations route and nav item).
  SC-01b-12-04, SC-01b-12-05, SC-01b-12-06 are @deferred (require vue-i18n runtime rendering).

  # Note: SC-01b-12-01 and SC-01b-12-02 are integration-level scenarios that require
  # downstream layout components from 01i (sidebar navigation and page header) for the
  # 4 currently scaffolded routes. Recommendations remains deferred until a future
  # change introduces that route and nav item; SC-01b-12-07 and SC-01b-12-08 retain
  # the canonical Recommendations-specific coverage.
  # Runtime coverage for the current scaffolded routes uses the default locale plus one
  # representative non-default locale per component. Structural parity across all three
  # locale files is enforced separately by SC-01b-12-03.
  # They will be implicitly exercised by 01i component tests.
  #
  # SC-01b-12-04, SC-01b-12-05, and SC-01b-12-06 are integration-level scenarios requiring
  # vue-i18n runtime rendering. They will be exercised after downstream features
  # provide components that consume the scaffolded keys.

  @deferred
  Scenario Outline: SC-01b-12-01 — Nav labels are translated
    Given the app language is set to <language>
    When I view the sidebar navigation
    Then the Home nav item displays "<home>"
    And the Calendar nav item displays "<calendar>"
    And the Library nav item displays "<library>"
    And the Settings nav item displays "<settings>"

    Examples:
      | language | home    | calendar   | library      | settings   |
      | English  | Home    | Calendar   | Library      | Settings   |
      | French   | Accueil | Calendrier | Bibliothèque | Paramètres |

  @deferred
  Scenario Outline: SC-01b-12-02 — Page header is translated
    Given the app language is set to <language>
    When I navigate to <route>
    Then the page header displays the translated page.<page>.title value: "<expected>"

    Examples:
      | language | route              | page            | expected        |
      | English  | /                  | home            | Home            |
      | Spanish  | /                  | home            | Inicio          |
      | English  | /calendar          | calendar        | Calendar        |
      | Spanish  | /calendar          | calendar        | Calendario      |
      | English  | /library           | library         | Library         |
      | Spanish  | /library           | library         | Biblioteca      |
      | English  | /settings          | settings        | Settings        |
      | Spanish  | /settings          | settings        | Ajustes         |

  @deferred
  Scenario Outline: SC-01b-12-07 — Recommendations nav label is translated when the route exists
    Given the app language is set to <language>
    When I view the sidebar navigation after the Recommendations route is introduced
    Then the Recommendations nav item displays "<recommendations>"

    Examples:
      | language | recommendations |
      | English  | Recommendations |
      | Spanish  | Recomendaciones |
      | French   | Recommandations |

  @deferred
  Scenario Outline: SC-01b-12-08 — Recommendations page header is translated when the route exists
    Given the app language is set to <language>
    When I navigate to /recommendations after the route is introduced
    Then the page header displays the translated page.recommendations.title value: "<expected>"

    Examples:
      | language | expected        |
      | English  | Recommendations |
      | Spanish  | Recomendaciones |
      | French   | Recommandations |

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
