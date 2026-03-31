# Implementation: App Scaffolding

## Overview

This implementation covers the foundational scaffolding layers for the application. It installs the two remaining runtime and dev dependencies (`vue-router`, `@vue/test-utils`), configures the Vitest test infrastructure, and adds 18 i18n keys across 5 namespaces to all three locale files. It also establishes the visual foundation with Tailwind theme color tokens for success/error states, Vue `<Transition>` CSS classes for route fades, toast notifications, and modal dialogs, a `prefers-reduced-motion` override for accessibility, and the `TOAST_DISMISS_MS` domain constant. All CSS is centralized in `src/assets/main.css` as an acknowledged exception to the Tailwind-only rule, since Vue's `<Transition>` component requires class-based CSS.

Configured Vue Router with 4 lazy-loaded routes, a catch-all redirect, scroll-to-top behavior, and i18n-based document title updates. The router uses `createWebHistory()` for clean URLs and is registered in `main.ts` after the i18n plugin. An `afterEach` guard sets `document.title` using the i18n instance's `t()` function, reading each route's `meta.titleKey` to produce translated page titles in the format `"Page Title — Plot Twisted"`. Placeholder view files were created in `src/presentation/views/` to satisfy Vite's import analysis during testing.

Created two reusable UI primitives — `SkeletonLoader` and `EmptyState` — in the Presentation layer's `common/` directory, following a test-first approach. Both components are stateless, translation-agnostic primitives that receive all content via props.

Created the `ToastContainer` and `ModalDialog` overlay components that render the toast queue and modal state managed by the composables. The toast container renders a queue of notifications in the top-right corner with type-colored borders, dismiss buttons, and optional action buttons. The modal dialog renders a centered confirmation dialog with backdrop overlay, title, optional content, and confirm/cancel buttons with i18n-driven default labels.

Implemented the `useToast` and `useModal` composables as module-level singleton reactive state managers for toast notifications and modal dialogs. Both composables live in `src/presentation/composables/` — a new directory in the Presentation layer for UI-only state composables that have no domain or infrastructure dependencies. The module-level pattern ensures both composables work outside Vue component `setup()`, which is required by the global error handler (01h). Unit tests were written test-first in `tests/presentation/composables/`, covering all functional requirements. Architecture and reference documentation was updated to reflect the new `composables/` directory and the distinction between Application-layer and Presentation-layer composables.

Added an `ErrorBoundary` presentation component and wired it around the routed application content in `src/App.vue`. The boundary catches descendant render/setup errors, replaces the normal UI with a translated full-screen fallback state, exposes a reload action, and returns `false` from `onErrorCaptured` so handled crashes do not propagate.

`src/main.ts` now also registers `app.config.errorHandler` after plugin setup. Uncaught Vue component/render errors outside the boundary are logged to `console.error` and dispatched to the shared toast queue with `i18n.global.t('toast.error')`, giving the scaffolded shell a documented recovery path for unexpected failures.

## Files Changed

### Created

- `tests/setup.ts` — Test setup file loaded by Vitest before each test run. Includes `/// <reference types="vitest/globals" />` for TypeScript global recognition and `localStorage.clear()` in `beforeEach` to prevent state leakage between tests.
- `tests/presentation/i18n/locale-keys.test.ts` — Unit test validating locale file structure: key parity across all three locales, non-empty string values, expected 19-key set, `app.title` preservation, and camelCase segment compliance (NFR-01b-01).
- `src/domain/constants.ts` — Exports `TOAST_DISMISS_MS = 4000`, the auto-dismiss timeout for toast notifications. Located in the Domain layer as a pure TypeScript constant consumed by downstream composables (R-01e) and components (R-01g).
- `tests/domain/constants.test.ts` — Unit tests verifying `TOAST_DISMISS_MS` is exported with value `4000` and is of type `number`.
- `src/presentation/router.ts` — Router configuration with `createWebHistory()`, 4 named routes with lazy-loaded components, catch-all redirect, `scrollBehavior` returning `{ top: 0 }`, `RouteMeta` module augmentation for `titleKey`, and `afterEach` guard setting `document.title` via i18n.
- `tests/presentation/router.test.ts` — 16 unit tests covering route definitions, catch-all redirect, lazy loading verification, `meta.titleKey` per route, scroll behavior, and document title updates via i18n mock.
- `src/presentation/views/home-screen.vue` — Minimal placeholder view (replaced by 01j).
- `src/presentation/views/calendar-screen.vue` — Minimal placeholder view (replaced by 01j).
- `src/presentation/views/library-screen.vue` — Minimal placeholder view (replaced by 01j).
- `src/presentation/views/settings-screen.vue` — Minimal placeholder view (replaced by 01j).
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

### Modified

- `package.json` — Added `vue-router@^5.0.4` to `dependencies` and `@vue/test-utils@^2.4.6` to `devDependencies`.
- `package-lock.json` — Updated lockfile reflecting the two new packages and their transitive dependencies (51 packages added total).
- `vitest.config.ts` — Added `globals: true`, `include: ['tests/**/*.test.ts']`, and `setupFiles: ['./tests/setup.ts']` to the existing `test: {}` block. Preserved the `mergeConfig(viteConfig, defineConfig(...))` pattern and `environment: 'jsdom'`.
- `docs/technical/testing.md` — Removed the `import { describe, it, expect } from 'vitest'` line from the code example in the "Test Pattern" section, aligning the documentation with the `globals: true` convention.
- `src/presentation/i18n/locales/en.json` — Added 18 English translation keys across 5 namespaces.
- `src/presentation/i18n/locales/es.json` — Added 18 Spanish translation keys across 5 namespaces.
- `src/presentation/i18n/locales/fr.json` — Added 18 French translation keys across 5 namespaces.
- `src/assets/main.css` — Added `--color-success: #22c55e` and `--color-error: #ef4444` to the existing `@theme` block. Added `.fade-*` transition classes (200ms opacity, ease-in-out), `.toast-*` transition classes (300ms enter with translateX slide + opacity, 200ms leave fade), `.modal-*` transition classes (200ms enter with scale + opacity, 150ms leave), and a `@media (prefers-reduced-motion: reduce)` block disabling all transitions and `animate-pulse` animation.
- `tsconfig.vitest.json` — Added `src/**/*` and `src/**/*.vue` to the `include` array so that test files can import source modules without TypeScript project boundary errors.
- `src/main.ts` — Registers the router after i18n and configures the global Vue error handler that logs uncaught component/render errors and dispatches translated error toasts via `useToast()`.
- `src/App.vue` — Wraps routed application content in `ErrorBoundary` so component crashes surface the documented fallback UI.
- `src/domain/constants.ts` — Added `MAX_VISIBLE_TOASTS = 5` constant.
- `docs/technical/architecture.md` — Added `composables/` to the Presentation-layer folder structure and description.
- `docs/technical/testing.md` — Added `tests/presentation/composables/` to the test directory tree example.
- `docs/technical/data-model.md` — Added `MAX_VISIBLE_TOASTS` to the constants table.
- `docs/reference/glossary.md` — Updated "Composable" entry to distinguish Application-layer and Presentation-layer composables.
- `src/presentation/i18n/locales/en.json` — Added `modal.confirm` and `modal.cancel` keys for default button labels.
- `src/presentation/i18n/locales/es.json` — Added Spanish translations: `modal.confirm: "Confirmar"`, `modal.cancel: "Cancelar"`.
- `src/presentation/i18n/locales/fr.json` — Added French translations: `modal.confirm: "Confirmer"`, `modal.cancel: "Annuler"`.
- `tests/presentation/i18n/locale-keys.test.ts` — Updated `EXPECTED_KEYS` array to include `modal.confirm` and `modal.cancel`; updated test description to reflect 21 keys.

## Key Decisions

- **No `passWithNoTests` added during initial setup**: The original 01a setup kept Vitest defaults rather than changing config solely to accommodate an empty suite. Later scaffolding phases introduced the current passing test suite, so the configuration remains unchanged.
- **Flat JSON structure**: Locale files use flat dot-notation keys (e.g., `{ "nav.home": "Home" }`) with `flatJson: true` in the vue-i18n configuration. The `$t('nav.home')` calls work identically — vue-i18n resolves dot-separated paths in flat key maps when `flatJson` is enabled.
- **Test uses `fs.readFileSync`**: The test reads locale files directly from disk rather than importing them as modules. This provides explicit file existence validation and avoids potential interference from the `@intlify/unplugin-vue-i18n` Vite plugin that transforms locale files during build.
- **Theme colors appended to existing `@theme` block**: Kept all theme tokens in a single block rather than creating a separate one, maintaining the existing pattern established in R-00.
- **Modal leave duration at 150ms**: Intentionally below the UI/UX spec's 200–300ms guideline for a snappier leave feel, as documented in NFR-01c-05.
- **Placeholder view files**: Vite's `vite:import-analysis` plugin validates dynamic import targets at transform time, before Vitest's `vi.mock()` can intercept. Created minimal `<template><div>Name</div></template>` stubs so tests and builds pass before 01j provides real views.
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

## Deviations from Plan

- **tsconfig.vitest.json fix**: The vitest TypeScript config only included `tests/**/*.ts` in its `include` array, which meant source files imported by tests were outside the project boundary. Added `src/**/*` and `src/**/*.vue` to fix TS error 6307. This was a pre-existing config issue that surfaced when the first test importing from `src/` was introduced.
- **Placeholder view files added**: The plan expected view files from 01j and noted that "TypeScript will not error on dynamic `import()` targets." While true for TypeScript, Vite's import analysis also validates dynamic imports at transform time, blocking both tests and builds. Created minimal stubs to unblock.
- **`scrollBehavior` signature simplified**: Plan specified `scrollBehavior(_to, _from, _savedPosition)` but ESLint `no-unused-vars` flagged all three parameters. Simplified to `scrollBehavior()` since the return value is unconditional.
- `src/App.vue` was updated in addition to the plan's originally listed files because the existing root component needed to place the router outlet inside the global error boundary.
- The visual fallback and toast-dispatch verification items were satisfied through automated tests rather than a separate manual browser check.

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
- Behavioral scenarios (SC-01c-22-02, SC-01c-22-03, SC-01c-23-02, SC-01c-24-01 through SC-01c-24-03) are deferred to R-01g and R-01k integration testing, as they require the toast component, modal component, and app shell wiring that those phases deliver.

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

## Verification Results

- `npm test` — PASS (11 files, 100 tests)
- `npm run lint` — PASS
- `npm run type-check` — PASS
- `npm run check` — PASS (format, lint, type-check, test, build all clean)

## Dependencies

- `vue-router@^5.0.4` — Vue Router for SPA routing (runtime dependency, used starting in phase 01d).
- `@vue/test-utils@^2.4.6` — Official Vue test utilities for mounting and interacting with components in tests (dev dependency, used starting in phase 01f+).

No new dependencies were added for the router phase. `vue-router` (^5.0.4) and `vue-i18n` (^11.3.0) were already installed by change 01a.
No new dependencies were added for error handling.

## Performance

- **Main bundle**: 68.80 KB gzipped (under 150 KB limit).
- **Lazy chunks**: ~0.15 KB gzipped each (under 20 KB limit). Sizes will increase when 01j adds real view content.

## Requirement Coverage

| Requirement                    | Implementation                                                                                                                                                                                                    |
| :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SC-01c-21 (Theme additions)    | `--color-success` and `--color-error` added to `@theme` block in `src/assets/main.css:9-10`                                                                                                                       |
| SC-01c-09 (Fade transition)    | `.fade-*` classes at `src/assets/main.css:13-21`                                                                                                                                                                  |
| SC-01c-22 (Toast transition)   | `.toast-*` classes at `src/assets/main.css:23-37`                                                                                                                                                                 |
| SC-01c-23 (Modal transition)   | `.modal-*` classes at `src/assets/main.css:39-53`                                                                                                                                                                 |
| SC-01c-24 (Reduced-motion)     | `@media (prefers-reduced-motion: reduce)` block at `src/assets/main.css:55-68`                                                                                                                                    |
| SC-01c-25 (Domain constants)   | `TOAST_DISMISS_MS` exported from `src/domain/constants.ts:2`                                                                                                                                                      |
| SC-01d-29 (Vue Router setup)   | `createWebHistory()` in `src/presentation/router.ts`, registered in `src/main.ts`                                                                                                                                 |
| SC-01d-02 (Route definitions)  | 4 named routes + catch-all redirect in `src/presentation/router.ts`                                                                                                                                               |
| SC-01d-03 (Route lazy loading) | Dynamic `import()` for all 4 route components                                                                                                                                                                     |
| SC-01d-10 (Document title)     | `afterEach` guard with i18n `t()` in `src/presentation/router.ts`                                                                                                                                                 |
| SC-01d-11 (Scroll-to-top)      | `scrollBehavior` returning `{ top: 0 }` in `src/presentation/router.ts`                                                                                                                                           |
| SC-01d-22 (Router unit tests)  | 16 tests in `tests/presentation/router.test.ts`                                                                                                                                                                   |
| SC-13 (Toast notification)     | `src/presentation/composables/use-toast.ts` with `addToast()`, `removeToast()`, auto-dismiss, eviction                                                                                                            |
| SC-12 (Modal/dialog)           | `src/presentation/composables/use-modal.ts` with `open()`, `close()`, single-instance replacement                                                                                                                 |
| SC-23 (Composable unit tests)  | 21 tests in `tests/presentation/composables/` (13 toast + 8 modal)                                                                                                                                                |
| SC-16 (Empty state component)  | `empty-state.vue` — centered layout, optional icon/description/CTA, all string props pre-translated                                                                                                               |
| SC-17 (Skeleton loader)        | `skeleton-loader.vue` — shimmer div with `animate-pulse bg-surface`, configurable dimensions, `aria-hidden="true"`                                                                                                |
| SC-14 (Toast container)        | `toast-container.vue` — fixed top-right positioning, z-50, TransitionGroup with `toast-*` classes, type-colored borders, dismiss button with X icon, optional action button, max 5 toasts (handled by composable) |
| SC-15 (Modal/dialog)           | `modal-dialog.vue` — backdrop with `bg-black/50`, centered content card, Escape key listener, confirm/cancel buttons with i18n defaults, `@click.stop` on content card                                            |
| SC-18 (Error boundary)         | `src/presentation/components/error/error-boundary.vue` in `src/App.vue` catches descendant render/setup errors, renders translated fallback UI with `role="alert"`, and reloads via a primary action              |
| SC-19 (Global error handler)   | `app.config.errorHandler` in `src/main.ts` logs uncaught component/render errors and dispatches translated error toasts through `useToast()`                                                                      |
| SC-24 (UI primitive tests)     | `empty-state.test.ts` (SC-24-01), `skeleton-loader.test.ts` (SC-24-02), `error-boundary.test.ts` (SC-24-03, SC-24-06), `toast-container.test.ts` (SC-24-04), `modal-dialog.test.ts` (SC-24-05)                    |

## Known Limitations

- A dedicated `tsconfig.vitest.json` was added (extending `tsconfig.app.json`) to provide IDE type-checking for test files. It adds `vitest/globals` and `node` types and includes `tests/**/*.ts`. Without this, VS Code cannot resolve `describe`, `it`, `expect`, or Node.js APIs in test files.
- **Translation accuracy**: Spanish and French translations use standard UI terminology but have not been reviewed by native speakers. This is noted as a deferred concern in the requirements.
- **Fallback verification (AC9)**: vue-i18n fallback to English is implicitly satisfied by the `fallbackLocale: 'en'` configuration from Phase 00. Explicit runtime fallback testing is deferred to downstream features (01i, 01j) that provide rendering components to exercise the fallback chain.
- Theme colors target the dark theme only; light-theme counterparts are deferred to a future theme-switching feature phase.
- Behavioral verification of transitions requires downstream components (R-01g, R-01k) and is deferred to those phases.
- View placeholder files are minimal stubs. They will be replaced by 01j with full implementations.
- `npm run dev` will render placeholder divs when navigating to routes until 01j provides real views.
- The `afterEach` title guard depends on `meta.titleKey` existing on each route. Routes added by future features must include this meta property to get document title updates.
- Skeleton composition variants (card skeleton, hero skeleton, etc.) are out of scope — deferred to consuming features.
- No responsive-specific skeleton behavior beyond standard Tailwind responsiveness.
- **Accessibility**: Per ui-ux.md § 11, no focus trapping is implemented for the modal. Focus remains on the element that triggered the modal.
- **Reduced motion**: Transition disabling for `prefers-reduced-motion` is handled entirely by CSS media queries in `main.css`. The components do not programmatically detect or respond to motion preferences.
- **Integration**: ToastContainer and ModalDialog components are not yet integrated into `App.vue`. That integration is handled by R-01k (App Shell & Assembly).
