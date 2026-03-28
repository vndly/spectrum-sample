---
id: R-01d
title: App Scaffolding — Router
status: approved
type: infrastructure
importance: critical
tags: [routing, navigation]
---

## Intent

Configure Vue Router with 4 lazy-loaded routes, catch-all redirect, scroll-to-top, and i18n-based document title updates.

## Context & Background

### Dependencies

- **01a** — vue-router installed, test infrastructure.
- **01b** — i18n keys for document title.

## Decisions

| Decision            | Choice               | Rationale                                                                         |
| :------------------ | :------------------- | :-------------------------------------------------------------------------------- |
| Router history mode | `createWebHistory()` | Clean URLs without hash fragments. Firebase SPA rewrite already handles fallback. |
| Home route matching | Exact match only     | Prevents the Home nav item from appearing active on every route.                  |

## Scope

### In Scope

- Create router configuration in `src/presentation/router.ts`.
- Register router in `src/main.ts`.
- Write router unit tests.

### Out of Scope

- Detail routes (`/movie/:id`, `/show/:id`) — deferred to their respective feature phases.
- `/stats` and `/recommendations` routes — deferred to their respective feature phases.
- Route transition animations — covered by 01k.
- Navigation guards beyond catch-all redirect.
- Route-level middleware or authentication guards.

## Functional Requirements

| ID    | Requirement        | Description                                                                                                                                                                                                                                                                       | Priority |
| :---- | :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-29 | Vue Router setup   | `vue-router@^5` installed (via 01a). `createWebHistory()`, router registered in `main.ts`. Routes defined in `src/presentation/router.ts`.                                                                                                                                        | P0       |
| SC-02 | Route definitions  | 4 named routes (home `/`, calendar `/calendar`, library `/library`, settings `/settings`) plus catch-all `/:pathMatch(.*)*` redirecting to `/`. Remaining routes from `architecture.md` (`/movie/:id`, `/show/:id`, `/stats`, `/recommendations`) are deferred to feature phases. | P0       |
| SC-03 | Route lazy loading | All 4 view components loaded via dynamic `import()` for code splitting.                                                                                                                                                                                                           | P0       |
| SC-10 | Document title     | `router.afterEach` guard sets `document.title` to `${t(meta.titleKey)} — ${t('app.title')}`. Each route's `meta.titleKey` uses the pattern `page.<route-name>.title` (e.g., `page.home.title`, `page.calendar.title`).                                                            | P1       |
| SC-11 | Scroll-to-top      | Router `scrollBehavior` returns `{ top: 0 }` on every navigation.                                                                                                                                                                                                                 | P1       |
| SC-22 | Router unit tests  | Tests in `tests/presentation/router.test.ts` for route definitions (4 named routes + catch-all), `scrollBehavior` returning `{ top: 0 }`, and `afterEach` guard setting `document.title`.                                                                                         | P0       |

## Non-Functional Requirements

### Architecture Compliance

- **Layer boundaries:** All new files live in `src/presentation/` (router configuration). `src/main.ts` is the only existing file modified.

### Performance

- **Initial load:** The main bundle (before lazy-loaded route chunks) should remain under 150 KB gzipped, establishing a baseline before feature code is added.
- **Lazy chunks:** Each route's lazy-loaded chunk should remain under 20 KB gzipped.
- **Measurement:** Measured from `vite build` output sizes.

## Acceptance Criteria

- [ ] Router uses `createWebHistory()` (HTML5 history mode, no hash fragments) (SC-29)
- [ ] Router registered in `src/main.ts` with `app.use(router)` (SC-29)
- [ ] 4 named routes exist (home, calendar, library, settings) with correct paths (SC-02)
- [ ] Catch-all `/:pathMatch(.*)*` redirects to `/` (SC-02)
- [ ] All 4 view components are lazy-loaded via dynamic `import()` (SC-03). Fully verifiable after 01j provides placeholder view files.
- [ ] `document.title` updates via i18n on every navigation (`afterEach` guard) (SC-10)
- [ ] `scrollBehavior` returns `{ top: 0 }` (SC-11)
- [ ] Main bundle remains under 150 KB gzipped
- [ ] Each route's lazy-loaded chunk remains under 20 KB gzipped
- [ ] Router unit tests pass (SC-22)

## Constraints

- Must use `createWebHistory()` (no hash mode) — requires Firebase SPA rewrite for server-side fallback.
- View component files (`*-screen.vue`) are provided by change 01j — router configuration will reference them before they exist.

## Risks & Assumptions

### Risks

| Risk                  | Likelihood | Impact | Mitigation                                                                                   |
| :-------------------- | :--------- | :----- | :------------------------------------------------------------------------------------------- |
| Firebase SPA fallback | Low        | High   | `createWebHistory()` requires Firebase SPA rewrite. Verify `hosting.rewrites` from Phase 00. |

### Assumptions

- Firebase SPA rewrite is configured in Phase 00.
- 01a has been completed and `vue-router@^5` is installed.
- 01b has been completed and i18n title keys (`page.*.title`) exist.
