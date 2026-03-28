# Implementation Plan: Router

---

## Phase 1 — Write Router Tests

### Step 1 — Write router tests and confirm they fail

- [x] Create `tests/presentation/router.test.ts`.

  Import the router instance from `@/presentation/router` and use `router.resolve()` to verify route definitions. Use `vi.mock('@/presentation/i18n', () => ({ default: { global: { t: (key: string) => key } } }))` to mock the i18n instance with an identity function, allowing title format assertions without depending on actual translations. Follow AAA (Arrange-Act-Assert) pattern per project conventions.

  Test cases:
  - **SC-01d-29-01** — Router uses `createWebHistory()` (HTML5 history mode)
  - **SC-01d-29-02** — Router is registered in `main.ts` `(implementation detail)` — verified by Phase 3 checks
  - **SC-01d-02-01, SC-01d-02-02** — Route resolution for all 4 named routes
  - **SC-01d-02-03** — Catch-all `/:pathMatch(.*)*` redirects to `/`
  - **SC-01d-03-01** — Route components use lazy-loaded functions (`() => import(...)`)
  - **SC-01d-10-01** — `afterEach` guard sets `document.title` to `"${t(titleKey)} — ${t('app.title')}"`
  - **SC-01d-10-02** — Title uses i18n `t()` function (translatable)
  - **SC-01d-10-03** — Home route title resolves correctly
  - **SC-01d-11-01** — `scrollBehavior` returns `{ top: 0 }`
  - **SC-01d-11-02** — `scrollBehavior` returns `{ top: 0 }` regardless of `savedPosition` (back navigation)
  - **SC-01d-22-01** through **SC-01d-22-04** — Satisfied by the above test cases
  - `(implementation detail)` — All 4 named routes exist with correct paths and names
  - `(implementation detail)` — Each route has `meta.titleKey` matching the expected i18n key

- [x] Run `npm run test` to confirm all new tests fail (`router.ts` does not exist yet). All tests should fail with import/resolution errors.

## Phase 2 — Implement Router & Register

### Step 1 — Create router configuration

- [x] Create `src/presentation/router.ts`:
  - `createWebHistory()` for clean URLs
  - `scrollBehavior(_to, _from, _savedPosition)` always returning `{ top: 0 }` — all three parameters are ignored per SC-01d-11
  - 4 routes with lazy-loaded views via `() => import('./views/...')`
  - Catch-all `/:pathMatch(.*)*` redirecting to `/`
  - `meta.titleKey` on each route (e.g., `page.home.title`, `page.library.title`)
  - `afterEach` guard setting `document.title` via i18n: `${t(titleKey)} — ${t('app.title')}`. Import the i18n instance from `@/presentation/i18n` and use `i18n.global.t()` (since `useI18n()` is only available inside Vue component setup). If `meta.titleKey` is undefined (e.g., catch-all route), fall back to just `t('app.title')`.
  - TypeScript `RouteMeta` module augmentation in `router.ts` declaring `titleKey?: string` on `RouteMeta`, using Vue Router's documented module augmentation pattern.

  > **Note:** View files use kebab-case (`home-screen.vue`, `calendar-screen.vue`, etc.) per `conventions.md`. The `architecture.md` example uses PascalCase (`LibraryScreen.vue`) which is inconsistent — conventions take precedence.

  > **Note:** View files are created by change 01j. Until 01j is implemented, dynamic imports will reference non-existent files. TypeScript will not error on dynamic `import()` targets, but `npm run dev` will fail if those routes are navigated to.

  **Routes:**

  | Path               | Name       | View File             | titleKey              |
  | :----------------- | :--------- | :-------------------- | :-------------------- |
  | `/`                | `home`     | `home-screen.vue`     | `page.home.title`     |
  | `/calendar`        | `calendar` | `calendar-screen.vue` | `page.calendar.title` |
  | `/library`         | `library`  | `library-screen.vue`  | `page.library.title`  |
  | `/settings`        | `settings` | `settings-screen.vue` | `page.settings.title` |
  | `/:pathMatch(.*)*` | —          | —                     | redirect `/`          |

### Step 2 — Register router

- [x] Modify `src/main.ts` to import router and register with `app.use(router)` (after existing `app.use(i18n)` call). **Rollback:** Remove the `import router from ...` line and the `app.use(router)` call from `main.ts`.

## Phase 3 — Verification

- [x] `npm run test` — all router tests pass
- [x] `npm run type-check` — no type errors
- [x] `npm run build` — production build succeeds and produces lazy-loaded chunks
- [x] `npm run lint` — no linting errors in new files
