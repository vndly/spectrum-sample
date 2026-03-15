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

## Rate Limiting

TMDB allows approximately 40 requests per 10 seconds per API key.

## Image URLs

TMDB returns relative image paths (e.g. `/kqjL17yufvn9OVLyXYpvtyrFfak.jpg`). To build a full URL:

```
https://image.tmdb.org/t/p/{size}{path}
```

Common sizes: `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`.

---

## Response Types

All response types are defined as Zod schemas in `src/types/` with TypeScript types inferred via `z.infer<>`.

### PaginatedResponse

Generic wrapper returned by all paginated endpoints.

```ts
interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
```

### MovieListItem

Returned by list endpoints: search, trending, popular, recommendations, upcoming.

```ts
interface MovieListItem {
  id: number
  title: string
  original_title: string
  overview: string
  release_date: string              // "YYYY-MM-DD"
  poster_path: string | null        // relative path, e.g. "/kqjL17y...jpg"
  backdrop_path: string | null
  vote_average: number              // 0–10
  vote_count: number
  popularity: number
  genre_ids: number[]               // e.g. [28, 12, 878]
  adult: boolean
  original_language: string         // ISO 639-1, e.g. "en"
  video: boolean
}
```

### MovieDetail

Returned by `/movie/{id}` with `append_to_response=credits,videos,watch/providers,release_dates`.

```ts
interface MovieDetail {
  id: number
  title: string
  original_title: string
  overview: string
  tagline: string
  release_date: string              // "YYYY-MM-DD"
  runtime: number | null            // minutes
  status: string                    // "Released", "Post Production", etc.
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number              // 0–10
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  budget: number                    // USD (0 if unknown)
  revenue: number                   // USD (0 if unknown)
  homepage: string | null
  imdb_id: string | null            // e.g. "tt1234567"
  genres: Genre[]
  spoken_languages: SpokenLanguage[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  belongs_to_collection: Collection | null

  // Appended relations
  credits: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  videos: {
    results: Video[]
  }
  "watch/providers": {
    results: Record<string, WatchProviderRegion>  // keyed by region code, e.g. "US"
  }
  release_dates: {
    results: ReleaseDateRegion[]
  }
}
```

### TVShowListItem

Returned by list endpoints: search, trending, popular, recommendations.

```ts
interface TVShowListItem {
  id: number
  name: string
  original_name: string
  overview: string
  first_air_date: string            // "YYYY-MM-DD"
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number              // 0–10
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  origin_country: string[]          // ISO 3166-1, e.g. ["US"]
}
```

### TVShowDetail

Returned by `/tv/{id}` with `append_to_response=credits,videos,watch/providers,content_ratings`.

```ts
interface TVShowDetail {
  id: number
  name: string
  original_name: string
  overview: string
  tagline: string
  first_air_date: string
  last_air_date: string | null
  status: string                    // "Returning Series", "Ended", "Canceled"
  number_of_seasons: number
  number_of_episodes: number
  episode_run_time: number[]        // typical episode length(s) in minutes
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  homepage: string | null
  genres: Genre[]
  spoken_languages: SpokenLanguage[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  origin_country: string[]
  created_by: Creator[]
  networks: Network[]
  next_episode_to_air: Episode | null

  // Appended relations
  credits: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  videos: {
    results: Video[]
  }
  "watch/providers": {
    results: Record<string, WatchProviderRegion>
  }
  content_ratings: {
    results: ContentRating[]
  }
}
```

### Shared Sub-types

```ts
interface Genre {
  id: number
  name: string                      // e.g. "Action", "Comedy"
}

interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null       // headshot image
  order: number                     // billing order
}

interface CrewMember {
  id: number
  name: string
  job: string                       // e.g. "Director", "Screenplay"
  department: string                // e.g. "Directing", "Writing"
  profile_path: string | null
}

interface Video {
  id: string
  key: string                       // YouTube video ID
  name: string
  site: string                      // "YouTube"
  type: string                      // "Trailer", "Teaser", "Featurette"
  official: boolean
}

interface WatchProviderRegion {
  link: string
  flatrate?: StreamingProvider[]    // subscription services
  rent?: StreamingProvider[]
  buy?: StreamingProvider[]
}

interface StreamingProvider {
  provider_id: number
  provider_name: string             // e.g. "Netflix", "Apple TV+"
  logo_path: string
  display_priority: number
}

interface ReleaseDateRegion {
  iso_3166_1: string                // e.g. "US"
  release_dates: {
    certification: string           // e.g. "PG-13", "R"
    release_date: string
    type: number                    // 1=Premiere, 2=Limited, 3=Theatrical, etc.
  }[]
}

interface ContentRating {
  iso_3166_1: string                // e.g. "US"
  rating: string                    // e.g. "TV-MA", "TV-14"
}

interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

interface ProductionCountry {
  iso_3166_1: string
  name: string
}

interface Collection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

interface Creator {
  id: number
  name: string
  profile_path: string | null
}

interface Network {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

interface Episode {
  id: number
  name: string
  overview: string
  air_date: string
  season_number: number
  episode_number: number
  runtime: number | null
}
```

---

## Endpoints

### Search

#### GET /search/multi

Searches movies, TV shows, and people in a single request. The app filters results to `movie` and `tv` types only.

**URL:** `https://api.themoviedb.org/3/search/multi`

| Parameter       | In    | Type   | Required | Default | Description                    |
| --------------- | ----- | ------ | -------- | ------- | ------------------------------ |
| `query`         | query | string | Yes      | —       | Search text                    |
| `language`      | query | string | No       | `en-US` | ISO 639-1 language code        |
| `page`          | query | int    | No       | `1`     | Page number (1–500)            |
| `include_adult` | query | bool   | No       | `false` | Include adult content          |

**Response:** `PaginatedResponse<MovieListItem | TVShowListItem>`

Each result includes an extra `media_type` field (`"movie"`, `"tv"`, or `"person"`) not present in the individual list item types. The app uses this to distinguish result types and discards `"person"` results.

```bash
curl -s "https://api.themoviedb.org/3/search/multi?query=inception" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

### Trending

#### GET /trending/movie/{time_window}

Returns trending movies for a given time window.

**URL:** `https://api.themoviedb.org/3/trending/movie/{time_window}`

| Parameter     | In    | Type   | Required | Default | Description                    |
| ------------- | ----- | ------ | -------- | ------- | ------------------------------ |
| `time_window` | path  | string | Yes      | —       | `"day"` or `"week"`            |
| `language`    | query | string | No       | `en-US` | ISO 639-1 language code        |
| `page`        | query | int    | No       | `1`     | Page number (1–500)            |

**Response:** `PaginatedResponse<MovieListItem>`

```bash
curl -s "https://api.themoviedb.org/3/trending/movie/week" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

#### GET /trending/tv/{time_window}

Returns trending TV shows for a given time window.

**URL:** `https://api.themoviedb.org/3/trending/tv/{time_window}`

| Parameter     | In    | Type   | Required | Default | Description                    |
| ------------- | ----- | ------ | -------- | ------- | ------------------------------ |
| `time_window` | path  | string | Yes      | —       | `"day"` or `"week"`            |
| `language`    | query | string | No       | `en-US` | ISO 639-1 language code        |
| `page`        | query | int    | No       | `1`     | Page number (1–500)            |

**Response:** `PaginatedResponse<TVShowListItem>`

```bash
curl -s "https://api.themoviedb.org/3/trending/tv/week" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

### Popular

#### GET /movie/popular

Returns a paginated list of currently popular movies.

**URL:** `https://api.themoviedb.org/3/movie/popular`

| Parameter  | In    | Type   | Required | Default | Description             |
| ---------- | ----- | ------ | -------- | ------- | ----------------------- |
| `language` | query | string | No       | `en-US` | ISO 639-1 language code |
| `page`     | query | int    | No       | `1`     | Page number (1–500)     |

**Response:** `PaginatedResponse<MovieListItem>`

```bash
curl -s "https://api.themoviedb.org/3/movie/popular?page=1" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

#### GET /tv/popular

Returns a paginated list of currently popular TV shows.

**URL:** `https://api.themoviedb.org/3/tv/popular`

| Parameter  | In    | Type   | Required | Default | Description             |
| ---------- | ----- | ------ | -------- | ------- | ----------------------- |
| `language` | query | string | No       | `en-US` | ISO 639-1 language code |
| `page`     | query | int    | No       | `1`     | Page number (1–500)     |

**Response:** `PaginatedResponse<TVShowListItem>`

```bash
curl -s "https://api.themoviedb.org/3/tv/popular?page=1" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

### Details

#### GET /movie/{id}

Returns full details for a single movie, including credits, videos, streaming availability, and release dates.

**URL:** `https://api.themoviedb.org/3/movie/{id}`

| Parameter            | In    | Type   | Required | Default | Description                                      |
| -------------------- | ----- | ------ | -------- | ------- | ------------------------------------------------ |
| `id`                 | path  | int    | Yes      | —       | TMDB movie ID                                    |
| `language`           | query | string | No       | `en-US` | ISO 639-1 language code                          |
| `append_to_response` | query | string | No       | —       | Comma-separated sub-requests (see note below)    |

The app requests `append_to_response=credits,videos,watch/providers,release_dates` to fetch all related data in a single call.

**Response:** `MovieDetail`

```bash
curl -s "https://api.themoviedb.org/3/movie/550?append_to_response=credits,videos,watch/providers,release_dates" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

#### GET /tv/{id}

Returns full details for a single TV show, including credits, videos, streaming availability, and content ratings.

**URL:** `https://api.themoviedb.org/3/tv/{id}`

| Parameter            | In    | Type   | Required | Default | Description                                      |
| -------------------- | ----- | ------ | -------- | ------- | ------------------------------------------------ |
| `id`                 | path  | int    | Yes      | —       | TMDB TV show ID                                  |
| `language`           | query | string | No       | `en-US` | ISO 639-1 language code                          |
| `append_to_response` | query | string | No       | —       | Comma-separated sub-requests (see note below)    |

The app requests `append_to_response=credits,videos,watch/providers,content_ratings` to fetch all related data in a single call.

**Response:** `TVShowDetail`

```bash
curl -s "https://api.themoviedb.org/3/tv/1396?append_to_response=credits,videos,watch/providers,content_ratings" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

### Recommendations

#### GET /movie/{id}/recommendations

Returns movies recommended based on a given movie.

**URL:** `https://api.themoviedb.org/3/movie/{id}/recommendations`

| Parameter  | In    | Type   | Required | Default | Description             |
| ---------- | ----- | ------ | -------- | ------- | ----------------------- |
| `id`       | path  | int    | Yes      | —       | TMDB movie ID           |
| `language` | query | string | No       | `en-US` | ISO 639-1 language code |
| `page`     | query | int    | No       | `1`     | Page number (1–500)     |

**Response:** `PaginatedResponse<MovieListItem>`

```bash
curl -s "https://api.themoviedb.org/3/movie/550/recommendations" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

#### GET /tv/{id}/recommendations

Returns TV shows recommended based on a given show.

**URL:** `https://api.themoviedb.org/3/tv/{id}/recommendations`

| Parameter  | In    | Type   | Required | Default | Description             |
| ---------- | ----- | ------ | -------- | ------- | ----------------------- |
| `id`       | path  | int    | Yes      | —       | TMDB TV show ID         |
| `language` | query | string | No       | `en-US` | ISO 639-1 language code |
| `page`     | query | int    | No       | `1`     | Page number (1–500)     |

**Response:** `PaginatedResponse<TVShowListItem>`

```bash
curl -s "https://api.themoviedb.org/3/tv/1396/recommendations" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

### Upcoming Releases

#### GET /movie/upcoming

Returns movies with upcoming theatrical release dates. Used for the release calendar.

**URL:** `https://api.themoviedb.org/3/movie/upcoming`

| Parameter  | In    | Type   | Required | Default | Description                                    |
| ---------- | ----- | ------ | -------- | ------- | ---------------------------------------------- |
| `language` | query | string | No       | `en-US` | ISO 639-1 language code                        |
| `page`     | query | int    | No       | `1`     | Page number (1–500)                            |
| `region`   | query | string | No       | —       | ISO 3166-1 code to filter by release region    |

**Response:** `PaginatedResponse<MovieListItem>`

The `region` parameter filters to theatrical releases in that region. Results include `release_date` for calendar display.

```bash
curl -s "https://api.themoviedb.org/3/movie/upcoming?region=US" \
  -H "Authorization: Bearer <TMDB_ACCESS_TOKEN>"
```

---

## External API References

- [TMDB API](https://developer.themoviedb.org/docs/getting-started)
- [OMDB API](https://www.omdbapi.com)
- [IMDB API](https://imdbapi.dev)
