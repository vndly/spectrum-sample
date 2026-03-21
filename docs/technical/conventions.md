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

## 5. Guardrails

- **No `any`** — Every `any` requires a suppressed lint rule and a documented reason.
- **No server state** — All persistence is localStorage. No backend, no cookies, no IndexedDB.
- **Typed everywhere** — All localStorage access goes through a typed service. Raw `JSON.parse` / `JSON.stringify` calls outside that service are prohibited.
- **Tailwind only** — No inline styles or separate CSS files. All styling through Tailwind utility classes and the theme config.

## 6. Testing

- **Test file naming** — `*.test.ts` (or `*.test.vue` for component tests), in a dedicated `tests/` folder at the project root mirroring the `src/` directory structure.
- **What to test** — Application composables (data flow, loading/error states), Infrastructure (API calls, storage reads/writes, validation), and Domain (schemas, pure functions). Presentation components only need tests for non-trivial interaction logic.
- **No mocking localStorage** — Tests use a real `storage.service.ts` instance backed by a fresh in-memory store to keep behavior close to production.
- **Arrange-Act-Assert** — Every test follows the AAA pattern with clear separation between setup, execution, and assertions.

## 7. Documentation

- **JSDoc required** — Every public class and function must have a JSDoc comment documenting its purpose, parameters, and return value.

## 8. Naming Conventions

- **Files:** kebab-case (`movie-card.vue`, `api-service.ts`, `use-movie.ts`)
- **Components:** PascalCase in templates and imports (`<MovieCard />`)
- **Composables:** camelCase prefixed with `use` (`useMovie`, `useLibrary`)
- **Types/Interfaces:** PascalCase (`Movie`, `LibraryEntry`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_SEARCH_RESULTS`)
- **Variables/functions:** camelCase (`getMovie`, `isLoading`)

## 9. Responsive Design

- **Desktop-first** — Base styles target desktop. Use Tailwind's responsive prefixes to override for smaller screens.
- **Layout breakpoints** — Below `md`: bottom navigation bar, single-column layout. `md` and above: sidebar navigation, multi-column grids.
- **Touch targets** — Interactive elements must be at least 44×44px on mobile to meet tap-target guidelines.
