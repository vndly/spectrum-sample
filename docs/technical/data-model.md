# Data Model

All types will be defined as Zod schemas in `src/types/` with TypeScript types inferred via `z.infer<>`. For TMDB API response types, see [API](./api.md#response-types).

## Models

### LibraryEntry

User data for a saved movie or TV show. Stored in localStorage, validated with Zod on every read.

```ts
interface LibraryEntry {
  id: number                        // TMDB ID
  mediaType: "movie" | "tv"
  status: "watchlist" | "watched" | "none"
  rating: number                    // 0 (unrated) to 5
  favorite: boolean
  lists: string[]                   // IDs of custom lists this entry belongs to
  tags: string[]                    // user-defined tags, e.g. ["horror", "90s"]
  notes: string                     // free-text user notes
  watchDates: string[]              // ISO dates, e.g. ["2026-03-08"] (supports rewatches)
  addedAt: string                   // ISO date — when the entry was first saved
}
```

### CustomList

User-created list for grouping library entries.

```ts
interface CustomList {
  id: string                        // generated UUID
  name: string                      // user-provided name, trimmed + sanitized
  createdAt: string                 // ISO date
}
```

### Settings

User preferences. Persisted in localStorage.

```ts
interface Settings {
  theme: "dark" | "light"
  language: string                  // ISO 639-1, e.g. "en"
  defaultHomeSection: "trending" | "popular" | "search"
  preferredRegion: string           // ISO 3166-1, e.g. "US" — for streaming availability
}
```

## localStorage Schema

All user data is persisted in localStorage as JSON, keyed under a single top-level namespace. `StorageService` owns all reads and writes — raw `localStorage` access outside the service is prohibited.

```json
{
  "schemaVersion": 1,
  "library": {
    "[tmdb-id]": "LibraryEntry"
  },
  "lists": {
    "[list-uuid]": "CustomList"
  },
  "tags": ["tag1", "tag2"],
  "settings": "Settings"
}
```

- **`schemaVersion`** — integer incremented on breaking changes. `StorageService` checks this on startup and runs migration functions to transform old data shapes.
- **`library`** — dictionary of `LibraryEntry` objects keyed by TMDB ID. Only entries the user has explicitly saved appear here.
- **`lists`** — dictionary of `CustomList` objects keyed by UUID. Membership is tracked on the entry side (`LibraryEntry.lists`).
- **`tags`** — global tag list. Kept in sync with tags referenced by library entries.
- **`settings`** — single `Settings` object. Defaults are applied if missing keys are detected during Zod validation.

## Services

- **`StorageService`** — Typed localStorage wrapper with JSON serialization. Handles schema migration between versions. Validates all reads with Zod schemas.
- **`ApiService`** — API client for fetching movie/TV metadata. Implements circuit breaker pattern. All responses are validated through Zod schemas before returning.

## Composables

Composables are the public data-access layer for components. They wrap services with Vue reactivity and expose a standard return shape:

```ts
{
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refresh?: () => Promise<void>
}
```

- **`useMovie(id)`** — Fetches and exposes reactive movie data via `ApiService`.
- **`useTVShow(id)`** — Fetches and exposes reactive TV show data via `ApiService`.
- **`useLibrary()`** — Reads/writes library entries via `StorageService`. Exposes watchlist, watched, favorites, etc.
- **`useSearch(query)`** — Runs search queries via `ApiService`, exposes reactive results.
- **`useTrending()`** — Fetches trending titles via `ApiService`.
