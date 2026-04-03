Feature: R-01b-07 — New-route shell behavior
  New placeholder routes SHALL preserve the existing shell contract.

  Scenario Outline: R-01b-07-01 — New placeholder routes stay inside the shared shell
    Given the app shell is mounted at "<route>"
    When the route settles
    Then the shared page header is visible above the routed content
    And the routed content remains inside the shared app-shell content column
    And the desktop sidebar and mobile bottom-nav breakpoint behavior is unchanged

    Examples:
      | route            |
      | /recommendations |
      | /stats           |
      | /movie/550       |
      | /show/1396       |

  Scenario: R-01b-07-02 — New placeholder routes reuse the shared fade and reduced-motion contract
    Given the app shell test suite runs
    When it navigates between an existing scaffolded route and a new placeholder route
    Then it confirms the routed views use the shared `fade` transition
    And it confirms reduced-motion disables the animated fade

  Scenario Outline: R-01b-07-03 — New placeholder routes avoid provider and storage side effects
    Given the app shell is mounted at "<route>"
    And a spy records all `fetch` calls
    And spies record `localStorage.setItem` and `localStorage.removeItem`
    When the route settles
    Then the placeholder screen is visible inside the shared shell
    And `fetch` was not called
    And `localStorage.setItem` was not called
    And `localStorage.removeItem` was not called
    And the modal and toast overlay layers remain mounted above routed content

    Examples:
      | route            |
      | /recommendations |
      | /stats           |
      | /movie/550       |
      | /show/1396       |
