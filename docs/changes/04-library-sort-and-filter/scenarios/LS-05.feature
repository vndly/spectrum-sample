Feature: LS-05 — Default Sort

  Scenario: LS-05-01 — Library displays Newest Added first by default
    Given the app has loaded for the first time
    And my library contains "Oldest Movie" (added Jan 1) and "Newest Movie" (added Dec 31)
    When I view the Library screen
    Then "Newest Movie" appears before "Oldest Movie"
    And the sort selection shows "Date Added (Newest First)"

  Scenario: LS-05-02 — Default sort label is localized
    Given my app language is set to "fr"
    And the app has loaded for the first time
    When I view the Library screen
    Then the default sort selection label is shown in French for "Date Added (Newest First)"
