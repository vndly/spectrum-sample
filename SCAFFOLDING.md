# Scaffolding Plan

Everything needed before implementing any roadmap features.

## Decisions

- **Tailwind v4** — CSS-based `@theme` config, no `tailwind.config.ts`
- **No semicolons** — `semi: false` in Prettier
- **Minimal AppShell** — basic `<RouterView>` wrapper; full sidebar/bottom nav deferred to roadmap 01
- **lucide-vue-next** — tree-shakeable icon library for navigation icons

---

## Step 1 — package.json & dependencies

Create `package.json` manually (`name: "movie-tracker"`, `version: "0.1.0"`, `private: true`, `type: "module"`).

**Scripts:** `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:coverage`, `type-check`

**Production deps:** `vue@^3`, `vue-router@^4`, `zod`, `lucide-vue-next`

**Dev deps:** `typescript@~5.7`, `vite@^6`, `@vitejs/plugin-vue`, `@tailwindcss/vite`, `tailwindcss`, `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-vue`, `prettier`, `eslint-config-prettier`, `vitest`, `@vue/test-utils`, `jsdom`, `vue-tsc`

Run `npm install`.

## Step 2 — TypeScript configuration

- `tsconfig.json` — project references to `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` — `strict: true`, `target: "ES2022"`, `module: "ESNext"`, `moduleResolution: "bundler"`, path alias `@/* → ./src/*`, `include: ["src/**/*"]`
- `tsconfig.node.json` — covers `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`

## Step 3 — Vite configuration

`vite.config.ts` with `@vitejs/plugin-vue`, `@tailwindcss/vite` plugin, and `@` path alias → `./src`.

## Step 4 — ESLint + Prettier

`eslint.config.js` (flat config):
- Extends `@eslint/js` recommended, `typescript-eslint` strict, `eslint-plugin-vue` recommended, `eslint-config-prettier`
- `@typescript-eslint/no-explicit-any: "error"`
- `vue/block-order: ["error", { order: ["script", "template", "style"] }]`

`prettier.config.js`:
- `semi: false`, `singleQuote: true`, `trailingComma: "all"`, `printWidth: 100`

## Step 5 — Vitest configuration

`vitest.config.ts` — `environment: "jsdom"`, `include: ["tests/**/*.test.ts"]`, `globals: true`, `setupFiles: ["./tests/setup.ts"]`, same `@` path alias.

## Step 6 — index.html

Root HTML entry with `<div id="app">`, dark background `style="background-color: #0f1923"` to prevent flash, `<script type="module" src="/src/main.ts">`.

## Step 7 — Directory structure

```
src/
├── main.ts
├── App.vue
├── env.d.ts
├── assets/
│   └── main.css
├── presentation/
│   ├── router.ts
│   ├── views/
│   └── components/
│       ├── layout/
│       ├── common/
│       ├── home/
│       ├── details/
│       ├── library/
│       ├── stats/
│       ├── recommendations/
│       ├── calendar/
│       ├── settings/
│       └── error/
├── application/
├── domain/
└── infrastructure/

tests/
├── setup.ts
├── domain/
├── infrastructure/
├── application/
└── presentation/
    └── components/
        └── common/
```

Empty directories get `.gitkeep` files until real files are added.

## Step 8 — Tailwind CSS theme

`src/assets/main.css` with `@import "tailwindcss"` and a `@theme` block defining:
- `--color-bg-primary: #0f1923`
- `--color-bg-secondary: #1a2332`
- `--color-surface: #1e293b`
- `--color-accent: #14b8a6`
- `--font-sans: Inter, system-ui, -apple-system, sans-serif`

## Step 9 — env.d.ts

`src/env.d.ts` — declares `ImportMetaEnv` with `VITE_TMDB_TOKEN: string` for typed env access.

## Step 10 — Domain layer (fully implement)

All files are pure TS + Zod with zero framework deps. Fully specified in docs.

| File | Contents |
|------|----------|
| `constants.ts` | `API_BASE_URL`, `IMAGE_BASE_URL`, `TMDB_IMAGE_SIZES`, `CURRENT_SCHEMA_VERSION`, `STORAGE_KEY`, `MAX_RETRY_ATTEMPTS`, `TOAST_DISMISS_MS` |
| `errors.ts` | `ApiError`, `NotFoundError`, `RateLimitError`, `StorageError` classes |
| `library-entry.schema.ts` | `LibraryEntry` Zod schema + `MediaType`, `WatchStatus` enums |
| `custom-list.schema.ts` | `CustomList` Zod schema |
| `settings.schema.ts` | `Settings` Zod schema with defaults + `DEFAULT_SETTINGS` |
| `storage.schema.ts` | Top-level localStorage structure schema + `DEFAULT_STORAGE` |
| `tmdb.schema.ts` | All TMDB response types: `PaginatedResponse`, `MovieListItem`, `TVShowListItem`, `MovieDetail`, `TVShowDetail`, `Genre`, `CastMember`, `CrewMember`, `Video`, `StreamingProvider`, `WatchProviderRegion`, `ContentRating`, etc. |

## Step 11 — Infrastructure layer (fully implement)

| File | Contents |
|------|----------|
| `tmdb.client.ts` | Core `fetchFromTMDB(path, params, schema)` with Bearer auth, error handling (401/404/429/500+), exponential backoff retry for 429. All 12 endpoint methods with full implementations. |
| `storage.service.ts` | `loadStorage()`, `saveStorage()`, convenience accessors (`getLibrary`, `getSettings`, `getLists`, `getTags`), CRUD methods (`saveLibraryEntry`, `removeLibraryEntry`, `saveSettings`, `saveList`, `removeList`, `saveTags`), migration infrastructure, `exportData()`, `importData()`. |
| `image.helper.ts` | `buildImageUrl(path, size)` — returns full TMDB image URL or null. |

## Step 12 — Application layer

**Fully implement:**
| File | Contents |
|------|----------|
| `types.ts` | `ComposableResult<T>` interface: `{ data, loading, error, refresh? }` |
| `use-toast.ts` | Shared reactive toast array, `showToast(type, message, action?)`, `dismissToast(id)`, auto-dismiss after 4s |
| `use-settings.ts` | Reads/writes settings via storage service, exposes reactive `data` + `updateSettings(partial)` |

**Stubs** (correct signatures, return dummy reactive state with `TODO` comments):

`use-movie.ts`, `use-tv-show.ts`, `use-library.ts`, `use-search.ts`, `use-trending.ts`, `use-popular.ts`, `use-recommendations.ts`, `use-upcoming.ts`, `use-stats.ts`, `use-genres.ts`, `use-lists.ts`

## Step 13 — Placeholder views

8 minimal stubs in `src/presentation/views/`, each showing the screen name and "Coming soon":

`HomeScreen.vue`, `MovieDetailScreen.vue`, `TVShowDetailScreen.vue`, `LibraryScreen.vue`, `StatsScreen.vue`, `RecommendationsScreen.vue`, `ReleaseCalendarScreen.vue`, `SettingsScreen.vue`

## Step 14 — Router

`src/presentation/router.ts`:
- All 8 routes with lazy-loaded dynamic imports
- Navigation guards on `/movie/:id` and `/tv/:id` rejecting non-numeric IDs → redirect to `/`
- Catch-all `/:pathMatch(.*)*` → redirect to `/`
- `createWebHistory()` for clean URLs

## Step 15 — Cross-cutting UI components

| Component | Location | Contents |
|-----------|----------|----------|
| `ErrorBoundary.vue` | `components/error/` | `onErrorCaptured` hook, `hasError` ref, fallback "Something went wrong" with "Reload" button |
| `SkeletonLoader.vue` | `components/common/` | Reusable shimmer placeholder with `width`, `height`, `rounded` props, `animate-pulse` |
| `ToastContainer.vue` | `components/common/` | Fixed top-right, renders toasts from `useToast()`, color-coded borders (red/green/teal), slide-in/fade-out transitions |

## Step 16 — App shell (minimal)

`src/presentation/components/layout/AppShell.vue` — basic `<div class="min-h-screen bg-bg-primary">` wrapping `<RouterView />`. Full sidebar + bottom nav deferred to roadmap item 01.

## Step 17 — Root components

- `src/App.vue` — `ErrorBoundary` wrapping `AppShell`, includes `ToastContainer`
- `src/main.ts` — `createApp(App).use(router).mount('#app')`, imports `main.css`

## Step 18 — Firebase config

- `firebase.json` — hosting with `dist` public dir, SPA rewrite (`** → /index.html`)
- `.firebaserc` — placeholder project ID

## Step 19 — Foundational tests

| File | Coverage |
|------|----------|
| `tests/setup.ts` | `localStorage.clear()` before each test |
| `tests/domain/library-entry.schema.test.ts` | Valid/invalid parsing, defaults, rejected values |
| `tests/domain/settings.schema.test.ts` | Valid/invalid parsing, defaults |
| `tests/infrastructure/storage.service.test.ts` | Load defaults, round-trip save/load, remove, settings update, export/import |

## Step 20 — VS Code settings

- `.vscode/settings.json` — format on save, ESLint auto-fix, Tailwind IntelliSense
- `.vscode/extensions.json` — recommended: Volar, Tailwind CSS IntelliSense, ESLint, Prettier

## Step 21 — Verify

Run and confirm all pass:
- `npm run dev` — app loads, shows placeholder home screen
- `npm run build` — production build succeeds
- `npm run lint` — zero errors
- `npm run test` — all tests pass
- `npm run type-check` — zero TS errors

---

## What else could we do before features?

These are additional foundational items not strictly required but valuable:

1. **Error types in domain** — typed error classes (`ApiError`, `NotFoundError`, `RateLimitError`, `StorageError`) for structured error handling across the app
2. **Route transition wrapper** — small component wrapping `<RouterView>` with the 200ms opacity fade specified in the UI/UX doc
3. **`useRouteId` composable** — extracts and validates the numeric `:id` param from the current route; used by both detail screens
4. **`prefers-reduced-motion` utility** — CSS media query or composable disabling animations per accessibility spec
5. **Image placeholder components** — `PosterPlaceholder.vue`, `BackdropPlaceholder.vue`, `ProfilePlaceholder.vue` with correct aspect ratios and fallback icons
6. **Empty state component** — reusable `EmptyState.vue` with heading, supporting text, and CTA button props (messages for each screen are already defined in the UI/UX doc)
