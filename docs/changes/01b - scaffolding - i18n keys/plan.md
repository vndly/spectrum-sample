# Implementation Plan: i18n Keys

---

## Phase 1 — i18n Keys

### Step 1 — Update locale files

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
