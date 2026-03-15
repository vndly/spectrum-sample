# API

## Provider

The app uses [TMDB (The Movie Database)](https://www.themoviedb.org/) as its data source for movie and TV content.

## Authentication

All requests require a Bearer token passed via the `Authorization` header:

```
Authorization: Bearer <TMDB_ACCESS_TOKEN>
```

The access token is obtained from the TMDB developer dashboard under API → API Read Access Token.

## Base URL

```
https://api.themoviedb.org/3
```

## Response Format

All responses are JSON. Paginated endpoints return:

```json
{
  "page": 1,
  "results": [],
  "total_pages": 500,
  "total_results": 10000
}
```

## Rate Limiting

TMDB allows approximately 40 requests per 10 seconds per API key.

## Image URLs

TMDB returns relative image paths (e.g. `/kqjL17yufvn9OVLyXYpvtyrFfak.jpg`). To build a full URL:

```
https://image.tmdb.org/t/p/{size}{path}
```

Common sizes: `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`.

---

## Endpoints

### GET /movie/popular

Returns a paginated list of currently popular movies.

**URL:** `https://api.themoviedb.org/3/movie/popular`

**Query Parameters:**

| Parameter  | Type   | Required | Default | Description              |
| ---------- | ------ | -------- | ------- | ------------------------ |
| `language` | string | No       | `en-US` | ISO 639-1 language code  |
| `page`     | int    | No       | `1`     | Page number (1–500)      |

**Example Request:**

```bash
curl -s "https://api.themoviedb.org/3/movie/popular?page=1" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

**Example Response (truncated):**

```json
{
  "page": 1,
  "results": [
    {
      "id": 123,
      "title": "Example Movie",
      "overview": "A brief description of the movie.",
      "release_date": "2026-01-15",
      "poster_path": "/kqjL17yufvn9OVLyXYpvtyrFfak.jpg",
      "backdrop_path": "/abc123.jpg",
      "vote_average": 7.8,
      "vote_count": 2450,
      "popularity": 985.32,
      "genre_ids": [28, 12, 878],
      "adult": false,
      "original_language": "en",
      "video": false
    }
  ],
  "total_pages": 500,
  "total_results": 10000
}
```

## APIs

- [TMDB API](https://developer.themoviedb.org/docs/getting-started)
- [OMDB API](https://www.omdbapi.com)
- [IMDB API](https://imdbapi.dev)