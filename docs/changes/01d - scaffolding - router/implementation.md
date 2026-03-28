# Implementation: App Scaffolding — Router

## Overview

Configured Vue Router with 4 lazy-loaded routes, a catch-all redirect, scroll-to-top behavior, and i18n-based document title updates. The router uses `createWebHistory()` for clean URLs and is registered in `main.ts` after the i18n plugin. An `afterEach` guard sets `document.title` using the i18n instance's `t()` function, reading each route's `meta.titleKey` to produce translated page titles in the format `"Page Title — Plot Twisted"`.

Placeholder view files were created in `src/presentation/views/` to satisfy Vite's import analysis during testing. These minimal stubs will be replaced by full implementations in change 01j.

## Files Changed

### Created

- `src/presentation/router.ts` — Router configuration with `createWebHistory()`, 4 named routes with lazy-loaded components, catch-all redirect, `scrollBehavior` returning `{ top: 0 }`, `RouteMeta` module augmentation for `titleKey`, and `afterEach` guard setting `document.title` via i18n.
- `tests/presentation/router.test.ts` — 16 unit tests covering route definitions, catch-all redirect, lazy loading verification, `meta.titleKey` per route, scroll behavior, and document title updates via i18n mock.
- `src/presentation/views/home-screen.vue` — Minimal placeholder view (replaced by 01j).
- `src/presentation/views/calendar-screen.vue` — Minimal placeholder view (replaced by 01j).
- `src/presentation/views/library-screen.vue` — Minimal placeholder view (replaced by 01j).
- `src/presentation/views/settings-screen.vue` — Minimal placeholder view (replaced by 01j).

### Modified

- `src/main.ts` — Added `import router from './presentation/router'` and `app.use(router)` after `app.use(i18n)`.

## Key Decisions

- **Placeholder view files**: Vite's `vite:import-analysis` plugin validates dynamic import targets at transform time, before Vitest's `vi.mock()` can intercept. Created minimal `<template><div>Name</div></template>` stubs so tests and builds pass before 01j provides real views.
- **`router.options.routes` for lazy-loading test**: Used `router.options.routes` instead of `router.getRoutes()` to verify lazy-loaded component functions. Vue Router replaces lazy functions with resolved components in normalized route records after navigation, making `getRoutes()` unreliable when other tests navigate first.
- **`router.push()` for catch-all test**: `router.resolve()` does not follow redirects in Vue Router, so the catch-all redirect test uses `router.push()` and asserts on `router.currentRoute.value`.
- **Parameterless `scrollBehavior()`**: Removed unused `_to`, `_from`, `_savedPosition` parameters to satisfy ESLint `no-unused-vars` rule, since all parameters are ignored per SC-01d-11.

## Deviations from Plan

- **Placeholder view files added**: The plan expected view files from 01j and noted that "TypeScript will not error on dynamic `import()` targets." While true for TypeScript, Vite's import analysis also validates dynamic imports at transform time, blocking both tests and builds. Created minimal stubs to unblock.
- **`scrollBehavior` signature simplified**: Plan specified `scrollBehavior(_to, _from, _savedPosition)` but ESLint `no-unused-vars` flagged all three parameters. Simplified to `scrollBehavior()` since the return value is unconditional.

## Testing

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

## Dependencies

No new dependencies. `vue-router` (^5.0.4) and `vue-i18n` (^11.3.0) were already installed by change 01a.

## Performance

- **Main bundle**: 68.80 KB gzipped (under 150 KB limit).
- **Lazy chunks**: ~0.15 KB gzipped each (under 20 KB limit). Sizes will increase when 01j adds real view content.

## Known Limitations

- View placeholder files are minimal stubs. They will be replaced by 01j with full implementations.
- `npm run dev` will render placeholder divs when navigating to routes until 01j provides real views.
- The `afterEach` title guard depends on `meta.titleKey` existing on each route. Routes added by future features must include this meta property to get document title updates.
