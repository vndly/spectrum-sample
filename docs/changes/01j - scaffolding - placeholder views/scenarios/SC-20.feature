Feature: SC-20 — Placeholder views
  Each route SHALL render a placeholder view.

  Scenario Outline: SC-20-01 — Placeholder shows page name
    Given I navigate to `<route>`
    When the view loads
    Then the empty state component is displayed with the <icon> icon and title "<page_name>"

    Examples:
      | route     | icon         | page_name |
      | /         | Home         | Home      |
      | /calendar | CalendarDays | Calendar  |
      | /library  | Bookmark     | Library   |
      | /settings | Settings     | Settings  |
