# Data Model

All types will be defined as Zod schemas in `src/domain/` with TypeScript types inferred via `z.infer<>`. For TMDB API response types, see [API](./api.md#response-types).

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

All user data is persisted in localStorage as JSON, keyed under a single top-level namespace. `storage.service.ts` owns all reads and writes — raw `localStorage` access outside the service is prohibited.

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

- **`schemaVersion`** — integer incremented on breaking changes. `storage.service.ts` checks this on startup and runs migration functions to transform old data shapes.
- **`library`** — dictionary of `LibraryEntry` objects keyed by TMDB ID. Only entries the user has explicitly saved appear here.
- **`lists`** — dictionary of `CustomList` objects keyed by UUID. Membership is tracked on the entry side (`LibraryEntry.lists`).
- **`tags`** — global tag list. Kept in sync with tags referenced by library entries.
- **`settings`** — single `Settings` object. Defaults are applied if missing keys are detected during Zod validation.

## Schema Migration

`storage.service.ts` runs schema migrations on startup to keep localStorage data compatible with the latest code.

### How It Works

1. On app load, `storage.service.ts` reads the `schemaVersion` field from localStorage.
2. If the stored version is lower than the current version expected by the code, it runs each migration function in sequence (e.g., v1→v2, then v2→v3).
3. After all migrations complete, `schemaVersion` is updated to the current version and the migrated data is written back.

### Adding a New Migration

1. Increment the `CURRENT_SCHEMA_VERSION` constant in `storage.service.ts`.
2. Add a migration function named `migrateVxToVy` that receives the old data shape and returns the new one.
3. Register the function in the `migrations` map keyed by the target version number.

```ts
// Example: adding a "color" field to CustomList in version 2
const migrations: Record<number, (data: unknown) => unknown> = {
  2: migrateV1ToV2,
}

function migrateV1ToV2(data: SchemaV1): SchemaV2 {
  const lists = Object.fromEntries(
    Object.entries(data.lists).map(([id, list]) => [
      id,
      { ...list, color: null },
    ])
  )
  return { ...data, lists, schemaVersion: 2 }
}
```

### Version Bump Rules

- **Increment `schemaVersion`** when a change alters the shape of persisted data in a way that old code cannot read (added required fields, renamed keys, changed value types).
- **Do not increment** for additive optional fields where Zod's `.optional()` or `.default()` handles the missing value gracefully on read.
- Each migration must be idempotent — running it twice on the same data produces the same result.

## Infrastructure

- **`storage.service.ts`** — Typed localStorage wrapper with JSON serialization. Handles schema migration between versions. Validates all reads with Zod schemas.
- **`tmdb.client.ts`** — API client for fetching movie/TV metadata. Implements circuit breaker pattern. All responses are validated through Zod schemas before returning.

## Application (Composables)

Composables are the public data-access layer for Presentation components. They orchestrate Domain and Infrastructure with Vue reactivity and expose a standard return shape:

```ts
{
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refresh?: () => Promise<void>
}
```

- **`useMovie(id)`** — Fetches and exposes reactive movie data via `tmdb.client.ts`.
- **`useTVShow(id)`** — Fetches and exposes reactive TV show data via `tmdb.client.ts`.
- **`useLibrary()`** — Reads/writes library entries via `storage.service.ts`. Exposes watchlist, watched, favorites, etc.
- **`useSearch(query)`** — Runs search queries via `tmdb.client.ts`, exposes reactive results.
- **`useTrending()`** — Fetches trending titles via `tmdb.client.ts`.
- **`usePopular()`** — Fetches popular titles via `tmdb.client.ts`.
- **`useRecommendations(id)`** — Fetches recommended titles for a given entry via `tmdb.client.ts`.
- **`useUpcoming()`** — Fetches upcoming movie releases via `tmdb.client.ts`.
- **`useStats()`** — Computes viewing statistics from library data via `storage.service.ts`.
- **`useSettings()`** — Reads/writes user preferences via `storage.service.ts`.
- **`useLists()`** — Manages custom lists and list membership via `storage.service.ts`.
