# Conventions

## 1. Error Handling

- **API failures** — Toast notification informing the user, with a retry option.
- **Storage issues** — Toast notification alerting the user (e.g., "Storage issue detected. Some data may not be saved.").
- **Unexpected crashes** — Global error boundary catching unhandled errors, showing a "Something went wrong" fallback with a reload option.

## 2. Data Access

- **Application layer is the public API** — Presentation components fetch and mutate data exclusively through Application composables (`use*` functions). Components never import Infrastructure or Domain directly.
- **Infrastructure is internal** — `tmdb.client.ts` and `storage.service.ts` handle HTTP and persistence. Only Application composables may call Infrastructure.
- **Reactivity lives in Application** — Composables wrap Infrastructure calls with Vue reactivity (`ref`, `computed`, `watchEffect`) and expose loading/error state.
- **Standard return shape** — Every composable returns `{ data, loading, error, refresh? }`. Presentation components can rely on this consistent interface.
- **Layer import rules** — Presentation imports Application only. Application imports Domain and Infrastructure. Infrastructure imports Domain only. Domain has no app imports. No layer may skip or reach across levels.

## 3. Validation

- **Zod at every boundary** — All API responses must be parsed through a Zod schema before use. No raw response data flows into components.
- **Validate on read** — All localStorage reads must be validated with Zod to guard against corrupted or migrated data.
- **Sanitize user input** — All user-provided strings (search queries, tags, notes, list names) must be trimmed and sanitized before storage or use in API calls.

## 4. Vue SFC Order

Every `.vue` file follows this block order:

1. `<script setup lang="ts">` — logic first
2. `<template>` — markup second
3. `<style>` — styles last (rare — Tailwind covers most cases)

## 5. ESLint & Prettier

### ESLint

`eslint.config.js` uses the flat config format:

- Extends `@eslint/js` recommended, `typescript-eslint` strict, `eslint-plugin-vue` recommended, `eslint-config-prettier`
- `@typescript-eslint/no-explicit-any: "error"`
- `vue/block-order: ["error", { order: ["script", "template", "style"] }]` — enforces the SFC block order defined in §4

### Prettier

`prettier.config.js`:

- `semi: false` — no semicolons
- `singleQuote: true`
- `trailingComma: "all"`
- `printWidth: 100`

## 6. Guardrails

- **No `any`** — Every `any` requires a suppressed lint rule and a documented reason.
- **No server state** — All persistence is localStorage. No backend, no cookies, no IndexedDB.
- **Typed everywhere** — All localStorage access goes through a typed service. Raw `JSON.parse` / `JSON.stringify` calls outside that service are prohibited.
- **Tailwind only** — No inline styles or separate CSS files. All styling through Tailwind utility classes and the theme config.

## 7. Testing

See [Testing](./testing.md) for the full testing specification (runner, file structure, coverage expectations, examples).

- **Test file naming** — `*.test.ts` for all tests (including component tests), in a dedicated `tests/` folder at the project root mirroring the `src/` directory structure.
- **What to test** — Application composables (data flow, loading/error states), Infrastructure (API calls, storage reads/writes, validation), and Domain (schemas, pure functions). Presentation components only need tests for non-trivial interaction logic.
- **No mocking localStorage** — Tests use a real `storage.service.ts` instance backed by a fresh in-memory store to keep behavior close to production.
- **Arrange-Act-Assert** — Every test follows the AAA pattern with clear separation between setup, execution, and assertions.

## 8. Documentation

- **JSDoc required** — Every public class and function must have a JSDoc comment documenting its purpose, parameters, and return value.

## 9. Naming Conventions

- **Files:** kebab-case (`movie-card.vue`, `use-movie.ts`). Domain and Infrastructure files use dot notation to encode the file's role: `<name>.<role>.ts` (e.g., `movie.schema.ts`, `movie.logic.ts`, `tmdb.client.ts`, `storage.service.ts`).
- **Components:** PascalCase in templates and imports (`<MovieCard />`)
- **Composables:** camelCase prefixed with `use` (`useMovie`, `useLibrary`)
- **Types/Interfaces:** PascalCase (`Movie`, `LibraryEntry`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_SEARCH_RESULTS`)
- **Variables/functions:** camelCase (`getMovie`, `isLoading`)

## 10. Responsive Design

- **Desktop-first** — Base styles target desktop. Use Tailwind's responsive prefixes to override for smaller screens.
- **Layout breakpoints** — Below `md`: bottom navigation bar, single-column layout. `md` and above: sidebar navigation, multi-column grids.
- **Touch targets** — Interactive elements must be at least 44×44px on mobile to meet tap-target guidelines.

## 11. Internationalization (i18n)

Language handling has two separate layers:

- **TMDB API responses** — All API calls pass the user's `Settings.language` value (ISO 639-1, e.g. `"en"`) as the `language` query parameter. TMDB accepts both ISO 639-1 (`"en"`) and locale codes (`"en-US"`); the app uses the shorter ISO 639-1 format. TMDB returns localized titles, overviews, and genre names for supported languages. If a translation is unavailable, TMDB falls back to English automatically.
- **UI strings** — All interface text (labels, button text, empty-state messages, error messages) is hardcoded in English. There is no i18n library (e.g. vue-i18n) and no translation files. UI strings do not change when the user switches language in Settings.

The language setting in Settings controls TMDB content language only. Changing it affects movie titles, synopses, and genre names returned by the API, but the app shell, navigation labels, and system messages remain in English.

## 12. Image Handling

### Size Selection

Use the smallest TMDB image size that looks sharp at the rendered dimensions. Larger sizes waste bandwidth without visible benefit.

| Context             | Image Type | Size   | Rationale                                      |
| ------------------- | ---------- | ------ | ---------------------------------------------- |
| Movie/TV card grid  | Poster     | `w342` | Sharp on desktop grid cards and retina mobile   |
| Detail page poster  | Poster     | `w500` | Larger display area on the detail screen        |
| Hero banner         | Backdrop   | `w780` | Full-width banner; `original` only if needed    |
| Cast headshots      | Profile    | `w185` | Small circular/square thumbnails                |
| Gallery thumbnails  | Any        | `w185` | Compact horizontal row                          |

### Lazy Loading

Apply the native `loading="lazy"` attribute on all `<img>` elements below the fold. Hero banners and the first visible row of cards should load eagerly (no `loading` attribute or `loading="eager"`).

### Fallback Placeholders

TMDB returns `null` for `poster_path`, `backdrop_path`, and `profile_path` when no image exists. The app must handle this gracefully:

- **Posters** — Show a neutral placeholder (e.g. a film-frame icon on a dark surface) matching the 2:3 aspect ratio.
- **Backdrops** — Show a solid dark gradient matching the app background. Do not render a broken image.
- **Profile photos** — Show a generic person silhouette icon.
