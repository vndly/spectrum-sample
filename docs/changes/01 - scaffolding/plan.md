# Implementation Plan: App Scaffolding

---

## Phase 1 — Dependencies & Test Infrastructure

### Step 1 — Install dependencies

- [ ] Run `npm install vue-router@^4`.
- [ ] Run `npm install -D @vue/test-utils@^2`.

### Step 2 — Configure test environment

- [ ] Update `vitest.config.ts`: add `globals: true`, `include: ["tests/**/*.test.ts"]`, `setupFiles: ["./tests/setup.ts"]` inside the existing `test: { }` block in the `defineConfig` call (do not create a separate config object).
- [ ] Create `tests/setup.ts` with `beforeEach(() => { localStorage.clear() })`.

---

## Phase 2 — i18n Keys

### Step 3 — Update locale files

- [ ] Add keys to `en.json`, `es.json`, `fr.json`:

**Key structure:**

```
nav.home / nav.calendar / nav.library / nav.settings
page.home.title / page.calendar.title / page.library.title / page.settings.title
common.empty.title / common.empty.description
common.error.title / common.error.description / common.error.reload
toast.error / toast.dismiss / toast.retry
```

**Translations:**

| Key                        | English                          | Spanish                           | French                                |
| :------------------------- | :------------------------------- | :-------------------------------- | :------------------------------------ |
| `nav.home`                 | Home                             | Inicio                            | Accueil                               |
| `nav.calendar`             | Calendar                         | Calendario                        | Calendrier                            |
| `nav.library`              | Library                          | Biblioteca                        | Bibliothèque                          |
| `nav.settings`             | Settings                         | Ajustes                           | Paramètres                            |
| `page.home.title`          | Home                             | Inicio                            | Accueil                               |
| `page.calendar.title`      | Calendar                         | Calendario                        | Calendrier                            |
| `page.library.title`       | Library                          | Biblioteca                        | Bibliothèque                          |
| `page.settings.title`      | Settings                         | Ajustes                           | Paramètres                            |
| `common.empty.title`       | Nothing here yet                 | Nada aquí todavía                 | Rien ici pour le moment               |
| `common.empty.description` | This page is under construction. | Esta página está en construcción. | Cette page est en construction.       |
| `common.error.title`       | Something went wrong             | Algo salió mal                    | Une erreur est survenue               |
| `common.error.description` | An unexpected error occurred.    | Ocurrió un error inesperado.      | Une erreur inattendue s'est produite. |
| `common.error.reload`      | Reload                           | Recargar                          | Recharger                             |
| `toast.error`              | An error occurred                | Ocurrió un error                  | Une erreur est survenue               |
| `toast.dismiss`            | Dismiss                          | Cerrar                            | Fermer                                |
| `toast.retry`              | Retry                            | Reintentar                        | Réessayer                             |

`page.*.title` keys mirror `nav.*` values initially (separate keys to allow divergence later).

> **Prerequisite:** The `app.title` key must already exist in all locale files from Phase 00. Verify before proceeding.

---

## Phase 3 — Router

### Step 4 — Write router tests

- [ ] Create `tests/presentation/router.test.ts` covering:

- **SC-02-03** — Catch-all `/:pathMatch(.*)*` route exists and redirects to `/`
- **SC-11-01** — `scrollBehavior` returns `{ top: 0 }`
- **SC-10-01** — `afterEach` guard sets `document.title` to `"${t(titleKey)} — ${t('app.title')}"`
- **SC-03-01** — Lazy-loaded views via `() => import('./views/...')`
- `(implementation detail)` — All 4 named routes exist with correct paths and names
- `(implementation detail)` — Each route has `meta.titleKey` matching the expected i18n key

### Step 5 — Create router configuration

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

### Step 6 — Register router

- [ ] Modify `src/main.ts` to import router and register with `app.use(router)` (after existing `app.use(i18n)` call).

---

## Phase 4 — Domain Constants & Composables

### Step 7 — Create domain constants

- [ ] Create `src/domain/constants.ts`:

- `TOAST_DISMISS_MS = 4000` — auto-dismiss timeout for toast notifications

> This is the only Domain layer change in this phase, acknowledged as an exception in the Architecture Compliance NFR.

### Step 8 — Write toast composable tests

- [ ] Create `tests/presentation/composables/use-toast.test.ts` covering:

- **SC-13-01** — `addToast()` adds a toast to the queue with a unique id
- **SC-13-02** — `removeToast(id)` removes the toast from the queue
- **SC-13-03** — Auto-dismiss removes the toast after timeout (~4s, use `vi.useFakeTimers()`)
- **SC-14-03** — Adding a 6th toast evicts the oldest toast (max 5 cap)
- `(implementation detail)` — Toast types: `'error'`, `'success'`, `'info'`
- `(implementation detail)` — Optional action object is preserved on the toast

### Step 9 — Write modal composable tests

- [ ] Create `tests/presentation/composables/use-modal.test.ts` covering:

- **SC-15-01** — `open(props)` sets `isOpen` to true and stores props
- `(implementation detail)` — `close()` sets `isOpen` to false and clears props
- **SC-15-06** — Calling `open()` a second time replaces the first modal's props (single-instance behavior)
- `(implementation detail)` — Props include `title`, optional `content`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`

### Step 10 — Create toast composable

- [ ] Create `src/presentation/composables/use-toast.ts`:

- Module-level `ref<Toast[]>` (singleton — shared across all callers, works outside `setup()`)
- `Toast` type: `{ id: string, message: string, type: 'error' | 'success' | 'info', action?: { label: string, handler: () => void } }`
- `addToast(options)` — generates unique id, pushes toast, starts `setTimeout` (using `TOAST_DISMISS_MS` from `src/domain/constants.ts`) for auto-removal. Enforces max 5 simultaneous toasts with oldest-first eviction.
- `removeToast(id)` — removes from array; also clears the associated `setTimeout` to prevent stale timer callbacks
- Returns `{ toasts: Readonly<Ref<Toast[]>>, addToast, removeToast }`

### Step 11 — Create modal composable

- [ ] Create `src/presentation/composables/use-modal.ts`:

- Module-level `ref<boolean>` + `shallowRef<ModalProps | null>` (single modal at a time)
- `ModalProps` type: `{ title: string, content?: string, confirmLabel?: string, cancelLabel?: string, onConfirm?: () => void, onCancel?: () => void }`
- `open(props)` — sets visible true, stores props
- `close()` — sets visible false, clears props
- Returns `{ isOpen: Readonly<Ref<boolean>>, props: Readonly<ShallowRef<ModalProps | null>>, open, close }`

---

## Phase 5 — Layout Components

### Step 12 — Write sidebar tests

- [ ] Create `tests/presentation/components/layout/sidebar-nav.test.ts` covering:

- **SC-05-01** — Renders all 4 nav items with correct icons and translated labels
- **SC-07-01** — Active route item has teal accent classes (`border-accent`, `bg-accent/10`)
- **SC-07-02** — Home route uses exact match (`route.path === '/'`)
- `(implementation detail)` — Inactive items have muted classes (`text-slate-400`)

### Step 13 — Write bottom nav tests

- [ ] Create `tests/presentation/components/layout/bottom-nav.test.ts` covering:

- **SC-06-01** — Renders all 4 nav items with icons and labels
- **SC-07-03** — Active route item has teal accent styling
- `(implementation detail)` — Inactive items have muted styling

### Step 14 — Write page header tests

- [ ] Create `tests/presentation/components/layout/page-header.test.ts` covering:

- **SC-08-01** — Displays translated title from route `meta.titleKey`
- **SC-08-02** — Updates displayed title when route changes

### Step 15 — Create layout components

- [ ] Create `src/presentation/components/layout/sidebar-nav.vue`:

- Fixed left sidebar, `w-56`, `bg-bg-secondary`
- App title at top using `$t('app.title')`
- Nav items array: `{ to: string, labelKey: string, icon: Component }`
- Icons from lucide-vue-next: `Home`, `CalendarDays`, `Bookmark`, `Settings`
- Each item is a `<RouterLink>` with icon + `$t(labelKey)`
- Active state: `border-l-2 border-accent bg-accent/10 text-white`
- Inactive state: `text-slate-400 hover:text-white`
- Home route: exact match only (`route.path === '/'`)

- [ ] Create `src/presentation/components/layout/bottom-nav.vue`:

- Fixed bottom bar (`fixed bottom-0 inset-x-0`), `z-10`
- Same 4 nav items with icons and short labels
- Active item: teal accent color, inactive: muted
- Dark background with subtle top border
- Classes: `hidden max-md:fixed max-md:flex` (visible below `md`, hidden at `md+`)

- [ ] Create `src/presentation/components/layout/page-header.vue`:

- Reads `route.meta.titleKey`, translates via `$t()`
- White text, `text-xl font-bold`
- Classes: `sticky top-0 z-10 bg-bg-primary`

- [ ] Create `src/presentation/components/layout/app-shell.vue`:

- Flexbox layout: `<SidebarNav>` (visible by default, `max-md:hidden`) + content area (`flex-1`)
- Content area: `pb-16 md:pb-0` (clearance for bottom nav on mobile)
- Renders `<PageHeader>` at top of content
- `<RouterView v-slot="{ Component }">` wrapped in `<Transition name="fade" mode="out-in">`
- `<BottomNav>` (`hidden max-md:fixed max-md:flex`)
- `<ToastContainer>` as global overlay
- `<ModalDialog />` as global overlay

---

## Phase 6 — Common Components

### Step 16 — Write empty-state tests

- [ ] Create `tests/presentation/components/common/empty-state.test.ts` covering:

- **SC-16-01** — Renders icon, title, and description when all provided
- **SC-16-02** — With only title prop, icon and description are absent
- **SC-16-03** — CTA button renders when `ctaLabel` is provided; clicking invokes `ctaAction`

### Step 17 — Write skeleton-loader tests

- [ ] Create `tests/presentation/components/common/skeleton-loader.test.ts` covering:

- **SC-17-01** — Renders with default dimensions
- **SC-17-02** — Applies custom `width`, `height`, and `rounded` props

### Step 18 — Write toast-container tests

- [ ] Create `tests/presentation/components/common/toast-container.test.ts` covering:

- **SC-14-01** — Multiple toasts stack vertically without overlapping
- **SC-14-02** — Container is fixed top-right with `z-50`
- `(implementation detail)` — Renders nothing when toast queue is empty; renders toast items when present
- `(implementation detail)` — Each toast shows message, dismiss button, type-colored border, and optional action button

### Step 19 — Write modal-dialog tests

- [ ] Create `tests/presentation/components/common/modal-dialog.test.ts` covering:

- **SC-15-01** — Opens and renders title, body, confirm, and cancel buttons
- **SC-15-02** — Closes on backdrop click
- **SC-15-03** — Closes on Escape key
- **SC-15-04** — Confirm button invokes `onConfirm` callback and closes
- **SC-15-05** — Cancel button invokes `onCancel` callback and closes
- `(implementation detail)` — Does not render when `isOpen` is false

### Step 20 — Create common components

- [ ] Create `src/presentation/components/common/skeleton-loader.vue`:

- Props: `width` (string, default `'100%'`), `height` (string, default `'1rem'`), `rounded` (string, default `'rounded-md'`)
- Single `<div>` with `animate-pulse bg-surface` and configured dimensions

- [ ] Create `src/presentation/components/common/empty-state.vue`:

- Props: `icon` (component, optional), `title` (string), `description` (string, optional), `ctaLabel` (string, optional), `ctaAction` (() => void, optional)
- Centered vertically and horizontally
- Icon in `text-slate-500`, title in `text-white font-bold`, description in `text-slate-400`
- CTA button rendered only when `ctaLabel` is provided; clicking invokes `ctaAction`

- [ ] Create `src/presentation/components/common/toast-container.vue`:

- Fixed `top-4 right-4 z-50`
- Uses `useToast()` to read the toast queue
- Each toast: dark surface card, type-colored left border (error -> red, success -> green, info -> teal)
- Dismiss X button + optional action button
- `<TransitionGroup>` for animated enter (slide from right) / leave (fade out)

- [ ] Create `src/presentation/components/common/modal-dialog.vue`:

- Uses `useModal()` to read open/close state and props
- Backdrop: `fixed inset-0 z-40 bg-black/50`, click-to-close
- Content card: centered, `bg-surface rounded-lg`
- Title, optional body text, confirm (teal) and cancel buttons
- Escape key closes via `@keydown.escape` listener
- `<Transition>`: fade backdrop + scale content

---

## Phase 7 — Error Handling

### Step 21 — Write error-boundary tests

- [ ] Create `tests/presentation/components/error/error-boundary.test.ts` covering:

- **SC-18-01** — Shows fallback UI with error title, description, and reload button when an error is captured
- **SC-18-02** — Reload button calls `window.location.reload()`
- `(implementation detail)` — Renders slot content in normal state

### Step 22 — Write global error handler test

- [ ] Create `tests/presentation/global-error-handler.test.ts` covering:

- **SC-19-01** — `app.config.errorHandler` dispatches an error toast via `useToast()` and logs to `console.error`

  **Setup:** Create a test Vue app instance, register the error handler function on it, invoke the handler with a synthetic error, and assert that `useToast().addToast` was called with type `'error'` and that `console.error` was invoked.

### Step 23 — Create error boundary

- [ ] Create `src/presentation/components/error/error-boundary.vue`:

- Uses `onErrorCaptured` lifecycle hook
- Normal state: renders `<slot />`
- Error state: centered fallback with `$t('common.error.title')`, `$t('common.error.description')`, and reload button calling `window.location.reload()`

### Step 24 — Add global error handler

- [ ] Modify `src/main.ts` to add `app.config.errorHandler` (after existing plugin registrations):

- Logs the error to `console.error`
- Calls `useToast().addToast({ message: i18n.global.t('toast.error'), type: 'error' })`

> Note: `main.ts` importing from `src/presentation/composables/` is an intentional exception to typical layer boundaries, consistent with the module-level singleton decision in requirements.

---

## Phase 8 — Placeholder Views

### Step 25 — Write view tests

- [ ] Create one test file per view in `tests/presentation/views/` covering:

- **SC-20-01** — Each view renders `<EmptyState>` with the correct icon and translated title/description

| Test File                 | Verifies                                                                  |
| :------------------------ | :------------------------------------------------------------------------ |
| `home-screen.test.ts`     | Renders `<EmptyState>` with `Home` icon and `page.home.title`             |
| `calendar-screen.test.ts` | Renders `<EmptyState>` with `CalendarDays` icon and `page.calendar.title` |
| `library-screen.test.ts`  | Renders `<EmptyState>` with `Bookmark` icon and `page.library.title`      |
| `settings-screen.test.ts` | Renders `<EmptyState>` with `Settings` icon and `page.settings.title`     |

### Step 26 — Create placeholder views

- [ ] Create placeholder views in `src/presentation/views/`:

| File                  | Icon Import    | Title Key             | Description Key            |
| :-------------------- | :------------- | :-------------------- | :------------------------- |
| `home-screen.vue`     | `Home`         | `page.home.title`     | `common.empty.description` |
| `calendar-screen.vue` | `CalendarDays` | `page.calendar.title` | `common.empty.description` |
| `library-screen.vue`  | `Bookmark`     | `page.library.title`  | `common.empty.description` |
| `settings-screen.vue` | `Settings`     | `page.settings.title` | `common.empty.description` |

Each view follows the same pattern: `<script setup>` imports `EmptyState`, the lucide icon, and `useI18n`. Template renders `<EmptyState>` with the icon, translated title (from `page.*.title`), and the shared description (`common.empty.description`).

---

## Phase 9 — App.vue & Tailwind

### Step 27 — Update App.vue

- [ ] Update `src/App.vue`: Import `ErrorBoundary` from `./presentation/components/error/error-boundary.vue` and `AppShell` from `./presentation/components/layout/app-shell.vue` in `<script setup>`. Replace template with `<ErrorBoundary>` wrapping `<AppShell />`.

### Step 28 — Update Tailwind theme & transition CSS

- [ ] Add to the existing `@theme { }` block in `src/assets/main.css` (do not create a new block):

- `--color-success: #22c55e`
- `--color-error: #ef4444`

- [ ] Add fade transition CSS after the `@theme` block:

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

- [ ] Add toast transition CSS:

```css
.toast-enter-active {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
}
.toast-leave-active {
  transition: opacity 0.2s ease-in;
}
.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.toast-leave-to {
  opacity: 0;
}
```

- [ ] Add modal transition CSS:

```css
.modal-enter-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}
.modal-leave-active {
  transition:
    opacity 0.15s ease-in,
    transform 0.15s ease-in;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
```

- [ ] Add reduced-motion override:

```css
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .toast-enter-active,
  .toast-leave-active,
  .modal-enter-active,
  .modal-leave-active {
    transition: none;
  }

  .animate-pulse {
    animation: none;
  }
}
```

---

## Phase 10 — Verification

### Step 29 — Verify

- [ ] Run and confirm all pass:
  - `npm run test` — zero test failures
  - `npm run type-check` — zero TypeScript errors
  - `npm run lint` — zero ESLint errors
  - `npm run format:check` — zero formatting issues
  - `npm run build` — production build succeeds
  - `npm run check` — full pipeline passes
  - `npm run dev` — manual verification:
    - **(SC-05-01, SC-04-01)** Desktop: sidebar visible with 4 nav items, flexbox layout with sidebar + scrollable content
    - **(SC-04-02, SC-06-01)** Mobile (< 768px): sidebar hides, bottom nav appears with 4 items
    - **(SC-04-03)** Resize back to desktop: sidebar restores, bottom nav hides
    - **(SC-06-02)** Mobile: scroll to bottom of page — content not obscured by bottom nav
    - **(SC-02-01, SC-02-02)** Navigation between pages via nav items and direct URL entry
    - **(SC-07-01, SC-07-03)** Active route highlighted in teal in both sidebar and bottom nav
    - **(SC-08-01, SC-08-02, SC-08-03)** Page header updates on navigation and remains sticky when scrolling
    - **(SC-10-01, SC-10-02)** Document title updates (e.g., "Library — Plot Twisted"); verify with Spanish locale
    - **(SC-09-01)** Route fade transition visible (~200ms)
    - **(SC-14-04)** Toast slide-in animation from right
    - **(SC-15-07)** Modal fade backdrop + scale-up animation for content card
    - **(SC-11-01)** Scroll resets to top on navigation
    - **(SC-02-03)** `/nonexistent` redirects to `/`
    - **(SC-01-01)** URL shows clean paths without hash fragments
    - **(SC-09-02, SC-09-03, SC-09-04)** `prefers-reduced-motion: reduce` disables all transitions and animations
    - **(SC-06-03)** Mobile: bottom nav touch targets meet 44x44px minimum
