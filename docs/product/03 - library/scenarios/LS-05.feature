Feature: LS-05 — Default Sort

  Scenario Outline: LS-05-01 — Every library view defaults to newest-first date sorting
    Given the app has loaded for the first time
    And the "<Scope>" library view contains "Oldest Entry" (added Jan 1) and "Newest Entry" (added Dec 31)
    When I view the "<Scope>" library view
    Then "Newest Entry" appears before "Oldest Entry"
    And the sort selection shows "Date Added (Newest First)"

    Examples:
      | Scope       |
      | "Watchlist" |
      | "Watched"   |

  Scenario: LS-05-02 — Default sort label is localized in French
    Given my app language is set to "fr"
    And the app has loaded for the first time
    When I view the Library screen
    Then the default sort selection label is "Date d'ajout (plus récent d'abord)"
