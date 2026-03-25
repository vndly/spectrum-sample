---
id: R-01d
title: App Scaffolding — Router
status: draft
type: infrastructure
importance: critical
tags: [routing, navigation]
---

## Intent

Configure Vue Router with 4 lazy-loaded routes, catch-all redirect, scroll-to-top, and i18n-based document title updates.

## Prerequisites

- 01a (vue-router installed, test infrastructure).
- 01b (i18n keys for document title).

## Decisions

| Decision            | Choice                 | Rationale                                                                                              |
| :------------------ | :--------------------- | :----------------------------------------------------------------------------------------------------- |
| Router history mode | `createWebHistory()`   | Clean URLs without hash fragments. Firebase SPA rewrite already handles fallback.                      |
| Home route matching | Exact match only       | Prevents the Home nav item from appearing active on every route.                                       |

## Scope

- Create router configuration in `src/presentation/router.ts`.
- Register router in `src/main.ts`.
- Write router unit tests.

## Functional Requirements

| ID    | Requirement         | Description                                                                                                                                                                                                                                         | Priority |
| :---- | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-01 | Vue Router setup    | `vue-router@^4` installed; `@vue/test-utils@^2` installed as dev dependency. `createWebHistory()`, router registered in `main.ts`. Routes defined in `src/presentation/router.ts`. Note: the dependencies were installed in 01a.                     | P0       |
| SC-02 | Route definitions   | 4 named routes (home `/`, calendar `/calendar`, library `/library`, settings `/settings`) plus catch-all `/:pathMatch(.*)*` redirecting to `/`.                                                                                                      | P0       |
| SC-03 | Route lazy loading  | All 4 view components loaded via dynamic `import()` for code splitting.                                                                                                                                                                              | P0       |
| SC-10 | Document title      | `router.afterEach` guard sets `document.title` to `${t(meta.titleKey)} — ${t('app.title')}`.                                                                                                                                                        | P1       |
| SC-11 | Scroll-to-top       | Router `scrollBehavior` returns `{ top: 0 }` on every navigation.                                                                                                                                                                                    | P1       |
| SC-22 | Router unit tests   | Tests for route definitions (4 named routes + catch-all), `scrollBehavior` returning `{ top: 0 }`, and `afterEach` guard setting `document.title`.                                                                                                   | P0       |

## Non-Functional Requirements

### Architecture Compliance

- **Layer boundaries:** All new files live in `src/presentation/` (components, composables, views, router). **Proposed architectural exception:** toast and modal composables live in `src/presentation/composables/` rather than `src/application/` because they manage UI-only state with no domain or infrastructure dependencies. This introduces a `composables/` subdirectory under `src/presentation/` not currently defined in `architecture.md` — architecture.md should be updated to acknowledge that purely UI-state composables may reside in the Presentation layer. Exceptions: `src/domain/constants.ts` is created in this phase with `TOAST_DISMISS_MS` only (additional constants defined in `data-model.md` will be added in their respective feature phases), and `src/assets/main.css` is modified for theme additions and transition CSS.

### Performance

- **Initial load:** The main bundle (before lazy-loaded route chunks) should remain under 150 KB gzipped, establishing a baseline before feature code is added.
- **Lazy chunks:** Each route's lazy-loaded chunk should remain under 20 KB gzipped.

## Acceptance Criteria

- [ ] 4 named routes exist (home, calendar, library, settings) with correct paths
- [ ] Catch-all `/:pathMatch(.*)*` redirects to `/`
- [ ] All 4 view components are lazy-loaded via dynamic `import()`
- [ ] `scrollBehavior` returns `{ top: 0 }`
- [ ] `document.title` updates via i18n on every navigation (`afterEach` guard)
- [ ] Router registered in `src/main.ts` with `app.use(router)`
- [ ] Router unit tests pass

## Risks

- **Firebase SPA fallback:** `createWebHistory()` requires the server to return `index.html` for all routes. If Firebase SPA rewrite is not configured, direct navigation or page refresh on any non-root route will 404. **Mitigation:** Verify Firebase `hosting.rewrites` configuration from Phase 00.
