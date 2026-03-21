# Architecture

## Overview

The app follows a **4-layer client-only architecture**. Each layer has a clear responsibility and strict dependency rules. There is no backend — all user data lives in localStorage, and all movie/show metadata comes from the media provider API. Every data boundary (API responses, storage reads, user input) is validated with Zod schemas before use.

## Folder Structure

```
src/
├── main.ts                    # App entry point — creates Vue app, registers router
├── App.vue                    # Root component — error boundary + router outlet
│
├── presentation/              # LAYER 1: UI — Vue SFCs, views, routing
│   ├── components/            # Vue SFCs organized by feature
│   │   ├── layout/            # App shell, navigation, shared layout wrappers
│   │   ├── common/            # Reusable UI pieces (cards, search bar, filters)
│   │   ├── home/              # Home screen, search results, trending/popular
│   │   ├── details/           # Movie/TV detail view and subcomponents
│   │   ├── library/           # Watchlist, watched, custom lists
│   │   ├── stats/             # Charts and analytics
│   │   ├── recommendations/   # Recommendation views
│   │   ├── calendar/          # Release calendar
│   │   ├── settings/          # User preferences
│   │   └── error/             # Error boundary fallback
│   ├── views/                 # Route-level view components
│   └── router.ts              # Vue Router config and navigation guards
│
├── application/               # LAYER 2: Orchestration — Composables coordinating Domain + Infrastructure
│   └── use-library.ts         # Example: orchestrates Storage + Domain for library operations
│
├── domain/                    # LAYER 3: Business rules — Zod schemas, types, pure logic (zero framework deps)
│   ├── constants.ts           # App-wide constants (API URLs, storage key, retry limits, etc.)
│   ├── movie.schema.ts        # Example: Zod schemas & inferred types for movies
│   └── movie.logic.ts         # Example: pure functions (formatting, validation, business rules)
│
├── infrastructure/            # LAYER 4: External integrations — API client, storage, config
│   ├── provider.client.ts     # Media provider API client with auth and Zod response validation
│   ├── storage.service.ts     # Typed localStorage wrapper with Zod validation and schema migration
│   └── image.helper.ts        # buildImageUrl(path, size) — constructs full image URLs
│
└── assets/                    # Static files and Tailwind entry CSS
```

## Layers

```
┌─────────────────────────────────────┐
│        Presentation (UI)            │  Vue SFCs + Tailwind + Router
│      imports application only       │  Renders UI, emits events
├─────────────────────────────────────┤
│     Application (Orchestration)     │  Vue composables (use* functions)
│   imports domain + infrastructure   │  Coordinates data flow, exposes reactive state
├─────────────────────────────────────┤
│       Domain (Business Rules)       │  Pure TypeScript + Zod
│           no app imports            │  Schemas, types, business logic
├─────────────────────────────────────┤
│    Infrastructure (External I/O)    │  Pure TypeScript — HTTP, localStorage
│        imports domain only          │  No Vue dependencies
└─────────────────────────────────────┘
```

### Presentation

Vue 3 SFCs using `<script setup>` and Tailwind. Components call composables from the Application layer to access data — they never import Infrastructure or Domain directly. Route-level views live in `views/`, reusable UI pieces live in `components/` organized by feature area.

### Application

Composables prefixed with `use` that orchestrate the Domain and Infrastructure layers using Vue reactivity (`ref`, `computed`, `watchEffect`). Each composable returns a standard shape: `{ data, loading, error, refresh? }`. This is the **only public API** that Presentation components use to read or mutate data.

**Example flow** — when the UI calls `addToWatchlist(movieId)`, the composable:
1. Asks Infrastructure to fetch movie details from the media provider.
2. Passes that data to Domain to validate it against the Zod schema.
3. Tells Infrastructure to save the validated entry to localStorage.

### Domain

Pure TypeScript with zero dependencies on Vue, Vite, or Web APIs. Contains:

- **Constants** (`constants.ts`) — App-wide constants: `API_BASE_URL`, `IMAGE_BASE_URL`, `IMAGE_SIZES`, `CURRENT_SCHEMA_VERSION`, `STORAGE_KEY`, `MAX_RETRY_ATTEMPTS`, `TOAST_DISMISS_MS`.
- **Zod schemas** (`.schema.ts`) — Define the shape of all data at boundaries (API responses, localStorage entries, user input). TypeScript types are inferred from schemas with `z.infer<>`.
- **Business logic** (`.logic.ts`) — Stateless pure functions: date/number formatting, validation rules, derived computations (e.g., `isHighRated(movie)` returns true if rating > 8.0).

Because this layer has no dependencies, it is trivially testable with Vitest.

### Infrastructure

Plain TypeScript with no Vue dependencies. Handles all external integration, importing only from Domain for type definitions:

- **`provider.client.ts`** — Media provider API client with Bearer token auth and Zod response validation.
- **`storage.service.ts`** — Typed localStorage wrapper with Zod validation on reads and schema migration between versions.
- **`image.helper.ts`** — `buildImageUrl(path, size)` — returns a full image URL or `null` when no image path is available.

## Dependency Rules

```
Presentation  →  Application  (only)
Application   →  Domain + Infrastructure
Infrastructure →  Domain  (only)
Domain        →  nothing
```

No layer may skip or reach across levels. Presentation never imports Infrastructure or Domain directly — it always goes through Application.

## Data Flow

### Read path (API → screen)

```
Media Provider API
  → provider.client.ts          # HTTP fetch + Zod validation (Infrastructure)
    → useMovie(id)              # Wraps in ref(), tracks loading/error (Application)
      → EntryDetails.vue        # Renders reactive data in template (Presentation)
```

### Write path (user action → storage)

```
User clicks "Add to Watchlist"
  → EntryDetails.vue calls useLibrary().addToWatchlist(id)   (Presentation → Application)
    → movie.schema.ts validates the entry                     (Application → Domain)
      → storage.service.ts writes to localStorage             (Application → Infrastructure)
        → useLibrary() reactive state updates                 (Application)
          → Component re-renders with new status              (Presentation)
```

## Routing

Routes are defined in `src/presentation/router.ts` using Vue Router with `createWebHistory()` for clean URLs (no hash fragments).

| Path                | View             | Purpose                          |
| ------------------- | ---------------- | -------------------------------- |
| `/`                 | Home             | Search bar, trending, popular    |
| `/movie/:id`        | Movie details    | Full movie info, actions         |
| `/tv/:id`           | TV show details  | Full show info, actions          |
| `/library`          | Library          | Watchlist, watched, custom lists |
| `/stats`            | Stats            | Viewing history analytics        |
| `/recommendations`  | Recommendations  | Personalized suggestions         |
| `/calendar`         | Release calendar | Upcoming releases                |
| `/settings`         | Settings         | Theme, language, data export     |

A catch-all route `/:pathMatch(.*)*` redirects unknown paths to `/`.

Navigation guards on `/movie/:id` and `/tv/:id` reject non-numeric IDs and redirect to `/`.

**Navigation:** Sidebar on desktop, bottom navigation bar on mobile. Both link to the same routes.

### Performance

**Route lazy loading** — All route-level view components use dynamic imports so Vite splits them into separate chunks. Only the initially visited route is loaded upfront; remaining views are fetched on navigation.

```ts
// Example route definition in router.ts
{
  path: '/library',
  component: () => import('./views/LibraryScreen.vue'),
}
```

**No API caching** — Every navigation or action that needs media provider data makes a fresh API request. There is no response cache, no request deduplication, and no stale-while-revalidate layer. This keeps the data layer simple and avoids cache-invalidation bugs. The media provider's rate limit (≈40 requests per 10 seconds) is well above typical usage. The one exception is `useGenres()`, which caches genre lists in memory for the session to avoid redundant lookups (see [Data Model — useGenres()](./data-model.md#application-composables)).

### Deep Linking

Every route is directly navigable via URL. Navigating to `/movie/550` or `/tv/1396` works the same whether the user clicks a card or pastes the URL into the browser:

1. Vue Router matches the `:id` param and lazy-loads the detail view component.
2. The view's composable (`useMovie(id)` or `useTVShow(id)`) fetches data from the media provider using the route param.
3. While loading, the view renders skeleton placeholders.
4. On success, the view renders the full detail screen.

**Error cases:**

- **The API returns 404 (ID not found)** — The view shows a "not found" message with a link back to Home.
- **Network error** — Toast notification with a retry option; the view stays in its error state.
- **Non-numeric ID (e.g. `/movie/abc`)** — A navigation guard rejects the route and redirects to Home.

**No offline handling** — The app requires a network connection. There is no service worker or offline fallback.

## Component Hierarchy

```
App.vue
└── ErrorBoundary
    └── AppShell (sidebar/bottom nav + router outlet)
        ├── / → HomeScreen
        │       ├── SearchBar → SearchResults → MovieCard[]
        │       ├── TrendingCarousel → HeroBanner[]
        │       ├── PopularGrid → MovieCard[]
        │       ├── FilterBar
        │       └── ViewToggle
        │
        ├── /movie/:id, /tv/:id → EntryDetails
        │       ├── HeroBackdrop
        │       ├── MetadataPanel
        │       ├── CastCarousel
        │       ├── TrailerEmbed
        │       ├── StreamingBadges
        │       ├── RatingStars
        │       └── Gallery
        │
        ├── /library → LibraryScreen
        │       ├── TabToggle (watchlist / watched / lists)
        │       ├── ViewStatsLink (visible when watched entries exist)
        │       ├── FilterBar
        │       ├── SortDropdown
        │       └── EntryGrid → MovieCard[]
        │
        ├── /stats → StatsScreen
        │       ├── StatCards
        │       ├── GenreChart
        │       ├── MonthlyChart
        │       └── TopRatedList
        │
        ├── /recommendations → RecommendationsScreen
        │       ├── FilterBar
        │       └── EntryGrid → MovieCard[]
        │
        ├── /calendar → ReleaseCalendar → CalendarGrid → ReleaseCard[]
        └── /settings → SettingsScreen
                ├── ThemeToggle
                ├── LanguageSelect
                ├── RegionSelect
                └── HomeSectionSelect
```

## State Management

No external state library (no Pinia/Vuex). State is managed across three tiers:

| Tier                  | What lives here                                | Mechanism                                                                         |
| --------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| **Component-local**   | UI toggles, form inputs, modal open/close      | `ref()` / `computed()` inside `<script setup>`                                    |
| **Application-shared** | Library entries, search results, trending data | `ref()` inside composables, shared across components                              |
| **Persistent**        | User library, lists, tags, settings            | localStorage via `storage.service.ts` (see [Data Model](./data-model.md))         |

All persistent data is validated with Zod on read to guard against corruption or schema drift.

## Testing

Because the Domain and Application layers are cleanly separated:

- **Domain tests** — Test Zod schemas and pure logic functions with zero overhead. No mocking required.
- **Application tests** — Mock the Infrastructure layer to test composable orchestration logic without touching localStorage or the media provider API.
- **Infrastructure tests** — Use a real `storage.service.ts` instance backed by a fresh in-memory store to keep behavior close to production.
