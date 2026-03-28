# Implementation Plan: Router

---

## Phase 1 — Write Router Tests

### Step 1 — Write router tests

- [ ] Create `tests/presentation/router.test.ts`.

  Import the router instance from `@/presentation/router` and use `router.resolve()` to verify route definitions. Mock the i18n instance (`i18n.global.t`) for document title tests. Follow AAA (Arrange-Act-Assert) pattern per project conventions.

  Test cases:
  - **SC-29-01** — Router uses `createWebHistory()` (HTML5 history mode)
  - **SC-02-01, SC-02-02** — Route resolution for all 4 named routes
  - **SC-02-03** — Catch-all `/:pathMatch(.*)*` redirects to `/`
  - **SC-03-01** — Route components use lazy-loaded functions (`() => import(...)`)
  - **SC-10-01** — `afterEach` guard sets `document.title` to `"${t(titleKey)} — ${t('app.title')}"`
  - **SC-10-02** — Title uses i18n `t()` function (translatable)
  - **SC-11-01** — `scrollBehavior` returns `{ top: 0 }`
  - **SC-22-01** through **SC-22-04** — Satisfied by the above test cases
  - `(implementation detail)` — All 4 named routes exist with correct paths and names
  - `(implementation detail)` — Each route has `meta.titleKey` matching the expected i18n key

### Step 2 — Confirm tests fail

- [ ] Run `npm run test` to confirm all new tests fail (`router.ts` does not exist yet). All tests should fail with import/resolution errors.

## Phase 2 — Implement Router & Register

### Step 1 — Create router configuration

- [ ] Create `src/presentation/router.ts`:
  - `createWebHistory()` for clean URLs
  - `scrollBehavior` always returning `{ top: 0 }` regardless of `savedPosition` parameter (per SC-11)
  - 4 routes with lazy-loaded views via `() => import('./views/...')`
  - Catch-all `/:pathMatch(.*)*` redirecting to `/`
  - `meta.titleKey` on each route (e.g., `page.home.title`, `page.library.title`)
  - `afterEach` guard setting `document.title` via i18n: `${t(titleKey)} — ${t('app.title')}`. Import the i18n instance from `@/presentation/i18n` and use `i18n.global.t()` (since `useI18n()` is only available inside Vue component setup). If `meta.titleKey` is undefined (e.g., catch-all route), fall back to just `t('app.title')`.
  - TypeScript `RouteMeta` module augmentation in `router.ts` declaring `titleKey?: string` on `RouteMeta`, using Vue Router's documented module augmentation pattern.

  > **Note:** View files (`home-screen.vue`, `calendar-screen.vue`, etc.) are created by change 01j. Until 01j is implemented, dynamic imports will reference non-existent files. TypeScript will not error on dynamic `import()` targets, but `npm run dev` will fail if those routes are navigated to.

  **Routes:**

  | Path               | Name       | View File             | titleKey              |
  | :----------------- | :--------- | :-------------------- | :-------------------- |
  | `/`                | `home`     | `home-screen.vue`     | `page.home.title`     |
  | `/calendar`        | `calendar` | `calendar-screen.vue` | `page.calendar.title` |
  | `/library`         | `library`  | `library-screen.vue`  | `page.library.title`  |
  | `/settings`        | `settings` | `settings-screen.vue` | `page.settings.title` |
  | `/:pathMatch(.*)*` | —          | —                     | redirect `/`          |

### Step 2 — Register router

- [ ] Modify `src/main.ts` to import router and register with `app.use(router)` (after existing `app.use(i18n)` call). **Rollback:** Remove the router import and `app.use(router)` line from `main.ts`.

## Phase 3 — Verification

- [ ] `npm run test` — all router tests pass
- [ ] `npm run type-check` — no type errors
- [ ] `npm run build` — production build succeeds and produces lazy-loaded chunks
- [ ] `npm run lint` — no linting errors in new files
