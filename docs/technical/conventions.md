# Conventions

## 1. Error Handling

- **API failures** — Toast notification informing the user, with a retry option.
- **Storage issues** — Toast notification alerting the user (e.g., "Storage issue detected. Some data may not be saved.").
- **Unexpected crashes** — Global error boundary catching unhandled errors, showing a "Something went wrong" fallback with a reload option.

## 2. Data Access

- **Application layer is the public API** — Presentation components fetch and mutate data exclusively through Application composables (`use*` functions). Components never import Infrastructure or Domain directly.
- **Infrastructure is internal** — `provider.client.ts` and `storage.service.ts` handle HTTP and persistence. Only Application composables may call Infrastructure.
- **Reactivity lives in Application** — Composables wrap Infrastructure calls with Vue reactivity (`ref`, `computed`, `watchEffect`) and expose loading/error state.
- **Standard return shape** — Every composable returns `{ data, loading, error, refresh? }`. Presentation components can rely on this consistent interface.
- **Layer import rules:**

```
Presentation   →  Application (only)
Application    →  Domain + Infrastructure
Infrastructure →  Domain (only)
Domain         →  nothing
```

No layer may skip or reach across levels. Presentation never imports Infrastructure or Domain directly — it always goes through Application.

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
- **No server state** — All persistence is localStorage. No backend, no cookies, no database.
- **No API caching** — Every navigation or action that needs media provider data makes a fresh API request. There is no response cache, no request deduplication, and no stale-while-revalidate layer. This keeps the data layer simple and avoids cache-invalidation bugs. The media provider's rate limit (≈40 requests per 10 seconds) is well above typical usage. The one exception is `useGenres()`, which caches genre lists in memory for the session to avoid redundant lookups (see [Data Model — useGenres()](./data-model.md#application-composables)).
- **No offline handling** — The app requires a network connection. There is no service worker or offline fallback.
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

- **Files:** kebab-case (`movie-card.vue`, `use-movie.ts`). Domain and Infrastructure files use dot notation to encode the file's role: `<name>.<role>.ts` (e.g., `movie.schema.ts`, `movie.logic.ts`, `provider.client.ts`, `storage.service.ts`).
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

The app is fully internationalized. `Settings.language` (ISO 639-1, e.g. `"en"`) controls both **UI translations** and **media provider API content**. Supported languages: English (`en`), Spanish (`es`), French (`fr`). English is the default and fallback.

### Library

[vue-i18n v11](https://vue-i18n.intlify.dev/) in Composition API mode (`legacy: false`) with `@intlify/unplugin-vue-i18n` for Vite build-time message compilation. The Vite plugin pre-compiles translation JSON at build time, stripping the runtime message compiler from production bundles.

### Translation Files

One JSON file per supported language, living in the Presentation layer:

```
src/presentation/i18n/
├── index.ts              # Creates and exports the vue-i18n instance
├── locales/
│   ├── en.json           # English (canonical — must contain every key)
│   ├── es.json           # Spanish
│   └── fr.json           # French
```

Keys are nested by feature area, mirroring the component directory structure (e.g. `nav.home`, `library.empty.title`, `errors.loadFailed`). Shared keys reusable across multiple features use the `common.*` namespace (e.g., `common.empty.title`, `common.error.reload`). Toast notification labels use the `toast.*` namespace (e.g., `toast.error`, `toast.dismiss`). Use camelCase for key segments.

`en.json` is the source of truth. `es.json` and `fr.json` must mirror the same key structure. Any missing key silently falls back to the English value.

### Usage in Components

No hardcoded user-facing strings in templates. All UI text must use `$t()` in templates or `t()` from `useI18n()` in `<script setup>`:

```vue
<template>
  <h1>{{ $t('library.empty.title') }}</h1>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const message = t('errors.generic')
</script>
```

Components use vue-i18n's `useI18n()` directly — it is a Presentation layer tool, analogous to Vue Router's `useRoute()`. No wrapper composable is needed.

### Configuration

The vue-i18n instance is created in `src/presentation/i18n/index.ts` and registered as a plugin in `main.ts` alongside Vue Router:

- `legacy: false` — Composition API mode
- `fallbackLocale: 'en'` — missing translations fall back to English
- `missingWarn` / `fallbackWarn` — enabled in dev mode only (suppressed in production)

### Locale Switching

When `Settings.language` changes:

1. `useSettings()` writes the new value to localStorage.
2. `useSettings()` updates `i18n.global.locale.value` — all `$t()` calls across mounted components re-evaluate immediately (no page reload).
3. Subsequent API calls use the new language for media provider content (titles, synopses, genre names).

### Browser Locale Detection

On first visit (no stored settings in localStorage), the app reads `navigator.language`, extracts the ISO 639-1 prefix (e.g. `"es-ES"` → `"es"`), and checks if it matches a supported language. If it matches, that becomes the initial `Settings.language`. Otherwise, English is used. After the first visit, the stored preference always takes precedence.

### Fallback Chain

1. Look up the key in the current locale (e.g. `es`).
2. If missing, look up the key in the fallback locale (`en`).
3. If still missing (should never happen if English is complete), vue-i18n renders the raw key path (e.g. `library.empty.title`).

### Media Provider API

All API calls pass `Settings.language` as the `language` query parameter. The media provider accepts both ISO 639-1 (`"en"`) and locale codes (`"en-US"`); the app uses the shorter ISO 639-1 format. The media provider returns localized titles, overviews, and genre names. If a translation is unavailable, the media provider falls back to English automatically.

## 12. Image Handling

### Size Selection

Use the smallest media provider image size that looks sharp at the rendered dimensions. Larger sizes waste bandwidth without visible benefit.

| Context              | Image Type | Size   | Rationale                                     |
| -------------------- | ---------- | ------ | --------------------------------------------- |
| Movie/show card grid | Poster     | `w342` | Sharp on desktop grid cards and retina mobile |
| Detail page poster   | Poster     | `w500` | Larger display area on the detail screen      |
| Hero banner          | Backdrop   | `w780` | Full-width banner; `original` only if needed  |
| Cast headshots       | Profile    | `w185` | Small circular/square thumbnails              |
| Gallery thumbnails   | Any        | `w185` | Compact horizontal row                        |

### Lazy Loading

Apply the native `loading="lazy"` attribute on all `<img>` elements below the fold. Hero banners and the first visible row of cards should load eagerly (no `loading` attribute or `loading="eager"`).

### Fallback Placeholders

The API returns `null` for `poster_path`, `backdrop_path`, and `profile_path` when no image exists. The app must handle this gracefully:

- **Posters** — Show a neutral placeholder (e.g. a film-frame icon on a dark surface) matching the 2:3 aspect ratio.
- **Backdrops** — Show a solid dark gradient matching the app background. Do not render a broken image.
- **Profile photos** — Show a generic person silhouette icon.
