# Implementation Plan: Dependencies & Test Infrastructure

---

## Phase 1 — Dependencies & Test Infrastructure

### Step 1 — Install dependencies (SC-01a-01)

- [x] Run `npm install vue-router@^4.5` (covering SC-01a-01-01).
- [x] Run `npm install -D @vue/test-utils@^2.4` (covering SC-01a-01-02).

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

> **References:** [requirements.md](./requirements.md) · [scenarios/SC-12.feature](./scenarios/SC-12.feature)

### Step 1 — Write locale key parity test (covering: SC-12-03)

- [x] Create `tests/presentation/i18n/locale-keys.test.ts` (directory `tests/presentation/i18n/` does not exist yet and must be created):
  - Test that `en.json`, `es.json`, `fr.json` all exist and parse as valid JSON (covering: AC5)
  - Test that all three files contain identical key paths (covering: AC2)
  - Test that all translation values are non-empty strings (covering: AC3)
  - Test that key paths include the expected 19 keys (18 new + 1 existing `app.title`, matching SC-12's 18 new keys) (covering: AC1):
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
> - SC-12-03 → covered by `locale-keys.test.ts` above (structural parity, camelCase, value checks)
> - SC-12-01 → deferred to 01i (navigation component tests, nav label rendering)
> - SC-12-02 → deferred to 01j (placeholder view component tests, page title rendering)
> - SC-12-04, SC-12-05, SC-12-06 → deferred to downstream integration tests (require vue-i18n runtime rendering with components that consume the scaffolded keys); AC9 (fallback verification) is implicitly satisfied by the `fallbackLocale: 'en'` configuration in Phase 00 and will be explicitly exercised when 01i/01j provide rendering components

---

## Phase 4 — Implementation: i18n Keys (covering: SC-12)

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

> **Key count verification:** The translation table above contains exactly 18 entries, matching SC-12's requirement of 18 new keys across 5 namespaces.

---

## Phase 5 — Verification: i18n Keys

### Step 1 — Confirm test-first cycle and run build

- [x] Confirm that tests written in Phase 3 failed before Phase 4 implementation (expected: all tests fail since locale files were incomplete)
- [x] Run `npx vitest run tests/presentation/i18n/locale-keys.test.ts` — all tests now pass after Phase 4 implementation
- [x] Run `npx prettier --check src/presentation/i18n/locales/*.json` — formatting passes
- [x] Run `npx tsc --noEmit` — no type errors in the new test file
- [x] Run `npm run build` — build succeeds with no errors
