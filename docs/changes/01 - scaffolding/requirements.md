---
id: R-01
title: App Scaffolding
status: draft
type: infrastructure
importance: critical
tags: [routing, layout, navigation, ui-primitives, dx]
---

## Intent

Establish the app shell — routing, responsive navigation, layout structure, and reusable UI primitives — so that every subsequent feature plugs into a working skeleton with consistent navigation, error handling, and feedback mechanisms.

## Context & Background

### Problem Statement

The project has a fully configured build pipeline and tooling (phase 00) but renders a blank dark screen. There is no routing, no navigation, no layout structure, and no shared UI components. Before any feature can be built, the app needs a navigable shell with the foundational components that every screen will use.

### Dependencies

- Phase 00 (Setup) must be complete — Vue 3, Vite, TypeScript, Tailwind v4, vue-i18n, lucide-vue-next all installed
- `vue-router@^4` must be added as a new dependency
- `@vue/test-utils@^2` must be added as a dev dependency (for component tests)

### User Stories

- **As a developer**, I want a navigable app shell with routing, layout, and navigation so that every subsequent feature plugs into a consistent skeleton.
- **As a user**, I want clear navigation between sections (Home, Calendar, Library, Settings) so that I can move through the app intuitively.
- **As a developer**, I want reusable UI primitives (toast, modal, empty state, skeleton, error boundary) available from day one so that feature work can focus on business logic rather than boilerplate.

## Decisions

| Decision                   | Choice                                  | Rationale                                                                                                                                                                            |
| :------------------------- | :-------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nav items                  | Home, Calendar, Library, Settings       | **Known deviation from UI/UX doc:** The UI/UX doc lists 5 primary nav items including Recommendations (position 2, between Home and Calendar). Recommendations is intentionally deferred to its own feature phase because it has no backing data or functionality at this stage. When added, it will be inserted at index 1 per the UI/UX doc order. Stats excluded from primary nav per UI/UX doc — accessed via internal link on Library screen. |
| Router history mode        | `createWebHistory()`                    | Clean URLs without hash fragments. Firebase SPA rewrite already handles fallback.                                                                                                    |
| Composable state pattern   | Module-level singleton                  | Toast and modal composables use module-level reactive state so they work both inside and outside component `setup()` (needed for the global error handler).                          |
| Desktop-first responsive   | `max-md:` breakpoints                   | Per conventions §10. Base styles target desktop; `max-md:` overrides adapt for mobile.                                                                                               |
| Transition CSS in main.css | Global CSS exception                    | Vue `<Transition>` requires class-based CSS. Centralizing in `main.css` avoids duplication. Acknowledged exception to the "Tailwind only" rule.                                      |
| Home route matching        | Exact match only                        | Prevents the Home nav item from appearing active on every route.                                                                                                                     |
| Testing approach           | Unit + component tests (Vitest + jsdom) | Vitest already configured with jsdom. Unit tests for composables and router logic; component tests for UI components using `@vue/test-utils`.                                        |
| Test file convention       | Dedicated `tests/` folder               | Tests live in a root `tests/` folder mirroring `src/` structure, per conventions §7 and testing.md. Keeps source tree clean and aligns with vitest config.                           |

## Scope

**In scope:**

- Vue Router configuration with lazy-loaded routes and catch-all redirect
- App shell layout (sidebar + content area)
- Desktop sidebar navigation with 4 items
- Mobile bottom navigation bar (below `md` breakpoint)
- Active route highlighting in both nav components
- Page header bar showing the current page name
- Route fade transitions (200ms)
- Document title updates per route via i18n
- Scroll-to-top on navigation
- Toast notification system (composable + container)
- Modal/dialog component (composable + component)
- Empty state component
- Skeleton loader component
- Error boundary component
- Global error handler routed to toast
- i18n keys for navigation, page titles, and UI primitives (en/es/fr)
- 4 placeholder views using the empty state component
- Unit tests for router configuration and composables
- Component tests for all UI primitives and navigation components
- Component tests for placeholder views

**Out of scope:**

- Actual feature content for any screen
- Additional routes beyond the 4 nav items (movie/:id, show/:id, stats, recommendations)
- Search bar
- Collapsible sidebar
- Tooltip component
- Theme switching (light/dark toggle)
- Authentication or navigation guards beyond catch-all

## Functional Requirements

| ID    | Requirement                | Description                                                                                                                                                                                                                                                                                                               | Priority |
| :---- | :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| SC-01 | Vue Router setup           | `vue-router@^4` installed; `@vue/test-utils@^2` installed as dev dependency. `createWebHistory()`, router registered in `main.ts`. Routes defined in `src/presentation/router.ts`.                                                                                                                                                                                          | P0       |
| SC-02 | Route definitions          | 4 named routes (home `/`, calendar `/calendar`, library `/library`, settings `/settings`) plus catch-all `/:pathMatch(.*)*` redirecting to `/`.                                                                                                                                                                           | P0       |
| SC-03 | Route lazy loading         | All 4 view components loaded via dynamic `import()` for code splitting.                                                                                                                                                                                                                                                   | P0       |
| SC-04 | App shell layout           | Flexbox layout with fixed sidebar on the left and scrollable content area on the right. Sidebar hidden below `md`, bottom nav shown instead.                                                                                                                                                                              | P0       |
| SC-05 | Desktop sidebar            | Fixed left panel (`w-56`, dark background), app title at top, 4 nav items as `<RouterLink>` elements with lucide icons and translated labels.                                                                                                                                                                             | P0       |
| SC-06 | Mobile bottom nav          | Fixed bottom bar visible below `md` breakpoint. Same 4 nav items with icons. `z-10` stacking above content, below modals/toasts.                                                                                                                                                                                          | P0       |
| SC-07 | Active route highlighting  | Active nav item highlighted with accent color (left border + background tint in sidebar, accent-colored icon/text in bottom nav). Home route uses exact matching.                                                                                                                                                                    | P0       |
| SC-08 | Page header                | Sticky header at the top of the content area showing the current page name, translated via route `meta.titleKey`.                                                                                                                                                                                                         | P0       |
| SC-09 | Route transitions          | `<Transition name="fade" mode="out-in">` wrapping `<RouterView>`. 200ms opacity fade between views. Respects `prefers-reduced-motion`.                                                                                                                                                                                    | P1       |
| SC-10 | Document title             | `router.afterEach` guard sets `document.title` to `${t(meta.titleKey)} — ${t('app.title')}`.                                                                                                                                                                                                                                   | P1       |
| SC-11 | Scroll-to-top              | Router `scrollBehavior` returns `{ top: 0 }` on every navigation.                                                                                                                                                                                                                                                         | P1       |
| SC-12 | i18n keys                  | Navigation labels (`nav.*`), page titles (`page.*.title`), empty state text (`common.empty.*`), error text (`common.error.*`), and toast labels (`toast.*`) added to en.json, es.json, fr.json.                                                                                                                           | P0       |
| SC-13 | Toast notification system  | `useToast()` composable with module-level reactive state. `addToast(options)` pushes a toast (options: `{ message, type, action?: { label: string, handler: () => void } }`) with auto-dismiss after `TOAST_DISMISS_MS` (default 4000ms, from `src/domain/constants.ts`). `removeToast(id)` removes it. Toast types: error (error color), success (success color), info (accent color).                                                                                                               | P0       |
| SC-14 | Toast container            | Fixed top-right container (`z-50`) rendering the toast queue with `<TransitionGroup>` (slide in from the right into the top-right position, fade-out on dismiss). Each toast has dismiss button and optional action button. Maximum 5 simultaneous toasts; when exceeded, the oldest toast is evicted.                                                                | P0       |
| SC-15 | Modal/dialog               | `useModal()` composable (single-instance). `modal-dialog.vue` with backdrop (`bg-black/50`), centered content card, title, optional body, confirm/cancel buttons. Closes on backdrop click and Escape key. Opening a new modal while one is active replaces the current modal.                                              | P1       |
| SC-16 | Empty state component      | Centered layout with optional lucide icon, title (white bold), description (muted), optional CTA (call-to-action) button. Props: `icon` (Component, optional), `title` (string), `description` (string, optional), `ctaLabel` (string, optional), `ctaAction` (() => void, optional).                                                                                                                                                                                  | P0       |
| SC-17 | Skeleton loader            | Reusable shimmer placeholder. Props: `width` (string, default `'100%'`), `height` (string, default `'1rem'`), `rounded` (string, default `'rounded-md'`). Renders a div with `animate-pulse bg-surface`.                                                                                                                  | P1       |
| SC-18 | Error boundary             | `onErrorCaptured` wrapper component. Normal state: renders slot. Error state: centered fallback with translated heading, description, and reload button (calls `window.location.reload()`). The error boundary returns `false` from `onErrorCaptured` to prevent propagation to the global error handler (SC-19), since the boundary already handles the error visually. | P0       |
| SC-19 | Global error handler       | `app.config.errorHandler` in `main.ts` logs errors and dispatches an error toast via `useToast()`.                                                                                                                                                                                                                        | P0       |
| SC-20 | Placeholder views          | 4 view components (one per route), each rendering `<EmptyState>` with the page's lucide icon and translated title.                                                                                                                                                                                                        | P0       |
| SC-21 | Tailwind theme additions   | Add `--color-success: #22c55e` and `--color-error: #ef4444` to the `@theme` block for toast type accents. Note: these colors target the current dark theme only; light-theme counterparts will be added in the future theme-switching feature phase. | P1       |
| SC-22 | Router unit tests          | Tests for route definitions (4 named routes + catch-all), `scrollBehavior` returning `{ top: 0 }`, and `afterEach` guard setting `document.title`.                                                                                                                                                                        | P0       |
| SC-23 | Composable unit tests      | `useToast`: add/remove toast, auto-dismiss after timeout, toast types. `useModal`: open/close state, confirm/cancel callbacks.                                                                                                                                                                                            | P0       |
| SC-24 | UI primitive tests         | Component tests for EmptyState (renders icon/title/description/CTA props), SkeletonLoader (renders with width/height/rounded props), ErrorBoundary (renders slot normally, shows fallback on error), ToastContainer (renders toast queue), ModalDialog (renders title/body/buttons, closes on backdrop click and Escape). | P0       |
| SC-25 | Navigation component tests | Sidebar and BottomNav render all 4 nav items with correct icons and labels. Active route item is highlighted. Home route uses exact matching.                                                                                                                                                                             | P0       |
| SC-26 | Placeholder view tests     | Each of the 4 view components renders an `<EmptyState>` with the expected icon and translated title.                                                                                                                                                                                                                      | P1       |
| SC-27 | Test infrastructure setup  | Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, and `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block. Create `tests/setup.ts` with `localStorage.clear()` in `beforeEach`.                                                                                     | P0       |

## Non-Functional Requirements

### Responsive Design

- **Desktop-first:** Base styles target desktop (`md+`). Mobile overrides use `max-md:` breakpoints.
- **Breakpoint behavior:** Below `md` (768px): sidebar hidden, bottom nav visible, single-column content. At `md` and above: sidebar visible, bottom nav hidden.
- **Touch targets:** All nav items and buttons meet the 44x44px minimum on mobile.

### Transitions & Animation

- **Route fade:** 200ms opacity transition, `ease-in-out`.
- **Toast enter/leave:** Slide from right on enter, fade on leave.
- **Modal:** Fade backdrop + slight scale-up for content card.
- **Motion sensitivity:** All transitions disabled when `prefers-reduced-motion` is set.
- **Duration cap:** No transition exceeds 300ms.

### Architecture Compliance

- **Layer boundaries:** All new files live in `src/presentation/` (components, composables, views, router). **Proposed architectural exception:** toast and modal composables live in `src/presentation/composables/` rather than `src/application/` because they manage UI-only state with no domain or infrastructure dependencies. This introduces a `composables/` subdirectory under `src/presentation/` not currently defined in `architecture.md` — architecture.md should be updated to acknowledge that purely UI-state composables may reside in the Presentation layer. Exceptions: `src/domain/constants.ts` is created in this phase with `TOAST_DISMISS_MS` only (additional constants defined in `data-model.md` will be added in their respective feature phases), and `src/assets/main.css` is modified for theme additions and transition CSS.
- **i18n mandatory:** All user-facing strings use `$t()` or `useI18n()`.
- **SFC block order:** `<script setup>` then `<template>` then `<style>` (rare).
- **File naming:** kebab-case for all component and composable files.
- **Tailwind only:** No inline styles. Exception: fade transition CSS in `main.css` (required by Vue `<Transition>`).

### Testing

- **Framework:** Vitest with jsdom environment. Additional configuration required this phase: `globals: true`, `include`, `setupFiles`, and `tests/setup.ts`.
- **Test types:** Unit tests for composables and router logic; component tests for Vue components using `@vue/test-utils`.
- **File naming:** `*.test.ts` files in a dedicated `tests/` folder at the project root, mirroring the `src/` directory structure.
- **Coverage target:** All composables and all components introduced in this phase must have tests.
- **CI integration:** `npm run check` (format, lint, type-check, test, build) must pass with zero failures.

### Performance

- **Initial load:** The main bundle (before lazy-loaded route chunks) should remain under 150 KB gzipped, establishing a baseline before feature code is added.
- **Lazy chunks:** Each route's lazy-loaded chunk should remain under 20 KB gzipped.

### Stacking Order

- Page content: default (`z-0`)
- Bottom nav: `z-10`
- Modal backdrop: `z-40`
- Modal content card: `z-40` (same layer as backdrop; stacks above via DOM order)
- Toast container: `z-50` (renders above modals — toasts remain visible when a modal is open)

## Acceptance Criteria

- [ ] `npm run dev` starts and renders the app shell with sidebar navigation (desktop)
- [ ] Resizing below 768px hides sidebar and shows bottom navigation bar
- [ ] Clicking each of the 4 nav items navigates to the corresponding placeholder view
- [ ] Active nav item is highlighted with accent color in both sidebar and bottom nav
- [ ] Page header displays the translated name of the current page
- [ ] Page header remains visible (sticky) at the top of the content area when scrolling
- [ ] Document title updates to `"{Page Name} — {App Name}"` pattern on navigation (using i18n for both parts)
- [ ] Route transitions fade in/out at 200ms
- [ ] When `prefers-reduced-motion` is enabled, all transitions and animations are disabled (route fade, toast slide, modal fade)
- [ ] Navigating to `/nonexistent` redirects to `/`
- [ ] Page scrolls to top on every route change
- [ ] Toast can be triggered programmatically and auto-dismisses after ~4 seconds
- [ ] When more than 5 toasts are active, the oldest toast is evicted to maintain the maximum of 5
- [ ] Modal can be opened and closed via composable, backdrop click, and Escape key
- [ ] Unhandled errors trigger an error toast
- [ ] Error boundary catches component errors and shows fallback UI with reload button
- [ ] `npm run test` passes with zero failures
- [ ] Router configuration has unit tests covering route definitions, catch-all redirect, scroll behavior, and document title
- [ ] `useToast` and `useModal` composables have unit tests
- [ ] All UI primitive components (EmptyState, SkeletonLoader, ErrorBoundary, ToastContainer, ModalDialog) have component tests
- [ ] Sidebar and BottomNav components have component tests covering rendering and active state
- [ ] Each placeholder view has a component test
- [ ] Tailwind theme includes `--color-success` and `--color-error` custom colors in `main.css` `@theme` block (SC-21)
- [ ] en.json, es.json, and fr.json contain all required i18n key namespaces: `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*` (SC-12)
- [ ] Opening a second modal replaces the first — single-instance behavior (SC-15)
- [ ] `npm run check` passes — full pipeline (format, lint:fix, type-check, test, build)

## Constraints

- **Runtime dependencies:** No new runtime dependencies beyond `vue-router@^4`. All other tools (Tailwind, vue-i18n, lucide-vue-next) are already installed from Phase 00.
- **Dev dependencies:** `@vue/test-utils@^2` is the only new dev dependency.
- **Browser targets:** Modern evergreen browsers only, per tech-stack.md.
- **No server-side changes:** Client-only; no Firebase functions or server config beyond the existing SPA rewrite.

## Risks & Assumptions

### Risks

- **Firebase SPA fallback:** `createWebHistory()` requires the server to return `index.html` for all routes. If Firebase SPA rewrite is not configured, direct navigation or page refresh on any non-root route will 404. **Mitigation:** Verify Firebase `hosting.rewrites` configuration from Phase 00.
- **Vitest config gap:** The existing `vitest.config.ts` only sets `environment: 'jsdom'`. Missing settings (`globals`, `include`, `setupFiles`) must be added before tests will run correctly. **Mitigation:** Addressed as the first step in the implementation plan.
- **Transition duration cap enforcement:** The NFR caps transitions at 300ms, but toast enter (slide from right) may feel rushed at 200ms. **Mitigation:** Toast transitions use up to 300ms; verify UX during manual testing.

### Assumptions

- Phase 00 (Setup) is complete and all listed dependencies are installed and working.
- The `@theme` block in `main.css` supports custom color additions without conflicts.
- `vue-i18n` global instance is accessible via `i18n.global.t()` outside component `setup()` for the global error handler and router guard.
- `app.title` i18n key already exists in locale files from Phase 00.
