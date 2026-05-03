Feature: LBS-04 Partial matching

  Background:
    Given the app is running
    And the active language is English
    And I am on the Library screen
    And the selected Library tab is Watchlist

  Scenario Outline: LBS-04-01 - Partial query matches title, tag, or note substrings
    Given the Watchlist contains an entry titled "<title>" with tag "<tag>" and notes "<notes>"
    When I type "<query>" in the Library search input
    And 300ms elapses without more typing
    Then the entry titled "<title>" is visible

    Examples:
      | title       | tag       | notes                    | query |
      | Batman     | superhero | dark city vigilante      | bat   |
      | Combat     | drama     | intense ensemble story   | bat   |
      | Arrival    | bat-list  | language mystery         | bat   |
      | Moon       | quiet     | contains a bat reference | bat   |
