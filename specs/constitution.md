# Constitution

A personal, offline-first movie and TV tracker.

## 1. Core Principles

- **Privacy first** — All user data stays in localStorage. No accounts, no server, no telemetry.
- **TMDB-powered** — See [API spec](api.md) for details.
- **Dark cinematic aesthetic** — See [UI/UX spec](ui-ux.md) for details.

## 2. Tech Stack

- **Language:** TypeScript 5 (strict mode)
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build:** Vite
- **Routing:** Vue Router
- **Validation:** Zod
- **Styling:** Tailwind CSS (dark theme config)
- **Storage:** localStorage via a typed service wrapper
- **Hosting:** Firebase Hosting
- **API:** TMDB REST API with response caching in localStorage

## 3. Data Access

- **Composables are the public API** — Components fetch and mutate data exclusively through composables (`use*` functions). Components never import or call services directly.
- **Services are internal** — `TMDBService` and `StorageService` handle HTTP, caching, and persistence. Only composables may call services.
- **Reactivity lives in composables** — Composables wrap service calls with Vue reactivity (`ref`, `computed`, `watchEffect`) and expose loading/error state.

## 4. Validation

- **Zod at every boundary** — All TMDB API responses must be parsed through a Zod schema before use. No raw response data flows into components.
- **Validate on read** — All localStorage reads must be validated with Zod to guard against corrupted or migrated data.
- **Sanitize user input** — All user-provided strings (search queries, tags, notes, list names) must be trimmed and sanitized before storage or use in API calls.

## 5. Guardrails

- **No `any`** — Every `any` requires a suppressed lint rule and a documented reason.
- **No server state** — All persistence is localStorage. No backend, no cookies, no IndexedDB.
- **Typed everywhere** — All localStorage access goes through a typed service. Raw `JSON.parse` / `JSON.stringify` calls outside that service are prohibited.
- **Tailwind only** — No inline styles or separate CSS files. All styling through Tailwind utility classes and the theme config.

## 6. Documentation

- **JSDoc required** — Every public class and function must have a JSDoc comment documenting its purpose, parameters, and return value.

## 7. Naming Conventions

- **Files:** kebab-case (`movie-card.vue`, `tmdb-service.ts`, `use-movie.ts`)
- **Components:** PascalCase in templates and imports (`<MovieCard />`)
- **Composables:** camelCase prefixed with `use` (`useMovie`, `useLibrary`)
- **Types/Interfaces:** PascalCase (`Movie`, `LibraryEntry`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`, `CACHE_TTL`)
- **Variables/functions:** camelCase (`getMovie`, `isLoading`)
