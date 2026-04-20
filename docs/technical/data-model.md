# Data Model

All types are defined as Zod schemas in `src/domain/` with TypeScript types inferred via `z.infer<>`. For media provider API response types, see [API](./api.md#response-types).

## Constants

`src/domain/constants.ts` defines app-wide constants used across layers:

| Constant                 | Type                | Description                                                  |
| ------------------------ | ------------------- | ------------------------------------------------------------ |
| `API_BASE_URL`           | `string`            | Media provider API base URL (`https://api.themoviedb.org/3`) |
| `IMAGE_BASE_URL`         | `string`            | Media provider image base URL                                |
| `IMAGE_SIZES`            | `object`            | Available image sizes per type (poster, backdrop, etc.)      |
| `CURRENT_SCHEMA_VERSION` | `number`            | Current localStorage schema version                          |
| `STORAGE_KEY`            | `string`            | localStorage key for all persisted data                      |
| `MAX_RETRY_ATTEMPTS`     | `number`            | Maximum retries for rate-limited API requests                |
| `TOAST_DISMISS_MS`       | `number`            | Auto-dismiss duration for toast notifications                |
| `MAX_VISIBLE_TOASTS`     | `number`            | Maximum simultaneous toasts; oldest evicted when exceeded    |
| `SUPPORTED_LANGUAGES`    | `readonly string[]` | Supported UI/content languages: `['en', 'es', 'fr']`         |
| `DEFAULT_LANGUAGE`       | `string`            | Default language when browser locale is unsupported (`'en'`) |

## Models

### LibraryEntry

User data for a saved movie or TV show. Stored in localStorage, validated with Zod on every read.

```ts
interface LibraryEntry {
  id: number // provider ID
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
  releaseDate?: string // authoritative snapshot for Release Year sorting
  voteAverage?: number // authoritative snapshot for TMDB rating (read-only reference)
  genreIds?: number[] // authoritative snapshot for local genre filtering
  status: 'watchlist' | 'watched' | 'none'
  rating: number // user-assigned rating (0 to 5)
  favorite: boolean
  tags: string[]
  notes: string
  watchDates: string[]
  addedAt: string // ISO date
}
```

### Settings

User preferences. Persisted in localStorage.

```ts
interface Settings {
  theme: 'dark' | 'light'
  language: string
  defaultHomeSection: 'trending' | 'popular' | 'search'
  preferredRegion: string
  layoutMode: 'grid' | 'list'
  librarySortField?: 'dateAdded' | 'title' | 'releaseYear' | 'userRating'
  librarySortOrder?: 'asc' | 'desc'
}
```

## localStorage Schema

All user data is persisted in localStorage as JSON, keyed under a single top-level namespace. `storage.service.ts` owns all reads and writes — raw `localStorage` access outside the service is prohibited.

```json
{
  "schemaVersion": 1,
  "library": {
    "[provider-id]": "LibraryEntry"
  },
  "tags": ["tag1", "tag2"],
  "settings": "Settings"
}
```

- **`schemaVersion`** — integer incremented on breaking changes. `storage.service.ts` checks this on startup and runs migration functions to transform old data shapes.
- **`library`** — dictionary of `LibraryEntry` objects keyed by provider ID. Only entries the user has explicitly saved appear here.
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
// Example: adding a required runtime field in version 2
const migrations: Record<number, (data: unknown) => unknown> = {
  2: migrateV1ToV2,
}

function migrateV1ToV2(data: SchemaV1): SchemaV2 {
  const library = Object.fromEntries(
    Object.entries(data.library).map(([id, entry]) => [id, { ...entry, runtime: 0 }]),
  )
  return { ...data, library, schemaVersion: 2 }
}
```

### Version Bump Rules

- **Increment `schemaVersion`** when a change alters the shape of persisted data in a way that old code cannot read (added required fields, renamed keys, changed value types).
- **Do not increment** for additive optional fields where Zod's `.optional()` or `.default()` handles the missing value gracefully on read.
- Each migration must be idempotent — running it twice on the same data produces the same result.

## Storage Limits

Browsers typically enforce a 5–10 MB localStorage quota per origin. The app stores user library entries, tags, and settings in localStorage as serialized JSON.

**Current handling:** There is no proactive quota monitoring or `QuotaExceededError` handling. If a write exceeds the browser's limit, the standard error convention applies — a toast notification alerts the user (e.g., "Storage issue detected. Some data may not be saved.").

**Practical risk:** Low for typical usage. A library of several hundred entries with notes, tags, and watch dates is well under 1 MB of JSON. The quota would only become a concern with thousands of entries or very long notes fields.

## Infrastructure

- **`storage.service.ts`** — Typed localStorage wrapper with JSON serialization. Handles schema migration between versions. Validates all reads with Zod schemas.
- **`provider.client.ts`** — API client for fetching movie/show metadata. All responses are validated through Zod schemas before returning.
- **`image.helper.ts`** — `buildImageUrl(path, size)` — returns a full image URL by combining `IMAGE_BASE_URL`, the requested size, and the relative path. Returns `null` when the path is `null` (no image available).

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

Examples:

- **`useMovie(id)`** — Fetches and exposes reactive movie detail data via `provider.client.ts`.
- **`useLibrary()`** — Reads/writes library entries via `storage.service.ts`.
- **`useSettings()`** — Reads/writes user preferences via `storage.service.ts`.
