# Implementation Plan: App Scaffolding

---

## Phase 1 — Dependencies & Test Infrastructure

### Step 1 — Install dependencies (SC-01a-01)

- [x] Run `npm install vue-router@^5.0.4` (covering SC-01a-01-01).
- [x] Run `npm install -D @vue/test-utils@^2.4.6` (covering SC-01a-01-02).

> Rollback: `npm uninstall vue-router @vue/test-utils` and revert `package.json` / `package-lock.json`.

### Step 2 — Configure test environment (SC-01a-02, SC-01a-03)

- [x] Update `vitest.config.ts`: add `globals: true`, `include: ['tests/**/*.test.ts']`, `setupFiles: ['./tests/setup.ts']` inside the existing `test: { }` block in the `defineConfig` call. Preserve the existing `mergeConfig(viteConfig, defineConfig(...))` pattern and the `environment: 'jsdom'` setting — do not restructure the config (covering SC-01a-02-01).

Expected final `test` block:

```ts
test: {
  environment: 'jsdom',
  globals: true,
  include: ['tests/**/*.test.ts'],
  setupFiles: ['./tests/setup.ts'],
},
```

The `@` path alias (`@ → ./src`) is inherited from `vite.config.ts` via `mergeConfig` and does not need separate configuration.

- [x] Create `tests/setup.ts` with `/// <reference types="vitest/globals" />` at the top and `beforeEach(() => { localStorage.clear() })`. The `beforeEach` function is available at runtime due to `globals: true` set in the previous substep; TypeScript recognizes it via the `/// <reference types="vitest/globals" />` directive — both are required (covering SC-01a-03-01, SC-01a-03-02).

> Note: `tsconfig.app.json` includes only `src/**/*` and does not cover the `tests/` directory. A dedicated `tsconfig.vitest.json` (extending `tsconfig.app.json`) provides IDE type-checking for test files, adding `vitest/globals` and `node` types with `include: ["tests/**/*.ts"]`.

> Rollback: revert `vitest.config.ts` to its previous state and delete `tests/setup.ts`.

### Step 3 — Update testing documentation (SC-01a-02)

- [x] Remove the `import { describe, it, expect } from 'vitest'` line from the code example in `docs/technical/testing.md`, so the example starts with `import { isHighRated } from '@/domain/movie.logic'`. This aligns the reference documentation with the `globals: true` convention established in Step 2. Note: the `vitest.config.ts` settings list in `testing.md` already reflects the post-Phase 01a target state (`globals: true`, `include`, `setupFiles`) — only the code example needs updating.

> Rollback: revert `docs/technical/testing.md` to its previous state.

---

## Phase 2 — Verification

> **Testing phase note:** No automated test files are produced in this phase because the scope is pure infrastructure with no testable application logic. Tests are deferred to downstream phases (01b–01k) that will use the infrastructure established here.

> This phase has no user-facing scenarios. Verification confirms the infrastructure is correctly configured. See [`scenarios/`](./scenarios/) for scenario IDs.

### Step 4 — Run verification checks (SC-01a-01, SC-01a-02, SC-01a-03)

- [x] Verify `package.json` lists `vue-router` under `dependencies` and `@vue/test-utils` under `devDependencies` (SC-01a-01-01, SC-01a-01-02).
- [x] Verify `vitest.config.ts` contains `globals: true`, `include: ['tests/**/*.test.ts']`, `setupFiles: ['./tests/setup.ts']`, and `environment: 'jsdom'` (SC-01a-02-01).
- [x] Verify `docs/technical/testing.md` code example does not contain explicit Vitest imports (SC-01a-02-04).
- [x] Verify `tests/setup.ts` calls `localStorage.clear()` in `beforeEach` (SC-01a-03-01) and includes `/// <reference types="vitest/globals" />` (SC-01a-03-02).
- [ ] Run `npm run test` — must exit with zero config errors (SC-01a-02-02). _(ignored: exits code 1 because no test files exist yet — config is correct)_
- [ ] Run `npm run check` — format, lint, type-check, test, and build must all pass with zero failures (SC-01a-02-03). _(ignored: fails at test step for same reason — format, lint, type-check all pass)_

> SC-01a-03-03 (without setup file, localStorage state leaks between tests) is a negative scenario that validates the need for the setup file. It is implicitly confirmed by SC-01a-02-01 (setupFiles configured) and SC-01a-03-01 (localStorage cleared) — no separate verification step needed.

---

## Phase 3 — Testing: i18n Keys (test-first)

> **References:** [requirements.md](./requirements.md) · [scenarios/SC-01b-12.feature](./scenarios/SC-01b-12.feature)

### Step 1 — Write locale key parity test (covering: SC-01b-12-03)

- [x] Create `tests/presentation/i18n/locale-keys.test.ts` (directory `tests/presentation/i18n/` does not exist yet and must be created):
  - Test that `en.json`, `es.json`, `fr.json` all exist and parse as valid JSON (covering: AC5)
  - Test that all three files contain identical key paths (covering: AC2)
  - Test that all translation values are non-empty strings (covering: AC3)
  - Test that key paths include the expected 19 keys (18 new + 1 existing `app.title`, matching SC-01b-12's 18 new keys) (covering: AC1):
    - `app.title`
    - `nav.home`, `nav.recommendations`, `nav.calendar`, `nav.library`, `nav.settings`
    - `page.home.title`, `page.recommendations.title`, `page.calendar.title`, `page.library.title`, `page.settings.title`
    - `common.empty.title`, `common.empty.description`
    - `common.error.title`, `common.error.description`, `common.error.reload`
    - `toast.error`, `toast.dismiss`, `toast.retry`
  - Test that the existing `app.title` key is preserved with its original value (covering: AC4)
  - Test that every dot-separated segment of each key matches the camelCase pattern `^[a-z][a-zA-Z0-9]*$` (covering: AC6)
- [x] Run test to confirm failure before implementation

> Tests must follow the Arrange-Act-Assert (AAA) pattern per project conventions.

> **Scenario traceability:**
>
> - SC-01b-12-03 → covered by `locale-keys.test.ts` above (structural parity, camelCase, value checks)
> - SC-01b-12-01 → deferred to 01i (navigation component tests for Home, Calendar, Library, and Settings label rendering); Recommendations remains deferred to the future change that introduces that route and nav item
> - SC-01b-12-02 → deferred to 01i (page-header component tests for Home, Calendar, Library, and Settings title rendering); Recommendations remains deferred to the future change that introduces that route
> - SC-01b-12-07, SC-01b-12-08 → deferred to the future change that introduces the Recommendations route and nav item
> - SC-01b-12-04, SC-01b-12-05, SC-01b-12-06 → deferred to downstream integration tests that render `toast.*` and `common.error.*` keys; AC9 (fallback verification) is implicitly satisfied by the `fallbackLocale: 'en'` configuration in Phase 00 and will be explicitly exercised by the later toast/error-handling and assembled-shell phases rather than by the navigation or placeholder-view phases

---

## Phase 4 — Implementation: i18n Keys (covering: SC-01b-12)

### Step 1 — Verify prerequisite

- [x] Confirm `app.title` key exists in all three locale files (`src/presentation/i18n/locales/en.json`, `es.json`, `fr.json`) from Phase 00. If missing, stop and complete Phase 00 first.

### Step 2 — Update locale files

- [x] Add keys to `en.json`, `es.json`, `fr.json`. All three files must be updated atomically to maintain key path parity. Rollback: `git checkout -- src/presentation/i18n/locales/` restores all locale files to their prior state; `rm tests/presentation/i18n/locale-keys.test.ts` removes the test file.

**Expected flat JSON structure (`en.json`):**

```json
{
  "app.title": "Plot Twisted",
  "nav.home": "Home",
  "nav.recommendations": "Recommendations",
  "nav.calendar": "Calendar",
  "nav.library": "Library",
  "nav.settings": "Settings",
  "page.home.title": "Home",
  "page.recommendations.title": "Recommendations",
  "page.calendar.title": "Calendar",
  "page.library.title": "Library",
  "page.settings.title": "Settings",
  "common.empty.title": "Nothing here yet",
  "common.empty.description": "This page is under construction.",
  "common.error.title": "Something went wrong",
  "common.error.description": "An unexpected error occurred.",
  "common.error.reload": "Reload",
  "toast.error": "An error occurred",
  "toast.dismiss": "Dismiss",
  "toast.retry": "Retry"
}
```

**Translations:**

| Key                          | English                          | Spanish                           | French                                |
| :--------------------------- | :------------------------------- | :-------------------------------- | :------------------------------------ |
| `nav.home`                   | Home                             | Inicio                            | Accueil                               |
| `nav.recommendations`        | Recommendations                  | Recomendaciones                   | Recommandations                       |
| `nav.calendar`               | Calendar                         | Calendario                        | Calendrier                            |
| `nav.library`                | Library                          | Biblioteca                        | Bibliothèque                          |
| `nav.settings`               | Settings                         | Ajustes                           | Paramètres                            |
| `page.home.title`            | Home                             | Inicio                            | Accueil                               |
| `page.recommendations.title` | Recommendations                  | Recomendaciones                   | Recommandations                       |
| `page.calendar.title`        | Calendar                         | Calendario                        | Calendrier                            |
| `page.library.title`         | Library                          | Biblioteca                        | Bibliothèque                          |
| `page.settings.title`        | Settings                         | Ajustes                           | Paramètres                            |
| `common.empty.title`         | Nothing here yet                 | Nada aquí todavía                 | Rien ici pour le moment               |
| `common.empty.description`   | This page is under construction. | Esta página está en construcción. | Cette page est en construction.       |
| `common.error.title`         | Something went wrong             | Algo salió mal                    | Une erreur est survenue               |
| `common.error.description`   | An unexpected error occurred.    | Ocurrió un error inesperado.      | Une erreur inattendue s'est produite. |
| `common.error.reload`        | Reload                           | Recargar                          | Recharger                             |
| `toast.error`                | An error occurred                | Ocurrió un error                  | Une erreur est survenue               |
| `toast.dismiss`              | Dismiss                          | Cerrar                            | Fermer                                |
| `toast.retry`                | Retry                            | Reintentar                        | Réessayer                             |

`page.*.title` keys mirror `nav.*` values initially (separate keys to allow divergence later).

> **Key count verification:** The translation table above contains exactly 18 entries, matching SC-01b-12's requirement of 18 new keys across 5 namespaces.

---

## Phase 5 — Verification: i18n Keys

### Step 1 — Confirm test-first cycle and run build

- [x] Confirm that tests written in Phase 3 failed before Phase 4 implementation (expected: all tests fail since locale files were incomplete)
- [x] Run `npx vitest run tests/presentation/i18n/locale-keys.test.ts` — all tests now pass after Phase 4 implementation
- [x] Run `npx prettier --check src/presentation/i18n/locales/*.json` — formatting passes
- [x] Run `npx tsc --noEmit` — no type errors in the new test file
- [x] Run `npm run build` — build succeeds with no errors

---

## Phase 6 — Tests: Theme, Transitions & Constants

> Test-first: tests are written and run before implementation code. CSS structural scenarios (SC-01c-21-01, SC-01c-09-01, SC-01c-22-01, SC-01c-23-01, SC-01c-24-04, SC-01c-24-05) are verified via CSS inspection in Phase 8. Behavioral scenarios requiring downstream components (SC-01c-22-02, SC-01c-22-03, SC-01c-23-02, SC-01c-24-01 through SC-01c-24-03) are verified after R-01g and R-01k are complete.

### Step 1 — Write domain constants unit test

- [x] Create `tests/domain/constants.test.ts` — covering: SC-01c-25-01
  - Assert `TOAST_DISMISS_MS` is exported and equals `4000`
  - Assert `TOAST_DISMISS_MS` is of type `number`

### Step 2 — Confirm test failure

- [x] Run `npx vitest run tests/domain/constants.test.ts` — expect failure (module does not exist yet)

## Phase 7 — Implementation: Theme, Transitions & Constants

> **Rollback:** Revert modified files via `git checkout src/assets/main.css src/domain/constants.ts`.

### Step 3 — Create domain constants [SC-01c-25]

- [x] Create `src/domain/constants.ts`:

```ts
/** Auto-dismiss timeout for toast notifications (in milliseconds). */
export const TOAST_DISMISS_MS = 4000
```

### Step 4 — Add theme color tokens [SC-01c-21]

- [x] Append to the existing `@theme { }` block in `src/assets/main.css` after the `--font-sans` line (do not create a new block):
  - `--color-success: #22c55e`
  - `--color-error: #ef4444`

### Step 5 — Add fade transition CSS [SC-01c-09]

> Vue `<Transition>` requires class-based CSS. Centralizing in `main.css` avoids duplication. Acknowledged exception to the "Tailwind only" rule (see Decisions table in requirements.md).

- [x] Add after the `@theme` block in `src/assets/main.css`:

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

### Step 6 — Add toast transition CSS [SC-01c-22]

- [x] Add toast transition CSS in `src/assets/main.css`:

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

### Step 7 — Add modal transition CSS [SC-01c-23]

- [x] Add modal transition CSS in `src/assets/main.css`. These classes apply to the content card only; backdrop transition is managed separately by the modal component in R-01g:

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

### Step 8 — Add reduced-motion override [SC-01c-24]

- [x] Add reduced-motion override in `src/assets/main.css`. The `.animate-pulse` rule disables Tailwind's built-in skeleton shimmer animation used in loading states (R-01f), ensuring all visual motion is suppressed:

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

## Phase 8 — Verification: Theme, Transitions & Constants

### Step 9 — Run tests

- [x] Run `npx vitest run` — all tests pass, including `tests/domain/constants.test.ts` (covering: SC-01c-25-01)

### Step 10 — Build and lint check

- [x] Run `npm run check` — passes with no errors

### Step 11 — CSS verification

> Covers CSS structural scenarios: SC-01c-21-01, SC-01c-09-01, SC-01c-22-01, SC-01c-23-01, SC-01c-24-04, SC-01c-24-05.

- [x] `--color-success` and `--color-error` exist in the `@theme` block of `src/assets/main.css`
- [x] Existing theme variables (`--color-bg-primary`, `--color-bg-secondary`, `--color-surface`, `--color-accent`, `--font-sans`) are preserved
- [x] `.fade-enter-active`, `.toast-enter-active`, `.modal-enter-active` classes present in `src/assets/main.css`
- [x] `.animate-pulse` animation disabled in the `@media (prefers-reduced-motion: reduce)` block
- [x] `@media (prefers-reduced-motion: reduce)` block present
- [x] No transition duration exceeds 300ms

### Step 12 — Deferred behavioral verification

> Behavioral scenarios requiring downstream components are verified in their respective feature phases:

- [x] SC-01c-22-02, SC-01c-22-03 — Verified in R-01g (Toast Container & Modal Dialog) integration testing
- [x] SC-01c-23-02 — Verified in R-01g (Toast Container & Modal Dialog) integration testing
- [x] SC-01c-24-01 — Verified in R-01k (App Shell & Assembly) with route transition wiring
- [x] SC-01c-24-02, SC-01c-24-03 — Verified in R-01g and R-01k with reduced-motion testing

---

## Phase 9 — Router Tests

> **References:** [requirements.md](./requirements.md) · [scenarios/SC-01d-29.feature](./scenarios/SC-01d-29.feature) · [scenarios/SC-01d-02.feature](./scenarios/SC-01d-02.feature) · [scenarios/SC-01d-03.feature](./scenarios/SC-01d-03.feature) · [scenarios/SC-01d-10.feature](./scenarios/SC-01d-10.feature) · [scenarios/SC-01d-11.feature](./scenarios/SC-01d-11.feature) · [scenarios/SC-01d-22.feature](./scenarios/SC-01d-22.feature)

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

## Phase 10 — Router Implementation

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

  > **Note:** These route view files are completed later in this plan's placeholder-view phases. Before that upgrade lands, the router can point to minimal stubs to satisfy Vite's import analysis.

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

## Phase 11 — Router Verification

- [x] `npm run test` — all router tests pass
- [x] `npm run type-check` — no type errors
- [x] `npm run build` — production build succeeds and produces lazy-loaded chunks
- [x] `npm run lint` — no linting errors in new files

---

## Phase 12 — Composable Test Scaffolding

### Step 1 — Write toast composable tests

- [x] Create `tests/presentation/composables/use-toast.test.ts` covering:

- **SC-13-01, SC-23-01** — `addToast()` adds a toast to the queue with a unique ID
- **SC-23-09** — `removeToast(id)` removes the toast from the queue
- **SC-13-01, SC-23-02** — Auto-dismiss removes the toast after `TOAST_DISMISS_MS` (use `vi.useFakeTimers()`)
- **SC-13-03** — Toast with action preserves the action object in state (composable stores the action; button click interaction is 01g's scope)
- **SC-13-04, SC-23-08** — Adding a 6th toast evicts the oldest toast (`MAX_VISIBLE_TOASTS` cap)
- **SC-13-05, SC-23-12** — `removeToast()` with a non-existent ID has no effect and does not throw
- **SC-23-03** — Toast types: `'error'`, `'success'`, `'info'`
- **SC-23-11** — `removeToast()` clears the auto-dismiss timer; the cleared timer does not fire
- **SC-23-13** — Two sequentially added toasts receive distinct, incrementing IDs

> **State isolation:** Each test must reset composable state in `beforeEach` — either via the public API (remove all toasts) or a `_resetForTesting()` helper (see Risks in requirements.md).

> **Note:** `tests/presentation/composables/` is a new directory mirroring the new `src/presentation/composables/` location established by this feature.

---

### Step 2 — Write modal composable tests

- [x] Create `tests/presentation/composables/use-modal.test.ts` covering:

- **SC-12-01, SC-23-04** — `open(props)` sets `isOpen` to true and stores props
- **SC-12-02, SC-23-04** — `close()` sets `isOpen` to false and clears props to null
- **SC-12-03, SC-23-07** — Calling `open()` a second time replaces the first modal's props (single-instance behavior)
- **SC-23-05** — `onConfirm` callback is stored and accessible in modal props
- **SC-23-06** — `onCancel` callback is stored and accessible in modal props
- **SC-12-04, SC-23-10** — `close()` when no modal is open has no effect and does not throw
- **SC-12-05** — `open(props)` with `confirmLabel` and `cancelLabel` stores the labels in props
- `(implementation detail)` — Props include `title`, optional `content`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`

> **State isolation:** Each test must reset composable state in `beforeEach` — either via the public API (`close()`) or a `_resetForTesting()` helper.

---

## Phase 13 — Composable Implementation

### Step 3 — Create toast composable

- [x] Add `MAX_VISIBLE_TOASTS = 5` to `src/domain/constants.ts`. _(Rollback: remove the `MAX_VISIBLE_TOASTS` line from `src/domain/constants.ts`.)_
- [x] Create `src/presentation/composables/use-toast.ts`:

- Module-level `ref<Toast[]>` (singleton — shared across all callers, works outside `setup()`)
- `Toast` type: `{ id: string, message: string, type: 'error' | 'success' | 'info', action?: { label: string, handler: () => void } }`
- ID generation: `String(nextId++)` — incrementing counter coerced to string (e.g., `'1'`, `'2'`, `'3'`)
- Timer tracking: `Map<string, ReturnType<typeof setTimeout>>` to associate each toast with its auto-dismiss timer
- `addToast(options: { message: string, type: 'error' | 'success' | 'info', action?: { label: string, handler: () => void } })` — `type` is required (no default value). Generates unique id, pushes toast, starts `setTimeout` (using `TOAST_DISMISS_MS` from `src/domain/constants.ts`) for auto-removal. Enforces `MAX_VISIBLE_TOASTS` (from `src/domain/constants.ts`) with oldest-first eviction — clears the evicted toast's auto-dismiss timer and deletes its entry from the timer map before eviction.
- `removeToast(id: string)` — removes from array; calls `clearTimeout` on the associated timer **and** deletes the entry from the timer map
- Returns `{ toasts: Readonly<Ref<Toast[]>>, addToast, removeToast }`
- JSDoc comments on all exported functions and the `Toast` type

> **Note:** The `{ data, loading, error }` return convention applies to Application-layer composables wrapping async operations. This Presentation-layer composable uses a shape suited to UI state management.

---

### Step 4 — Create modal composable

- [x] Create `src/presentation/composables/use-modal.ts`:

- Module-level `ref<boolean>` + `shallowRef<ModalProps | null>` (single modal at a time; `shallowRef` is intentional — props are always replaced via `open()`, never mutated in place. Incoming props are not cloned; the caller-provided object is stored directly.)
- `ModalProps` type: `{ title: string, content?: string, confirmLabel?: string, cancelLabel?: string, onConfirm?: () => void, onCancel?: () => void }`
- `open(props: ModalProps)` — sets visible true, stores props
- `close()` — sets visible false, clears props to `null`
- Returns `{ isOpen: Readonly<Ref<boolean>>, props: Readonly<ShallowRef<ModalProps | null>>, open, close }`
- JSDoc comments on all exported functions and the `ModalProps` type

> **Note:** The `{ data, loading, error }` return convention applies to Application-layer composables wrapping async operations. This Presentation-layer composable uses a shape suited to UI state management.

---

## Phase 14 — Composable Documentation

### Step 5 — Update architecture documentation

- [x] Update `docs/technical/architecture.md` to document `src/presentation/composables/` as the location for UI-only state composables. Add `composables/` to the Presentation-layer folder structure.
- [x] Update `docs/technical/testing.md` directory-tree example to include `tests/presentation/composables/`.
- [x] Update `docs/technical/data-model.md` constants table to include `MAX_VISIBLE_TOASTS`.
- [x] Update the glossary entry for "Composable" in `docs/reference/glossary.md`. Draft wording: _"A `use`-prefixed function providing reactive state. **Application-layer** composables (in `src/application/`) wrap Infrastructure calls with Vue reactivity and return `{ data, loading, error, refresh? }`. **Presentation-layer** composables (in `src/presentation/composables/`) manage UI-only state (e.g., toast queue, modal visibility) with a custom return shape."_

---

## Phase 15 — Composable Verification

### Step 6 — Verification

- [x] `npx vitest run tests/presentation/composables/` — all composable tests pass
- [x] `npx tsc --noEmit` — no type errors
- [x] `npx eslint src/presentation/composables/` — no lint violations
- [x] Verify `MAX_VISIBLE_TOASTS` is exported from `src/domain/constants.ts` (e.g., `grep 'MAX_VISIBLE_TOASTS' src/domain/constants.ts`)
- [x] Verify JSDoc comments are present on all exported functions and types

---

## Phase 16 — Tests: Skeleton & Empty State

### Step 1 — Write empty-state tests

- [x] Create `tests/presentation/components/common/empty-state.test.ts` covering:

- **SC-16-01** — Renders icon, title, and description when all provided
- **SC-16-02** — With only title prop, icon and description are absent
- **SC-16-03** — CTA button renders when `ctaLabel` and `ctaAction` are provided
- **SC-16-04** — No CTA button rendered when `ctaLabel` is provided without `ctaAction`
- **SC-16-05** — CTA button click invokes `ctaAction` handler
- **SC-16-06** — Empty title string renders without error
- _(implementation detail)_ — No CTA button rendered when `ctaAction` is provided without `ctaLabel`
- Also covers **SC-24-01** (EmptyState component test exists and verifies props)

Tests use `@vue/test-utils` `mount()` (provided by prerequisite 01a). Type-check is expected to fail until Phase 17 completes (test-first approach).

---

### Step 2 — Write skeleton-loader tests

- [x] Create `tests/presentation/components/common/skeleton-loader.test.ts` covering:

- **SC-17-01** — Renders with specified dimensions, pulsing shimmer animation, and `aria-hidden="true"`
- **SC-17-02** — Applies custom `rounded` prop
- **SC-17-03** — Renders with default prop values (width `'100%'`, height `'1rem'`, `rounded-md`)
- Also covers **SC-24-02** (SkeletonLoader component test exists and verifies props)

---

## Phase 17 — Implementation: Skeleton & Empty State

### Step 3 — Create skeleton-loader component

- [x] Create `src/presentation/components/common/skeleton-loader.vue`:

- Props: `width` (string, default `'100%'`), `height` (string, default `'1rem'`), `rounded` (string, default `'rounded-md'`)
- Single `<div>` with `animate-pulse bg-surface`, `aria-hidden="true"`, and dimensions applied via `:style="{ width, height }"`

---

### Step 4 — Create empty-state component

- [x] Create `src/presentation/components/common/empty-state.vue`:

- **Props:** `icon` (Vue `Component` type, optional), `title` (string), `description` (string, optional), `ctaLabel` (string, optional), `ctaAction` (() => void, optional)
- **Layout:** Centered with `flex flex-col items-center justify-center`
- **Styling:** Icon in `text-slate-400`, title in `text-white font-bold`, description in `text-slate-400`
- **CTA button:** Styled as primary teal (`bg-accent text-white rounded-md px-4 py-2`); rendered only when both `ctaLabel` and `ctaAction` are provided; clicking invokes `ctaAction`
- **i18n:** All string props receive pre-translated values from the consuming component (which calls `$t()`) — this component does not call `$t()` internally

---

## Phase 18 — Verification: Skeleton & Empty State

### Step 5 — Verify

- [x] `npm run type-check` passes with no errors
- [x] `npm run lint` passes with no errors
- [x] `npm run test` — all tests pass including the new empty-state and skeleton-loader test files
- [x] `npm run build` succeeds with no warnings

---

## Phase 19 — Tests: Toast Container & Modal Dialog

### Step 1 — Write toast-container tests

- [x] Create `tests/presentation/components/common/toast-container.test.ts` covering:

- **SC-14-01** — Multiple toasts stack vertically without overlapping
- **SC-14-02** — Container is fixed top-right with `z-50`
- **SC-14-03** — Dismiss button removes toast
- **SC-14-04** — Oldest toast evicted when max (5) exceeded
- **SC-14-05a** — Toast enter transition (slide-in from right, 300 ms)
- **SC-14-05b** — Toast leave transition (fade-out, 200 ms)
- **SC-14-06** — Type-colored left borders per toast type
- **SC-14-07** — Toast auto-dismisses after `TOAST_DISMISS_MS`
- **SC-14-08** — Transitions disabled when `prefers-reduced-motion: reduce`
- **SC-14-09** — Toast text renders in non-default locale
- **SC-14-10** — Action button triggers callback
- **SC-24-04** — ToastContainer component test suite exists and passes
- `(implementation detail)` — Renders nothing when toast queue is empty; renders toast items when present
- `(implementation detail)` — Each toast shows message, dismiss button, type-colored border, and optional action button (renders when provided, triggers handler on click)
- `(implementation detail)` — Each toast item is keyed by `toast.id` for `<TransitionGroup>`

### Step 2 — Write modal-dialog tests

- [x] Create `tests/presentation/components/common/modal-dialog.test.ts` covering:

- **SC-15-01** — Opens and renders title, content, confirm, and cancel buttons
- **SC-15-02** — Closes on backdrop click
- **SC-15-03** — Closes on Escape key (document-level listener)
- **SC-15-04** — Confirm button invokes `onConfirm` callback
- **SC-15-05** — Cancel button invokes `onCancel` callback
- **SC-15-06** — Opening a new modal replaces the current one
- **SC-15-07a** — Modal open transition (fade backdrop in, scale content up)
- **SC-15-07b** — Modal close transition (fade backdrop out, scale content down)
- **SC-15-10** — Clicking inside modal content card does not close modal
- **SC-15-11** — Modal with empty/missing optional content renders correctly
- **SC-15-08** — Modal text renders in non-default locale
- **SC-15-09** — Modal transitions disabled with reduced motion
- **SC-24-05** — ModalDialog component test suite exists and passes
- `(implementation detail)` — Does not render when `isOpen` is false

---

## Phase 20 — Implementation: Toast Container & Modal Dialog

### Step 3 — Create toast-container component

- [x] Create `src/presentation/components/common/toast-container.vue`:

- Fixed `top-4 right-4 z-50`, flex column with `gap-3`
- Uses `useToast()` to read the toast queue
- Each toast item keyed by `toast.id` for correct `<TransitionGroup>` animation
- Each toast: `bg-surface` card, type-colored left border mapping: `error` → `--color-error`, `success` → `--color-success`, `info` → `--color-accent`
- Dismiss button: X icon from lucide-vue-next, minimum 44×44px touch target
- Optional action button (text-style, left of dismiss), minimum 44×44px touch target
- i18n keys: `toast.dismiss` for dismiss button aria-label
- `<TransitionGroup>` using `toast-*` CSS transition classes (300 ms enter, 200 ms leave, ease-in-out); transitions disabled when `prefers-reduced-motion: reduce` is active

### Step 4 — Create modal-dialog component

- [x] Create `src/presentation/components/common/modal-dialog.vue`:

- Uses `useModal()` to read open/close state and props
- Rendered with `v-if` on `isOpen` (no DOM presence when closed)
- Backdrop: `fixed inset-0 z-40 bg-black/50`, click-to-close
- Content card: centered, `bg-surface rounded-lg p-6 max-w-md shadow-lg overflow-y-auto max-h-[80vh]`
- Click on content card stops propagation (does not trigger backdrop close)
- Title, optional content (from `ModalProps.content`), confirm and cancel buttons
- Confirm defaults to `$t('modal.confirm')`, cancel defaults to `$t('modal.cancel')` when labels not provided
- Escape key listener registered on `document` via `onMounted`/`onUnmounted`
- `<Transition>`: fade backdrop + scale content (200-300 ms, ease-in-out); disabled when `prefers-reduced-motion: reduce` is active

---

## Phase 21 — Verification: Toast Container & Modal Dialog

### Step 5 — Verify

- [x] Run `npm run type-check` — zero errors
- [x] Run `npm run test` — all tests pass
- [x] Confirm all acceptance criteria in `requirements.md` are met

---

## Phase 22 — Tests: Error Handling

### Step 1 — Write error-boundary tests

- [x] Create `tests/presentation/components/error/error-boundary.test.ts` covering:

- **SC-24-03** — Renders slot content in normal state
- **SC-18-01 / SC-24-06** — Shows the full-screen fallback UI with translated error title, description, primary reload button, and `role="alert"` when an error is captured
- **SC-18-02** — Reload button calls `window.location.reload()`
- **SC-18-03** — `onErrorCaptured` returns `false` to prevent propagation to the global error handler, so no error toast is dispatched

### Step 2 — Write global error handler test

- [x] Create `tests/main.test.ts` covering:

- **SC-19-01** — `app.config.errorHandler` dispatches an error toast to the shared queue via `useToast()` and logs to `console.error`

  **Setup:** Mock `createApp()` to capture the production `app.config.errorHandler` assigned during `src/main.ts` module initialization, then invoke that captured handler with a synthetic error. Use `vi.spyOn(console, 'error')` to verify logging. Assert that `useToast().toasts.value` contains a newly queued toast with `message: i18n.global.t('toast.error')` and `type: 'error'`. Call `_resetForTesting()` in `beforeEach` for test isolation.

---

## Phase 23 — Implementation: Error Handling

### Step 3 — Create error boundary

- [x] Create `src/presentation/components/error/error-boundary.vue`:

- Uses `onErrorCaptured` lifecycle hook
- Returns `false` from `onErrorCaptured` to prevent propagation to the global error handler
- Normal state: renders `<slot />`
- Error state: full-screen centered fallback with `$t('common.error.title')`, `$t('common.error.description')`, and a primary reload button calling `window.location.reload()`
- Fallback container uses `role="alert"` for accessibility as an intentional exception to the default semantic-only guidance
- Style fallback UI with Tailwind classes consistent with the global error-state guidance in `docs/technical/ui-ux.md`

### Step 4 — Add global error handler

- [x] Modify `src/main.ts` to add `app.config.errorHandler` after existing plugin registrations:

- Import `useToast` from `./presentation/composables/use-toast`
- Import `i18n` from `./presentation/i18n`
- Logs uncaught component/render errors to `console.error`
- Calls `useToast().addToast({ message: i18n.global.t('toast.error'), type: 'error' })` for errors not already handled by the ErrorBoundary
- Leaves API request failures on their existing request-specific error paths

> Note: `src/main.ts` importing from `src/presentation/composables/` is an intentional exception to typical layer boundaries, consistent with the module-level singleton decision in requirements. The `i18n.global.t()` function is used because the handler runs outside Vue component lifecycle.

- [x] Update `src/App.vue` to wrap routed application content in `ErrorBoundary`.

---

## Phase 24 — Verification: Error Handling

### Step 5 — Verify

- [x] Run `npm test` to verify all tests pass
- [x] Run `npm run lint` to verify no linting errors
- [x] Run `npm run type-check` to verify no type errors
- [x] Verify the error boundary renders the documented full-screen fallback when a child throws
- [x] Verify the global error handler dispatches a `toast.error` entry to the shared toast queue for uncaught component/render errors outside the ErrorBoundary

---

## Phase 25 — Navigation Components: Sidebar

### Step 1 — Write sidebar tests

- [x] Create `tests/presentation/components/layout/sidebar-nav.test.ts` covering:
  - **SC-05-01** — Renders a fixed desktop sidebar with the `app.title` branding block, exactly 4 scaffolded nav links, and no Recommendations/Stats/detail nav items
  - **SC-05-02** — Renders the documented French labels (`Accueil`, `Calendrier`, `Bibliothèque`, `Paramètres`) with the mapped icons
  - **SC-07-01** — Active route item has teal accent classes (`border-accent`, `bg-accent/10`)
  - **SC-07-02** — Home route uses exact match (`route.path === '/'`)
  - **SC-07-04** — Home route is highlighted on `/`
  - **SC-25-01** — Sidebar test covers nav item rendering and exact 4-item navigation
  - **SC-25-02** — Sidebar test covers desktop active-state behavior
  - **SC-25-07** — Sidebar test covers Home exact-match positive behavior
  - `(implementation detail)` — Inactive items use muted classes (`text-slate-400`)
- [x] Run `npx vitest run tests/presentation/components/layout/sidebar-nav.test.ts` and confirm the new assertions fail before implementing `sidebar-nav.vue`

### Step 2 — Create sidebar-nav component

- [x] Create `src/presentation/components/layout/sidebar-nav.vue`:
  - Fixed left sidebar, `w-56`, `bg-bg-secondary`
  - App title at top using `$t('app.title')`; a dedicated logo asset remains out of scope for this phase
  - Nav items array: `{ to: string, labelKey: string, icon: Component }`
  - Icons from lucide-vue-next: `House`, `CalendarDays`, `Bookmark`, `Settings`
  - Routes and labels: `/` + `nav.home`, `/calendar` + `nav.calendar`, `/library` + `nav.library`, `/settings` + `nav.settings`
  - Exactly 4 items; Recommendations intentionally remains out of scope until its route exists
  - Each item is a `<RouterLink>` with icon + `$t(labelKey)`
  - Active state: `border-l-2 border-accent bg-accent/10 text-white`
  - Inactive state: `text-slate-400 hover:text-white`
  - Home route: exact match only (`route.path === '/'`)

### Step 3 — Run sidebar tests

- [x] Run `npx vitest run tests/presentation/components/layout/sidebar-nav.test.ts` and confirm all sidebar assertions pass before moving to the next phase

## Phase 26 — Navigation Components: Bottom Nav

### Step 4 — Write bottom nav tests

- [x] Create `tests/presentation/components/layout/bottom-nav.test.ts` covering:
  - **SC-06-01** — Renders a fixed mobile bottom nav with the same exact 4 scaffolded nav links in documented order and no Recommendations/Stats/detail nav items
  - **SC-06-03** — Each bottom-nav item meets the 44x44px minimum touch target
  - **SC-07-03** — Active route item has teal accent styling
  - **SC-07-05** — Home route item uses exact match on `/`
  - **SC-25-03** — Bottom-nav test covers mobile rendering and exact 4-item navigation
  - **SC-25-04** — Bottom-nav test covers active state and touch targets
  - **SC-25-08** — Bottom-nav test covers Home exact-match positive behavior
  - `(implementation detail)` — Inactive items use muted styling
- [x] Run `npx vitest run tests/presentation/components/layout/bottom-nav.test.ts` and confirm the new assertions fail before implementing `bottom-nav.vue`

### Step 5 — Create bottom-nav component

- [x] Create `src/presentation/components/layout/bottom-nav.vue`:
  - Fixed bottom bar (`fixed bottom-0 inset-x-0 z-10`)
  - Same 4 nav items, order, icons, and translation keys as the sidebar
  - Each interactive item uses `min-h-11` / `min-w-11` or equivalent sizing to meet the 44x44px minimum touch target
  - Active item: teal accent color; Home route uses exact match only (`route.path === '/'`)
  - Inactive item: muted
  - Dark background with subtle top border
  - Classes: `hidden max-md:fixed max-md:flex` (visible below `md`, hidden at `md+`)
  - Keep the component focused on nav rendering and mobile presentation; the later app-shell phases own content-area clearance in the assembled shell

### Step 6 — Run bottom-nav tests

- [x] Run `npx vitest run tests/presentation/components/layout/bottom-nav.test.ts` and confirm all bottom-nav assertions pass before moving to the next phase

## Phase 27 — Navigation Components: Page Header

### Step 7 — Write page header tests

- [x] Create `tests/presentation/components/layout/page-header.test.ts` covering:
  - **SC-08-01** — Displays translated title from route `meta.titleKey`
  - **SC-08-02** — Updates displayed title when route changes
  - **SC-08-03** — Applies sticky positioning classes
  - **SC-08-04** — Renders translated title in a non-default locale
  - **SC-25-05** — Page-header test covers title rendering and route updates
  - **SC-25-06** — Page-header test covers sticky positioning and non-default locale output
- [x] Run `npx vitest run tests/presentation/components/layout/page-header.test.ts` and confirm the new assertions fail before implementing `page-header.vue`

### Step 8 — Create page-header component

- [x] Create `src/presentation/components/layout/page-header.vue`:
  - Reads `route.meta.titleKey`, translates via `$t()`
  - Updates immediately when the active route changes
  - White text, `text-xl font-bold`
  - Classes: `sticky top-0 z-10 bg-bg-primary`

### Step 9 — Run page-header tests

- [x] Run `npx vitest run tests/presentation/components/layout/page-header.test.ts` and confirm all page-header assertions pass before moving to project-wide verification

## Phase 28 — Navigation Components: Verification

### Step 10 — Run targeted layout component tests

- [x] Run and confirm all pass:
  - `npx vitest run tests/presentation/components/layout/sidebar-nav.test.ts`
  - `npx vitest run tests/presentation/components/layout/bottom-nav.test.ts`
  - `npx vitest run tests/presentation/components/layout/page-header.test.ts`

### Step 11 — Run project verification

- [x] Run and confirm all pass:
  - `npm run test`
  - `npm run lint`
  - `npm run format:check`
  - `npm run type-check`
  - `npm run build`

> App-shell integration checks for responsive switching and content-area clearance are captured in the later app-shell phases of this plan, after `AppShell` assembles these components.

## Phase 29 — Placeholder Views: Test Coverage

### Step 12 — Write placeholder-view tests

- [x] Add one component test file per scaffolded route view in `tests/presentation/views/` before changing the implementations. Each test includes both `en` and `fr` cases to prove the placeholder copy is sourced from vue-i18n.

  | Test File                 | Covers                 | Verifies                                                                                                                                                 |
  | :------------------------ | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `home-screen.test.ts`     | `SC-20-01`, `SC-26-01` | `/` renders the `House` icon, translated `common.empty.title`, and `common.empty.description` in the active locale for both `en` and `fr`                |
  | `calendar-screen.test.ts` | `SC-20-01`, `SC-26-01` | `/calendar` renders the `CalendarDays` icon, translated `common.empty.title`, and `common.empty.description` in the active locale for both `en` and `fr` |
  | `library-screen.test.ts`  | `SC-20-01`, `SC-26-01` | `/library` renders the `Bookmark` icon, translated `common.empty.title`, and `common.empty.description` in the active locale for both `en` and `fr`      |
  | `settings-screen.test.ts` | `SC-20-01`, `SC-26-01` | `/settings` renders the `Settings` icon, translated `common.empty.title`, and `common.empty.description` in the active locale for both `en` and `fr`     |

### Step 13 — Confirm tests fail against the original stubs

- [x] Run the targeted route-view tests and confirm they fail against the original stub implementations before editing the view files:

  `npm run test -- tests/presentation/views/home-screen.test.ts tests/presentation/views/calendar-screen.test.ts tests/presentation/views/library-screen.test.ts tests/presentation/views/settings-screen.test.ts`

## Phase 30 — Placeholder Views: Implementation

### Step 14 — Upgrade the scaffolded route views

- [x] Update the existing placeholder view SFCs in `src/presentation/views/` to replace the current stubs with `EmptyState`-based implementations:

  | File                  | Icon Import    | Title Key            | Description Key            |
  | :-------------------- | :------------- | :------------------- | :------------------------- |
  | `home-screen.vue`     | `House`        | `common.empty.title` | `common.empty.description` |
  | `calendar-screen.vue` | `CalendarDays` | `common.empty.title` | `common.empty.description` |
  | `library-screen.vue`  | `Bookmark`     | `common.empty.title` | `common.empty.description` |
  | `settings-screen.vue` | `Settings`     | `common.empty.title` | `common.empty.description` |

Each view follows the same pattern: `<script setup lang="ts">` imports `EmptyState`, the mapped lucide icon, and `useI18n`. The template renders `<EmptyState>` with the icon, the shared translated heading from `common.empty.title`, and the shared supporting text from `common.empty.description`. Route-title rendering remains owned by route `meta.titleKey` and `PageHeader`.

## Phase 31 — Placeholder Views: Verification

### Step 15 — Re-run targeted and project verification

- [x] Re-run the targeted placeholder-view tests and confirm all documented route cases pass:

  `npm run test -- tests/presentation/views/home-screen.test.ts tests/presentation/views/calendar-screen.test.ts tests/presentation/views/library-screen.test.ts tests/presentation/views/settings-screen.test.ts`

- [x] Inspect `home-screen.vue`, `calendar-screen.vue`, `library-screen.vue`, and `settings-screen.vue` to verify `<script setup lang="ts">` appears before `<template>`, no local `<style>` block was added, and placeholder copy is sourced from `common.empty.title` plus `common.empty.description`.

- [x] Run project verification commands after the view updates:
  - `npm run test`
  - `npm run type-check`

## Phase 32 — App Shell: Test Coverage

### Step 16 — Write app-shell and root-assembly tests

- [x] Create `tests/presentation/components/layout/app-shell.test.ts` covering `SC-04-01`, `SC-04-02`, `SC-04-03`, `SC-04-04`, `SC-09-01`, `SC-09-02`, and `SC-10-03`. Assert the desktop sidebar offset, mobile shell switching, bottom-nav clearance, route fade behavior, reduced-motion behavior, and overlay stacking contract.
- [x] Create `tests/App.test.ts` covering `SC-10-01` and `SC-10-02`. Verify `App.vue` renders the routed experience through `ErrorBoundary` and `AppShell`, shows the current four-item scaffolded nav set, and places routed content beneath the shared shell chrome.

### Step 17 — Confirm tests fail before implementation

- [x] Run `npm run test -- tests/presentation/components/layout/app-shell.test.ts tests/App.test.ts` and confirm the new suites fail before implementation begins.

## Phase 33 — App Shell: Implementation

### Step 18 — Create the shared shell

- [x] Create `src/presentation/components/layout/app-shell.vue` with a desktop-first shell wrapper that keeps `SidebarNav` fixed at `w-56`, offsets the content column with `md:pl-56`, and uses a full-height content column as the scroll owner.
- [x] Render `PageHeader` at the top of the content column and a route content region with `flex-1 overflow-y-auto pb-16 md:pb-0` so the final routed content clears the fixed mobile bottom nav.
- [x] Render `<RouterView v-slot="{ Component }">` with `<component :is="Component" />` inside `<Transition name="fade" mode="out-in">` so routed views use the shared fade contract.
- [x] Mount `<BottomNav />`, `<ToastContainer />`, and `<ModalDialog />` inside `AppShell` so assembled-shell z-order remains page content < bottom nav < modal < toast.

## Phase 34 — App Shell: Root Assembly

### Step 19 — Wire the shell at the application root

- [x] Update `src/App.vue` so `ErrorBoundary` wraps `<AppShell />` directly and `RouterView` no longer renders outside the shell.
- [x] Preserve the current scaffolded route set (Home, Calendar, Library, Settings) and document Recommendations as a follow-up dependency instead of introducing a fifth route in this change.

## Phase 35 — App Shell: Verification

### Step 20 — Re-run shell and project verification

- [x] Run `npm run type-check` and confirm zero TypeScript errors.
- [x] Run `npm run lint` and confirm zero ESLint errors.
- [x] Run `npm run format:check` and confirm zero formatting issues.
- [x] Run `npm run test` covering `SC-04-01`, `SC-04-02`, `SC-04-03`, `SC-04-04`, `SC-09-01`, `SC-09-02`, `SC-10-01`, `SC-10-02`, and `SC-10-03`.
- [x] Run `npm run build`, then inspect the emitted main entry chunk and each route-view chunk in `dist/assets/`; confirm the main entry remains under 150 KB and each lazy-loaded route chunk remains under 20 KB.
- [x] Run `npm run dev` and manually confirm:
  - `(SC-10-01)` The header and routed view render together inside the assembled shell on first load.
  - `(SC-10-02)` Sidebar and bottom nav show Home, Calendar, Library, and Settings in the documented order for the current scaffolded route set.
  - `(SC-04-01)` Desktop layout keeps routed content offset from the fixed sidebar.
  - `(SC-04-02)` and `(SC-04-03)` Resizing below and above `768px` switches shell chrome correctly.
  - `(SC-04-04)` The final routed content remains visible above the fixed mobile bottom nav.
  - `(SC-09-01)` Route changes use the 200ms opacity-only fade.
  - `(SC-09-02)` `prefers-reduced-motion: reduce` removes the animated route fade.
  - `(SC-10-03)` Modal overlays shell chrome and toast remains visible above the modal.
  - Re-verify dependency behaviors from `01d` and `01i`: document title updates, clean URLs, catch-all redirect, scroll reset, active route highlighting, and `44x44` mobile touch targets.

---

## Phase 36 — Tests: Router & Locale Contract (test-first)

> **References:** [requirements.md](./requirements.md) · [scenarios/R-01b-01.feature](./scenarios/R-01b-01.feature) · [scenarios/R-01b-03.feature](./scenarios/R-01b-03.feature) · [scenarios/R-01b-04.feature](./scenarios/R-01b-04.feature) · [scenarios/R-01b-05.feature](./scenarios/R-01b-05.feature) · [scenarios/R-01b-08.feature](./scenarios/R-01b-08.feature)

### Step 1 — Extend locale key parity test (covering: R-01b-03-02, R-01b-08-04)

- [x] Update `tests/presentation/i18n/locale-keys.test.ts`:
  - add `page.stats.title`, `page.movie.title`, and `page.show.title` to the expected key list
  - update the exact expected key count from `21` to `24`
  - preserve the existing parity, non-empty value, `app.title`, and camelCase-segment assertions
  - keep the file in `tests/presentation/i18n/` so the mirrored-path contract remains explicit

### Step 2 — Extend router contract tests (covering: R-01b-01-01, R-01b-01-02, R-01b-03-01, R-01b-03-02, R-01b-04-01, R-01b-04-03, R-01b-05-01, R-01b-08-01)

- [x] Update `tests/presentation/router.test.ts`:
  - mock `recommendations-screen.vue`, `stats-screen.vue`, `movie-screen.vue`, and `show-screen.vue`
  - assert the router resolves 8 named routes with paths `/`, `/recommendations`, `/calendar`, `/library`, `/settings`, `/stats`, `/movie/:id`, and `/show/:id`
  - assert all named routes remain lazy imports via `router.options.routes`
  - assert `meta.titleKey` values include Recommendations, Stats, Movie, and Show
  - assert `/recommendations`, `/stats`, `/movie/550`, and `/show/1396` resolve to the expected route names
  - assert `/movie/abc` and `/show/abc` redirect to `/`
  - assert `document.title` updates for Recommendations, Stats, Movie, and Show

### Step 3 — Confirm fail-first state `(implementation detail)`

- [x] Run `npx vitest run tests/presentation/i18n/locale-keys.test.ts tests/presentation/router.test.ts` and confirm the new assertions fail before implementation.

---

## Phase 37 — Implementation: Locale Keys, Route Bootstrap & Guards

### Step 1 — Add new page-title locale keys (covering: R-01b-03-02, R-01b-04-03, R-01b-08-04)

- [x] Update `src/presentation/i18n/locales/en.json`, `src/presentation/i18n/locales/es.json`, and `src/presentation/i18n/locales/fr.json` atomically:
  - add `page.stats.title`
  - add `page.movie.title`
  - add `page.show.title`
  - preserve flat dot-notation, exact key parity, and non-empty translated strings
- [x] Do not add any other new keys; `nav.recommendations` and `page.recommendations.title` already exist.

### Step 2 — Bootstrap the new route view files `(implementation detail)`

- [x] Create `src/presentation/views/recommendations-screen.vue`, `src/presentation/views/stats-screen.vue`, `src/presentation/views/movie-screen.vue`, and `src/presentation/views/show-screen.vue` as minimal valid SFC stubs using the structure `<script setup lang="ts"></script><template><div /></template>` so `src/presentation/router.ts` can import them without breaking the build before the final placeholder-view implementation phase.
- [x] Keep each file in the current flat `src/presentation/views/` directory to match the existing scaffolded view pattern and avoid introducing new route folders in this change.

### Step 3 — Extend the router with new routes and numeric guards (covering: R-01b-01-01, R-01b-01-02, R-01b-03-01, R-01b-03-02, R-01b-04-01, R-01b-04-03, R-01b-05-01)

- [x] Update `src/presentation/router.ts`:
  - keep `createWebHistory()`, `scrollBehavior()`, the existing `afterEach` title logic, and the catch-all redirect
  - insert a named `recommendations` route at `/recommendations` with `meta.titleKey: 'page.recommendations.title'`
  - add a named `stats` route at `/stats` with `meta.titleKey: 'page.stats.title'`
  - add named `movie` and `show` routes at `/movie/:id` and `/show/:id` with `meta.titleKey` values `page.movie.title` and `page.show.title`
  - use per-route guards for `movie` and `show` that accept digits-only `:id` values and redirect all non-numeric params to `/`
  - keep the primary-nav routes in the documented order `home`, `recommendations`, `calendar`, `library`, `settings`; append `stats`, `movie`, and `show` routes after `settings` and before the catch-all redirect
  - extract a shared `numericIdGuard` function used by both `movie` and `show` route definitions to avoid duplication

> Rollback: revert `src/presentation/router.ts`, the three locale JSON files, and the four new view stubs.

---

## Phase 38 — Tests: Navigation, Shell & Placeholder Views (test-first)

> **References:** [scenarios/R-01b-02.feature](./scenarios/R-01b-02.feature) · [scenarios/R-01b-06.feature](./scenarios/R-01b-06.feature) · [scenarios/R-01b-07.feature](./scenarios/R-01b-07.feature) · [scenarios/R-01b-08.feature](./scenarios/R-01b-08.feature)

### Step 1 — Extend nav component tests for Recommendations (covering: R-01b-02-01, R-01b-02-02, R-01b-02-03, R-01b-02-04, R-01b-08-02)

- [x] Update `tests/presentation/components/layout/sidebar-nav.test.ts`:
  - mock the `Compass` icon
  - assert the sidebar now renders 5 primary nav links in order `Home`, `Recommendations`, `Calendar`, `Library`, `Settings` (expected route names: `home`, `recommendations`, `calendar`, `library`, `settings`)
  - assert Recommendations uses the translated label in `en` and `fr`
  - assert Recommendations uses the mapped `Compass` icon
  - assert Recommendations active-state styling uses the same teal accent border/background classes as existing nav items
  - assert Stats and detail routes still do not appear in primary navigation
- [x] Update `tests/presentation/components/layout/bottom-nav.test.ts`:
  - mock the `Compass` icon
  - assert the bottom nav now renders 5 primary nav links in the same order
  - assert Recommendations uses the translated label and active accent treatment
  - assert each nav item, including Recommendations, retains `min-h-11` and `min-w-11`
  - assert Stats and detail routes remain absent from primary navigation

### Step 2 — Extend shell/title tests for the new routes (covering: R-01b-03-02, R-01b-04-03, R-01b-07-01, R-01b-07-02, R-01b-07-03, R-01b-08-02)

> **Note:** Touch target verification (NFR-01b-01) is tested by asserting the presence of `min-h-11 min-w-11` Tailwind classes per the existing nav test pattern, since jsdom lacks layout capabilities for pixel measurement.

- [x] Update `tests/presentation/components/layout/page-header.test.ts`:
  - add route metadata cases for `/recommendations`, `/stats`, `/movie/550`, and `/show/1396`
  - assert translated header output for at least one non-default locale on a new route
- [x] Update `tests/presentation/components/layout/app-shell.test.ts`:
  - extend the in-memory router with the four new route paths and title keys
  - assert new routes render inside the shared `AppShell` content column beneath `PageHeader`
  - assert route transitions to the new placeholders still use `Transition name="fade" mode="out-in"` and the reduced-motion CSS contract in `src/assets/main.css`
  - spy on `global.fetch` and `Storage.prototype.setItem` / `removeItem` while navigating to the new routes and assert zero TMDB requests and zero `localStorage` writes (set up spies in Arrange phase, restore via `vi.restoreAllMocks()` in afterEach)
  - assert modal and toast overlays remain mounted above the new routes

### Step 3 — Add placeholder view tests for the four new screens (covering: R-01b-04-02, R-01b-06-01, R-01b-06-02, R-01b-08-03)

- [x] Create `tests/presentation/views/recommendations-screen.test.ts`, `tests/presentation/views/stats-screen.test.ts`, `tests/presentation/views/movie-screen.test.ts`, and `tests/presentation/views/show-screen.test.ts`:
  - mount each view with `en` and `fr` locales
  - assert each view renders `EmptyState`
  - assert icon mappings `Compass`, `ChartColumn`, `Film`, and `Tv`
  - assert the heading uses translated `common.empty.title`
  - assert the supporting text uses translated `common.empty.description`
- [x] In the same view test files, read the source file as text using `fs.readFileSync` and use string assertions to verify:
  - the file contains `common.empty.title` binding
  - the file contains `common.empty.description` binding
  - the file does not contain hardcoded locale-specific placeholder copy (e.g., no "Nothing here yet" string literals)

### Step 4 — Confirm fail-first state `(implementation detail)`

- [x] Run `npx vitest run tests/presentation/components/layout/sidebar-nav.test.ts tests/presentation/components/layout/bottom-nav.test.ts tests/presentation/components/layout/page-header.test.ts tests/presentation/components/layout/app-shell.test.ts tests/presentation/views/recommendations-screen.test.ts tests/presentation/views/stats-screen.test.ts tests/presentation/views/movie-screen.test.ts tests/presentation/views/show-screen.test.ts` and confirm the new assertions fail before final implementation.

---

## Phase 39 — Implementation: Final Navigation & Placeholder Views

### Step 1 — Upgrade the four new view stubs to final placeholder screens (covering: R-01b-04-02, R-01b-06-01, R-01b-06-02)

- [x] Update `src/presentation/views/recommendations-screen.vue`, `src/presentation/views/stats-screen.vue`, `src/presentation/views/movie-screen.vue`, and `src/presentation/views/show-screen.vue`:
  - use `<script setup lang="ts">`
  - import `useI18n`
  - import `EmptyState` from `@/presentation/components/common/empty-state.vue`
  - import the mapped Lucide icon (`Compass`, `ChartColumn`, `Film`, `Tv`)
  - render `EmptyState` with translated `common.empty.title` and `common.empty.description`
  - keep SFC block order `script` → `template`
  - do not add a local `<style>` block
  - do not add any hardcoded user-facing strings

### Step 2 — Add Recommendations to both primary nav surfaces (covering: R-01b-02-01, R-01b-02-02, R-01b-02-03, R-01b-02-04)

- [x] Update `src/presentation/components/layout/sidebar-nav.vue`:
  - import `Compass`
  - insert the Recommendations nav item between Home and Calendar
  - keep exact-match Home logic unchanged
  - keep existing active/inactive class names unchanged apart from the new item
- [x] Update `src/presentation/components/layout/bottom-nav.vue`:
  - import `Compass`
  - insert the Recommendations nav item between Home and Calendar
  - keep `min-h-11 min-w-11` touch-target classes
  - keep exact-match Home logic and existing accent styling unchanged

> Rollback: revert `src/presentation/components/layout/sidebar-nav.vue`, `src/presentation/components/layout/bottom-nav.vue`, the four new view SFCs, and any related locale/router edits from earlier phases.

---

## Phase 40 — Verification

### Step 1 — Run targeted feature verification (covering: R-01b-08-01, R-01b-08-02, R-01b-08-03, R-01b-08-04)

- [x] Run `npx vitest run tests/presentation/i18n/locale-keys.test.ts tests/presentation/router.test.ts tests/presentation/components/layout/sidebar-nav.test.ts tests/presentation/components/layout/bottom-nav.test.ts tests/presentation/components/layout/page-header.test.ts tests/presentation/components/layout/app-shell.test.ts tests/presentation/views/recommendations-screen.test.ts tests/presentation/views/stats-screen.test.ts tests/presentation/views/movie-screen.test.ts tests/presentation/views/show-screen.test.ts` and require all tests to pass.

### Step 2 — Run project verification commands (covering: R-01b-08-05)

- [x] Run `npm run type-check`.
- [x] Run `npm run lint`.
- [x] Run `npm run format:check`.
- [x] Run `npm run test`.

### Step 3 — Update dependent documentation `(implementation detail)`

- [x] After R-01b is released, update `docs/product/01 - scaffolding/requirements.md` to promote the assertions that previously deferred `/recommendations`, `/stats`, `/movie/:id`, and `/show/:id` routes (SC-01d-02, SC-05, SC-06).
- [x] Check if `CLAUDE.md` needs updating after implementation.
