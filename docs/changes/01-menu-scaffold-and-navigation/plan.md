# Implementation Plan: Menu Scaffold and Navigation

---

## Phase 1 — Tests: Router & Locale Contract (test-first)

> **References:** [requirements.md](./requirements.md) · [scenarios/R-01b-01.feature](./scenarios/R-01b-01.feature) · [scenarios/R-01b-03.feature](./scenarios/R-01b-03.feature) · [scenarios/R-01b-04.feature](./scenarios/R-01b-04.feature) · [scenarios/R-01b-05.feature](./scenarios/R-01b-05.feature) · [scenarios/R-01b-08.feature](./scenarios/R-01b-08.feature)

### Step 1 — Extend locale key parity test (covering: R-01b-08-04)

- [ ] Update `tests/presentation/i18n/locale-keys.test.ts`:
  - add `page.stats.title`, `page.movie.title`, and `page.show.title` to the expected key list
  - update the exact expected key count from `21` to `24`
  - preserve the existing parity, non-empty value, `app.title`, and camelCase-segment assertions
  - keep the file in `tests/presentation/i18n/` so the mirrored-path contract remains explicit

### Step 2 — Extend router contract tests (covering: R-01b-01-01, R-01b-01-02, R-01b-03-01, R-01b-03-02, R-01b-04-01, R-01b-04-03, R-01b-05-01, R-01b-08-01)

- [ ] Update `tests/presentation/router.test.ts`:
  - mock `recommendations-screen.vue`, `stats-screen.vue`, `movie-screen.vue`, and `show-screen.vue`
  - assert the router resolves 8 named routes with paths `/`, `/recommendations`, `/calendar`, `/library`, `/settings`, `/stats`, `/movie/:id`, and `/show/:id`
  - assert all named routes remain lazy imports via `router.options.routes`
  - assert `meta.titleKey` values include Recommendations, Stats, Movie, and Show
  - assert `/recommendations`, `/stats`, `/movie/550`, and `/show/1396` resolve to the expected route names
  - assert `/movie/abc` and `/show/abc` redirect to `/`
  - assert `document.title` updates for Recommendations, Stats, Movie, and Show

### Step 3 — Confirm fail-first state `(implementation detail)`

- [ ] Run `npx vitest run tests/presentation/i18n/locale-keys.test.ts tests/presentation/router.test.ts` and confirm the new assertions fail before implementation.

---

## Phase 2 — Implementation: Locale Keys, Route Bootstrap & Guards

### Step 1 — Add new page-title locale keys (covering: R-01b-03-02, R-01b-04-03, R-01b-08-04)

- [ ] Update `src/presentation/i18n/locales/en.json`, `src/presentation/i18n/locales/es.json`, and `src/presentation/i18n/locales/fr.json` atomically:
  - add `page.stats.title`
  - add `page.movie.title`
  - add `page.show.title`
  - preserve flat dot-notation, exact key parity, and non-empty translated strings
- [ ] Do not add any other new keys; `nav.recommendations` and `page.recommendations.title` already exist.

### Step 2 — Bootstrap the new route view files `(implementation detail)`

- [ ] Create `src/presentation/views/recommendations-screen.vue`, `src/presentation/views/stats-screen.vue`, `src/presentation/views/movie-screen.vue`, and `src/presentation/views/show-screen.vue` as minimal valid SFC stubs so `src/presentation/router.ts` can import them without breaking the build before the final placeholder-view implementation phase.
- [ ] Keep each file in the current flat `src/presentation/views/` directory to match the existing scaffolded view pattern and avoid introducing new route folders in this change.

### Step 3 — Extend the router with new routes and numeric guards (covering: R-01b-01-01, R-01b-01-02, R-01b-03-01, R-01b-03-02, R-01b-04-01, R-01b-04-03, R-01b-05-01)

- [ ] Update `src/presentation/router.ts`:
  - keep `createWebHistory()`, `scrollBehavior()`, the existing `afterEach` title logic, and the catch-all redirect
  - insert a named `recommendations` route at `/recommendations` with `meta.titleKey: 'page.recommendations.title'`
  - add a named `stats` route at `/stats` with `meta.titleKey: 'page.stats.title'`
  - add named `movie` and `show` routes at `/movie/:id` and `/show/:id` with `meta.titleKey` values `page.movie.title` and `page.show.title`
  - use per-route guards for `movie` and `show` that accept digits-only `:id` values and redirect all non-numeric params to `/`
  - keep the primary-nav routes in the documented order `home`, `recommendations`, `calendar`, `library`, `settings`; append direct-only routes before the catch-all redirect

> Rollback: revert `src/presentation/router.ts`, the three locale JSON files, and the four new view stubs.

---

## Phase 3 — Tests: Navigation, Shell & Placeholder Views (test-first)

> **References:** [scenarios/R-01b-02.feature](./scenarios/R-01b-02.feature) · [scenarios/R-01b-06.feature](./scenarios/R-01b-06.feature) · [scenarios/R-01b-07.feature](./scenarios/R-01b-07.feature) · [scenarios/R-01b-08.feature](./scenarios/R-01b-08.feature)

### Step 1 — Extend nav component tests for Recommendations (covering: R-01b-02-01, R-01b-02-02, R-01b-02-03, R-01b-02-04, R-01b-08-02)

- [ ] Update `tests/presentation/components/layout/sidebar-nav.test.ts`:
  - mock the `Compass` icon
  - assert the sidebar now renders 5 primary nav links in order `Home`, `Recommendations`, `Calendar`, `Library`, `Settings`
  - assert Recommendations uses the translated label in `en` and `fr`
  - assert Recommendations uses the mapped `Compass` icon
  - assert Recommendations active-state styling matches the existing sidebar accent treatment
  - assert Stats and detail routes still do not appear in primary navigation
- [ ] Update `tests/presentation/components/layout/bottom-nav.test.ts`:
  - mock the `Compass` icon
  - assert the bottom nav now renders 5 primary nav links in the same order
  - assert Recommendations uses the translated label and active accent treatment
  - assert each nav item, including Recommendations, retains `min-h-11` and `min-w-11`
  - assert Stats and detail routes remain absent from primary navigation

### Step 2 — Extend shell/title tests for the new routes (covering: R-01b-03-02, R-01b-04-03, R-01b-07-01, R-01b-07-02, R-01b-07-03, R-01b-08-02)

- [ ] Update `tests/presentation/components/layout/page-header.test.ts`:
  - add route metadata cases for `/recommendations`, `/stats`, `/movie/550`, and `/show/1396`
  - assert translated header output for at least one non-default locale on a new route
- [ ] Update `tests/presentation/components/layout/app-shell.test.ts`:
  - extend the in-memory router with the four new route paths and title keys
  - assert new routes render inside the shared `AppShell` content column beneath `PageHeader`
  - assert route transitions to the new placeholders still use `Transition name="fade" mode="out-in"` and the reduced-motion CSS contract in `src/assets/main.css`
  - spy on `global.fetch` and `Storage.prototype.setItem` / `removeItem` while navigating to the new routes and assert zero TMDB requests and zero `localStorage` writes
  - assert modal and toast overlays remain mounted above the new routes

### Step 3 — Add placeholder view tests for the four new screens (covering: R-01b-04-02, R-01b-06-01, R-01b-06-02, R-01b-08-03)

- [ ] Create `tests/presentation/views/recommendations-screen.test.ts`, `tests/presentation/views/stats-screen.test.ts`, `tests/presentation/views/movie-screen.test.ts`, and `tests/presentation/views/show-screen.test.ts`:
  - mount each view with `en` and `fr` locales
  - assert each view renders `EmptyState`
  - assert icon mappings `Compass`, `ChartColumn`, `Film`, and `Tv`
  - assert the heading uses translated `common.empty.title`
  - assert the supporting text uses translated `common.empty.description`
- [ ] In the same view test files, inspect the source for each paired SFC in `src/presentation/views/` and assert:
  - the file binds `common.empty.title`
  - the file binds `common.empty.description`
  - the file does not contain hardcoded locale-specific placeholder copy

### Step 4 — Confirm fail-first state `(implementation detail)`

- [ ] Run `npx vitest run tests/presentation/components/layout/sidebar-nav.test.ts tests/presentation/components/layout/bottom-nav.test.ts tests/presentation/components/layout/page-header.test.ts tests/presentation/components/layout/app-shell.test.ts tests/presentation/views/recommendations-screen.test.ts tests/presentation/views/stats-screen.test.ts tests/presentation/views/movie-screen.test.ts tests/presentation/views/show-screen.test.ts` and confirm the new assertions fail before final implementation.

---

## Phase 4 — Implementation: Final Navigation & Placeholder Views

### Step 1 — Upgrade the four new view stubs to final placeholder screens (covering: R-01b-04-02, R-01b-06-01, R-01b-06-02)

- [ ] Update `src/presentation/views/recommendations-screen.vue`, `src/presentation/views/stats-screen.vue`, `src/presentation/views/movie-screen.vue`, and `src/presentation/views/show-screen.vue`:
  - use `<script setup lang="ts">`
  - import `useI18n`
  - import `EmptyState`
  - import the mapped Lucide icon (`Compass`, `ChartColumn`, `Film`, `Tv`)
  - render `EmptyState` with translated `common.empty.title` and `common.empty.description`
  - keep SFC block order `script` → `template`
  - do not add a local `<style>` block
  - do not add any hardcoded user-facing strings

### Step 2 — Add Recommendations to both primary nav surfaces (covering: R-01b-02-01, R-01b-02-02, R-01b-02-03, R-01b-02-04)

- [ ] Update `src/presentation/components/layout/sidebar-nav.vue`:
  - import `Compass`
  - insert the Recommendations nav item between Home and Calendar
  - keep exact-match Home logic unchanged
  - keep existing active/inactive class names unchanged apart from the new item
- [ ] Update `src/presentation/components/layout/bottom-nav.vue`:
  - import `Compass`
  - insert the Recommendations nav item between Home and Calendar
  - keep `min-h-11 min-w-11` touch-target classes
  - keep exact-match Home logic and existing accent styling unchanged

> Rollback: revert `src/presentation/components/layout/sidebar-nav.vue`, `src/presentation/components/layout/bottom-nav.vue`, the four new view SFCs, and any related locale/router edits from earlier phases.

---

## Phase 5 — Verification

### Step 1 — Run targeted feature verification (covering: R-01b-08-01, R-01b-08-02, R-01b-08-03, R-01b-08-04)

- [ ] Run `npx vitest run tests/presentation/i18n/locale-keys.test.ts tests/presentation/router.test.ts tests/presentation/components/layout/sidebar-nav.test.ts tests/presentation/components/layout/bottom-nav.test.ts tests/presentation/components/layout/page-header.test.ts tests/presentation/components/layout/app-shell.test.ts tests/presentation/views/recommendations-screen.test.ts tests/presentation/views/stats-screen.test.ts tests/presentation/views/movie-screen.test.ts tests/presentation/views/show-screen.test.ts` and require all tests to pass.

### Step 2 — Run project verification commands (covering: R-01b-08-05)

- [ ] Run `npm run type-check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run format:check`.
- [ ] Run `npm run test`.
