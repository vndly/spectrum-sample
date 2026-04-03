Feature: R-01b-02 — Recommendations nav item
  Recommendations SHALL become the fifth primary navigation item.

  Scenario Outline: R-01b-02-01 — Recommendations appears in the documented nav order
    Given the `<surface>` navigation component is rendered
    When the active route is `/`
    Then the visible primary nav items are `Home`, `Recommendations`, `Calendar`, `Library`, and `Settings` in that order
    And Stats is not shown in primary navigation
    And detail routes are not shown in primary navigation

    Examples:
      | surface |
      | desktop |
      | mobile  |

  Scenario Outline: R-01b-02-02 — Recommendations uses translated labels and the Compass icon
    Given the `<surface>` navigation component is rendered
    And the active locale is `<locale>`
    When the navigation finishes rendering
    Then the Recommendations nav item label is "<label>"
    And the Recommendations nav item shows the Compass icon

    Examples:
      | surface | locale | label             |
      | desktop | en     | Recommendations   |
      | mobile  | fr     | Recommandations   |

  Scenario Outline: R-01b-02-03 — Recommendations uses the existing active-state treatment
    Given the `<surface>` navigation component is rendered
    When the active route is `/recommendations`
    Then the Recommendations nav item is highlighted using the existing active-state styling
    And the Home nav item is not highlighted

    Examples:
      | surface |
      | desktop |
      | mobile  |

  Scenario: R-01b-02-04 — Recommendations keeps the mobile minimum touch target
    Given the mobile bottom navigation component is rendered
    When I inspect the Recommendations nav item
    Then the item has a minimum touch target of 44x44px
