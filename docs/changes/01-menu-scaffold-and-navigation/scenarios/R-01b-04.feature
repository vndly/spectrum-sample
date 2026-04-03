Feature: R-01b-04 — Detail placeholder routes
  Numeric movie and show detail URLs SHALL resolve to placeholder screens in this phase.

  Scenario Outline: R-01b-04-01 — Numeric detail URLs render placeholder screens
    Given the app is running
    When I navigate directly to "<route>"
    Then the "<page_title>" placeholder screen is displayed inside the shared app shell
    And the page header shows "<page_title>"

    Examples:
      | route      | page_title |
      | /movie/550 | Movie      |
      | /show/1396 | Show       |

  Scenario Outline: R-01b-04-02 — Numeric detail placeholders do not block on provider validation
    Given the app shell is mounted at "<route>"
    And a spy records all `fetch` calls
    When the route settles
    Then the "<page_title>" placeholder screen is visible
    And `fetch` was not called

    Examples:
      | route      | page_title |
      | /movie/550 | Movie      |
      | /show/1396 | Show       |

  Scenario Outline: R-01b-04-03 — Router tests verify detail title metadata
    Given the router test suite runs
    When it inspects the `<route_name>` route metadata
    Then it confirms the route title key is `<title_key>`

    Examples:
      | route_name | title_key          |
      | movie      | page.movie.title   |
      | show       | page.show.title    |
