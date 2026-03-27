# Implementation Plan: i18n Keys

---

## Phase 1 — Testing (test-first)

### Step 1 — Write locale key parity test (covering: SC-12-03)

- [ ] Create `tests/presentation/i18n/locale-keys.test.ts`:
  - Test that `en.json`, `es.json`, `fr.json` all exist and parse as valid JSON
  - Test that all three files contain identical key paths
  - Test that all translation values are non-empty strings
  - Test that key paths include the expected namespaces: `app.title`, `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*`
  - Test that the existing `app.title` key is preserved
- [ ] Run test to confirm failure before implementation

> SC-12-01 and SC-12-02 are integration-level scenarios requiring UI components from downstream features (01i for navigation, 01j for views). They will be exercised after those features are implemented.

---

## Phase 2 — Implementation (covering: SC-12)

### Step 1 — Verify prerequisite

- [ ] Confirm `app.title` key exists in all three locale files (`src/presentation/i18n/locales/en.json`, `es.json`, `fr.json`) from Phase 00.

### Step 2 — Update locale files

- [ ] Add keys to `en.json`, `es.json`, `fr.json`. All three files must be updated atomically to maintain key path parity.

**Expected nested JSON structure (`en.json`):**

```json
{
  "app": {
    "title": "Plot Twisted"
  },
  "nav": {
    "home": "Home",
    "calendar": "Calendar",
    "library": "Library",
    "settings": "Settings"
  },
  "page": {
    "home": { "title": "Home" },
    "calendar": { "title": "Calendar" },
    "library": { "title": "Library" },
    "settings": { "title": "Settings" }
  },
  "common": {
    "empty": {
      "title": "Nothing here yet",
      "description": "This page is under construction."
    },
    "error": {
      "title": "Something went wrong",
      "description": "An unexpected error occurred.",
      "reload": "Reload"
    }
  },
  "toast": {
    "error": "An error occurred",
    "dismiss": "Dismiss",
    "retry": "Retry"
  }
}
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

---

## Phase 3 — Verification

### Step 1 — Run tests and build

- [ ] Run `npx vitest run tests/presentation/i18n/locale-keys.test.ts` — all tests pass
- [ ] Run `npm run build` — build succeeds with no errors
