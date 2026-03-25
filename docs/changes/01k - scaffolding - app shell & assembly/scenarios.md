# Verification Scenarios: App Scaffolding — App Shell & Assembly

Feature: App Scaffolding — App Shell & Assembly

### Requirement: SC-04 — App shell layout

The app shell SHALL provide a responsive layout structure.

#### Scenario: SC-04-01 — App shell flexbox layout

GIVEN the viewport width is 768px or above
WHEN the app loads
THEN the layout contains a sidebar and a scrollable content area arranged with flexbox

#### Scenario: SC-04-02 — Sidebar hides on mobile

GIVEN the viewport width is 768px or above
WHEN the viewport is resized to below 768px
THEN the sidebar hides and the bottom nav shows

#### Scenario: SC-04-03 — Sidebar restores on desktop

GIVEN the viewport width is below 768px
WHEN the viewport is resized to 768px or above
THEN the sidebar shows and the bottom nav hides

---

### Requirement: SC-09 — Route transitions

Views SHALL fade in and out during navigation.

#### Scenario: SC-09-01 — Fade transition on navigate

GIVEN the app is running with transitions enabled
WHEN I navigate from one route to another
THEN the outgoing view fades out and the incoming view fades in over ~200ms

---

### Requirement: SC-27 — Test infrastructure setup and build tooling

Test infrastructure SHALL be configured and all tooling checks SHALL pass.

#### Scenario: SC-27-01 — Type-check passes

GIVEN all scaffolding files are in place
WHEN I run `npm run type-check`
THEN zero TypeScript errors are reported

#### Scenario: SC-27-02 — Lint passes

GIVEN all scaffolding files are in place
WHEN I run `npm run lint`
THEN zero ESLint errors are reported

#### Scenario: SC-27-03 — Format check passes

GIVEN all scaffolding files are in place
WHEN I run `npm run format:check`
THEN zero formatting issues are reported

#### Scenario: SC-27-04 — Production build succeeds

GIVEN all scaffolding files are in place
WHEN I run `npm run build`
THEN the build completes with zero errors

#### Scenario: SC-27-05 — Test suite passes

GIVEN all scaffolding files are in place
WHEN I run `npm run test`
THEN zero test failures are reported
