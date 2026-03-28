# Implementation Plan: i18n Keys

> **References:** [requirements.md](./requirements.md) · [scenarios/SC-12.feature](./scenarios/SC-12.feature)

---

## Phase 1 — Testing (test-first)

### Step 1 — Write locale key parity test (covering: SC-12-03)

- [ ] Create `tests/presentation/i18n/locale-keys.test.ts` (directory `tests/presentation/i18n/` does not exist yet and must be created):
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
- [ ] Run test to confirm failure before implementation

> Tests must follow the Arrange-Act-Assert (AAA) pattern per project conventions.

> **Scenario traceability:**
>
> - SC-12-03 → covered by `locale-keys.test.ts` above (structural parity, camelCase, value checks)
> - SC-12-01 → deferred to 01i (navigation component tests, nav label rendering)
> - SC-12-02 → deferred to 01j (placeholder view component tests, page title rendering)
> - SC-12-04, SC-12-05, SC-12-06 → deferred to downstream integration tests (require vue-i18n runtime rendering with components that consume the scaffolded keys); AC9 (fallback verification) is implicitly satisfied by the `fallbackLocale: 'en'` configuration in Phase 00 and will be explicitly exercised when 01i/01j provide rendering components

---

## Phase 2 — Implementation (covering: SC-12)

### Step 1 — Verify prerequisite

- [ ] Confirm `app.title` key exists in all three locale files (`src/presentation/i18n/locales/en.json`, `es.json`, `fr.json`) from Phase 00. If missing, stop and complete Phase 00 first.

### Step 2 — Update locale files

- [ ] Add keys to `en.json`, `es.json`, `fr.json`. All three files must be updated atomically to maintain key path parity. Rollback: `git checkout -- src/presentation/i18n/locales/` restores all locale files to their prior state; `rm tests/presentation/i18n/locale-keys.test.ts` removes the test file.

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

## Phase 3 — Verification

### Step 1 — Confirm test-first cycle and run build

- [ ] Confirm that tests written in Phase 1 failed before Phase 2 implementation (expected: all tests fail since locale files were incomplete)
- [ ] Run `npx vitest run tests/presentation/i18n/locale-keys.test.ts` — all tests now pass after Phase 2 implementation
- [ ] Run `npx prettier --check src/presentation/i18n/locales/*.json` — formatting passes
- [ ] Run `npx tsc --noEmit` — no type errors in the new test file
- [ ] Run `npm run build` — build succeeds with no errors
