---
id: R-01a
title: App Scaffolding — Dependencies & Test Infrastructure
status: released
type: infrastructure
importance: critical
tags:
  [
    dependencies,
    testing,
    dx,
    i18n,
    localization,
    tailwind,
    transitions,
    error-handling,
    error-boundary,
    constants,
    routing,
    navigation,
    composables,
    toast,
    modal,
    state,
    components,
    ui-primitives,
    overlay,
  ]
---

## Intent

Install vue-router and @vue/test-utils, configure the Vitest test infrastructure so all subsequent scaffolding phases can write and run tests. Add all i18n keys needed by the scaffolding phases (navigation labels, page titles, empty state text, error text, toast labels) to all three locale files.

Add Tailwind theme color tokens (success, error), all transition/animation CSS (fade, toast, modal, reduced-motion), and the domain constant for toast auto-dismiss, preparing the visual foundation for subsequent components.

Configure Vue Router with 4 lazy-loaded routes, catch-all redirect, scroll-to-top, and i18n-based document title updates.

Create the `useToast` and `useModal` composables — module-level singleton reactive state for toast notifications and modal dialogs — along with their unit tests.

Create the SkeletonLoader and EmptyState reusable UI primitives with their component tests.

Create the ToastContainer and ModalDialog overlay components that render the toast queue and modal state managed by the composables.

Add an `ErrorBoundary` component that catches descendant Vue render/setup errors and shows a translated full-screen fallback UI with a reload action. Register `app.config.errorHandler` in `src/main.ts` so uncaught component/render errors outside the boundary are logged and surfaced to the shared toast queue.

## Context & Background

### Problem Statement

Downstream scaffolding features (01b through 01k) need test infrastructure and routing/test-utils dependencies before they can write or validate code. Without a configured Vitest setup and the required npm packages, no tests can be authored in subsequent phases.

Downstream features (01g — Toast Container, 01h — Error Handling) require shared reactive state for toast notifications and modal dialogs. These composables must be available both inside and outside Vue component `setup()` so the global error handler can dispatch toast notifications.

The scaffolding layer also needs a consistent crash path for unexpected Vue component/render failures. Errors inside the routed experience should fall back to a recoverable full-screen state, while uncaught errors outside that boundary should still surface a translated toast and console logging.

### User Stories

- As a developer working on phases 01b–01k, I need Vitest globals and `@vue/test-utils` available so I can write component and unit tests without additional setup.
- As a developer working on phase 01d (Router), I need `vue-router` installed so I can configure routing without additional dependency setup.
- As a user, I need unexpected UI crashes to surface a clear recovery path instead of a blank screen.

### Visual Foundation

This phase is part of the Phase 01 scaffolding sequence. It delivers the visual foundation that downstream phases depend on:

- **R-01e** (Composables): Consumes `TOAST_DISMISS_MS` from `src/domain/constants.ts`.
- **R-01g** (Toast Container & Modal Dialog): Consumes `--color-success` and `--color-error` theme colors.
- **R-01k** (App Shell & Assembly): Wires the fade transition CSS into `<Transition>` around `<RouterView>`.

### Dependencies

- Phase 00 ([R-00](../../product/00%20-%20setup/requirements.md)) complete — Vue 3, Vite, TypeScript, Tailwind v4, vue-i18n, lucide-vue-next all installed.
- [Phase 00 (Setup)](../../product/00%20-%20setup/) complete — vue-i18n installed, locale files exist with `app.title` key.
- R-01a (Dependencies & Test Infrastructure) complete — Vitest, `@vue/test-utils`, and test configuration available.
- R-01c — `TOAST_DISMISS_MS` constant in `src/domain/constants.ts`.
- R-01b — `common.error.*` and `toast.error` locale keys exist in all supported locales.
- R-01e — `useToast()` is available as a module-level singleton outside component `setup()`.

### Dependents

- **01e (Composables)** — consumes `TOAST_DISMISS_MS` from `src/domain/constants.ts`.
- **01g (Toast Container & Modal Dialog)** — consumes `--color-success` and `--color-error` theme colors.
- **01i (Navigation Components)** — uses `nav.*` keys for sidebar and bottom nav labels.
- **01j (Placeholder Views)** — uses `page.*.title` and `common.empty.*` keys.
- **01k (App Shell & Assembly)** — wires the fade transition CSS into `<Transition>` around `<RouterView>`.

## Decisions

| Decision                          | Choice                                                    | Rationale                                                                                                                                                                                                             |
| :-------------------------------- | :-------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testing approach                  | Unit + component tests (Vitest + jsdom)                   | Conformance with existing project standard ([docs/technical/testing.md](../../technical/testing.md)). Vitest already configured with jsdom; this phase extends that configuration.                                    |
| Vitest globals                    | `globals: true`                                           | Enables `describe`, `it`, `expect`, `beforeEach` in test files without explicit imports. Reduces boilerplate across all test files in downstream phases.                                                              |
| Namespace pattern for shared keys | `common.*` (e.g., `common.error.*`, `common.empty.*`)     | Distinguishes global reusable strings from feature-scoped keys (e.g., `library.empty.title`). Keeps shared error and empty state text under a single top-level namespace rather than scattering across feature areas. |
| Page title namespace              | `page.*` (e.g., `page.home.title`, `page.settings.title`) | Separates document/page titles from nav labels (`nav.*`). Allows titles to diverge independently (e.g., subtitles, contextual prefixes) without affecting nav items.                                                  |
| Toast action labels               | `toast.*` (e.g., `toast.dismiss`, `toast.retry`)          | Groups toast-related labels under a dedicated top-level namespace. Avoids nesting under `common.*` since toasts are a distinct UI pattern used across many features.                                                  |
| Transition CSS in main.css        | Global CSS exception                                      | Vue `<Transition>` requires class-based CSS. Centralizing in `main.css` avoids duplication. Acknowledged exception to the "Tailwind only" rule.                                                                       |
| Domain file in scaffolding        | Early creation                                            | `src/domain/constants.ts` is introduced during a Presentation-focused scaffolding phase because downstream phases (R-01e, R-01g) depend on `TOAST_DISMISS_MS`.                                                        |
| Router history mode               | `createWebHistory()`                                      | Clean URLs without hash fragments. Firebase SPA rewrite already handles fallback.                                                                                                                                     |
| Home route matching               | Exact match only                                          | Prevents the Home nav item from appearing active on every route.                                                                                                                                                      |
| Composable state pattern          | Module-level singleton                                    | Toast and modal composables use module-level reactive state so they work both inside and outside component `setup()` (needed for the global error handler).                                                           |
| Composable return shape           | Custom per composable                                     | The `{ data, loading, error, refresh? }` return convention applies to Application-layer composables wrapping async operations. Presentation-layer UI-state composables use a shape suited to their purpose.           |
| SkeletonLoader `aria-hidden`      | Apply `aria-hidden="true"`                                | Intentional exception to ui-ux.md section 11 ("No ARIA beyond semantic HTML defaults"). Decorative shimmer placeholders should be hidden from screen readers.                                                         |
| `rounded` prop type               | Accept raw Tailwind border-radius class string            | Simpler API for an internal project — consumers already use Tailwind classes.                                                                                                                                         |
| String prop i18n                  | Props receive pre-translated values                       | Primitives stay translation-agnostic; consuming components call `$t()`.                                                                                                                                               |
| Toast z-index above modal         | Toast `z-50`, Modal `z-40`                                | Toasts should remain visible during modal interactions for error feedback and action confirmations.                                                                                                                   |
| Dismiss button icon               | X icon (lucide-vue-next)                                  | Consistent with common UI patterns and the project's icon library.                                                                                                                                                    |
| Max toast limit                   | Fixed at 5 (not configurable)                             | Prevents UI clutter; configurability deferred to future enhancement if user feedback requests it.                                                                                                                     |
| Modal button order                | Cancel left, Confirm right                                | Primary action rightmost follows common web conventions.                                                                                                                                                              |
| `main.ts` layer exception         | Allow `src/main.ts` to import Presentation composables    | The global error handler must call `useToast()` outside component `setup()`, so the bootstrap layer uses a documented exception for this single import path.                                                          |
| Error boundary propagation        | Return `false` from `onErrorCaptured`                     | Prevents double-handling: the boundary already renders the fallback UI, so the global handler should not also emit an error toast for the same crash.                                                                 |

## Scope

### In Scope

- Install `vue-router@^4.5` as a runtime dependency.
- Install `@vue/test-utils@^2.4` as a dev dependency.
- Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block.
- Create `tests/setup.ts` with `localStorage.clear()` in `beforeEach` and `/// <reference types="vitest/globals" />` for TypeScript global recognition.
- Add `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*` keys to `en.json`, `es.json`, `fr.json`.
- Verify that vue-i18n fallback to English works correctly for the scaffolded keys.
- Add `--color-success: #22c55e` and `--color-error: #ef4444` to the `@theme` block in `src/assets/main.css`.
- Add fade transition CSS (`.fade-enter-active`, `.fade-leave-active`, `.fade-enter-from`, `.fade-leave-to`).
- Add toast transition CSS (`.toast-enter-active`, `.toast-leave-active`, `.toast-enter-from`, `.toast-leave-to`).
- Add modal transition CSS for the content card (`.modal-enter-active`, `.modal-leave-active`, `.modal-enter-from`, `.modal-leave-to`).
- Add `prefers-reduced-motion` override disabling all transitions, animations, and `animate-pulse` shimmer.
- Create `src/domain/constants.ts` with `TOAST_DISMISS_MS = 4000`.
- Create router configuration in `src/presentation/router.ts`.
- Register router in `src/main.ts`.
- Write router unit tests.
- Create `src/presentation/composables/use-toast.ts` and `use-modal.ts`.
- Write unit tests for both composables.
- Define `MAX_VISIBLE_TOASTS` constant in `src/domain/constants.ts`.
- Create `src/presentation/components/common/skeleton-loader.vue` and `empty-state.vue`.
- Write component tests for both SkeletonLoader and EmptyState.
- Create `src/presentation/components/common/toast-container.vue` (consumes `toast-*` CSS transition classes).
- Create `src/presentation/components/common/modal-dialog.vue` (consumes `modal-*` CSS transition classes).
- Write component tests: `tests/presentation/components/common/toast-container.test.ts` and `tests/presentation/components/common/modal-dialog.test.ts`.
- Create `src/presentation/components/error/error-boundary.vue`.
- Wrap routed application content in `src/App.vue` with the error boundary.
- Add `app.config.errorHandler` to `src/main.ts`.
- Write component and bootstrap tests covering the error boundary and global error handler.

> **Note:** `nav.recommendations` and `page.recommendations.title` are included for forward compatibility with the Recommendations feature phase, even though no scaffolding sibling currently consumes them.

> **Follow-up:** After implementation, update [conventions.md Section 11](../../technical/conventions.md#11-internationalization-i18n) to document the `page.*` namespace pattern alongside `nav.*`, `common.*`, and `toast.*`.

### Out of Scope

- Vue component creation beyond scaffolding UI primitives.
- vue-i18n instance configuration or locale switching logic (fallback verification for scaffolded keys is in scope).
- i18n keys beyond the scaffolding namespaces listed above (e.g., `library.*`, `details.*`).
- Light-theme color variants (deferred to future theme-switching phase).
- `<Transition>` wiring in the app shell (covered by R-01k).
- Toast and modal components (covered by R-01g).
- Additional domain constants beyond `TOAST_DISMISS_MS` (added in their respective feature phases).
- Modal backdrop transition CSS (backdrop uses a simple opacity toggle managed by the modal component in R-01g).
- Detail routes (`/movie/:id`, `/show/:id`) — deferred to their respective feature phases.
- `/stats` and `/recommendations` routes — deferred to their respective feature phases. These are primary nav destinations but depend on feature-specific views and composables not yet built.
- Route transition animations — covered by 01k.
- Navigation guards beyond catch-all redirect.
- Route-level middleware or authentication guards.
- Toast container component (`toast-container.vue`) — covered by 01g.
- Modal dialog component (`modal-dialog.vue`) — covered by 01g.
- Toast animations and transitions — covered by 01g.
- Skeleton composition variants (card skeleton, hero skeleton, detail skeleton, grid skeleton) — deferred to consuming features.
- i18n integration within SkeletonLoader/EmptyState primitives — consuming components pass pre-translated strings via props.
- Responsive-specific skeleton behavior beyond standard Tailwind responsiveness.
- Toast/modal integration into App.vue (handled by 01k).
- Recovery strategies beyond page reload.
- Error reporting to external services.
- Custom error types or error categorization.
- API request failures beyond their existing request-specific handling.
- Rendering the toast UI in the root shell; this phase only dispatches to the shared toast queue.

> The scaffolding sequence builds cumulatively on the infrastructure, shared UI primitives, overlays, and error handling documented here.

## Functional Requirements

> Canonical scaffolding requirements preserve the original IDs from each merged subfeature. Infrastructure items use scoped prefixes such as `SC-01a-*` and `SC-01c-*`, while component features retain their standalone IDs (`SC-12` through `SC-24`).

| ID        | Requirement              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Priority |
| :-------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| SC-01a-01 | Dependency installation  | `vue-router@^4.5` installed as runtime dependency; `@vue/test-utils@^2.4` installed as dev dependency.                                                                                                                                                                                                                                                                                                                                                              | P0       |
| SC-01a-02 | Vitest configuration     | Update `vitest.config.ts` with `globals: true`, `include: ["tests/**/*.test.ts"]`, and `setupFiles: ["./tests/setup.ts"]` inside the existing `test: {}` block. Update the code example in `docs/technical/testing.md` to remove explicit Vitest imports, aligning with the `globals: true` convention.                                                                                                                                                             | P0       |
| SC-01a-03 | Test setup file          | Create `tests/setup.ts` with `/// <reference types="vitest/globals" />` at the top for TypeScript global recognition and `localStorage.clear()` in `beforeEach`. Note: `localStorage.clear()` is a direct call, intentionally exempt from the [conventions.md](../../technical/conventions.md) guardrail requiring all localStorage access to go through the typed storage service (section 6) — this is test-infrastructure teardown, not application data access. | P0       |
| SC-01b-12 | i18n keys                | Add 18 i18n keys across 5 namespaces to `en.json`, `es.json`, `fr.json`: **nav** — `home`, `recommendations`, `calendar`, `library`, `settings`; **page.\*.title** — `home`, `recommendations`, `calendar`, `library`, `settings`; **common.empty** — `title`, `description`; **common.error** — `title`, `description`, `reload`; **toast** — `error`, `dismiss`, `retry`. Existing `app.title` key must be preserved.                                             | P0       |
| SC-01c-21 | Tailwind theme additions | Add `--color-success: #22c55e` and `--color-error: #ef4444` to the `@theme` block for toast type accents. Note: these colors target the current dark theme only; light-theme counterparts will be added in the future theme-switching feature phase.                                                                                                                                                                                                                | P1       |
| SC-01c-09 | Fade transition CSS      | Define `.fade-*` CSS classes for route transitions: 200ms opacity fade with `ease-in-out`. Note: this phase covers only the CSS definitions — the `<Transition>` wiring in the app shell is in R-01k.                                                                                                                                                                                                                                                               | P1       |
| SC-01c-22 | Toast transition CSS     | Define `.toast-*` CSS classes: slide in horizontally from off-screen right with simultaneous opacity fade on enter (300ms `ease-out`), fade out on leave (200ms `ease-in`).                                                                                                                                                                                                                                                                                         | P1       |
| SC-01c-23 | Modal transition CSS     | Define `.modal-*` CSS classes for the content card: fade in with slight scale-up on enter (200ms `ease-out`), reverse on leave (150ms `ease-in`). Backdrop transition is managed separately by the modal component (R-01g).                                                                                                                                                                                                                                         | P1       |
| SC-01c-24 | Reduced-motion override  | Add `@media (prefers-reduced-motion: reduce)` block that disables all `.fade-*`, `.toast-*`, `.modal-*` transitions and `animate-pulse` animations.                                                                                                                                                                                                                                                                                                                 | P1       |
| SC-01c-25 | Domain constants         | Create `src/domain/constants.ts` with `export const TOAST_DISMISS_MS = 4000` (auto-dismiss timeout in milliseconds for toast notifications).                                                                                                                                                                                                                                                                                                                        | P1       |

| SC-01d-29 | Vue Router setup | vue-router (installed via 01a). `createWebHistory()`, router registered in `main.ts`. Routes defined in `src/presentation/router.ts`. | P0 |
| SC-01d-02 | Route definitions | 4 named routes (`home` at `/`, `calendar` at `/calendar`, `library` at `/library`, `settings` at `/settings`) plus catch-all `/:pathMatch(.*)*` redirecting to `/`. Remaining routes from `architecture.md` (`/movie/:id`, `/show/:id`, `/stats`, `/recommendations`) are deferred. | P0 |
| SC-01d-03 | Route lazy loading | All 4 view components loaded via dynamic `import()` for code splitting. | P0 |
| SC-01d-10 | Document title | `router.afterEach` guard sets `document.title` to `${t(meta.titleKey)} — ${t('app.title')}`. Each route's `meta.titleKey` uses the pattern `page.<route-name>.title`. If `meta.titleKey` is undefined (e.g., catch-all route during redirect), fall back to just `t('app.title')`. | P1 |
| SC-01d-11 | Scroll-to-top | Router `scrollBehavior` returns `{ top: 0 }` on every navigation. | P1 |
| SC-01d-22 | Router unit tests | Tests in `tests/presentation/router.test.ts` for route definitions (4 named routes + catch-all), `scrollBehavior` returning `{ top: 0 }`, and `afterEach` guard setting `document.title`. | P0 |
| SC-13 | Toast notification system | `useToast()` composable with module-level reactive state. `addToast(options)` pushes a toast (options: `{ message, type, action?: { label: string, handler: () => void } }`) with a generated unique ID (incrementing counter) and auto-dismiss after `TOAST_DISMISS_MS` (default 4000ms, from `src/domain/constants.ts`). `removeToast(id)` removes it and clears its auto-dismiss timer. Toast types: error (red), success (green), info (teal). Enforces a maximum of `MAX_VISIBLE_TOASTS` (5) simultaneous toasts; when exceeded, the oldest toast is evicted before the new one is added. | P0 |
| SC-12 | Modal/dialog | `useModal()` composable (single-instance). `open(props)` sets visible true and stores props (shape: `{ title: string, content?: string, confirmLabel?: string, cancelLabel?: string, onConfirm?: () => void, onCancel?: () => void }`). `close()` sets visible false and clears props. Opening a new modal while one is active replaces the current modal. The composable stores callback references in props; invocation of callbacks is the consuming component's responsibility (see 01g). | P1 |
| SC-23 | Composable unit tests | `useToast`: add/remove toast, auto-dismiss after timeout, toast types. `useModal`: open/close state, callback storage in props. | P0 |
| SC-16 | Empty state component | Centered layout with optional lucide icon, title (white bold), description (muted), optional CTA button styled as a primary teal button (`bg-accent text-white rounded-md px-4 py-2`) per ui-ux.md section 9. Props: `icon` (Vue `Component` type, optional), `title` (string), `description` (string, optional), `ctaLabel` (string, optional), `ctaAction` (() => void, optional). All string props receive pre-translated values from the consuming component — this primitive does not call `$t()` internally. | P0 |
| SC-17 | Skeleton loader | Reusable shimmer placeholder. Props: `width` (string, default `'100%'`), `height` (string, default `'1rem'`), `rounded` (string, default `'rounded-md'`). Renders a div with `animate-pulse bg-surface`. | P1 |
| SC-14 | Toast container | Fixed top-right container (`z-50`) rendering the toast queue with `<TransitionGroup>` using the `toast-*` CSS transition classes (300 ms slide-in from the right, 200 ms fade-out on dismiss). Each toast has a dismiss button (X icon from lucide-vue-next) and an optional action button (text-style, positioned left of the dismiss button). Maximum 5 simultaneous toasts (fixed limit); when exceeded, the oldest toast is evicted. Supported toast types: `error`, `success`, `info` (warning type out of scope for this phase). | P0 |
| SC-15 | Modal/dialog | `modal-dialog.vue` with backdrop (`bg-black/50`), centered content card, title, optional content, confirm/cancel buttons (cancel left, confirm right). Escape key listener registered on `document` when the modal is open, removed on close. Confirm defaults to `$t('modal.confirm')`, cancel defaults to `$t('modal.cancel')` when labels are not provided. Opening a new modal while one is active replaces the current. Clicks on the content card do not propagate to the backdrop (only backdrop clicks close the modal). Modal content scrolls internally (`overflow-y-auto max-h-[80vh]`) when content exceeds viewport height. | P1 |
| SC-18 | Error boundary | `ErrorBoundary` component using `onErrorCaptured`. Normal state renders slot content. Error state replaces routed content with a full-screen centered fallback UI showing translated error heading, description, and a primary reload button that calls `window.location.reload()`. The boundary returns `false` from `onErrorCaptured` so handled crashes do not propagate to the global error handler. | P0 |
| SC-19 | Global error handler | Register `app.config.errorHandler` in `src/main.ts`. Uncaught Vue component/render errors outside the `ErrorBoundary` are logged to `console.error` and dispatch an error toast to the shared `useToast()` queue using translated `toast.error` text. API request failures remain on their request-specific handling paths. | P0 |
| SC-24 | UI primitive tests | Component tests for EmptyState (SC-24-01: renders icon/title/description/CTA props), SkeletonLoader (SC-24-02: renders with width/height/rounded props), ErrorBoundary (SC-24-03: renders slot content normally; SC-24-06: shows fallback on error), ToastContainer (SC-24-04: renders toast queue, dismiss, positioning), and ModalDialog (SC-24-05: renders title/content/buttons, closes on backdrop click and Escape). | P0 |

> **Note:** `src/domain/constants.ts` is created in this phase with `TOAST_DISMISS_MS` only (additional constants will be added in their respective feature phases). See Decisions table for rationale.

## Non-Functional Requirements

### Testing

- **NFR-01a-01 (CI integration):** `npm run check` must pass with zero failures. This script runs the following sub-commands in sequence: `format`, `lint:fix`, `type-check`, `test`, `build`. It applies auto-formatting and auto-linting before type-check, test, and build — it mutates files on disk rather than performing read-only verification.
- **NFR-01a-02 (File naming):** All test files must use the `*.test.ts` naming convention under a dedicated `tests/` directory at the project root, mirroring the `src/` directory structure.

### NFR-01b-01 — Key Structure Compliance

- **camelCase key segments:** Zero violations — every dot-separated segment of each key in all locale JSON files must be a camelCase identifier (matching `^[a-z][a-zA-Z0-9]*$`). Verified by a unit test to be created at `tests/presentation/i18n/locale-keys.test.ts` per [conventions.md Section 11](../../technical/conventions.md#11-internationalization-i18n).

### Transitions & Animation

- **NFR-01c-01 — Route fade:** 200ms opacity transition, `ease-in-out`.
- **NFR-01c-02 — Toast enter:** Slide in horizontally from off-screen right with opacity fade, 300ms `ease-out`.
- **NFR-01c-03 — Toast leave:** Fade out, 200ms `ease-in`.
- **NFR-01c-04 — Modal enter:** Fade in + scale from 0.95 to 1 (content card only), 200ms `ease-out`.
- **NFR-01c-05 — Modal leave:** Fade out + scale from 1 to 0.95 (content card only), 150ms `ease-in`. Note: 150ms is below the UI/UX spec's 200–300ms guideline; intentional for snappier leave feel.
- **NFR-01c-06 — Motion sensitivity:** All transitions and `animate-pulse` animation disabled when `prefers-reduced-motion` is set.
- **NFR-01c-07 — Duration cap:** No transition exceeds 300ms.

### Stacking Order

Overlay elements use the following z-index scale. Navigation component z-indices are defined in R-01i.

- Modal backdrop: `z-40`
- Modal content card: `z-40` (same layer as backdrop; stacks above via DOM order)
- Toast container: `z-50` (renders above modals — toasts remain visible when a modal is open)

### Architecture Compliance

- **CSS centralization:** No CSS files other than `src/assets/main.css` shall exist in the project. All transition and animation styles are centralized in the single Tailwind entry point.
- **Composable location:** Toast and modal composables live in `src/presentation/composables/` rather than `src/application/` because they manage UI-only state with no domain or infrastructure dependencies. This introduces a `composables/` subdirectory under `src/presentation/` not currently defined in `architecture.md` — both `architecture.md` and the glossary entry for "Composable" should be updated to acknowledge that purely UI-state composables may reside in the Presentation layer.
- **NFR-01h-01 — `main.ts` exception:** `src/main.ts` importing from `src/presentation/composables/` is an intentional exception to typical layer boundaries because the global handler must call `useToast()` outside component `setup()`. _Threshold: No additional cross-layer imports beyond this documented exception._
- **SFC block order:** `<script setup>` then `<template>` then `<style>` (rare). Verifiable by linting SFC files.
- **File naming:** kebab-case for all component files. Verifiable by checking file names match `[a-z0-9-]+\.vue`.

### Accessibility

- SkeletonLoader div uses `aria-hidden="true"` since it is purely decorative (see Decisions). Verifiable by inspecting rendered HTML.
- EmptyState CTA uses a native `<button>` element. Optional icon is treated as decorative (`aria-hidden="true"` on the icon wrapper). Verifiable by inspecting rendered HTML.
- `animate-pulse` on SkeletonLoader is disabled when `prefers-reduced-motion: reduce` is active, handled by the existing CSS rule in `src/assets/main.css`. Verifiable by toggling the media query in dev tools.
- Toast and modal transitions must respect `prefers-reduced-motion` by setting transition duration to 0ms when the user preference is `reduce`.
- Dismiss and action buttons must meet minimum touch target size of 44×44px per ui-ux.md guidelines.
- **NFR-01h-02 — Error fallback accessibility:** The error-boundary fallback uses `role="alert"` so assistive technology announces the crash state when it appears. _Threshold: The fallback message is announced when displayed._

### Performance

- **Initial load:** The main bundle (before lazy-loaded route chunks) should remain under 150 KB gzipped, establishing a baseline before feature code is added.
- **Lazy chunks:** Each route's lazy-loaded chunk should remain under 20 KB gzipped.
- **Measurement:** Measured from `vite build` output sizes.

## UI/UX Specs

Visual contracts per `docs/technical/ui-ux.md`:

- **SkeletonLoader** (section 8 — Loading States): `animate-pulse bg-surface` shimmer, configurable dimensions and border radius.
- **EmptyState** (section 9 — Empty States): Centered layout with muted icon, bold heading, slate-400 supporting text, optional primary teal CTA button.

## Risks & Assumptions

### Assumptions

- Phase 00 (Setup) is fully released and the base tooling is stable.
- `vitest.config.ts` uses the `mergeConfig(viteConfig, defineConfig({ test: {} }))` pattern and the `test: {}` block can be extended with additional properties.
- The `@` path alias (`@ → ./src`) configured in `vite.config.ts` is inherited by Vitest via `mergeConfig` and does not need separate configuration.
- Phase 00 (Setup) is complete: vue-i18n is installed, `src/presentation/i18n/index.ts` exists, and all three locale files contain the `app.title` key.
- Spanish and French translations use standard UI terminology; native speaker review is deferred to a later phase.
- Tailwind v4 `@theme` block supports arbitrary CSS custom properties for extending the design token set.
- Vue 3 `<Transition>` class naming convention (`name-enter-active`, `name-leave-active`, etc.) is stable and will not change in minor versions.
- Firebase SPA rewrite is configured in Phase 00.
- 01a has been completed: vue-router is installed and i18n title keys (`page.*.title`) exist (SC-01b-12).
- Module-level singleton state persists correctly during Vite HMR in development.
- The `TOAST_DISMISS_MS` constant from 01c exists and exports the expected value (4000ms).
- `animate-pulse` is sufficient for the shimmer effect (no custom keyframe needed).
- The `bg-surface` theme color (`--color-surface`) is already defined in `src/assets/main.css` (from base project setup) before SkeletonLoader is implemented.
- `@vue/test-utils` is available from prerequisite 01a for component testing.
- `useToast` and `useModal` composables are implemented and tested (01e dependency).
- Transition CSS classes (`toast-*`, `modal-*`) exist in `main.css` (delivered in 01c).
- No accessibility focus trapping is required for the modal (per ui-ux.md § 11: minimal scope).

### Risks

- **`globals: true` may conflict with explicit Vitest imports:** If a downstream test file explicitly imports `describe`/`it`/`expect` from `vitest` while globals are enabled, TypeScript may flag duplicate declarations. Likelihood: Low. Impact: Medium (TypeScript compile errors in downstream tests). Mitigation: project convention should mandate using globals without imports; the code example in `docs/technical/testing.md` will be updated as part of this phase to remove the explicit import and align with this convention.
- **TypeScript global type recognition:** Enabling `globals: true` in Vitest does not automatically make `describe`/`it`/`expect` visible to the TypeScript compiler. Likelihood: Low. Impact: High (all downstream test files would fail type-checking). Mitigation: add `/// <reference types="vitest/globals" />` directive at the top of `tests/setup.ts` (specified in SC-01a-03).
- **Translation accuracy** (low likelihood, low impact): Translations cannot be verified in context until downstream features (01i, 01j) render the keys in UI components. Mitigation: translations use standard, well-known UI terms.
- **Key path mismatch** (medium likelihood, medium impact): Downstream features (01d, 01h, 01i, 01j) may reference key paths that do not match the exact paths defined here. Mitigation: downstream requirements explicitly list the keys they consume; the locale key parity test catches missing keys.
- **Low likelihood, low impact:** If Tailwind v4 changes the `@theme` block syntax in a future update, the custom property declarations may need to be moved. Mitigation: pin Tailwind version in `package.json`.
- **Firebase SPA fallback** (low likelihood, high impact): `createWebHistory()` requires Firebase SPA rewrite. Mitigation: verify `hosting.rewrites` from Phase 00.
- **Leaked timers during HMR** (low likelihood, low impact): Tests validate timer cleanup; HMR invalidation replaces module state.
- **Module-level state not cleared between tests** (medium likelihood, medium impact): Expose a `_resetForTesting()` helper or clear state in `beforeEach` via the public API.

## Acceptance Criteria

- [ ] [SC-01a-01] `package.json` lists `vue-router@^4.5` under `dependencies`
- [ ] [SC-01a-01] `package.json` lists `@vue/test-utils@^2.4` under `devDependencies`
- [ ] [SC-01a-02] `vitest.config.ts` updated with `globals: true`, `include`, and `setupFiles` inside the existing `test: {}` block
- [ ] [SC-01a-03] `tests/setup.ts` exists with `localStorage.clear()` in `beforeEach`
- [ ] [SC-01a-03] `tests/setup.ts` includes `/// <reference types="vitest/globals" />` for TypeScript global recognition
- [ ] [SC-01a-02] `npm run test` runs without config errors
- [ ] [SC-01a-02, NFR-01a-01] `npm run check` passes with zero failures (note: the `check` script runs `format` and `lint:fix` which may auto-fix files — this is inherited behavior from Phase 00, not introduced by this phase)
- [ ] [SC-01a-02] `docs/technical/testing.md` code example updated to use Vitest globals without explicit imports, aligning with the `globals: true` convention
- [ ] [SC-01b-12] All three locale files (`en.json`, `es.json`, `fr.json`) contain the new key namespaces: `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*`
- [ ] [SC-01b-12] All three files have identical key paths
- [ ] [SC-01b-12] All translation values are non-empty strings in all three files
- [ ] [SC-01b-12] Existing `app.title` key is preserved in all three files
- [ ] [SC-01b-12] All locale files are valid JSON after modification
- [ ] [SC-01b-12] All key paths follow flat dot-notation with camelCase segments per conventions.md Section 11
- [ ] [SC-01b-12] Each locale file contains exactly 18 new keys across the 5 specified namespaces
- [ ] [SC-01b-12, NFR-01b-01] Unit test at `tests/presentation/i18n/locale-keys.test.ts` passes, confirming all key segments match camelCase regex
- [ ] [SC-01b-12] vue-i18n fallback to English is verified for the scaffolded keys (e.g., removing a key from `es.json` causes vue-i18n to fall back to the English value)
- [ ] [SC-01c-21] `--color-success` (`#22c55e`) and `--color-error` (`#ef4444`) exist in the `@theme` block of `src/assets/main.css`
- [ ] [SC-01c-09] Fade transition classes (`.fade-enter-active`, `.fade-leave-active`, `.fade-enter-from`, `.fade-leave-to`) are defined
- [ ] [SC-01c-22] Toast transition classes (`.toast-enter-active`, `.toast-leave-active`, `.toast-enter-from`, `.toast-leave-to`) are defined
- [ ] [SC-01c-23] Modal transition classes (`.modal-enter-active`, `.modal-leave-active`, `.modal-enter-from`, `.modal-leave-to`) are defined for the content card
- [ ] [SC-01c-24] `prefers-reduced-motion` disables all transitions and `animate-pulse` animation
- [ ] [NFR-01c-07] No transition duration exceeds 300ms
- [ ] [SC-01c-25] `TOAST_DISMISS_MS` constant exists in `src/domain/constants.ts` with value `4000`
- [ ] Existing theme variables (`--color-bg-primary`, `--color-bg-secondary`, `--color-surface`, `--color-accent`, `--font-sans`) in `src/assets/main.css` are preserved
- [ ] Unit test verifies `TOAST_DISMISS_MS` value and type
- [ ] `npm run check` passes with no errors
- [ ] [SC-01d-29] Router uses `createWebHistory()` (HTML5 history mode, no hash fragments)
- [ ] [SC-01d-29] Router registered in `src/main.ts` with `app.use(router)`
- [ ] [SC-01d-02] 4 named routes exist (`home`, `calendar`, `library`, `settings`) with correct paths
- [ ] [SC-01d-02] Catch-all `/:pathMatch(.*)*` redirects to `/`
- [ ] [SC-01d-03] Router config uses `() => import(...)` syntax for all 4 route components
- [ ] [SC-01d-03] Lazy-loaded chunks appear in `vite build` output
- [ ] [SC-01d-10] `document.title` updates via i18n on every navigation (`afterEach` guard)
- [ ] [SC-01d-11] `scrollBehavior` returns `{ top: 0 }`
- [ ] [NFR, Performance] Main bundle remains under 150 KB gzipped
- [ ] [NFR, Performance] Each route's lazy-loaded chunk remains under 20 KB gzipped
- [ ] [SC-01d-22] Router unit tests pass
- [ ] [SC-13] `useToast` adds toasts to the queue with unique IDs
- [ ] [SC-13] `useToast` removes toasts via `removeToast(id)`
- [ ] [SC-13] Toasts auto-dismiss after `TOAST_DISMISS_MS`
- [ ] [SC-13] Maximum `MAX_VISIBLE_TOASTS` (5) simultaneous toasts; when exceeded, the oldest toast is evicted
- [ ] [SC-13] `removeToast(id)` with a non-existent ID has no effect and does not throw
- [ ] [SC-12] `useModal` `open(props)` sets the modal visible and stores props (including optional callbacks)
- [ ] [SC-12] `useModal` `close()` hides the modal and clears props
- [ ] [SC-12] Calling `close()` when no modal is open has no effect and does not throw
- [ ] [SC-12] Opening a second modal replaces the first — single-instance behavior
- [ ] [SC-13] `addToast` works correctly when the optional `action` field is omitted
- [ ] [SC-13] `removeToast(id)` clears the auto-dismiss timer for that toast
- [ ] `architecture.md` updated to document `src/presentation/composables/` for UI-only state composables
- [ ] Glossary "Composable" entry updated to acknowledge Presentation-layer composables
- [ ] `MAX_VISIBLE_TOASTS` constant documented in `data-model.md` constants table
- [ ] [SC-23] All composable unit tests pass
- [ ] [SC-17] SkeletonLoader renders with configurable `width`, `height`, and `rounded` props
- [ ] [SC-17] SkeletonLoader applies `animate-pulse bg-surface` classes
- [ ] [SC-16] EmptyState renders icon, title, description, and CTA button when all props provided
- [ ] [SC-16] EmptyState renders only title when optional props are omitted
- [ ] [SC-16] CTA button invokes `ctaAction` handler when clicked
- [ ] [SC-24] Component tests for EmptyState pass
- [ ] [SC-17] SkeletonLoader renders with `aria-hidden="true"`
- [ ] [SC-17] SkeletonLoader renders with default width, height, and rounded when props are omitted
- [ ] [SC-24] Component tests for SkeletonLoader pass
- [ ] [SC-14] Toast container is fixed top-right with `z-50`
- [ ] [SC-14] Toasts stack vertically (flex column, `gap-3`) without overlapping
- [ ] [SC-14] Each toast has a dismiss button; clicking it removes the toast
- [ ] [SC-14] Toasts display type-colored left borders (error -> `--color-error`, success -> `--color-success`, info -> `--color-accent`)
- [ ] [SC-14] Toast enter/leave uses `<TransitionGroup>` animation (300 ms slide-in, 200 ms fade-out)
- [ ] [SC-14] When toast queue exceeds 5, oldest toast is evicted
- [ ] [SC-14] Optional action button renders left of dismiss button and invokes callback when clicked
- [ ] [SC-14, SC-15] Toast and modal transitions are disabled when `prefers-reduced-motion: reduce` is active
- [ ] [SC-15] Modal renders backdrop overlay (`bg-black/50`) and centered content card
- [ ] [SC-15] Modal displays title, optional content (hidden when not provided), confirm and cancel buttons
- [ ] [SC-15] Modal closes on backdrop click
- [ ] [SC-15] Modal closes on Escape key (document-level listener)
- [ ] [SC-15] Confirm button invokes `onConfirm` callback and closes the modal
- [ ] [SC-15] Cancel button invokes `onCancel` callback and closes the modal
- [ ] [SC-15] Opening a new modal replaces any currently active modal
- [ ] [SC-15] Modal confirm button defaults to `$t('modal.confirm')` and cancel button defaults to `$t('modal.cancel')` when labels are not provided
- [ ] [SC-15] Clicking inside the modal content card does not close the modal
- [ ] [SC-15] Modal content scrolls internally when content exceeds viewport height
- [ ] [SC-24] Component tests for ToastContainer pass
- [ ] [SC-24] Component tests for ModalDialog pass
- [ ] [SC-18] Error boundary renders slot content in normal state
- [ ] [SC-18] Error boundary shows a full-screen centered fallback UI with translated error heading, description, and primary "Reload" button when a child component throws
- [ ] [SC-18] Error boundary returns `false` from `onErrorCaptured` to prevent propagation
- [ ] [SC-18] Reload button calls `window.location.reload()`
- [ ] [SC-19] Global error handler logs uncaught component/render errors to `console.error`
- [ ] [SC-19] Global error handler dispatches an error toast with the translated `toast.error` message to the shared `useToast()` queue
- [ ] [SC-24] ErrorBoundary component tests pass
- [ ] [SC-19] Global error handler test passes
- [ ] [NFR-01h-02] Error boundary fallback UI uses `role="alert"` for accessibility

## Constraints

- **Runtime dependencies:** No new runtime dependencies beyond `vue-router@^4.5`. All other tools (Tailwind, vue-i18n, lucide-vue-next, Zod) are already installed from Phase 00.
- **Dev dependencies:** `@vue/test-utils@^2.4` is the only new dev dependency.
- Must use `createWebHistory()` (no hash mode) — requires Firebase SPA rewrite for server-side fallback.
- View component files (`*-screen.vue`) are provided by change 01j — router configuration will reference them before they exist.
- Existing bootstrap files modified in this scaffolding sequence are limited to `src/main.ts` and `src/App.vue`; most new implementation lives under `src/presentation/`.
- Composables must work both inside and outside Vue component `setup()` context (needed by the global error handler in 01h).
- `MAX_VISIBLE_TOASTS` must be defined as a named constant in `src/domain/constants.ts`.
