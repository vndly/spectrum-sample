Feature: SC-05 — Desktop sidebar
  The desktop sidebar SHALL render the current scaffolded primary navigation set.

  Background:
    Given the viewport width is 768px or above

  Scenario: SC-05-01 — Sidebar renders the desktop navigation structure
    When the sidebar navigation component is rendered
    Then a fixed left sidebar with width `w-56` and a dark background is visible
    And the app title is visible at the top of the sidebar
    And exactly 4 navigation links are visible
    And navigation links for Home, Calendar, Library, and Settings are visible
    And no navigation link is shown for Recommendations
    And no navigation link is shown for Stats
    And no navigation link is shown for detail routes

  Scenario: SC-05-02 — Sidebar renders the documented French labels and icon mappings
    Given the language is "fr"
    When the sidebar navigation component is rendered
    Then the Home nav item displays "Accueil"
    And the Calendar nav item displays "Calendrier"
    And the Library nav item displays "Bibliothèque"
    And the Settings nav item displays "Paramètres"
    And each nav item uses its mapped lucide icon
