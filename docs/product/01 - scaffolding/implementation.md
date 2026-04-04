# Implementation: App Scaffolding

## Overview

This implementation covers the foundational scaffolding layers for the application. It installs the two remaining runtime and dev dependencies (`vue-router`, `@vue/test-utils`), configures the Vitest test infrastructure, and adds 18 i18n keys across 5 namespaces to all three locale files. It also establishes the visual foundation with Tailwind theme color tokens for success/error states, Vue `<Transition>` CSS classes for route fades, toast notifications, and modal dialogs, a `prefers-reduced-motion` override for accessibility, and the `TOAST_DISMISS_MS` domain constant. All CSS is centralized in `src/assets/main.css` as an acknowledged exception to the Tailwind-only rule, since Vue's `<Transition>` component requires class-based CSS.

Configured Vue Router with 8 lazy-loaded routes, a catch-all redirect, scroll-to-top behavior, and i18n-based document title updates. The router uses `createWebHistory()` for clean URLs and is registered in `main.ts` after the i18n plugin. An `afterEach` guard sets `document.title` using the i18n instance's `t()` function, reading each route's `meta.titleKey` to produce translated page titles in the format `"Page Title — Plot Twisted"`. The route view files in `src/presentation/views/` were introduced early to satisfy Vite's import analysis and are now implemented as `EmptyState`-based screens for all 8 routes. Numeric ID validation guards protect detail routes (`/movie/:id` and `/show/:id`) from invalid inputs by redirecting non-numeric IDs to the home route.

Created two reusable UI primitives — `SkeletonLoader` and `EmptyState` — in the Presentation layer's `common/` directory, following a test-first approach. Both components are stateless, translation-agnostic primitives that receive all content via props.

Created the `ToastContainer` and `ModalDialog` overlay components that render the toast queue and modal state managed by the composables. The toast container renders a queue of notifications in the top-right corner with type-colored borders, dismiss buttons, and optional action buttons. The modal dialog renders a centered confirmation dialog with backdrop overlay, title, optional content, and confirm/cancel buttons with i18n-driven default labels.

Implemented the `useToast` and `useModal` composables as module-level singleton reactive state managers for toast notifications and modal dialogs. Both composables live in `src/presentation/composables/` — a new directory in the Presentation layer for UI-only state composables that have no domain or infrastructure dependencies. The module-level pattern ensures both composables work outside Vue component `setup()`, which is required by the global error handler (01h). Unit tests were written test-first in `tests/presentation/composables/`, covering all functional requirements. Architecture and reference documentation was updated to reflect the new `composables/` directory and the distinction between Application-layer and Presentation-layer composables.

Added an `ErrorBoundary` presentation component and wired it around the routed application content in `src/App.vue`. The boundary catches descendant render/setup errors, replaces the normal UI with a translated full-screen fallback state, exposes a reload action, and returns `false` from `onErrorCaptured` so handled crashes do not propagate.

`src/main.ts` now also registers `app.config.errorHandler` after plugin setup. Uncaught Vue component/render errors outside the boundary are logged to `console.error` and dispatched to the shared toast queue with `i18n.global.t('toast.error')`, giving the scaffolded shell a documented recovery path for unexpected failures.

The navigation-components phase extends that scaffold with the structural navigation UI: a fixed desktop sidebar, a mobile bottom navigation bar, and a sticky page header driven by each route's `meta.titleKey`. The implementation stayed presentation-only, reused the existing `nav.*`, `page.*.title`, and `app.title` locale keys, and verified exact-match Home-route highlighting plus responsive visibility and touch-target behavior through dedicated component tests. Recommendations was added as the fifth primary nav item between Home and Calendar with the `Compass` icon.

The placeholder-view phase upgrades all 8 routed screens to render `EmptyState` with the mapped Lucide icons (`House`, `Compass`, `CalendarDays`, `Bookmark`, `Settings`, `ChartColumn`, `Film`, `Tv`) and the shared translated `common.empty.title` plus `common.empty.description` copy. Dedicated component tests verify both English and French output so the canonical scaffold now covers the routed placeholder UI rather than temporary stub content.

The final shell-assembly phase composes those released pieces in `src/presentation/components/layout/app-shell.vue` and updates `src/App.vue` so the routed experience boots through `ErrorBoundary` and `AppShell`. The assembled shell now combines the fixed desktop sidebar, mobile bottom nav, sticky page header, routed content outlet, shared fade transition contract, toast container, and modal dialog in one recoverable scaffold.

## Files Changed

### Created

- `tests/setup.ts` — Test setup file loaded by Vitest before each test run. Includes `/// <reference types="vitest/globals" />` for TypeScript global recognition and `localStorage.clear()` in `beforeEach` to prevent state leakage between tests.
- `tests/presentation/i18n/locale-keys.test.ts` — Unit test validating locale file structure: key parity across all three locales, non-empty string values, expected 19-key set, `app.title` preservation, and camelCase segment compliance (NFR-01b-01).
- `src/domain/constants.ts` — Exports `TOAST_DISMISS_MS = 4000`, the auto-dismiss timeout for toast notifications. Located in the Domain layer as a pure TypeScript constant consumed by downstream composables (R-01e) and components (R-01g).
- `tests/domain/constants.test.ts` — Unit tests verifying `TOAST_DISMISS_MS` is exported with value `4000` and is of type `number`.
- `src/presentation/router.ts` — Router configuration with `createWebHistory()`, 8 named routes with lazy-loaded components, catch-all redirect, `scrollBehavior` returning `{ top: 0 }`, `RouteMeta` module augmentation for `titleKey`, `afterEach` guard setting `document.title` via i18n, and `numericIdGuard` for detail routes.
- `tests/presentation/router.test.ts` — Unit tests covering route definitions (8 routes), catch-all redirect, lazy loading verification, `meta.titleKey` per route, scroll behavior, document title updates via i18n mock, and numeric ID guard behavior.
- `src/presentation/views/home-screen.vue` — Home route view, introduced as a router stub and upgraded to render `EmptyState` with the `House` icon plus shared translated placeholder copy.
- `src/presentation/views/calendar-screen.vue` — Calendar route view, introduced as a router stub and upgraded to render `EmptyState` with the `CalendarDays` icon plus shared translated placeholder copy.
- `src/presentation/views/library-screen.vue` — Library route view, introduced as a router stub and upgraded to render `EmptyState` with the `Bookmark` icon plus shared translated placeholder copy.
- `src/presentation/views/settings-screen.vue` — Settings route view, introduced as a router stub and upgraded to render `EmptyState` with the `Settings` icon plus shared translated placeholder copy.
- `tests/presentation/views/home-screen.test.ts` — Component tests covering English and French placeholder rendering for the Home route.
- `tests/presentation/views/calendar-screen.test.ts` — Component tests covering English and French placeholder rendering for the Calendar route.
- `tests/presentation/views/library-screen.test.ts` — Component tests covering English and French placeholder rendering for the Library route.
- `tests/presentation/views/settings-screen.test.ts` — Component tests covering English and French placeholder rendering for the Settings route.
- `src/presentation/views/recommendations-screen.vue` — Placeholder view for `/recommendations` using `EmptyState` with `Compass` icon.
- `src/presentation/views/stats-screen.vue` — Placeholder view for `/stats` using `EmptyState` with `ChartColumn` icon.
- `src/presentation/views/movie-screen.vue` — Placeholder view for `/movie/:id` using `EmptyState` with `Film` icon.
- `src/presentation/views/show-screen.vue` — Placeholder view for `/show/:id` using `EmptyState` with `Tv` icon.
- `tests/presentation/views/recommendations-screen.test.ts` — Component tests for RecommendationsScreen.
- `tests/presentation/views/stats-screen.test.ts` — Component tests for StatsScreen.
- `tests/presentation/views/movie-screen.test.ts` — Component tests for MovieScreen.
- `tests/presentation/views/show-screen.test.ts` — Component tests for ShowScreen.
- `src/presentation/composables/use-toast.ts` — Toast notification composable with `addToast()`, `removeToast()`, auto-dismiss timers, and `MAX_VISIBLE_TOASTS` eviction.
- `src/presentation/composables/use-modal.ts` — Modal dialog composable with `open()`, `close()`, single-instance replacement, and callback storage.
- `tests/presentation/composables/use-toast.test.ts` — 13 unit tests covering add, remove, auto-dismiss, eviction, timer cleanup, type variants, and ID uniqueness.
- `tests/presentation/composables/use-modal.test.ts` — 8 unit tests covering open, close, replacement, callback storage, label storage, and no-op close.
- `src/presentation/components/common/skeleton-loader.vue` — Shimmer placeholder with configurable `width`, `height`, and `rounded` props. Renders a single `<div>` with `animate-pulse bg-surface` and `aria-hidden="true"`.
- `src/presentation/components/common/empty-state.vue` — Centered empty state layout with optional icon (dynamic `<component :is>`), required title, optional description, and optional CTA button. CTA renders only when both `ctaLabel` and `ctaAction` are provided.
- `tests/presentation/components/common/skeleton-loader.test.ts` — 3 tests covering SC-17-01, SC-17-02, SC-17-03, and SC-24-02.
- `tests/presentation/components/common/empty-state.test.ts` — 7 tests covering SC-16-01 through SC-16-06, SC-24-01, and the implementation-detail case (ctaAction without ctaLabel).
- `src/presentation/components/common/toast-container.vue` — Fixed top-right container (`z-50`) rendering the toast queue with `<TransitionGroup name="toast">`. Each toast displays a type-colored left border (`border-l-error`, `border-l-success`, `border-l-accent`), message text, optional action button, and dismiss button with X icon from lucide-vue-next.
- `src/presentation/components/common/modal-dialog.vue` — Modal overlay component with backdrop (`fixed inset-0 z-40 bg-black/50`) and centered content card. Uses `<Transition name="modal">` for enter/leave animations. Escape key listener is registered/unregistered via `watch` on `isOpen` state to avoid stale listeners.
- `tests/presentation/components/common/toast-container.test.ts` — Component test suite covering SC-14 scenarios: container positioning, toast stacking, dismiss button, type-colored borders, transition classes, auto-dismiss timing, i18n labels, and action button callbacks.
- `tests/presentation/components/common/modal-dialog.test.ts` — Component test suite covering SC-15 scenarios: backdrop click close, Escape key close, confirm/cancel callbacks, modal replacement, transition classes, i18n labels, and content card click propagation stop.
- `src/presentation/components/error/error-boundary.vue` — Error boundary component with translated fallback UI, `role="alert"`, and reload handling.
- `tests/presentation/components/error/error-boundary.test.ts` — Component tests for normal rendering, fallback UI, reload behavior, and propagation suppression.
- `tests/main.test.ts` — Bootstrap test that captures `app.config.errorHandler` and verifies console logging plus toast dispatch.
- `src/presentation/components/layout/sidebar-nav.vue` — Desktop sidebar component with localized branding, five primary links (Home, Recommendations, Calendar, Library, Settings), and exact-match active styling.
- `src/presentation/components/layout/bottom-nav.vue` — Mobile bottom navigation component with responsive visibility classes, five primary nav items, accent active state, and 44x44 touch-target classes.
- `src/presentation/components/layout/page-header.vue` — Sticky route-title header driven by `route.meta.titleKey`.
- `src/presentation/components/layout/app-shell.vue` — Shared shell component that assembles navigation chrome, routed content, fade transitions, and global overlays.
- `tests/presentation/components/layout/sidebar-nav.test.ts` — Component tests for structure, icon mapping, French labels, active state, and exact-match Home behavior.
- `tests/presentation/components/layout/bottom-nav.test.ts` — Component tests for route order, icon mapping, touch-target classes, active state, and exact-match Home behavior.
- `tests/presentation/components/layout/page-header.test.ts` — Component tests for translated titles, route updates, sticky classes, and Spanish output.
- `tests/presentation/components/layout/app-shell.test.ts` — Component tests for shell layout, route transitions, reduced-motion behavior, bottom-nav clearance, and overlay stacking.
- `tests/App.test.ts` — Root-assembly tests confirming `App.vue` renders the routed scaffold through `ErrorBoundary` and `AppShell`.

### Modified

- `package.json` — Added `vue-router@^5.0.4` to `dependencies` and `@vue/test-utils@^2.4.6` to `devDependencies`.
- `package-lock.json` — Updated lockfile reflecting the two new packages and their transitive dependencies (51 packages added total).
- `vitest.config.ts` — Added `globals: true`, `include: ['tests/**/*.test.ts']`, and `setupFiles: ['./tests/setup.ts']` to the existing `test: {}` block. Preserved the `mergeConfig(viteConfig, defineConfig(...))` pattern and `environment: 'jsdom'`.
- `docs/technical/testing.md` — Removed the `import { describe, it, expect } from 'vitest'` line from the code example in the "Test Pattern" section, aligning the documentation with the `globals: true` convention.
- `src/presentation/i18n/locales/en.json` — Added 21 English translation keys across 5 namespaces (18 original + 3 new page titles for stats/movie/show).
- `src/presentation/i18n/locales/es.json` — Added 21 Spanish translation keys across 5 namespaces.
- `src/presentation/i18n/locales/fr.json` — Added 21 French translation keys across 5 namespaces.
- `src/assets/main.css` — Added `--color-success: #22c55e` and `--color-error: #ef4444` to the existing `@theme` block. Added `.fade-*` transition classes (200ms opacity, ease-in-out), `.toast-*` transition classes (300ms enter with translateX slide + opacity, 200ms leave fade), `.modal-*` transition classes (200ms enter with scale + opacity, 150ms leave), and a `@media (prefers-reduced-motion: reduce)` block disabling all transitions and `animate-pulse` animation.
- `tsconfig.vitest.json` — Added `src/**/*` and `src/**/*.vue` to the `include` array so that test files can import source modules without TypeScript project boundary errors.
- `src/main.ts` — Registers the router after i18n and configures the global Vue error handler that logs uncaught component/render errors and dispatches translated error toasts via `useToast()`.
- `src/App.vue` — Boots the routed experience through `ErrorBoundary` and `AppShell` so the shared shell, overlays, and fallback UI render together at the root.
- `src/domain/constants.ts` — Added `MAX_VISIBLE_TOASTS = 5` constant.
- `docs/technical/architecture.md` — Added `composables/` to the Presentation-layer folder structure and description.
- `docs/technical/testing.md` — Added `tests/presentation/composables/` to the test directory tree example.
- `docs/technical/data-model.md` — Added `MAX_VISIBLE_TOASTS` to the constants table.
- `docs/reference/glossary.md` — Updated "Composable" entry to distinguish Application-layer and Presentation-layer composables.
- `src/presentation/i18n/locales/en.json` — Added `modal.confirm` and `modal.cancel` keys for default button labels.
- `src/presentation/i18n/locales/es.json` — Added Spanish translations: `modal.confirm: "Confirmar"`, `modal.cancel: "Cancelar"`.
- `src/presentation/i18n/locales/fr.json` — Added French translations: `modal.confirm: "Confirmer"`, `modal.cancel: "Annuler"`.
- `tests/presentation/i18n/locale-keys.test.ts` — Updated `EXPECTED_KEYS` array to include `modal.confirm`, `modal.cancel`, `page.stats.title`, `page.movie.title`, `page.show.title`; updated test description to reflect 24 keys.
- `tests/App.test.ts` — Updated to expect 5 nav items with Recommendations.

## Key Decisions

- **No `passWithNoTests` added during initial setup**: The original 01a setup kept Vitest defaults rather than changing config solely to accommodate an empty suite. Later scaffolding phases introduced the current passing test suite, so the configuration remains unchanged.
- **Flat JSON structure**: Locale files use flat dot-notation keys (e.g., `{ "nav.home": "Home" }`) with `flatJson: true` in the vue-i18n configuration. The `$t('nav.home')` calls work identically — vue-i18n resolves dot-separated paths in flat key maps when `flatJson` is enabled.
- **Test uses `fs.readFileSync`**: The test reads locale files directly from disk rather than importing them as modules. This provides explicit file existence validation and avoids potential interference from the `@intlify/unplugin-vue-i18n` Vite plugin that transforms locale files during build.
- **Theme colors appended to existing `@theme` block**: Kept all theme tokens in a single block rather than creating a separate one, maintaining the existing pattern established in R-00.
- **Modal leave duration at 150ms**: Intentionally below the UI/UX spec's 200–300ms guideline for a snappier leave feel, as documented in NFR-01c-05.
- **Placeholder view bootstrap**: Vite's `vite:import-analysis` plugin validates dynamic import targets at transform time, before Vitest's `vi.mock()` can intercept. The route views were bootstrapped as minimal stubs first, then upgraded to their canonical `EmptyState` implementations once the placeholder-view phase landed.
- **`router.options.routes` for lazy-loading test**: Used `router.options.routes` instead of `router.getRoutes()` to verify lazy-loaded component functions. Vue Router replaces lazy functions with resolved components in normalized route records after navigation, making `getRoutes()` unreliable when other tests navigate first.
- **`router.push()` for catch-all test**: `router.resolve()` does not follow redirects in Vue Router, so the catch-all redirect test uses `router.push()` and asserts on `router.currentRoute.value`.
- **Parameterless `scrollBehavior()`**: Removed unused `_to`, `_from`, `_savedPosition` parameters to satisfy ESLint `no-unused-vars` rule, since all parameters are ignored per SC-01d-11.
- **`_resetForTesting()` helper**: Both composables export a `_resetForTesting()` function (prefixed with underscore, marked `@internal`) to reset module-level singleton state between tests. This avoids test coupling from shared state leaking across tests.
- **`shallowRef` for modal props**: `use-modal.ts` uses `shallowRef` for the props ref because props are always replaced wholesale via `open()`, never mutated in place. This avoids unnecessary deep reactivity tracking.
- **Timer map for cleanup**: `use-toast.ts` tracks auto-dismiss timers in a `Map<string, ReturnType<typeof setTimeout>>` keyed by toast ID, ensuring `removeToast()` and eviction both properly clear timers to prevent leaked timeouts.
- **String IDs from incrementing counter**: Toast IDs use `String(nextId++)` for simplicity and uniqueness. The counter resets in `_resetForTesting()` for deterministic test behavior.
- **SkeletonLoader dimensions via inline style**: Used `:style="{ width, height }"` for dimensions since these are arbitrary user-provided values, not Tailwind utility classes. The `rounded` prop is applied via `:class` since it receives Tailwind class strings.
- **EmptyState CTA guard**: Button renders only when both `ctaLabel` and `ctaAction` are truthy (`v-if="ctaLabel && ctaAction"`), matching requirements that a label without an action or an action without a label should not show a button.
- **Optional prop defaults**: All optional props default to `undefined` rather than empty strings or no-ops, keeping the component's conditional rendering clean with simple truthiness checks.
- **Icon rendering**: Used Vue's dynamic `<component :is="icon">` for the icon prop, allowing consumers to pass any Vue component (e.g., lucide-vue-next icons).
- **Escape key handling via watch**: The modal registers and unregisters the document-level `keydown` listener using a `watch` on `isOpen` state, ensuring the listener is properly cleaned up when the modal closes and avoiding stale listener issues when the modal reopens.
- **Click propagation stop on content card**: The modal content card uses `@click.stop` to prevent clicks inside the card from bubbling to the backdrop. The backdrop uses `@click.self="close"` to only respond to direct clicks on itself.
- **Type-to-border-class mapping function**: Toast border colors are mapped via a `getBorderClass` function that returns Tailwind classes (`border-l-error`, `border-l-success`, `border-l-accent`) rather than inline styles, maintaining Tailwind-only styling convention.
- **Minimum touch targets**: Both dismiss and action buttons on toasts, as well as modal buttons, use `min-h-11` (44px) to meet the 44×44px touch target requirement from ui-ux.md § 11.
- `src/main.ts` continues to use the documented layer exception by importing `useToast()` and `i18n` directly so the global handler works outside component `setup()`.
- `ErrorBoundary` returns `false` from `onErrorCaptured`, which prevents propagation to the global handler and avoids double-handling crashes that already show the fallback UI.
- `ErrorBoundary` accepts an optional `reloadPage` callback with a production default of `window.location.reload()` so the required reload behavior remains directly testable in jsdom.
- Reused the existing route metadata and locale keys instead of adding new strings or router changes, which kept the navigation implementation inside the planned presentation scope.
- Duplicated the four-item nav definitions inside the sidebar and bottom-nav components rather than introducing a new shared module, because the approved plan did not authorize additional shared files outside the listed layout component paths.
- Used exact `route.path === '/'` matching for Home and exact path matching for the other scaffolded routes to prevent false-positive active states.
- Kept the navigation components presentation-only: no new async flows, storage writes, API calls, authentication changes, or environment/config changes were introduced.
- Shared placeholder text remains bound to `common.empty.title` and `common.empty.description` in every route view so localization stays centralized and no route-specific placeholder strings are introduced.
- Each route-view test mounts the screen with its own minimal vue-i18n instance in both English and French, which proves the rendered placeholder strings come from translation lookup rather than hardcoded English literals.
- `AppShell` offsets the routed content column with `md:pl-56` and gives the route region `pb-16 md:pb-0` so the fixed `SidebarNav` and fixed `BottomNav` do not cover the active view.
- Route changes reuse the existing `fade` transition contract from `src/assets/main.css`, including the existing `prefers-reduced-motion: reduce` override, instead of introducing a new animation system.
- `PageHeader`, `ModalDialog`, and `ToastContainer` are mounted inside `AppShell` so the root experience renders through a recoverable shell and overlay layers stay ordered above page content and navigation chrome.
- **Shared `numericIdGuard`**: Extracted a reusable guard function in `router.ts` that validates `:id` params contain digits only (`/^\d+$/`). Both `/movie/:id` and `/show/:id` use this guard to redirect invalid IDs to home before rendering.
- **Route ordering**: Primary nav routes are ordered as `home`, `recommendations`, `calendar`, `library`, `settings` per the documented design. Non-nav routes (`stats`, `movie`, `show`) are appended after settings and before the catch-all redirect.
- **Placeholder icon mapping**: Each placeholder screen uses a distinct Lucide icon (`Compass` for Recommendations, `ChartColumn` for Stats, `Film` for Movie, `Tv` for Show) passed to the shared `EmptyState` component.
- **No provider calls**: Placeholder screens render immediately without any TMDB API calls or localStorage writes, verified by spying on `fetch` and `Storage.prototype.setItem`/`removeItem` in tests.

## Deviations from Plan

- **tsconfig.vitest.json fix**: The vitest TypeScript config only included `tests/**/*.ts` in its `include` array, which meant source files imported by tests were outside the project boundary. Added `src/**/*` and `src/**/*.vue` to fix TS error 6307. This was a pre-existing config issue that surfaced when the first test importing from `src/` was introduced.
- **Placeholder view files added**: The router plan assumed the route view files would land in a later placeholder-view phase and noted that "TypeScript will not error on dynamic `import()` targets." While true for TypeScript, Vite's import analysis also validates dynamic imports at transform time, blocking both tests and builds. Created minimal stubs first, then upgraded them once the placeholder-view phase was implemented.
- **`scrollBehavior` signature simplified**: Plan specified `scrollBehavior(_to, _from, _savedPosition)` but ESLint `no-unused-vars` flagged all three parameters. Simplified to `scrollBehavior()` since the return value is unconditional.
- `src/App.vue` was updated in addition to the earlier subfeature plans because the existing root component needed to place the router outlet inside the global error boundary and shared `AppShell`.
- The visual fallback and toast-dispatch verification items were satisfied through automated tests rather than a separate manual browser check.
- Navigation components introduced no additional deviations from plan; the sidebar, bottom nav, and page header followed the documented test-first sequence exactly.
- Placeholder views introduced no additional deviations from plan; the route screens and their tests followed the documented test-first sequence exactly.
- No router changes were required for shell assembly because `src/presentation/router.ts` already limited the scaffold to Home, Calendar, Library, and Settings.

## Testing

### Dependencies & Test Infrastructure

No test files were created for this sub-phase. The scope is pure infrastructure — the test setup file (`tests/setup.ts`) and Vitest configuration establish the foundation for tests written in phases 01b–01k.

#### Verification Results

| Check                                   | Result                                |
| --------------------------------------- | ------------------------------------- |
| `package.json` dependencies present     | PASS                                  |
| `vitest.config.ts` properties set       | PASS                                  |
| `testing.md` no explicit Vitest imports | PASS                                  |
| `tests/setup.ts` contents correct       | PASS                                  |
| `npm run test` exits cleanly            | FAIL (no test files — ignored)        |
| `npm run check` full pipeline           | FAIL (blocked by test step — ignored) |

Format (`prettier`), lint (`eslint`), and type-check (`vue-tsc`) all pass individually. The test and check failures are expected and resolve once test files are added in downstream phases.

### i18n Keys

- **Test file**: `tests/presentation/i18n/locale-keys.test.ts` — 6 test cases covering:
  - File existence and valid JSON parsing (AC5)
  - Identical key paths across all three locales (AC2)
  - Non-empty string values in all locales (AC3)
  - Exactly 19 expected keys present (AC1, AC7)
  - `app.title` preserved with original value (AC4)
  - camelCase segment compliance for all key paths (AC6, NFR-01b-01)
- **Test-first verification**: Tests failed before implementation (1 of 6 failed — "contains exactly the expected 19 keys"), then all 6 passed after locale files were updated.
- **Verification results**: All automated checks passed — vitest, prettier, tsc, build.

### Theme, Transitions & Constants

- `tests/domain/constants.test.ts` — 2 tests covering SC-01c-25-01: value assertion (`4000`) and type assertion (`number`). Both pass.
- CSS structural verification performed manually against `src/assets/main.css` content: all theme tokens, transition classes, and reduced-motion overrides confirmed present and correct.
- Behavioral scenarios (SC-01c-22-02, SC-01c-23-02, SC-01c-24-01 through SC-01c-24-03) are now covered by the released toast, modal, and app-shell integrations. Route fade, reduced-motion behavior, and overlay stacking were re-verified through the final shell tests.

### Router

- **Test file**: `tests/presentation/router.test.ts` — 16 tests in 6 describe blocks.
- **Coverage**:
  - SC-01d-29: HTML5 history mode verified by checking resolved href lacks hash fragments.
  - SC-01d-02: All 4 named routes resolve correctly; catch-all redirects to `/` via `router.push()`.
  - SC-01d-03: All 4 routes use function-typed components (lazy `import()`), verified via `router.options.routes`.
  - SC-01d-10: `afterEach` guard sets `document.title` using i18n identity mock; verified for `/library`, `/settings`, and `/` routes.
  - SC-01d-11: `scrollBehavior` returns `{ top: 0 }` with both `null` and non-null `savedPosition`.
  - SC-01d-22: Satisfied by the above test cases.
- **Mocking**: i18n mocked with identity function (`t: (key) => key`). View components mocked as `{ default: {} }`.
- **Verification results**:
  - `npm run test` — 16 router tests pass (24 total suite)
  - `npm run type-check` — no errors
  - `npm run build` — succeeds, 4 lazy-loaded chunks produced (each ~0.15 KB gzipped), main bundle 68.80 KB gzipped
  - `npm run lint` — no errors

### Composables

- `tests/presentation/composables/use-toast.test.ts` — 13 tests covering: add toast (SC-23-01), remove toast (SC-23-09), auto-dismiss (SC-23-02), action preservation (SC-13-03), max-toast eviction (SC-23-08), no-op remove (SC-23-12), type variants (SC-23-03), timer cleanup (SC-23-11), ID uniqueness (SC-23-13), eviction timer cleanup, and action-less toast.
- `tests/presentation/composables/use-modal.test.ts` — 8 tests covering: open/close (SC-23-04), replacement (SC-23-07), confirm callback (SC-23-05), cancel callback (SC-23-06), no-op close (SC-23-10), label storage (SC-12-05), and full props.
- All 21 composable tests pass. Type checking (`tsc --noEmit`) and linting (`eslint`) report zero errors.

### Skeleton & Empty State

- **`skeleton-loader.test.ts`** (3 tests): Verifies specified dimensions with pulse animation and `aria-hidden`, custom `rounded` prop, and default prop values. Covers SC-17-01, SC-17-02, SC-17-03, SC-24-02.
- **`empty-state.test.ts`** (7 tests): Verifies full props rendering (icon, title, description), title-only rendering, CTA button rendering with both props, no CTA without `ctaAction`, click handler invocation, empty title string, and no CTA without `ctaLabel`. Covers SC-16-01 through SC-16-06, SC-24-01.
- All 55 tests across 7 test files pass. `npm run type-check`, `npm run lint`, and `npm run build` all pass.

### Toast Container & Modal Dialog

- **`toast-container.test.ts`** (18 tests): Covers all SC-14 scenarios plus implementation details (empty state, keying, action button presence).
- **`modal-dialog.test.ts`** (18 tests): Covers all SC-15 scenarios plus additional edge cases (optional callbacks, listener cleanup).
- All 95 tests across 9 test files pass. `npm run type-check` — PASS (zero errors). `npm run test` — PASS.

### Error Handling

- `tests/presentation/components/error/error-boundary.test.ts` covers SC-24-03, SC-18-01, SC-18-02, SC-18-03, and NFR-01h-02.
- `tests/main.test.ts` covers SC-19-01 by importing `src/main.ts`, capturing the production `app.config.errorHandler`, and asserting console logging plus toast queue updates.
- Verification results:
  - `npm test` — PASS (11 files, 100 tests)
  - `npm run lint` — PASS
  - `npm run type-check` — PASS

### Navigation Components

- `tests/presentation/components/layout/sidebar-nav.test.ts` — 5 tests covering desktop nav structure, icon mapping, French labels, active-state styling, and exact-match Home behavior.
- `tests/presentation/components/layout/bottom-nav.test.ts` — 5 tests covering mobile nav rendering, documented route order, icon mapping, touch targets, and exact-match active-state behavior.
- `tests/presentation/components/layout/page-header.test.ts` — 4 tests covering translated route titles, route updates, sticky positioning, and non-default locale output.
- Re-verified during promotion:
  - `npx vitest run tests/presentation/components/layout/sidebar-nav.test.ts` — PASS
  - `npx vitest run tests/presentation/components/layout/bottom-nav.test.ts` — PASS
  - `npx vitest run tests/presentation/components/layout/page-header.test.ts` — PASS
  - `npm run test` — PASS (14 files, 114 tests)
  - `npm run lint` — PASS
  - `npm run format:check` — PASS
  - `npm run type-check` — PASS
  - `npm run build` — PASS

### Placeholder Views

- `tests/presentation/views/home-screen.test.ts`, `calendar-screen.test.ts`, `library-screen.test.ts`, and `settings-screen.test.ts` cover the documented routed placeholder cases in both English and French.
- The placeholder-view tests were added before the route-view implementations changed, failed against the original stubs, then passed after the `EmptyState` upgrades were completed.
- Source inspection of `src/presentation/views/home-screen.vue`, `calendar-screen.vue`, `library-screen.vue`, and `settings-screen.vue` confirmed `<script setup lang="ts">` appears before `<template>`, no local `<style>` block was added, and placeholder copy is sourced from `common.empty.title` plus `common.empty.description`.
- Re-verified during promotion:
  - `npm run test -- tests/presentation/views/home-screen.test.ts tests/presentation/views/calendar-screen.test.ts tests/presentation/views/library-screen.test.ts tests/presentation/views/settings-screen.test.ts` — PASS (4 files, 8 tests)
  - `npm run test` — PASS (18 files, 122 tests)
  - `npm run type-check` — PASS

### App Shell & Assembly

- `tests/presentation/components/layout/app-shell.test.ts` covers `SC-04-01`, `SC-04-02`, `SC-04-03`, `SC-04-04`, `SC-09-01`, `SC-09-02`, and `SC-10-03`.
- `tests/App.test.ts` covers `SC-10-01` and `SC-10-02`.
- Re-verified during promotion:
  - `npm run type-check` — PASS
  - `npm run lint` — PASS
  - `npm run format:check` — PASS
  - `npm run test` — PASS (20 files, 130 tests)
  - `npm run build` — PASS
- Performance verification passed with the current build output. The initial non-lazy payload is 77.70 KB gzipped (`index-BkTy7rxi.js` 14.75 KB, `createLucideIcon-tpZhrWTu.js` 58.49 KB, `index-KAVinTIh.css` 4.46 KB), and each route-view chunk remains well below the 20 KB limit.
- Manual browser verification confirmed the assembled-shell checklist: header + routed content on first load, the documented five-item nav order (with Recommendations), responsive shell switching, mobile bottom-nav clearance, 200ms fade behavior, reduced-motion fallback, modal-over-chrome stacking, toast-over-modal stacking, and the dependent router/navigation behaviors from 01d and 01i.

### Menu Scaffold and Navigation (R-01b)

- `tests/presentation/i18n/locale-keys.test.ts` — Extended for 24 keys including new page titles
- `tests/presentation/router.test.ts` — Extended for 8 routes, numeric guards, and new title metadata
- `tests/presentation/components/layout/sidebar-nav.test.ts` — Updated for 5 nav items with Recommendations
- `tests/presentation/components/layout/bottom-nav.test.ts` — Updated for 5 nav items with Recommendations
- `tests/presentation/components/layout/page-header.test.ts` — Added test cases for new routes
- `tests/presentation/components/layout/app-shell.test.ts` — Added shell tests for new routes and no-side-effects validation
- `tests/presentation/views/recommendations-screen.test.ts` — EmptyState, Compass icon, i18n bindings
- `tests/presentation/views/stats-screen.test.ts` — EmptyState, ChartColumn icon, i18n bindings
- `tests/presentation/views/movie-screen.test.ts` — EmptyState, Film icon, i18n bindings
- `tests/presentation/views/show-screen.test.ts` — EmptyState, Tv icon, i18n bindings
- `tests/App.test.ts` — Updated for 5 nav items
- Re-verified during promotion:
  - `npm run type-check` — PASS
  - `npm run lint` — PASS
  - `npm run format:check` — PASS
  - `npm run test` — PASS (24 files, 181 tests)

## Verification Results

- `npm test` — PASS (24 files, 181 tests)
- `npm run lint` — PASS
- `npm run format:check` — PASS
- `npm run type-check` — PASS
- `npm run build` — PASS

## Dependencies

- `vue-router@^5.0.4` — Vue Router for SPA routing (runtime dependency, used starting in phase 01d).
- `@vue/test-utils@^2.4.6` — Official Vue test utilities for mounting and interacting with components in tests (dev dependency, used starting in phase 01f+).

No new dependencies were added for the router phase. `vue-router` (^5.0.4) and `vue-i18n` (^11.3.0) were already installed by change 01a.
No new dependencies were added for error handling.
No new dependencies were added for navigation components.
No new dependencies were added for placeholder views.
No new dependencies were added for app shell assembly.

## Performance

- **Initial non-lazy payload**: 77.70 KB gzipped (under 150 KB limit).
- **Lazy chunks**: route-view chunks are 0.27 KB gzipped each, and the shared `empty-state` chunk is 0.54 KB gzipped (all under 20 KB).

## Requirement Coverage

| Requirement                      | Implementation                                                                                                                                                                                                                                                                      |
| :------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SC-01c-21 (Theme additions)      | `--color-success` and `--color-error` added to `@theme` block in `src/assets/main.css:9-10`                                                                                                                                                                                         |
| SC-01c-09 (Fade transition)      | `.fade-*` classes at `src/assets/main.css:13-21`                                                                                                                                                                                                                                    |
| SC-01c-22 (Toast transition)     | `.toast-*` classes at `src/assets/main.css:23-37`                                                                                                                                                                                                                                   |
| SC-01c-23 (Modal transition)     | `.modal-*` classes at `src/assets/main.css:39-53`                                                                                                                                                                                                                                   |
| SC-01c-24 (Reduced-motion)       | `@media (prefers-reduced-motion: reduce)` block at `src/assets/main.css:55-68`                                                                                                                                                                                                      |
| SC-01c-25 (Domain constants)     | `TOAST_DISMISS_MS` exported from `src/domain/constants.ts:2`                                                                                                                                                                                                                        |
| SC-01d-29 (Vue Router setup)     | `createWebHistory()` in `src/presentation/router.ts`, registered in `src/main.ts`                                                                                                                                                                                                   |
| SC-01d-02 (Route definitions)    | 8 named routes + catch-all redirect in `src/presentation/router.ts`                                                                                                                                                                                                                 |
| SC-01d-03 (Route lazy loading)   | Dynamic `import()` for all 8 route components                                                                                                                                                                                                                                       |
| SC-01d-10 (Document title)       | `afterEach` guard with i18n `t()` in `src/presentation/router.ts`                                                                                                                                                                                                                   |
| SC-01d-11 (Scroll-to-top)        | `scrollBehavior` returning `{ top: 0 }` in `src/presentation/router.ts`                                                                                                                                                                                                             |
| SC-01d-22 (Router unit tests)    | 16 tests in `tests/presentation/router.test.ts`                                                                                                                                                                                                                                     |
| SC-13 (Toast notification)       | `src/presentation/composables/use-toast.ts` with `addToast()`, `removeToast()`, auto-dismiss, eviction                                                                                                                                                                              |
| SC-12 (Modal/dialog)             | `src/presentation/composables/use-modal.ts` with `open()`, `close()`, single-instance replacement                                                                                                                                                                                   |
| SC-23 (Composable unit tests)    | 21 tests in `tests/presentation/composables/` (13 toast + 8 modal)                                                                                                                                                                                                                  |
| SC-16 (Empty state component)    | `empty-state.vue` — centered layout, optional icon/description/CTA, all string props pre-translated                                                                                                                                                                                 |
| SC-17 (Skeleton loader)          | `skeleton-loader.vue` — shimmer div with `animate-pulse bg-surface`, configurable dimensions, `aria-hidden="true"`                                                                                                                                                                  |
| SC-14 (Toast container)          | `toast-container.vue` — fixed top-right positioning, z-50, TransitionGroup with `toast-*` classes, type-colored borders, dismiss button with X icon, optional action button, max 5 toasts (handled by composable)                                                                   |
| SC-15 (Modal/dialog)             | `modal-dialog.vue` — backdrop with `bg-black/50`, centered content card, Escape key listener, confirm/cancel buttons with i18n defaults, `@click.stop` on content card                                                                                                              |
| SC-18 (Error boundary)           | `src/presentation/components/error/error-boundary.vue` in `src/App.vue` catches descendant render/setup errors, renders translated fallback UI with `role="alert"`, and reloads via a primary action                                                                                |
| SC-19 (Global error handler)     | `app.config.errorHandler` in `src/main.ts` logs uncaught component/render errors and dispatches translated error toasts through `useToast()`                                                                                                                                        |
| SC-24 (UI primitive tests)       | `empty-state.test.ts` (SC-24-01), `skeleton-loader.test.ts` (SC-24-02), `error-boundary.test.ts` (SC-24-03, SC-24-06), `toast-container.test.ts` (SC-24-04), `modal-dialog.test.ts` (SC-24-05)                                                                                      |
| SC-05 (Desktop sidebar)          | `src/presentation/components/layout/sidebar-nav.vue` renders the localized `app.title` branding block, five primary links (Home, Recommendations, Calendar, Library, Settings), mapped lucide icons, and desktop-only active-state styling                                          |
| SC-06 (Mobile bottom nav)        | `src/presentation/components/layout/bottom-nav.vue` renders five primary links with responsive visibility classes and 44x44px touch-target sizing                                                                                                                                   |
| SC-07 (Active route styling)     | `sidebar-nav.vue` and `bottom-nav.vue` apply teal active-state styling and exact-match Home detection                                                                                                                                                                               |
| SC-08 (Page header)              | `src/presentation/components/layout/page-header.vue` translates `route.meta.titleKey`, updates on route changes, and remains sticky at the top of the content area                                                                                                                  |
| SC-25 (Layout component tests)   | `sidebar-nav.test.ts`, `bottom-nav.test.ts`, and `page-header.test.ts` verify rendering, locale output, route updates, active states, and sticky/touch-target behavior                                                                                                              |
| SC-20 (Placeholder views)        | All 8 route views (`home-screen.vue`, `recommendations-screen.vue`, `calendar-screen.vue`, `library-screen.vue`, `settings-screen.vue`, `stats-screen.vue`, `movie-screen.vue`, `show-screen.vue`) render `EmptyState` with the mapped icon plus shared translated placeholder copy |
| SC-26 (Placeholder view tests)   | All 8 route view tests verify icon mapping plus English and French placeholder rendering                                                                                                                                                                                            |
| R-01b-01 (Recommendations route) | `/recommendations` defined in `router.ts` with lazy loading and `page.recommendations.title`                                                                                                                                                                                        |
| R-01b-02 (Recommendations nav)   | Fifth nav item added to `sidebar-nav.vue` and `bottom-nav.vue` between Home and Calendar                                                                                                                                                                                            |
| R-01b-03 (Stats route)           | `/stats` defined in `router.ts` with lazy loading, not in primary nav                                                                                                                                                                                                               |
| R-01b-04 (Detail routes)         | `/movie/:id` and `/show/:id` defined in `router.ts` with lazy loading                                                                                                                                                                                                               |
| R-01b-05 (Detail ID guards)      | `numericIdGuard` in `router.ts` rejects non-numeric IDs                                                                                                                                                                                                                             |
| R-01b-06 (Placeholder rendering) | All four new views use `EmptyState` with mapped icons (`Compass`, `ChartColumn`, `Film`, `Tv`)                                                                                                                                                                                      |
| R-01b-07 (Shell behavior)        | New routes render inside `AppShell` with existing transitions and no side effects                                                                                                                                                                                                   |
| R-01b-08 (Verification)          | Extended test suites cover all new routes, nav composition, and guard behavior                                                                                                                                                                                                      |
| SC-04 (App shell layout)         | `src/presentation/components/layout/app-shell.vue` provides the fixed desktop shell, responsive mobile bottom-nav layout, and routed-content clearance                                                                                                                              |
| SC-09 (Route transitions)        | `AppShell` wraps `RouterView` in `<Transition name="fade" mode="out-in">`, reusing the shared fade contract and reduced-motion override                                                                                                                                             |
| SC-10 (Root shell assembly)      | `src/App.vue` boots through `ErrorBoundary` and `AppShell`, which renders `PageHeader`, the routed outlet, `ToastContainer`, and `ModalDialog` together                                                                                                                             |

## Known Limitations

- A dedicated `tsconfig.vitest.json` was added (extending `tsconfig.app.json`) to provide IDE type-checking for test files. It adds `vitest/globals` and `node` types and includes `tests/**/*.ts`. Without this, VS Code cannot resolve `describe`, `it`, `expect`, or Node.js APIs in test files.
- **Translation accuracy**: Spanish and French translations use standard UI terminology but have not been reviewed by native speakers. This is noted as a deferred concern in the requirements.
- **Fallback verification (AC9)**: vue-i18n fallback to English is implicitly satisfied by the `fallbackLocale: 'en'` configuration from Phase 00. Explicit runtime fallback testing beyond the current component coverage remains deferred to a future localization-focused verification pass.
- Theme colors target the dark theme only; light-theme counterparts are deferred to a future theme-switching feature phase.
- The `afterEach` title guard depends on `meta.titleKey` existing on each route. Routes added by future features must include this meta property to get document title updates.
- Skeleton composition variants (card skeleton, hero skeleton, etc.) are out of scope — deferred to consuming features.
- No responsive-specific skeleton behavior beyond standard Tailwind responsiveness.
- **Accessibility**: Per ui-ux.md § 11, no focus trapping is implemented for the modal. Focus remains on the element that triggered the modal.
- **Reduced motion**: Transition disabling for `prefers-reduced-motion` is handled entirely by CSS media queries in `main.css`. The components do not programmatically detect or respond to motion preferences.
- Sidebar branding uses the existing localized `app.title` text only; a dedicated logo asset is still deferred.
- **Placeholder-only detail routes**: Detail routes (`/movie/:id`, `/show/:id`) do not fetch TMDB data or validate provider existence. The [Entry Details](../../roadmap/03-entry-details.md) roadmap item will add provider-backed detail loading and inline not-found handling.
- **Stats access**: The `/stats` route is direct-URL-only; the Library "View Stats" entry path remains deferred to [Stats](../../roadmap/08-stats.md).
- **Recommendations logic**: The `/recommendations` route displays a placeholder; provider-backed seed selection, fetching, and deduplication remain deferred to [Recommendations](../../roadmap/09-recommendations.md).
