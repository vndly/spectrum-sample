# API: Entry Details: Movie and Show Detail Pages (R-04)

## Overview

The entry details feature fetches comprehensive metadata from the TMDB API using a single request with appended relations. This minimizes network requests and provides all data needed for the detail page.

## TMDB API Endpoints

### Movie Detail

**Endpoint:** `GET /movie/{id}`

**Query Parameters:**

- `language` — User's preferred language (e.g., `en-US`)
- `append_to_response` — `credits,videos,watch/providers,release_dates,images,external_ids`

**Response:** See `MovieDetail` schema in [Data Model](./data-model.md).

### Show Detail

**Endpoint:** `GET /tv/{id}`

**Query Parameters:**

- `language` — User's preferred language (e.g., `en-US`)
- `append_to_response` — `credits,videos,watch/providers,content_ratings,images,external_ids`

**Response:** See `ShowDetail` schema in [Data Model](./data-model.md).

### Person Detail

**Endpoint:** `GET /person/{id}`

**Query Parameters:**

- `language` — User's preferred language (e.g., `en-US`)
- `append_to_response` — `combined_credits,external_ids`

**Response:** See `PersonDetailWithCredits` schema in [Data Model](./data-model.md).

## API Client Functions

### getMovieDetail

```ts
// src/infrastructure/provider.client.ts

async function getMovieDetail(id: number, language: string): Promise<MovieDetail>
```

**Parameters:**

- `id` — TMDB movie ID
- `language` — Locale string for localized content

**Returns:** Validated `MovieDetail` object

**Error Handling:**

- Retries on 429 (rate limit) with exponential backoff
- Throws on 404 (not found) or other HTTP errors

### getShowDetail

```ts
// src/infrastructure/provider.client.ts

async function getShowDetail(id: number, language: string): Promise<ShowDetail>
```

**Parameters:**

- `id` — TMDB show ID
- `language` — Locale string for localized content

**Returns:** Validated `ShowDetail` object

**Error Handling:** Same as `getMovieDetail`

### getPersonDetail

```ts
// src/infrastructure/provider.client.ts

async function getPersonDetail(id: number, language: string): Promise<PersonDetailWithCredits>
```

**Parameters:**

- `id` — TMDB person ID
- `language` — Locale string for localized person content

**Returns:** Validated `PersonDetailWithCredits` object

**Error Handling:**

- Preserves 404 status for inline "person not found" handling
- Retries 429 rate-limit responses with exponential backoff
- Surfaces network and 500+ server errors for manual Retry actions

## Composables

### useMovieDetail

```ts
// src/application/use-movie-detail.ts

function useMovieDetail(id: MaybeRef<number>) {
  return {
    data: Ref<MovieDetail | null>,
    loading: Ref<boolean>,
    error: Ref<Error | null>,
    refresh: () => void
  }
}
```

**Behavior:**

- Fetches immediately on composable creation
- Respects user's language setting from `useSettings()`
- Re-fetches when `id` changes (if reactive)
- `refresh()` triggers a manual re-fetch

### useShowDetail

```ts
// src/application/use-show-detail.ts

function useShowDetail(id: MaybeRef<number>) {
  return {
    data: Ref<ShowDetail | null>,
    loading: Ref<boolean>,
    error: Ref<Error | null>,
    refresh: () => void
  }
}
```

**Behavior:** Identical to `useMovieDetail` but for TV shows.

### usePerson

```ts
// src/application/use-person.ts

function usePerson(id: MaybeRef<number>) {
  return {
    data: Ref<PersonPageData | null>,
    loading: Ref<boolean>,
    error: Ref<Error | null>,
    refresh: () => void
  }
}
```

**Behavior:**

- Fetches localized person details, combined cast credits, and external IDs
- Re-fetches when the person ID or active `Settings.language` changes
- Deduplicates and sorts filmography before Presentation receives it
- Exposes ready-to-render profile, poster, route, date, and external-link view models
- `refresh()` manually re-attempts the current person request after recoverable errors

### useLibraryEntry

```ts
// src/application/use-library-entry.ts

function useLibraryEntry(
  id: number,
  mediaType: MediaType,
  title: string,
  posterPath: string | null,
  voteAverage?: number,
  releaseDate?: string
) {
  return {
    entry: Ref<LibraryEntry | null>,
    loadEntry: () => void,
    setRating: (value: number) => void,
    toggleFavorite: () => void,
    setStatus: (status: WatchStatus) => void
  }
}
```

**Behavior:**

- Loads entry from localStorage or creates default
- Syncs metadata (poster, rating, release date) on load
- `setStatus()` toggles between 'watchlist', 'watched', and 'none'
- All changes persist to localStorage immediately

## Image URLs

### buildImageUrl

```ts
// src/infrastructure/image.helper.ts

function buildImageUrl(path: string | null, size: ImageSize): string | null
```

Constructs TMDB image URL: `https://image.tmdb.org/t/p/{size}{path}`

### buildImageSrcSet

```ts
function buildImageSrcSet(path: string | null, sizes: ImageSize[]): string | null
```

Generates srcset string for responsive images.

## Rate Limiting

The API client implements retry logic for rate limiting:

- **Max Attempts:** Configured via `MAX_RETRY_ATTEMPTS` constant
- **Backoff:** Exponential: `RETRY_BASE_DELAY_MS * 2^(attempt-1)`
- **Trigger:** HTTP 429 status code

```ts
// Retry behavior
attempt 1: immediate
attempt 2: RETRY_BASE_DELAY_MS * 1
attempt 3: RETRY_BASE_DELAY_MS * 2
attempt 4: RETRY_BASE_DELAY_MS * 4
...
```

## Request Headers

All TMDB API requests include:

```
Authorization: Bearer {VITE_MEDIA_PROVIDER_TOKEN}
Content-Type: application/json
```

The token is configured via environment variable.
