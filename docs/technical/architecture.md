# Architecture

## Overview

The app follows a **4-layer client-only architecture**. Each layer has a clear responsibility and strict dependency rules. There is no backend — all user data lives in localStorage, and all movie/show metadata comes from the TMDB API. Every data boundary (API responses, storage reads, user input) is validated with Zod schemas before use.

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
│   └── useLibrary.ts          # Example: orchestrates Storage + Domain for library operations
│
├── domain/                    # LAYER 3: Business rules — Zod schemas, types, pure logic (zero framework deps)
│   ├── movie.schema.ts        # Example: Zod schemas & inferred types for movies
│   └── movie.logic.ts         # Example: pure functions (formatting, validation, business rules)
│
├── infrastructure/            # LAYER 4: External integrations — API client, storage, config
│   ├── tmdb.client.ts         # TMDB API client with auth and Zod response validation
│   └── storage.service.ts     # Typed localStorage wrapper with Zod validation and schema migration
│
└── assets/                    # Static files and Tailwind entry CSS
```

## Layers

```
┌─────────────────────────────────────────┐
│        Presentation (UI)                │  Vue SFCs + Tailwind + Router
│      imports application only           │  Renders UI, emits events
├─────────────────────────────────────────┤
│     Application (Orchestration)         │  Vue composables (use* functions)
│   imports domain + infrastructure       │  Coordinates data flow, exposes reactive state
├─────────────────────────────────────────┤
│         Domain (Business Rules)         │  Pure TypeScript + Zod
│           no app imports                │  Schemas, types, business logic
├─────────────────────────────────────────┤
│    Infrastructure (External I/O)        │  Pure TypeScript — HTTP, localStorage
│        imports domain only              │  No Vue dependencies
└─────────────────────────────────────────┘
```

### Presentation

Vue 3 SFCs using `<script setup>` and Tailwind. Components call composables from the Application layer to access data — they never import Infrastructure or Domain directly. Route-level views live in `views/`, reusable UI pieces live in `components/` organized by feature area.

### Application

Composables prefixed with `use` that orchestrate the Domain and Infrastructure layers using Vue reactivity (`ref`, `computed`, `watchEffect`). Each composable returns a standard shape: `{ data, loading, error, refresh? }`. This is the **only public API** that Presentation components use to read or mutate data.

**Example flow** — when the UI calls `addToWatchlist(movieId)`, the composable:
1. Asks Infrastructure to fetch movie details from TMDB.
2. Passes that data to Domain to validate it against the Zod schema.
3. Tells Infrastructure to save the validated entry to localStorage.

### Domain

Pure TypeScript with zero dependencies on Vue, Vite, or Web APIs. Contains:

- **Zod schemas** (`.schema.ts`) — Define the shape of all data at boundaries (API responses, localStorage entries, user input). TypeScript types are inferred from schemas with `z.infer<>`.
- **Business logic** (`.logic.ts`) — Stateless pure functions: date/number formatting, validation rules, derived computations (e.g., `isHighRated(movie)` returns true if rating > 8.0).

Because this layer has no dependencies, it is trivially testable with Vitest.

### Infrastructure

Plain TypeScript with no Vue dependencies. Handles all external integration, importing only from Domain for type definitions:

- **`tmdb.client.ts`** — TMDB API client with Bearer token auth, Zod response validation, and circuit breaker for rate limits.
- **`storage.service.ts`** — Typed localStorage wrapper with Zod validation on reads and schema migration between versions.
- **Cache layer** — localStorage-backed response cache with TTL to reduce redundant API calls.

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
TMDB API
  → tmdb.client.ts              # HTTP fetch + Zod validation (Infrastructure)
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

Routes are defined in `src/presentation/router.ts` using Vue Router.

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

**Navigation:** Sidebar on desktop, bottom navigation bar on mobile. Both link to the same routes.

## Component Hierarchy

```
App.vue
└── ErrorBoundary
    └── AppShell (sidebar/bottom nav + router outlet)
        ├── / → HomeScreen
        │       ├── SearchBar → SearchResults → MovieCard[]
        │       ├── TrendingCarousel → MovieCard[]
        │       └── PopularGrid → MovieCard[]
        │
        ├── /movie/:id, /tv/:id → EntryDetails
        │       ├── HeroBackdrop
        │       ├── MetadataPanel
        │       ├── CastCarousel
        │       ├── TrailerEmbed
        │       ├── StreamingBadges
        │       └── RatingStars
        │
        ├── /library → LibraryScreen
        │       ├── TabToggle (watchlist / watched / lists)
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
        ├── /calendar → ReleaseCalendar → CalendarGrid → ReleaseCard[]
        └── /settings → SettingsScreen
```

## State Management

No external state library (no Pinia/Vuex). State is managed across three tiers:

| Tier                  | What lives here                                | Mechanism                                                                         |
| --------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| **Component-local**   | UI toggles, form inputs, modal open/close      | `ref()` / `computed()` inside `<script setup>`                                    |
| **Application-shared** | Library entries, search results, trending data | `ref()` inside composables, shared across components                              |
| **Persistent**        | User library, lists, tags, settings, API cache | localStorage via `storage.service.ts` (see [Data Model](./data-model.md))         |

API responses are cached in localStorage with a TTL to avoid redundant requests. All persistent data is validated with Zod on read to guard against corruption or schema drift.

## Testing

Because the Domain and Application layers are cleanly separated:

- **Domain tests** — Test Zod schemas and pure logic functions with zero overhead. No mocking required.
- **Application tests** — Mock the Infrastructure layer to test composable orchestration logic without touching localStorage or the TMDB API.
- **Infrastructure tests** — Use a real `storage.service.ts` instance backed by a fresh in-memory store to keep behavior close to production.
