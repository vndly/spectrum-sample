Feature: SC-20 — Placeholder views
  Each route SHALL render translated placeholder content.

  Scenario Outline: SC-20-01 — Placeholder shows translated route content
    Given the active locale is `<locale>`
    And I navigate to `<route>`
    When the view loads
    Then the placeholder empty state shows the <icon> icon
    And the heading is "<empty_title>"
    And the supporting text is "<description>"

    Examples:
      | route     | icon         | locale | empty_title           | description                        |
      | /         | House        | en     | Nothing here yet      | This page is under construction.   |
      | /calendar | CalendarDays | en     | Nothing here yet      | This page is under construction.   |
      | /library  | Bookmark     | en     | Nothing here yet      | This page is under construction.   |
      | /settings | Settings     | en     | Nothing here yet      | This page is under construction.   |
      | /         | House        | fr     | Rien ici pour le moment | Cette page est en construction.  |
      | /calendar | CalendarDays | fr     | Rien ici pour le moment | Cette page est en construction.  |
      | /library  | Bookmark     | fr     | Rien ici pour le moment | Cette page est en construction.  |
      | /settings | Settings     | fr     | Rien ici pour le moment | Cette page est en construction.  |

  Scenario Outline: SC-20-02 — Placeholder view SFC keeps the required block structure
    Given the `<view_file>` placeholder view source file
    When I inspect its SFC blocks
    Then `<script setup lang="ts">` appears before `<template>`
    And the file does not include a local `<style>` block

    Examples:
      | view_file             |
      | home-screen.vue       |
      | calendar-screen.vue   |
      | library-screen.vue    |
      | settings-screen.vue   |

  Scenario Outline: SC-20-03 — Placeholder view text is sourced from shared translations
    Given the `<view_file>` placeholder view source file
    When I inspect its placeholder content bindings
    Then the heading uses the `common.empty.title` translation key
    And the supporting text uses the `common.empty.description` translation key
    And the file contains no hardcoded locale-specific placeholder copy

    Examples:
      | view_file             |
      | home-screen.vue       |
      | calendar-screen.vue   |
      | library-screen.vue    |
      | settings-screen.vue   |
