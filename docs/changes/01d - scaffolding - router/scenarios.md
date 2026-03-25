# Verification Scenarios: App Scaffolding — Router

Feature: App Scaffolding — Router

### Requirement: SC-01/SC-02/SC-03 — Routing

The router SHALL navigate between all defined routes.

#### Scenario: SC-01-01 — Router uses HTML5 history mode

GIVEN the app is running
WHEN I navigate to `/settings`
THEN the URL in the browser address bar is `/settings` without a hash fragment

#### Scenario Outline: SC-02-01 — Navigation between pages

GIVEN the app is running
WHEN I click the "<nav_item>" nav item
THEN the URL changes to `<route>`
AND the <page_name> placeholder view is displayed
AND the page header shows "<page_name>"

Examples:
| nav_item | route     | page_name |
| Home     | /         | Home      |
| Calendar | /calendar | Calendar  |
| Library  | /library  | Library   |
| Settings | /settings | Settings  |

#### Scenario: SC-02-02 — Direct URL navigation

GIVEN the app is running
WHEN I navigate directly to `/settings` in the browser address bar
THEN the settings placeholder view is displayed
AND the sidebar highlights the Settings nav item

#### Scenario: SC-02-03 — Catch-all redirect

GIVEN the app is running
WHEN I navigate to `/nonexistent`
THEN the router redirects to `/`
AND the home placeholder view is displayed

#### Scenario: SC-03-01 — Route lazy loading (build verification)

GIVEN the app is built for production
WHEN I inspect the build output
THEN the production build output contains at least 4 separate JavaScript chunk files corresponding to route views

---

### Requirement: SC-10 — Document title

The document title SHALL update to reflect the current page.

#### Scenario: SC-10-01 — Title updates on navigation

GIVEN the app is running
WHEN I navigate to `/library`
THEN `document.title` becomes "Library — Plot Twisted" (where "Plot Twisted" is the value of `t('app.title')`)

#### Scenario: SC-10-02 — Title uses i18n

GIVEN the app language is set to Spanish
WHEN I navigate to `/settings`
THEN `document.title` becomes "Ajustes — Plot Twisted" (where "Plot Twisted" is the value of `t('app.title')` — the app name is not translated)

---

### Requirement: SC-11 — Scroll-to-top

The page SHALL scroll to the top on every navigation.

#### Scenario: SC-11-01 — Scroll resets on navigate

GIVEN I have scrolled down on the current page
WHEN I navigate to a different route
THEN the page scroll position resets to the top

---

### Requirement: SC-22 — Router unit tests

Router tests SHALL verify route definitions and navigation behavior.

#### Scenario: SC-22-01 — Router test verifies named routes

GIVEN the router test file exists
WHEN the test suite runs
THEN it verifies all 4 named routes exist with correct paths

#### Scenario: SC-22-02 — Router test verifies catch-all redirect

GIVEN the router test file exists
WHEN the test suite runs
THEN it verifies the catch-all route redirects to `/`

#### Scenario: SC-22-03 — Router test verifies scroll behavior

GIVEN the router test file exists
WHEN the test suite runs
THEN it verifies `scrollBehavior` returns `{ top: 0 }`

#### Scenario: SC-22-04 — Router test verifies document title

GIVEN the router test file exists
WHEN the test suite runs
THEN it verifies `afterEach` sets `document.title` using i18n
