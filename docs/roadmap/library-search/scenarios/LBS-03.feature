Feature: LBS-03 Case-insensitive matching

  Background:
    Given the app is running
    And the active language is English
    And I am on the Library screen
    And the selected Library tab is Watchlist
    And the Watchlist contains an entry titled "The Batman" with tag "NoirHero" and notes "DARK CITY case file"

  Scenario Outline: LBS-03-01 - Case variants match title, tag, and note fields
    When I type "<query>" in the Library search input
    And 300ms elapses without more typing
    Then the entry titled "The Batman" is visible

    Examples:
      | query     |
      | batman    |
      | Batman    |
      | BATMAN    |
      | noirhero  |
      | NOIRHERO  |
      | dark city |
      | DARK CITY |
