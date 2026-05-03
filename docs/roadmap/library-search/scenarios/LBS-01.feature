Feature: LBS-01 Search input

  Background:
    Given the app is running
    And the Library contains a Watchlist entry titled "Arrival"

  Scenario: LBS-01-01 - Search input appears in Library sticky controls
    Given the active language is English
    And I am on the Library screen
    When the Library controls are displayed
    Then a Library search input is visible in the sticky controls area
    And the Library search input appears above the entry grid
    And the Library search input placeholder is "Search titles, tags, notes..."
    And keyboard focus is not in the Library search input

  Scenario Outline: LBS-01-02 - Search input responds to mobile and desktop control layouts
    Given the active language is English
    And the viewport width is <width> pixels
    And I am on the Library screen
    When the Library controls are displayed
    Then the Library search input layout is "<search_layout>"
    And the filter controls layout is "<filter_layout>"

    Examples:
      | width | search_layout                     | filter_layout                 |
      | 390   | full-width above the filters      | below the search input        |
      | 1024  | inline with the filter controls   | beside the search input       |

  Scenario: LBS-01-03 - Search input exposes localized text and accessible label
    Given the active language is Spanish
    And I am on the Library screen
    When the Library controls are displayed
    Then the Library search input has an accessible name for searching the library
    And the Library search input placeholder is "Buscar títulos, etiquetas, notas..."
