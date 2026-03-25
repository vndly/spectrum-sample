# Verification Scenarios: App Scaffolding — Placeholder Views

Feature: App Scaffolding — Placeholder Views

### Requirement: SC-20 — Placeholder views

Each route SHALL render a placeholder view.

#### Scenario Outline: SC-20-01 — Placeholder shows page name

GIVEN I navigate to `<route>`
WHEN the view loads
THEN the empty state component is displayed with the <icon> icon and title "<page_name>"

Examples:
| route     | icon         | page_name |
| /         | Home         | Home      |
| /calendar | CalendarDays | Calendar  |
| /library  | Bookmark     | Library   |
| /settings | Settings     | Settings  |

---

### Requirement: SC-26 — Placeholder view tests

Placeholder view tests SHALL verify each view renders an empty state.

#### Scenario: SC-26-01 — Home view renders EmptyState

GIVEN the home-screen test file exists
WHEN the test suite runs
THEN it verifies the view renders `<EmptyState>` with the Home icon and translated title

#### Scenario: SC-26-02 — Calendar view renders EmptyState

GIVEN the calendar-screen test file exists
WHEN the test suite runs
THEN it verifies the view renders `<EmptyState>` with the CalendarDays icon and translated title

#### Scenario: SC-26-03 — Library view renders EmptyState

GIVEN the library-screen test file exists
WHEN the test suite runs
THEN it verifies the view renders `<EmptyState>` with the Bookmark icon and translated title

#### Scenario: SC-26-04 — Settings view renders EmptyState

GIVEN the settings-screen test file exists
WHEN the test suite runs
THEN it verifies the view renders `<EmptyState>` with the Settings icon and translated title
