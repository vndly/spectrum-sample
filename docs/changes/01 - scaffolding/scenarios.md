# Verification Scenarios: App Scaffolding

Feature: App Scaffolding

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

### Requirement: SC-09 — Route transitions

Views SHALL fade in and out during navigation.

#### Scenario: SC-09-01 — Fade transition on navigate

GIVEN the app is running with transitions enabled
WHEN I navigate from one route to another
THEN the outgoing view fades out and the incoming view fades in over ~200ms

#### Scenario: SC-09-02 — Reduced motion respected

GIVEN the user's OS has `prefers-reduced-motion` enabled
WHEN I navigate between routes
THEN no fade transition occurs (instant swap)

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

### Requirement: SC-13/SC-14 — Toast notification system

The toast system SHALL display non-blocking notifications.

#### Scenario Outline: SC-13-01 — Toast appears and auto-dismisses

GIVEN a toast is triggered with message "<message>" and type "<type>"
WHEN the toast appears
THEN it is visible in the top-right corner with a <color> accent
AND it automatically disappears after approximately 4 seconds

Examples:
| type    | color | message              |
| error   | red   | An error occurred    |
| success | green | Added to watchlist   |
| info    | accent| Update available     |

#### Scenario: SC-13-02 — Toast can be manually dismissed

GIVEN a toast is visible
WHEN I click the dismiss button
THEN the toast is removed immediately

#### Scenario: SC-13-03 — Toast with action button

GIVEN a toast is triggered with an action (label: "Retry", handler function)
WHEN the toast appears
THEN it shows a "Retry" button alongside the dismiss button
AND clicking "Retry" invokes the handler function

#### Scenario: SC-14-01 — Multiple toasts stack

GIVEN two toasts are triggered in quick succession
WHEN both are visible
THEN they stack vertically in the top-right corner without overlapping

#### Scenario: SC-14-03 — Oldest toast evicted when maximum exceeded

GIVEN 5 toasts are currently visible
WHEN a 6th toast is triggered
THEN the oldest toast is removed
AND the new toast is added to the stack
AND 5 toasts remain visible

#### Scenario: SC-14-02 — Toast container positioning

GIVEN a toast is triggered
WHEN the toast container renders
THEN it is fixed to the top-right of the viewport with z-50

---

### Requirement: SC-15 — Modal/dialog

The modal SHALL display a centered dialog with backdrop.

#### Scenario: SC-15-01 — Modal opens and shows content

GIVEN `useModal().open()` is called with title "Confirm Delete"
WHEN the modal appears
THEN a backdrop overlay covers the screen
AND a centered card shows "Confirm Delete" with confirm and cancel buttons

#### Scenario: SC-15-02 — Modal closes on backdrop click

GIVEN the modal is open
WHEN I click on the backdrop (outside the content card)
THEN the modal closes

#### Scenario: SC-15-03 — Modal closes on Escape key

GIVEN the modal is open
WHEN I press the Escape key
THEN the modal closes

#### Scenario: SC-15-04 — Confirm callback

GIVEN the modal is open with `onConfirm` and `onCancel` callbacks
WHEN I click the confirm button
THEN the `onConfirm` callback is invoked and the modal closes

#### Scenario: SC-15-05 — Cancel callback

GIVEN the modal is open with `onConfirm` and `onCancel` callbacks
WHEN I click the cancel button
THEN the `onCancel` callback is invoked and the modal closes

#### Scenario: SC-15-06 — Single-instance replacement

GIVEN the modal is open with title "First"
WHEN `useModal().open()` is called again with title "Second"
THEN only one modal is visible
AND it displays the title "Second"

---

### Requirement: SC-16 — Empty state component

The empty state SHALL display a centered placeholder message.

#### Scenario: SC-16-01 — Empty state renders with icon and text

GIVEN a view renders `<EmptyState>` with icon, title, and description
WHEN the component mounts
THEN the icon, title, and description are centered in the content area

#### Scenario: SC-16-02 — Empty state with only title prop

GIVEN a view renders `<EmptyState>` with only a title prop (no icon, no description)
WHEN the component mounts
THEN the title renders
AND the icon and description are absent

#### Scenario: SC-16-03 — Empty state with CTA button

GIVEN a view renders `<EmptyState>` with ctaLabel "Try Again" and ctaAction handler
WHEN the component mounts
THEN a "Try Again" button is rendered
AND clicking the button invokes the ctaAction handler

---

### Requirement: SC-17 — Skeleton loader

The skeleton loader SHALL render an animated placeholder.

#### Scenario: SC-17-01 — Skeleton renders with pulse animation

GIVEN a `<SkeletonLoader>` is rendered with width "100%" and height "2rem"
WHEN the component mounts
THEN a pulsing placeholder div is visible with the specified dimensions

#### Scenario: SC-17-02 — Skeleton with rounded prop

GIVEN a `<SkeletonLoader>` is rendered with rounded "rounded-full"
WHEN the component mounts
THEN the placeholder div has fully rounded corners applied (using the `rounded-full` Tailwind class)

---

### Requirement: SC-18 — Error boundary

The error boundary SHALL catch unhandled component errors.

#### Scenario: SC-18-01 — Error boundary shows fallback

GIVEN a child component throws an unhandled error
WHEN the error is caught by the error boundary
THEN the normal content is replaced with a fallback UI showing a translated error heading, description, and "Reload" button

#### Scenario: SC-18-02 — Reload button refreshes the page

GIVEN the error boundary fallback is displayed
WHEN I click the "Reload" button
THEN `window.location.reload()` is called

---

### Requirement: SC-19 — Global error handler

Unhandled errors SHALL trigger an error toast.

#### Scenario: SC-19-01 — Error handler dispatches toast

GIVEN an unhandled error occurs in any component
WHEN `app.config.errorHandler` catches it
THEN an error toast appears with a translated error message
AND the error is logged to the console

---

### Requirement: SC-12 — i18n

All user-facing text SHALL be translated via vue-i18n.

#### Scenario: SC-12-01 — Nav labels are translated

GIVEN the app language is set to French
WHEN I view the sidebar navigation
THEN the nav items display "Accueil", "Calendrier", "Bibliothèque", "Paramètres"

#### Scenario: SC-12-02 — Page header is translated

GIVEN the app language is set to Spanish
WHEN I navigate to `/library`
THEN the page header displays "Biblioteca"

#### Scenario: SC-12-03 — i18n key completeness

GIVEN all locale files for en, es, and fr
WHEN I inspect their contents
THEN each file contains keys in the app.title, nav.*, page.*.title, common.empty.*, common.error.*, and toast.* namespaces
AND all three locale files contain the identical set of key paths

---

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

### Requirement: Cross-cutting NFRs (SC-06, SC-08, SC-09, SC-14, SC-15)

Non-functional requirements that span multiple functional requirements. Scenario IDs follow their parent requirement prefix.

#### Scenario: SC-09-03 — Reduced motion disables toast animations

GIVEN the user's OS has `prefers-reduced-motion` enabled
WHEN a toast is triggered
THEN it appears without slide animation (instant display)

#### Scenario: SC-09-04 — Reduced motion disables modal animations

GIVEN the user's OS has `prefers-reduced-motion` enabled
WHEN the modal is opened
THEN it appears without fade or scale animation (instant display)

#### Scenario: SC-06-03 — Mobile touch targets

GIVEN the viewport width is below 768px
WHEN I inspect the bottom nav items
THEN each item has a minimum touch target of 44x44px

#### Scenario: SC-08-03 — Sticky page header

GIVEN I am on a page with scrollable content
WHEN I scroll down
THEN the page header remains visible at the top of the content area

#### Scenario: SC-14-04 — Toast slide-in animation

GIVEN transitions are enabled (no `prefers-reduced-motion`)
WHEN a toast is triggered
THEN it slides in from the right and fades out on dismiss

#### Scenario: SC-15-07 — Modal fade and scale animation

GIVEN transitions are enabled (no `prefers-reduced-motion`)
WHEN the modal is opened
THEN the backdrop fades in and the content card scales up slightly

---

### Requirement: SC-21 — Theme additions

The app theme SHALL provide semantic color tokens.

#### Scenario: SC-21-01 — Theme colors available

GIVEN the app is built
WHEN I inspect the CSS custom properties
THEN `--color-success` and `--color-error` CSS custom properties exist

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

---

### Requirement: SC-23 — Composable unit tests

Composable tests SHALL verify toast and modal state management.

#### Scenario: SC-23-01 — Toast composable test: add and remove

GIVEN the toast composable test file exists
WHEN the test suite runs
THEN it verifies `addToast` adds a toast to the queue and `removeToast` removes it

#### Scenario: SC-23-02 — Toast composable test: auto-dismiss

GIVEN the toast composable test file exists
WHEN the test suite runs
THEN it verifies toasts are automatically dismissed after the timeout

#### Scenario: SC-23-03 — Toast composable test: type variants

GIVEN the toast composable test file exists
WHEN the test suite runs
THEN it verifies error, success, and info toast types are supported

#### Scenario: SC-23-04 — Modal composable test: open and close

GIVEN the modal composable test file exists
WHEN the test suite runs
THEN it verifies `open(props)` sets the modal visible and `close()` hides it

#### Scenario: SC-23-05 — Modal composable test: confirm callback

GIVEN the modal composable test file exists
WHEN the test suite runs
THEN it verifies the `onConfirm` callback is invoked when confirm is triggered

#### Scenario: SC-23-06 — Modal composable test: cancel callback

GIVEN the modal composable test file exists
WHEN the test suite runs
THEN it verifies the `onCancel` callback is invoked when cancel is triggered

---

### Requirement: SC-24 — UI primitive tests

UI primitive component tests SHALL verify rendering and behavior.

#### Scenario: SC-24-01 — EmptyState component test

GIVEN the EmptyState test file exists
WHEN the test suite runs
THEN it verifies rendering of icon, title, description, and CTA props

#### Scenario: SC-24-02 — SkeletonLoader component test

GIVEN the SkeletonLoader test file exists
WHEN the test suite runs
THEN it verifies rendering with width, height, and rounded props

#### Scenario: SC-24-03 — ErrorBoundary component test

GIVEN the ErrorBoundary test file exists
WHEN the test suite runs
THEN it verifies slot rendering in normal state and fallback UI on error

#### Scenario: SC-24-04 — ToastContainer component test

GIVEN the ToastContainer test file exists
WHEN the test suite runs
THEN it verifies toast queue rendering, dismiss button, and positioning

#### Scenario: SC-24-05 — ModalDialog component test

GIVEN the ModalDialog test file exists
WHEN the test suite runs
THEN it verifies title/body/buttons rendering, backdrop click close, and Escape key close

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
