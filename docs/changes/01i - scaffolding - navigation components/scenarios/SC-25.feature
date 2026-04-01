Feature: SC-25 — Layout component tests
  Component tests SHALL cover the documented navigation and header behaviors.

  Scenario: SC-25-01 — Sidebar test covers nav item rendering
    Given the sidebar navigation component test suite runs
    When the desktop sidebar is rendered in the test environment
    Then the test asserts the four nav links render with the documented icons and translated labels
    And the test asserts no extra primary nav item is present

  Scenario: SC-25-02 — Sidebar test covers desktop active-state behavior
    Given the sidebar navigation component test suite runs
    When the active route is `/library`
    Then the test asserts the Library item is highlighted and Home uses exact matching

  Scenario: SC-25-03 — Bottom nav test covers mobile rendering
    Given the bottom navigation component test suite runs
    When the mobile bottom nav is rendered in the test environment
    Then the test asserts the four nav links render with the documented icons and translated labels
    And the test asserts no extra primary nav item is present

  Scenario: SC-25-04 — Bottom nav test covers active state and touch targets
    Given the bottom navigation component test suite runs
    When the active route is `/library`
    Then the test asserts the active item uses the teal accent treatment
    And the test asserts each bottom nav item meets the 44x44px minimum touch target

  Scenario: SC-25-07 — Sidebar test covers Home exact-match positive behavior
    Given the sidebar navigation component test suite runs
    When the active route is `/`
    Then the test asserts the Home item is highlighted
    And the test asserts the other sidebar items are muted

  Scenario: SC-25-08 — Bottom nav test covers Home exact-match positive behavior
    Given the bottom navigation component test suite runs
    When the active route is `/`
    Then the test asserts the Home item is highlighted
    And the test asserts the other bottom-nav items are muted

  Scenario: SC-25-05 — Page header test covers title rendering and route updates
    Given the page header component test suite runs
    When route metadata changes from `page.home.title` to `page.settings.title`
    Then the test asserts the translated page title updates accordingly

  Scenario: SC-25-06 — Page header test covers sticky positioning and locale output
    Given the active locale is "es"
    And the route title key is `page.library.title`
    When the page header component is rendered in the test environment
    Then the test asserts the header renders "Biblioteca"
    And the test asserts the header includes sticky positioning classes
