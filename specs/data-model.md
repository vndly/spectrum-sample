# Data Model

## Services

- **`StorageService`** — Typed localStorage wrapper with JSON serialization. Handles schema migration between versions.
- **`TMDBService`** — API client for TMDB. Implements circuit breaker pattern and caches responses in localStorage to reduce API calls.

## Models

| Model | Purpose |
|-------|---------|
| `Movie` | TMDB movie data (title, year, genres, cast, images, etc.) |
| `TVShow` | TMDB TV show data (title, seasons, episodes, cast, images, etc.) |
| `LibraryEntry` | User data per title: rating, watchlist status, lists, tags, watch dates |

## localStorage Schema

```json
{
  "library": {
    "[tmdb_id]": {
      "tmdbId": "number",
      "mediaType": "movie | tv",
      "status": "watchlist | watched | none",
      "rating": "0-5",
      "favorite": "boolean",
      "lists": ["list-id-1"],
      "tags": ["tag1", "tag2"],
      "notes": "",
      "watchDates": ["2026-03-08"],
      "addedAt": "ISO date",
      "cachedData": { "/* TMDB response snapshot */" }
    }
  },
  "lists": {
    "[list-id]": { "name": "...", "createdAt": "..." }
  },
  "tags": ["tag1", "tag2"],
  "settings": { "theme": "dark" }
}
```

> **Note:** The `cachedData` field stores a snapshot of the TMDB response to enable offline browsing of previously viewed titles.
