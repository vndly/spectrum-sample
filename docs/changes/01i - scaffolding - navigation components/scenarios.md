# Verification Scenarios: App Scaffolding — Navigation Components

Feature: App Scaffolding — Navigation Components

### Requirement: SC-04/SC-05/SC-07 — Desktop sidebar navigation

The sidebar SHALL be visible on desktop and provide navigation to all 4 routes.

Background:
GIVEN the viewport width is 768px or above

#### Scenario: SC-05-01 — Sidebar renders on desktop

WHEN the app loads
THEN the sidebar is visible on the left with app title and 4 nav items

#### Scenario: SC-07-01 — Active route highlighting in sidebar

WHEN I am on the `/library` route
THEN the Library nav item has a teal left border and background tint
AND the other 3 nav items are muted gray

#### Scenario: SC-07-02 — Home exact matching

WHEN I am on the `/library` route
THEN the Home nav item is NOT highlighted (exact match only for `/`)

---

### Requirement: SC-04/SC-06/SC-07 — Mobile bottom navigation

The bottom nav SHALL replace the sidebar on small viewports.

Background:
GIVEN the viewport width is below 768px

#### Scenario: SC-06-01 — Bottom nav appears on mobile

WHEN the app loads
THEN the sidebar is hidden
AND a bottom navigation bar is visible with 4 items

#### Scenario: SC-07-03 — Active route highlighting in bottom nav

WHEN I am on the `/library` route
THEN the Library icon in the bottom nav uses the teal accent color
AND the other icons are muted

#### Scenario: SC-06-02 — Content not hidden by bottom nav

WHEN I scroll to the bottom of any page
THEN all content is visible and not obscured by the fixed bottom navigation bar

---

### Requirement: SC-08 — Page header

The page header SHALL display the translated name of the current page.

#### Scenario: SC-08-01 — Header shows current page

GIVEN the app is running
WHEN I navigate to `/calendar`
THEN the page header displays "Calendar" (or the translated equivalent)

#### Scenario: SC-08-02 — Header updates on navigation

GIVEN I am on the Home page
WHEN I click the "Settings" nav item
THEN the page header updates from "Home" to "Settings"

---

### Requirement: Cross-cutting NFRs

Non-functional requirements that span multiple functional requirements.

#### Scenario: SC-06-03 — Mobile touch targets

GIVEN the viewport width is below 768px
WHEN I inspect the bottom nav items
THEN each item has a minimum touch target of 44x44px

#### Scenario: SC-08-03 — Sticky page header

GIVEN I am on a page with scrollable content
WHEN I scroll down
THEN the page header remains visible at the top of the content area

---

### Requirement: SC-25 — Navigation component tests

Navigation component tests SHALL verify sidebar and bottom nav rendering.

#### Scenario: SC-25-01 — Sidebar nav renders items with icons and labels

GIVEN the SidebarNav test file exists
WHEN the test suite runs
THEN it verifies all 4 nav items render with correct icons and translated labels

#### Scenario: SC-25-02 — Sidebar nav active state highlighting

GIVEN the SidebarNav test file exists
WHEN the test suite runs
THEN it verifies the active route item has teal accent classes and home uses exact match

#### Scenario: SC-25-03 — Bottom nav renders items

GIVEN the BottomNav test file exists
WHEN the test suite runs
THEN it verifies all 4 nav items render with icons and labels

#### Scenario: SC-25-04 — Bottom nav active state highlighting

GIVEN the BottomNav test file exists
WHEN the test suite runs
THEN it verifies the active route item has teal accent styling
