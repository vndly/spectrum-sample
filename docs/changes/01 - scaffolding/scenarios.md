# Verification Scenarios: App Scaffolding

### Requirement: Routing

The router SHALL navigate between all defined routes.

#### Scenario: Navigation between pages

GIVEN the app is running
WHEN I click the "Library" nav item
THEN the URL changes to `/library`
AND the library placeholder view is displayed
AND the page header shows "Library"

#### Scenario: Direct URL navigation

GIVEN the app is running
WHEN I navigate directly to `/settings` in the browser address bar
THEN the settings placeholder view is displayed
AND the sidebar highlights the Settings nav item

#### Scenario: Catch-all redirect

GIVEN the app is running
WHEN I navigate to `/nonexistent`
THEN the router redirects to `/`
AND the home placeholder view is displayed

#### Scenario: Route lazy loading

GIVEN the app is built for production
WHEN I inspect the build output
THEN each view is in a separate chunk (code-split via dynamic import)

---

### Requirement: Desktop sidebar navigation

The sidebar SHALL be visible on desktop and provide navigation to all 5 routes.

#### Scenario: Sidebar renders on desktop

GIVEN the viewport width is 768px or above
WHEN the app loads
THEN the sidebar is visible on the left with app title and 5 nav items

#### Scenario: Active route highlighting in sidebar

GIVEN the app is running on desktop
WHEN I am on the `/library` route
THEN the Library nav item has a teal left border and background tint
AND the other 4 nav items are muted gray

#### Scenario: Home exact matching

GIVEN the app is running on desktop
WHEN I am on the `/library` route
THEN the Home nav item is NOT highlighted (exact match only for `/`)

---

### Requirement: Mobile bottom navigation

The bottom nav SHALL replace the sidebar on small viewports.

#### Scenario: Bottom nav appears on mobile

GIVEN the viewport width is below 768px
WHEN the app loads
THEN the sidebar is hidden
AND a bottom navigation bar is visible with 5 items

#### Scenario: Active route highlighting in bottom nav

GIVEN the viewport is below 768px
WHEN I am on the `/stats` route
THEN the Stats icon in the bottom nav uses the teal accent color
AND the other icons are muted

#### Scenario: Content not hidden by bottom nav

GIVEN the viewport is below 768px
WHEN I scroll to the bottom of any page
THEN all content is visible and not obscured by the fixed bottom navigation bar

---

### Requirement: Page header

The page header SHALL display the translated name of the current page.

#### Scenario: Header shows current page

GIVEN the app is running
WHEN I navigate to `/calendar`
THEN the page header displays "Calendar" (or the translated equivalent)

#### Scenario: Header updates on navigation

GIVEN I am on the Home page
WHEN I click the "Settings" nav item
THEN the page header updates from "Home" to "Settings"

---

### Requirement: Route transitions

Views SHALL fade in and out during navigation.

#### Scenario: Fade transition on navigate

GIVEN the app is running with transitions enabled
WHEN I navigate from one route to another
THEN the outgoing view fades out and the incoming view fades in over ~200ms

#### Scenario: Reduced motion respected

GIVEN the user's OS has `prefers-reduced-motion` enabled
WHEN I navigate between routes
THEN no fade transition occurs (instant swap)

---

### Requirement: Document title

The document title SHALL update to reflect the current page.

#### Scenario: Title updates on navigation

GIVEN the app is running
WHEN I navigate to `/stats`
THEN `document.title` becomes "Stats — Plot Twisted"

#### Scenario: Title uses i18n

GIVEN the app language is set to Spanish
WHEN I navigate to `/settings`
THEN `document.title` becomes "Ajustes — Plot Twisted"

---

### Requirement: Scroll-to-top

The page SHALL scroll to the top on every navigation.

#### Scenario: Scroll resets on navigate

GIVEN I have scrolled down on the current page
WHEN I navigate to a different route
THEN the page scroll position resets to the top

---

### Requirement: Toast notification system

The toast system SHALL display non-blocking notifications.

#### Scenario: Toast appears and auto-dismisses

GIVEN a toast is triggered with message "Added to watchlist" and type "success"
WHEN the toast appears
THEN it is visible in the top-right corner with a green accent
AND it automatically disappears after approximately 4 seconds

#### Scenario: Toast can be manually dismissed

GIVEN a toast is visible
WHEN I click the dismiss button
THEN the toast is removed immediately

#### Scenario: Toast with action button

GIVEN a toast is triggered with an action (label: "Retry", handler function)
WHEN the toast appears
THEN it shows a "Retry" button alongside the dismiss button
AND clicking "Retry" invokes the handler function

#### Scenario: Multiple toasts stack

GIVEN two toasts are triggered in quick succession
WHEN both are visible
THEN they stack vertically in the top-right corner without overlapping

---

### Requirement: Modal/dialog

The modal SHALL display a centered dialog with backdrop.

#### Scenario: Modal opens and shows content

GIVEN `useModal().open()` is called with title "Confirm Delete"
WHEN the modal appears
THEN a backdrop overlay covers the screen
AND a centered card shows "Confirm Delete" with confirm and cancel buttons

#### Scenario: Modal closes on backdrop click

GIVEN the modal is open
WHEN I click on the backdrop (outside the content card)
THEN the modal closes

#### Scenario: Modal closes on Escape key

GIVEN the modal is open
WHEN I press the Escape key
THEN the modal closes

#### Scenario: Confirm and cancel callbacks

GIVEN the modal is open with `onConfirm` and `onCancel` callbacks
WHEN I click the confirm button
THEN the `onConfirm` callback is invoked and the modal closes

---

### Requirement: Empty state component

The empty state SHALL display a centered placeholder message.

#### Scenario: Empty state renders with icon and text

GIVEN a view renders `<EmptyState>` with icon, title, and description
WHEN the component mounts
THEN the icon, title, and description are centered in the content area

---

### Requirement: Skeleton loader

The skeleton loader SHALL render an animated placeholder.

#### Scenario: Skeleton renders with pulse animation

GIVEN a `<SkeletonLoader>` is rendered with width "100%" and height "2rem"
WHEN the component mounts
THEN a pulsing placeholder div is visible with the specified dimensions

---

### Requirement: Error boundary

The error boundary SHALL catch unhandled component errors.

#### Scenario: Error boundary shows fallback

GIVEN a child component throws an unhandled error
WHEN the error is caught by the error boundary
THEN the normal content is replaced with a fallback UI showing a translated error heading, description, and "Reload" button

#### Scenario: Reload button refreshes the page

GIVEN the error boundary fallback is displayed
WHEN I click the "Reload" button
THEN `window.location.reload()` is called

---

### Requirement: Global error handler

Unhandled errors SHALL trigger an error toast.

#### Scenario: Error handler dispatches toast

GIVEN an unhandled error occurs in any component
WHEN `app.config.errorHandler` catches it
THEN an error toast appears with a translated error message
AND the error is logged to the console

---

### Requirement: i18n

All user-facing text SHALL be translated via vue-i18n.

#### Scenario: Nav labels are translated

GIVEN the app language is set to French
WHEN I view the sidebar navigation
THEN the nav items display "Accueil", "Bibliotheque", "Statistiques", "Calendrier", "Parametres"

#### Scenario: Page header is translated

GIVEN the app language is set to Spanish
WHEN I navigate to `/library`
THEN the page header displays "Biblioteca"

---

### Requirement: Placeholder views

Each route SHALL render a placeholder view.

#### Scenario: Placeholder shows page name

GIVEN I navigate to `/stats`
WHEN the view loads
THEN the empty state component is displayed with the Stats icon and title "Stats"

---

### Requirement: Build and tooling

All tooling checks SHALL pass after scaffolding is complete.

#### Scenario: Type-check passes

GIVEN all scaffolding files are in place
WHEN I run `npm run type-check`
THEN zero TypeScript errors are reported

#### Scenario: Lint passes

GIVEN all scaffolding files are in place
WHEN I run `npm run lint`
THEN zero ESLint errors are reported

#### Scenario: Format check passes

GIVEN all scaffolding files are in place
WHEN I run `npm run format:check`
THEN zero formatting issues are reported

#### Scenario: Production build succeeds

GIVEN all scaffolding files are in place
WHEN I run `npm run build`
THEN the build completes with zero errors
