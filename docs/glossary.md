# Glossary

Domain terminology used consistently across the codebase and documentation.

---

## Content

| Term | Definition | Notes |
| :--- | :--- | :--- |
| **Entry** | A movie or TV show — the generic term for any piece of content in the app. | Use "entry" when referring to content regardless of type. Use "movie" or "TV show" only when the distinction matters. |
| **Movie** | A film. Identified by `mediaType: "movie"`. | API field: `media_type: "movie"`. Uses `title` and `release_date`. |
| **TV Show** | A television series. Identified by `mediaType: "tv"`. | API field: `media_type: "tv"`. Uses `name` and `first_air_date` (not `title` / `release_date`). |
| **Media Type** | The content kind: `"movie"` or `"tv"`. | Stored on `LibraryEntry.mediaType`. Returned by the API as `media_type` in multi-search results. |
| **Genre** | A media provider category such as "Action" or "Comedy", identified by numeric ID. | List endpoints return `genre_ids: number[]`; detail endpoints return full `Genre` objects with `id` and `name`. |
| **Collection** | A media provider grouping of related movies (e.g., a franchise). | Only applies to movies. Found in `MovieDetail.belongs_to_collection`. |
| **Episode** | A single installment of a TV show, belonging to a season. | Relevant in `ShowDetail.next_episode_to_air`. |

---

## User Library

| Term | Definition | Notes |
| :--- | :--- | :--- |
| **Library** | The user's personal collection of saved entries. Contains all entries the user has explicitly saved, regardless of watch status. | Stored in `localStorage` under the `library` key. Not a media provider concept — purely local. |
| **Library Entry** | A saved record in the user's library, holding status, rating, tags, notes, and watch dates for a single entry. | Type: `LibraryEntry`. Keyed by provider ID in localStorage. |
| **Watch Status** | The state of a library entry: `"watchlist"`, `"watched"`, or `"none"`. | Field: `LibraryEntry.status`. Determines which tab the entry appears under in the Library screen. `"none"` entries remain in the library but do not appear in the Watchlist or Watched tabs — they are accessible via the entry's detail screen or by searching. |
| **Watchlist** | Entries the user plans to watch. | `status: "watchlist"`. Displayed in the Library's "Watchlist" tab. |
| **Watched** | Entries the user has already seen. | `status: "watched"`. Displayed in the Library's "Watched" tab. |
| **Rating** | The user's 1–5 star score for an entry. `0` means unrated. | Field: `LibraryEntry.rating`. Not the same as the media provider's `vote_average` (0–10 scale). |
| **Favorite** | A boolean flag on a library entry for quick-access filtering. | Field: `LibraryEntry.favorite`. |
| **Custom List** | A user-created named grouping of library entries. | Type: `CustomList`. Keyed by UUID. Membership is tracked on the entry side via `LibraryEntry.lists`. |
| **Tag** | A user-defined label attached to library entries (e.g., "horror", "90s"). | Field: `LibraryEntry.tags`. A global `tags` array in localStorage tracks all known tags. |
| **Watch Date** | An ISO date recording when the user watched an entry. Supports multiple dates for rewatches. | Field: `LibraryEntry.watchDates`. Array of ISO date strings. |
| **Notes** | Free-text user commentary on a library entry. | Field: `LibraryEntry.notes`. |

---

## Discovery

| Term | Definition | Notes |
| :--- | :--- | :--- |
| **Search** | Multi-search across movies and TV shows via the media provider's `/search/multi` endpoint. | Returns both movie and TV results; `"person"` results are discarded. |
| **Trending** | Entries currently gaining popularity, fetched from the media provider's trending endpoints. | Configurable time window: `"day"` or `"week"`. Displayed in the Home screen's trending carousel. |
| **Popular** | Entries with high overall popularity scores, fetched from the media provider's popular endpoints. | Displayed in the Home screen's popular grid. |
| **Recommendations** | Entries suggested by the media provider based on similarity to a given entry. | Endpoint: `/movie/{id}/recommendations` or `/tv/{id}/recommendations`. Powers the Recommendations screen. The app fetches recommendations from multiple seed entries (up to 5, highest-rated first) and deduplicates results; see [Data Model](./technical/data-model.md) for aggregation logic. |
| **Release Calendar** | A calendar view of upcoming movie theatrical releases. | Data source: the media provider's `/movie/upcoming` endpoint, filterable by region. |
| **Upcoming** | Movies with future theatrical release dates, as reported by the media provider. | Synonym for the data behind the Release Calendar. |

---

## Architecture

| Term | Definition | Notes |
| :--- | :--- | :--- |
| **Presentation Layer** | Layer 1 — Vue SFCs, views, and router. Renders UI and emits events. | Imports Application layer only. Never touches Infrastructure or Domain directly. |
| **Application Layer** | Layer 2 — Vue composables orchestrating Domain and Infrastructure. Exposes reactive state to Presentation. | The only public API for data access. |
| **Domain Layer** | Layer 3 — Zod schemas, TypeScript types, and pure business logic. Zero framework dependencies. | Importable by Application and Infrastructure. Has no app imports of its own. |
| **Infrastructure Layer** | Layer 4 — Media provider API client and localStorage wrapper. Plain TypeScript with no Vue dependencies. | Imports Domain only. |
| **Composable** | A `use`-prefixed function in the Application layer that wraps Infrastructure calls with Vue reactivity. | Examples: `useMovie()`, `useLibrary()`, `useSearch()`. |
| **Standard Return Shape** | The consistent interface every composable exposes: `{ data, loading, error, refresh? }`. | Presentation components rely on this contract. |
| **App Shell** | The root layout component: sidebar navigation on desktop, bottom navigation bar on mobile, plus the router outlet. | Component: `AppShell`. |
| **Error Boundary** | A global catch-all that renders a "Something went wrong" fallback when an unhandled error occurs. | Wraps the App Shell in `App.vue`. |
| **HMR** | Hot Module Replacement — a Vite development feature that applies code changes in the browser instantly without a full page reload, preserving application state. | Enabled automatically by `vite dev`. Not present in production builds. |
| **SPA** | Single Page Application — a web app that loads a single HTML page and dynamically updates content via client-side routing, avoiding full page reloads. | The app is deployed as an SPA. Firebase/hosting config uses SPA rewrite rules to direct all routes to `index.html`. |

---

## UI Components

| Term | Definition | Notes |
| :--- | :--- | :--- |
| **Movie Card** | The primary card component displaying a poster, title, year, and rating badge. Used across Home, Recommendations, Library, and search results. | Component: `MovieCard`. Poster aspect ratio is 2:3. |
| **Hero Banner** | A full-width backdrop image with title overlay, used in the trending carousel on the Home screen. | Includes gradient overlay, "Watchlist +" button, and dot pagination. |
| **Entry Details** | The detail view for a single movie or TV show, showing full metadata, cast, trailer, and streaming availability. | Route: `/movie/:id` or `/show/:id`. |
| **Tab Toggle** | Horizontal text tabs for switching between content categories (e.g., Watchlist / Watched / Lists). | Active tab: white with underline. Inactive: muted gray. |
| **Skeleton Loader** | A shimmer placeholder matching the exact layout shape of content being loaded. | Used instead of spinners. Animated with `animate-pulse` or custom shimmer. |
| **Toast** | A small, non-blocking notification in the top-right corner. Auto-dismisses after ~4 seconds. | Types: error (red), success (green), info (teal). Includes "Retry" on API failures. |
| **View Toggle** | A toggle control for switching between grid view (poster cards) and list view (compact rows). | Used on the Home screen. Preference persists in localStorage. |
| **Filter Bar** | A row of controls for narrowing displayed entries by criteria (genre, year, etc.). | Used on Home and Library screens. |
| **Sort Dropdown** | A control for changing the order of displayed entries (e.g., by popularity, date added). | Used on the Library screen. |
| **CTA** | Call To Action — a UI element (typically a button or link) that prompts the user to take a specific action (e.g., "Add to Watchlist", "Try searching"). | Used in empty states, hero banners, and detail screens. Styled as a primary teal button. |

---

## Data & API

| Term | Definition | Notes |
| :--- | :--- | :--- |
| **Media Provider** | The external REST API providing all movie and TV show metadata, images, and discovery data. | See [API](./technical/api.md) for provider-specific details. |
| **Bearer Token** | The media provider API read access token, passed via `Authorization: Bearer <token>`. | Obtained from the media provider's developer dashboard. Stored in environment config, never in localStorage. |
| **Paginated Response** | The media provider's standard list wrapper: `{ page, results, total_pages, total_results }`. | Type: `PaginatedResponse<T>`. Returned by search, trending, popular, recommendations, and upcoming endpoints. |
| **append_to_response** | A media provider API query parameter that fetches related data (credits, videos, providers) in a single API call instead of separate requests. | Used on detail endpoints. Value: comma-separated list (e.g., `credits,videos,watch/providers`). |
| **Cast Member** | An actor/actress in a movie or show, with character name and billing order. | Type: `CastMember`. Found in `credits.cast`. |
| **Crew Member** | A production team member such as a director or writer. | Type: `CrewMember`. Found in `credits.crew`. |
| **Streaming Provider** | A service where a title is available to stream, rent, or buy (e.g., Netflix, Apple TV+). | Type: `StreamingProvider`. Found in `watch/providers` response, grouped by `flatrate`, `rent`, `buy`. |
| **Content Rating** | An age/content classification for a TV show (e.g., "TV-MA", "TV-14"). | Type: `ContentRating`. Movies use `certification` from `release_dates` instead. |
| **Certification** | An age/content classification for a movie (e.g., "PG-13", "R"). | Found in `release_dates.results[].release_dates[].certification`. TV shows use Content Rating instead. |
| **Vote Average** | The media provider's community rating on a 0–10 scale. | Field: `vote_average`. Not the same as the user's 1–5 star Rating. |
| **Genre List** | The media provider endpoint that returns the full set of genre IDs and display names for a media type. | Endpoints: `/genre/movie/list` and `/genre/tv/list`. Used to resolve `genre_ids` (numeric) from list endpoints into human-readable genre names for the Filter Bar. Response type: `GenreListResponse`. |

---

## Storage & Infrastructure

| Term | Definition | Notes |
| :--- | :--- | :--- |
| **localStorage** | The browser storage mechanism where all user data persists. No backend or server-side storage. | All access goes through `storage.service.ts`. Raw `localStorage` calls outside the service are prohibited. |
| **Schema Version** | An integer tracking breaking changes in the localStorage data shape. | Field: `schemaVersion` in the top-level localStorage object. Incremented on breaking changes. |
| **Schema Migration** | The process of transforming old localStorage data to match a new schema version on app startup. | Handled by `storage.service.ts`. |
| **Zod Schema** | A runtime validation definition that also infers the corresponding TypeScript type via `z.infer<>`. | Used at every data boundary: API responses, localStorage reads, and user input. |
| **Settings** | User preferences stored in localStorage: theme, language, default home section, and preferred region. | Type: `Settings`. Defaults applied if missing keys are detected during Zod validation. |
