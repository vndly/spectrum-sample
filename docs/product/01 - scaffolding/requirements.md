---
id: R-01
title: App Scaffolding
status: todo
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

## Decisions

| Decision                   | Choice                                   | Rationale                                                                                                                                                     |
| :------------------------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nav items                  | Home, Library, Stats, Calendar, Settings | User-defined scope for this phase. Differs from UI/UX doc (which has Recommendations instead of Stats). Recommendations route will be added with its feature. |
| Router history mode        | `createWebHistory()`                     | Clean URLs without hash fragments. Firebase SPA rewrite already handles fallback.                                                                             |
| Composable state pattern   | Module-level singleton                   | Toast and modal composables use module-level reactive state so they work both inside and outside component `setup()` (needed for the global error handler).   |
| Desktop-first responsive   | `max-md:` breakpoints                    | Per conventions §10. Base styles target desktop; `max-md:` overrides adapt for mobile.                                                                        |
| Transition CSS in main.css | Global CSS exception                     | Vue `<Transition>` requires class-based CSS. Centralizing in `main.css` avoids duplication. Acknowledged exception to the "Tailwind only" rule.               |
| Home route matching        | Exact match only                         | Prevents the Home nav item from appearing active on every route.                                                                                              |
| Testing approach           | Unit + component tests (Vitest + jsdom)  | Vitest already configured with jsdom. Unit tests for composables and router logic; component tests for UI components using `@vue/test-utils`.                 |
| Test file convention       | Co-located `*.test.ts` files             | Tests live next to the source files they cover (e.g., `use-toast.test.ts` beside `use-toast.ts`). Keeps related code together and simplifies imports.        |

## Scope

**In scope:**

- Vue Router configuration with lazy-loaded routes and catch-all redirect
- App shell layout (sidebar + content area)
- Desktop sidebar navigation with 5 items
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
- 5 placeholder views using the empty state component
- Unit tests for router configuration and composables
- Component tests for all UI primitives and navigation components
- Component tests for placeholder views

**Out of scope:**

- Actual feature content for any screen
- Additional routes beyond the 5 nav items (movie/:id, show/:id, recommendations)
- Search bar
- Collapsible sidebar
- Tooltip component
- Theme switching (light/dark toggle)
- Authentication or navigation guards beyond catch-all

## Functional Requirements

| ID    | Requirement               | Description                                                                                                                                                                                                 | Priority |
| :---- | :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-01 | Vue Router setup          | `vue-router@^4` installed, `createWebHistory()`, router registered in `main.ts`. Routes defined in `src/presentation/router.ts`.                                                                            | P0       |
| SC-02 | Route definitions         | 5 named routes (home `/`, library `/library`, stats `/stats`, calendar `/calendar`, settings `/settings`) plus catch-all `/:pathMatch(.*)*` redirecting to `/`.                                             | P0       |
| SC-03 | Route lazy loading        | All 5 view components loaded via dynamic `import()` for code splitting.                                                                                                                                     | P0       |
| SC-04 | App shell layout          | Flexbox layout with fixed sidebar on the left and scrollable content area on the right. Sidebar hidden below `md`, bottom nav shown instead.                                                                | P0       |
| SC-05 | Desktop sidebar           | Fixed left panel (`w-56`, dark background), app title at top, 5 nav items as `<RouterLink>` elements with lucide icons and translated labels.                                                               | P0       |
| SC-06 | Mobile bottom nav         | Fixed bottom bar visible below `md` breakpoint. Same 5 nav items with icons. `z-10` stacking above content, below modals/toasts.                                                                            | P0       |
| SC-07 | Active route highlighting | Active nav item highlighted with teal accent (left border + background tint in sidebar, teal icon/text in bottom nav). Home route uses exact matching.                                                      | P0       |
| SC-08 | Page header               | Sticky header at the top of the content area showing the current page name, translated via route `meta.titleKey`.                                                                                           | P0       |
| SC-09 | Route transitions         | `<Transition name="fade" mode="out-in">` wrapping `<RouterView>`. 200ms opacity fade between views. Respects `prefers-reduced-motion`.                                                                      | P1       |
| SC-10 | Document title            | `router.afterEach` guard sets `document.title` to `${t(meta.titleKey)} — Plot Twisted`.                                                                                                                     | P1       |
| SC-11 | Scroll-to-top             | Router `scrollBehavior` returns `{ top: 0 }` on every navigation.                                                                                                                                           | P1       |
| SC-12 | i18n keys                 | Navigation labels (`nav.*`), page titles (`page.*.title`), empty state text (`common.empty.*`), error text (`common.error.*`), and toast labels (`toast.*`) added to en.json, es.json, fr.json.             | P0       |
| SC-13 | Toast notification system | `useToast()` composable with module-level reactive state. `addToast(options)` pushes a toast with auto-dismiss (~4s). `removeToast(id)` removes it. Toast types: error (red), success (green), info (teal). | P0       |
| SC-14 | Toast container           | Fixed top-right container (`z-50`) rendering the toast queue with `<TransitionGroup>` (slide-in from right, fade-out). Each toast has dismiss button and optional action button.                            | P0       |
| SC-15 | Modal/dialog              | `useModal()` composable (single-instance). `modal-dialog.vue` with backdrop (`bg-black/50`), centered content card, title, optional body, confirm/cancel buttons. Closes on backdrop click and Escape key.  | P1       |
| SC-16 | Empty state component     | Centered layout with optional lucide icon, title (white bold), description (muted), optional CTA. Props: `icon`, `title`, `description`.                                                                    | P0       |
| SC-17 | Skeleton loader           | Reusable shimmer placeholder. Props: `width`, `height`, `rounded`. Renders a div with `animate-pulse bg-surface`.                                                                                           | P1       |
| SC-18 | Error boundary            | `onErrorCaptured` wrapper component. Normal state: renders slot. Error state: centered fallback with translated heading, description, and reload button.                                                    | P0       |
| SC-19 | Global error handler      | `app.config.errorHandler` in `main.ts` logs errors and dispatches an error toast via `useToast()`.                                                                                                          | P0       |
| SC-20 | Placeholder views         | 5 view components (one per route), each rendering `<EmptyState>` with the page's lucide icon and translated title.                                                                                          | P0       |
| SC-21 | Tailwind theme additions  | Add `--color-success: #22c55e` and `--color-error: #ef4444` to the `@theme` block for toast type accents.                                                                                                   | P1       |
| SC-22 | Router unit tests         | Tests for route definitions (5 named routes + catch-all), `scrollBehavior` returning `{ top: 0 }`, and `afterEach` guard setting `document.title`.                                                          | P0       |
| SC-23 | Composable unit tests     | `useToast`: add/remove toast, auto-dismiss after timeout, toast types. `useModal`: open/close state, confirm/cancel callbacks.                                                                               | P0       |
| SC-24 | UI primitive tests        | Component tests for EmptyState (renders icon/title/description/CTA props), SkeletonLoader (renders with width/height/rounded props), ErrorBoundary (renders slot normally, shows fallback on error), ToastContainer (renders toast queue), ModalDialog (renders title/body/buttons, closes on backdrop click and Escape). | P0       |
| SC-25 | Navigation component tests | Sidebar and BottomNav render all 5 nav items with correct icons and labels. Active route item is highlighted. Home route uses exact matching.                                                                | P0       |
| SC-26 | Placeholder view tests    | Each of the 5 view components renders an `<EmptyState>` with the expected icon and translated title.                                                                                                         | P1       |

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

- **Layer boundaries:** All new files live in `src/presentation/` (components, composables, views, router). No application/domain/infrastructure changes.
- **i18n mandatory:** All user-facing strings use `$t()` or `useI18n()`.
- **SFC block order:** `<script setup>` then `<template>` then `<style>` (rare).
- **File naming:** kebab-case for all component and composable files.
- **Tailwind only:** No inline styles. Exception: fade transition CSS in `main.css` (required by Vue `<Transition>`).

### Testing

- **Framework:** Vitest with jsdom environment (already configured).
- **Test types:** Unit tests for composables and router logic; component tests for Vue components using `@vue/test-utils`.
- **File naming:** `*.test.ts` files co-located next to the source file they cover.
- **Coverage target:** All composables and all components introduced in this phase must have tests.
- **CI integration:** `npm run test` must pass with zero failures as part of the `npm run check` pipeline.

### Stacking Order

- Page content: default (`z-0`)
- Bottom nav: `z-10`
- Toast container: `z-50`
- Modal backdrop: `z-50`

## Acceptance Criteria

- [ ] `npm run dev` starts and renders the app shell with sidebar navigation (desktop)
- [ ] Resizing below 768px hides sidebar and shows bottom navigation bar
- [ ] Clicking each of the 5 nav items navigates to the corresponding placeholder view
- [ ] Active nav item is highlighted with teal accent in both sidebar and bottom nav
- [ ] Page header displays the translated name of the current page
- [ ] Document title updates to `"{Page Name} — Plot Twisted"` on navigation
- [ ] Route transitions fade in/out at 200ms
- [ ] Navigating to `/nonexistent` redirects to `/`
- [ ] Page scrolls to top on every route change
- [ ] Toast can be triggered programmatically and auto-dismisses after ~4 seconds
- [ ] Modal can be opened and closed via composable, backdrop click, and Escape key
- [ ] Unhandled errors trigger an error toast
- [ ] Error boundary catches component errors and shows fallback UI with reload button
- [ ] `npm run test` passes with zero failures
- [ ] Router configuration has unit tests covering route definitions, catch-all redirect, scroll behavior, and document title
- [ ] `useToast` and `useModal` composables have unit tests
- [ ] All UI primitive components (EmptyState, SkeletonLoader, ErrorBoundary, ToastContainer, ModalDialog) have component tests
- [ ] Sidebar and BottomNav components have component tests covering rendering and active state
- [ ] Each placeholder view has a component test
- [ ] `npm run type-check` reports zero TypeScript errors
- [ ] `npm run lint` reports zero ESLint errors
- [ ] `npm run format:check` reports zero formatting issues
- [ ] `npm run build` produces a successful production build
