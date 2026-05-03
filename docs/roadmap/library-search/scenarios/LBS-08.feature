Feature: LBS-08 Empty search results

  Background:
    Given the app is running
    And the active language is English
    And I am on the Library screen

  Scenario: LBS-08-01 - Search/filter empty state appears for a non-empty tab reduced to zero
    Given the selected Library tab is Watchlist
    And the Watchlist contains an entry titled "Arrival"
    When I type "zzzz" in the Library search input
    And 300ms elapses without more typing
    Then the Library search/filter empty-state title is "No matches found"
    And the Library search/filter empty-state description is "Try a different search term or clear your filters"

  Scenario Outline: LBS-08-02 - Base Watchlist and Watched empty states are preserved
    Given the selected Library tab is "<tab>"
    And the selected Library tab has no base entries
    When the Library screen renders
    Then the base empty-state title is "<title>"
    And the Library search/filter empty state is not visible

    Examples:
      | tab       | title                   |
      | Watchlist | Your watchlist is empty |
      | Watched   | No watched entries yet  |

  Scenario Outline: LBS-08-03 - Empty-state CTA clears the active search/filter state
    Given the selected Library tab is Watchlist
    And the Watchlist contains an entry titled "Arrival" with genre "Drama"
    And the Watchlist contains an entry titled "Batman" with genre "Action"
    And the Library search input value is "<query>"
    And the selected genre filter is "<filter>"
    And the Library has applied the search query and selected filters
    When the Library search/filter empty state is visible
    Then the empty-state CTA label is "<cta>"
    When I click the empty-state CTA
    Then the Library search input value is "<expected_query>"
    And the selected genre filter is "<expected_filter>"
    And the entry titled "<visible_entry>" is visible

    Examples:
      | query | filter | cta           | expected_query | expected_filter | visible_entry |
      | zzzz  | none   | Clear search  |                | none            | Arrival       |
      |       | Comedy | Clear filters |                | none            | Arrival       |
      | zzzz  | Comedy | Clear all     |                | none            | Arrival       |
