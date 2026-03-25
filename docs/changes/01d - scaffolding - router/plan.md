# Implementation Plan: Router

---

## Phase 1 — Router Tests & Configuration

### Step 1 — Write router tests

- [ ] Create `tests/presentation/router.test.ts` covering:

- **SC-02-03** — Catch-all `/:pathMatch(.*)*` route exists and redirects to `/`
- **SC-11-01** — `scrollBehavior` returns `{ top: 0 }`
- **SC-10-01** — `afterEach` guard sets `document.title` to `"${t(titleKey)} — ${t('app.title')}"`
- **SC-03-01** — Lazy-loaded views via `() => import('./views/...')`
- `(implementation detail)` — All 4 named routes exist with correct paths and names
- `(implementation detail)` — Each route has `meta.titleKey` matching the expected i18n key

### Step 2 — Create router configuration

- [ ] Create `src/presentation/router.ts`:

- `createWebHistory()` for clean URLs
- `scrollBehavior` returning `{ top: 0 }` on every navigation
- 4 routes with lazy-loaded views via `() => import('./views/...')`
- Catch-all `/:pathMatch(.*)*` redirecting to `/`
- `meta.titleKey` on each route (e.g., `page.home.title`, `page.library.title`)
- `afterEach` guard setting `document.title` via i18n: `${t(titleKey)} — ${t('app.title')}`
- TypeScript `RouteMeta` augmentation for `titleKey`

**Routes:**

| Path               | Name       | View File             | titleKey              |
| :----------------- | :--------- | :-------------------- | :-------------------- |
| `/`                | `home`     | `home-screen.vue`     | `page.home.title`     |
| `/calendar`        | `calendar` | `calendar-screen.vue` | `page.calendar.title` |
| `/library`         | `library`  | `library-screen.vue`  | `page.library.title`  |
| `/settings`        | `settings` | `settings-screen.vue` | `page.settings.title` |
| `/:pathMatch(.*)*` | —          | —                     | redirect `/`          |

### Step 3 — Register router

- [ ] Modify `src/main.ts` to import router and register with `app.use(router)` (after existing `app.use(i18n)` call).
