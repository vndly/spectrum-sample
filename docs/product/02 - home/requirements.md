---
id: 02-home
title: Home Screen
status: released
importance: high
type: functional
tags: [home, search, api, details, movie, show, library, filter, view, grid, list]
---

## Intent

Enable users to search for movies and TV shows from the home screen and view comprehensive details about each title, including metadata, cast, trailer, streaming availability, and personal tracking features (rating, favorite, watch status). Also enhance the browse mode with filtering capabilities (genre, year, media type) and a layout toggle (grid vs. list view).

## Context & Background

### Problem Statement

Users need a way to find specific movies and TV shows by name. The home screen currently displays trending and popular content, but users cannot search for specific titles they want to add to their library. Once found, users need to see complete information about movies and TV shows to decide whether to watch them, view streaming availability, and track their personal viewing preferences.

Additionally, while browse mode provides trending and popular content, users need ways to narrow down these results to find specific genres or time periods. Some users also prefer a compact list view over a large grid for easier scanning.

### User Stories

- As a user, I want to search for movies and TV shows by title so that I can find specific content to add to my watchlist.
- As a user, I want to see search results as I type so that I can quickly find what I'm looking for without waiting.
- As a user, I want to see trending movies and shows so that I can keep up with what's popular today.
- As a user, I want to see popular movies and TV shows so that I can find highly-rated and well-known content.
- As a user, I want to easily return to browsing trending/popular content after searching so that I can discover new titles.
- As a user, I want to retry a failed search or browse section so that temporary network issues don't prevent me from finding content.
- As a user, I want to see complete information about a movie or TV show so that I can decide whether to watch it.
- As a user, I want to see where a title is available for streaming so that I can watch it on my preferred service.
- As a user, I want to rate movies and shows I've watched so that I can remember my opinions.
- As a user, I want to mark titles as favorites so that I can quickly find content I love.
- As a user, I want to add titles to my watchlist so that I can track what I plan to watch.
- As a user, I want to watch the official trailer inline so that I can preview the content.
- As a user, I want to share a title with friends so that I can recommend content I enjoy.
- As a user, I want to filter browse results by genre so that I can find content that matches my taste.
- As a user, I want to filter browse results by media type so that I can see only movies or only TV shows.
- As a user, I want to filter browse results by year range so that I can find newer or older content.
- As a user, I want to toggle between a grid and list view so that I can choose the layout that works best for me.
- As a user, I want my view preference to be saved so that the app opens in my preferred layout next time.
- As a user, I want to share my filtered results with others via a URL.

### Personas

- **Casual viewer**: Searches for specific movies they've heard about; wants quick access to streaming availability and trailers before deciding what to watch. Also browses trending content when unsure what to watch.
- **TV enthusiast**: Searches for TV shows by name to track episodes and keeps up with popular series.
- **Collector**: Rates and organizes watched content, uses favorites and watchlist extensively.
- **Social viewer**: Shares recommendations with friends via the share feature.

### Dependencies

- **R-01a (Scaffolding)**: Provides routing, SkeletonLoader, EmptyState, useToast, useModal, and ErrorBoundary composables.
- **Architecture**: Uses `append_to_response` API pattern per `docs/technical/api.md`.
- **Data Model**: Uses `LibraryEntry` schema for persisting user data per `docs/technical/data-model.md`.
- **TMDB API**: Provides genre definitions and content data.
- **useSettings**: For persisting user preferences like layout mode.

## Decisions

| Decision                | Choice                                          | Rationale                                                                                                                                  |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| API endpoint            | `/search/multi`                                 | Single request covers both movies and TV shows, reducing API calls compared to separate `/search/movie` and `/search/tv` requests          |
| Person result filtering | Client-side                                     | Simpler than calling two separate endpoints and merging results; `/search/multi` returns person results which are not relevant to this app |
| Debounce duration       | 300 ms                                          | Balances responsiveness with avoiding excessive API calls during typing                                                                    |
| Retry strategy          | 3 retries with exponential backoff (1s, 2s, 4s) | Per project API rate limit handling in `docs/technical/api.md`                                                                             |
| Detail API strategy     | Single call with `append_to_response`           | Fetches credits, videos, watch/providers, and release_dates in one request to minimize latency. Documented in `docs/technical/api.md`.     |
| Share implementation    | Web Share API with clipboard fallback           | Provides native sharing on supported devices without third-party dependencies. Falls back to clipboard copy with toast confirmation.       |
| Trailer embed           | YouTube iframe with privacy-enhanced mode       | Uses `youtube-nocookie.com` domain to reduce tracking. Only loads when user clicks play.                                                   |
| Rating storage          | localStorage via `LibraryEntry.rating`          | Consistent with local-first architecture. No backend required.                                                                             |
| Streaming region        | User's `Settings.preferredRegion`               | Uses ISO 3166-1 region code from settings to filter streaming providers.                                                                   |
| Media Type Injection    | Client-side during fetch                        | Popular/Trending endpoints in TMDB may lack consistent `media_type`. We inject it in the provider client for schema compatibility.         |
| Browse Layout           | Native CSS Snap-Scrolling                       | Used for the TrendingCarousel to provide a high-performance, native mobile feel without external libraries.                                |
| Filtering Strategy      | Client-side                                     | Trending/popular data sets are small enough (20-50 items) to filter in-memory without re-fetching, providing an instantaneous UI.          |
| Dataset Scope           | Currently Visible                               | Filtering applies only to the currently fetched dataset (e.g., the first page of trending/popular results).                                |
| Genre Resolution        | API-driven (TMDB)                               | Genre names are resolved via `/genre/movie/list` and `/genre/tv/list` to ensure accuracy and support localization.                         |
| URL Persistence         | Query Parameters                                | Using the URL query string allows users to share specific filtered views and maintains state on page refreshes.                            |
| Mode Interaction        | Search Resets Filter                            | When entering Search mode (typing in the search bar), active filters are cleared to avoid confusing "no results" states.                   |

## Scope

### In Scope

- SearchBar component with debounced input.
- API integration with `/search/multi`, `/trending/all/day`, `/movie/popular`, and `/tv/popular` endpoints.
- `TrendingCarousel` component displaying top 10 trending items with horizontal snap-scrolling.
- `PopularGrid` component for movies and TV shows.
- `useBrowse` application logic (composable) for fetching trending and popular data in parallel.
- Search results display as MovieCard grid.
- MovieCard component — reusable card displaying poster, title, year, and vote average for movies and TV shows. Supports a list variant.
- useSettings composable — provides `Settings.language` for API localization and persists layout mode.
- Client-side filtering to exclude person results.
- Loading skeleton during API requests and for browse sections.
- Empty state when no results found.
- Inline error message for API failures.
- Mode switching between browse and search states.
- Movie and TV show detail views at `/movie/:id` and `/show/:id`.
- Hero backdrop with gradient overlay and title.
- Metadata panel: year, runtime/seasons, genres, directors, writers, languages.
- Cast carousel with horizontally scrollable headshots and character names.
- Trailer embed playing official YouTube trailer inline.
- Streaming badges showing available providers for user's region.
- Rating stars (1-5 scale) persisted in localStorage.
- Favorite toggle persisted in localStorage.
- Watch status toggle (watchlist/watched/none) persisted in localStorage.
- IMDB link opening external IMDB page.
- Share button with Web Share API and clipboard fallback.
- Loading skeleton matching detail layout.
- Error handling with inline retry action.
- Box office data (budget and revenue) for movies.
- `FilterBar` component with genre multi-select, media type toggle, and year range inputs.
- `ViewToggle` component for switching between grid and list layouts.
- Domain-level filtering logic (AND-composition).
- URL query string synchronization for filters.

### Out of Scope

- Infinite scroll / pagination for browse sections (first page only per [API pagination strategy](../../technical/api.md#pagination-strategy)).
- Search history / recent searches.
- Voice search.
- Advanced filters within search (genre, year).
- Typeahead suggestions / autocomplete dropdown.
- Season/episode browser for TV shows.
- Full image gallery/lightbox.
- User reviews or comments.
- Social features (following, sharing activity).
- Collection/franchise navigation.
- Similar/recommended titles section (separate feature in roadmap).
- Server-side filtering (TMDB API filtering).
- Persistent custom lists (already in Roadmap 05).

## Functional Requirements

### Search & Browse Base

| ID    | Requirement             | Description                                                                                                                                                                                                                                                                                                                                                         | Priority |
| ----- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| HS-01 | Debounced Search Input  | The SearchBar component SHALL debounce user input by 300 ms before initiating an API request. Typing within the debounce window resets the timer.                                                                                                                                                                                                                   | P0       |
| HS-02 | Multi-Search API Call   | When the debounce timer fires with a non-empty query, the app SHALL call `GET /search/multi` with the trimmed query string and current `Settings.language`.                                                                                                                                                                                                         | P0       |
| HS-03 | Person Result Filtering | The app SHALL filter API results to include only items where `media_type === "movie"` or `media_type === "tv"`, discarding `"person"` results before rendering.                                                                                                                                                                                                     | P0       |
| HS-04 | Search Results Display  | Search results SHALL be displayed as MovieCard components in a responsive grid, showing poster, title, year, and vote average (displayed as rating badge per UI/UX spec) for each result.                                                                                                                                                                           | P0       |
| HS-05 | Result Navigation       | Tapping a MovieCard in search results SHALL navigate to `/movie/:id` for movies or `/show/:id` for TV shows, using the item's `id` from the API response.                                                                                                                                                                                                           | P0       |
| HS-06 | Empty State             | When the API returns zero results (after filtering), the app SHALL display an empty state message with heading "No results found" and subtitle "Try different keywords or check your spelling".                                                                                                                                                                     | P0       |
| HS-07 | Loading Skeleton        | While the API request is in flight, the app SHALL display 8 skeleton placeholders matching the MovieCard grid layout. The SearchBar SHALL remain interactive during loading (not disabled, keyboard navigation available).                                                                                                                                          | P0       |
| HS-08 | Error Handling          | If the API request fails (network error, server error, or rate limit after 3 retries with exponential backoff), the app SHALL display an inline error message "Failed to load search results" below the SearchBar with a "Retry" button. The error message SHALL NOT be a full-page error. Clicking Retry SHALL re-attempt the search with the current query value. | P0       |
| HS-09 | Browse Mode             | When the search query is empty, the home screen SHALL display the TrendingCarousel, PopularGrid, FilterBar, and ViewToggle sections (browse mode).                                                                                                                                                                                                                  | P0       |
| HS-10 | Search Mode             | When the user types a non-empty query into the SearchBar, the home screen SHALL hide the browse sections and display only the SearchResults grid below the SearchBar (search mode).                                                                                                                                                                                 | P0       |
| HS-11 | Mode Transition         | Clearing the search query (backspace to empty or clear button) SHALL restore the browse sections. There SHALL NOT be an intermediate state where both search results and browse sections are visible simultaneously.                                                                                                                                                | P0       |
| HB-01 | Trending Data Fetch     | The app SHALL fetch trending items (movies and TV shows) for the day from the TMDB `/trending/all/day` endpoint.                                                                                                                                                                                                                                                    | P0       |
| HB-02 | Popular Movies Fetch    | The app SHALL fetch popular movies from the TMDB `/movie/popular` endpoint.                                                                                                                                                                                                                                                                                         | P0       |
| HB-03 | Popular Shows Fetch     | The app SHALL fetch popular TV shows from the TMDB `/tv/popular` endpoint.                                                                                                                                                                                                                                                                                          | P0       |
| HB-04 | Trending Carousel       | The `TrendingCarousel` SHALL display up to 10 trending items in a horizontally scrollable carousel. Each item SHALL display its backdrop or poster and title.                                                                                                                                                                                                       | P0       |
| HB-05 | Popular Grid            | The `PopularGrid` SHALL display popular movies and shows in a responsive grid. By default, it SHALL show the first 20 items of each.                                                                                                                                                                                                                                | P0       |
| HB-06 | Browse Mode Display     | When `query` is empty in `home-screen.vue`, the browse sections (Trending and Popular) SHALL be visible.                                                                                                                                                                                                                                                            | P0       |
| HB-07 | Item Navigation         | Tapping any item in browse mode SHALL navigate to its detail screen (`/movie/:id` or `/show/:id`).                                                                                                                                                                                                                                                                  | P0       |
| HB-08 | Loading States          | Browse sections SHALL show appropriate skeleton loaders while data is being fetched.                                                                                                                                                                                                                                                                                | P0       |
| HB-09 | Error Handling          | If browse data fails to load, a retry option SHALL be provided for each section or the entire browse view.                                                                                                                                                                                                                                                          | P1       |

### Filtering & View Toggle

| ID    | Requirement            | Description                                                                                                                                                         | Priority |
| ----- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| HF-01 | Genre Multi-Select     | The `FilterBar` SHALL provide a way to select multiple genres. The list of genres SHALL be fetched from TMDB and cached for the session.                            | P0       |
| HF-02 | Media Type Toggle      | The `FilterBar` SHALL provide a toggle for media type (Movies, TV Shows, or All).                                                                                   | P0       |
| HF-03 | Year Range Inputs      | The `FilterBar` SHALL provide two numeric inputs for "From Year" and "To Year" to filter results within that range.                                                 | P1       |
| HF-04 | Composite Filtering    | Filters SHALL apply using AND logic: only results matching all active filters SHALL be displayed.                                                                   | P0       |
| HF-05 | Client-Side Filtering  | Filters SHALL apply to already-fetched data (trending and popular results) without re-fetching from the server.                                                     | P0       |
| HF-06 | Layout Toggle          | The `ViewToggle` SHALL switch the content layout between "Grid" (poster-focused cards) and "List" (compact rows with title and key metadata).                       | P0       |
| HF-07 | Preference Persistence | The layout preference (grid or list) SHALL be persisted in the user's settings.                                                                                     | P0       |
| HF-08 | URL Sync               | Active filter values (genres, media type, year range) SHALL be reflected in the URL query string. Changing filters SHALL update the URL without a full page reload. | P1       |
| HF-09 | Clear All Filters      | A "Clear All" action SHALL be provided to reset all filters. Filters SHALL also clear automatically when a new search is initiated.                                 | P0       |

### Entry Details

| ID    | Requirement      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Priority |
| ----- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| ED-01 | Hero Backdrop    | The `HeroBackdrop` component SHALL display the backdrop image (`backdrop_path`) with a gradient overlay from transparent to the page background color. The movie/show title SHALL be overlaid on the image with sufficient contrast for readability. If no backdrop is available, a solid dark gradient matching the app background SHALL be displayed.                                                                                                                                         | P0       |
| ED-02 | Metadata Panel   | The `MetadataPanel` component SHALL display: (a) release year extracted from `release_date` or `first_air_date`, (b) runtime in hours and minutes for movies or season/episode count for TV shows, (c) genres as comma-separated list, (d) directors extracted from `credits.crew` where `job === "Director"`, (e) writers extracted from `credits.crew` where `department === "Writing"`, (f) spoken languages as comma-separated list. Missing data SHALL be omitted, not displayed as empty. | P0       |
| ED-03 | Cast Carousel    | The `CastCarousel` component SHALL render a horizontally scrollable list of cast members from `credits.cast`, sorted by `order` (billing order). Each cast item SHALL display: profile headshot (or placeholder icon if `profile_path` is null), actor name, and character name. The carousel SHALL display up to 20 cast members.                                                                                                                                                              | P0       |
| ED-04 | Trailer Embed    | The `TrailerEmbed` component SHALL display a play button over a thumbnail. When clicked, it SHALL embed the official YouTube trailer using the first video from `videos.results` where `type === "Trailer"` and `site === "YouTube"`. If no trailer is available, the component SHALL NOT be rendered. The embed SHALL use privacy-enhanced mode (`youtube-nocookie.com`).                                                                                                                      | P0       |
| ED-05 | Streaming Badges | The `StreamingBadges` component SHALL display available streaming providers from `watch/providers.results[region].flatrate`, where `region` matches `Settings.preferredRegion`. Each badge SHALL display the provider logo. If no streaming providers are available for the region, the component SHALL display "Not available for streaming" text.                                                                                                                                             | P0       |
| ED-06 | Rating Stars     | The `RatingStars` component SHALL allow the user to set a 0-5 star personal rating (0 means unrated). The rating SHALL be persisted in localStorage via `LibraryEntry.rating`. Hovering over stars SHALL preview the selection. Clicking a star SHALL confirm the rating. Clicking the same star again SHALL clear the rating (set to 0).                                                                                                                                                       | P0       |
| ED-07 | Favorite Toggle  | A favorite button SHALL toggle the `LibraryEntry.favorite` boolean in localStorage. The button SHALL display a filled heart icon when favorited and an outline heart icon when not favorited.                                                                                                                                                                                                                                                                                                   | P0       |
| ED-08 | Watch Status     | A watch status control SHALL allow the user to set `LibraryEntry.status` to one of: `watchlist`, `watched`, or `none`. The control SHALL provide separate buttons for each state (not a cycling control). Clicking a button sets that status; clicking the active status button clears it to `none`.                                                                                                                                                                                            | P0       |
| ED-09 | IMDB Link        | If `imdb_id` is present, an IMDB button/link SHALL open `https://www.imdb.com/title/{imdb_id}` in a new tab. If `imdb_id` is null, the IMDB link SHALL NOT be rendered.                                                                                                                                                                                                                                                                                                                         | P0       |
| ED-10 | Share Button     | A share button SHALL invoke the Web Share API with the entry title and URL (`/movie/:id` or `/show/:id`). If the Web Share API is not available, clicking SHALL copy the URL to the clipboard and display a success toast "Link copied to clipboard".                                                                                                                                                                                                                                           | P0       |
| ED-11 | Loading Skeleton | While the API request is in flight, the view SHALL display a skeleton matching the detail layout: backdrop placeholder, metadata text lines, cast headshot circles, and action button placeholders.                                                                                                                                                                                                                                                                                             | P0       |
| ED-12 | Error Handling   | If the API request fails (network error, 404, or server error), the view SHALL display an inline error message with a "Retry" button. Clicking Retry SHALL re-attempt the API call. A 404 response SHALL display "Not found" with a link back to Home.                                                                                                                                                                                                                                          | P0       |
| ED-13 | TMDB Rating      | The TMDB community rating (`vote_average`) SHALL be displayed as a badge, formatted to one decimal place (e.g., "8.4").                                                                                                                                                                                                                                                                                                                                                                         | P1       |
| ED-14 | Tagline          | If `tagline` is present and non-empty, it SHALL be displayed below the title in the hero area.                                                                                                                                                                                                                                                                                                                                                                                                  | P2       |
| ED-15 | Synopsis         | The `overview` text SHALL be displayed in full below the metadata panel. If `overview` is empty, the synopsis section SHALL NOT be rendered.                                                                                                                                                                                                                                                                                                                                                    | P0       |
| ED-16 | Box Office Data  | For movies, the `BoxOffice` component SHALL display budget and revenue from the API response. Values SHALL be formatted as currency (e.g., "$200,000,000"). If both `budget` and `revenue` are 0 or unavailable, the section SHALL NOT be rendered. This component is only displayed for movies, not TV shows.                                                                                                                                                                                  | P1       |

## Non-Functional Requirements

### Performance

| ID        | Requirement             | Threshold                                                                                                                                                                  |
| --------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HS-NFR-01 | API Response Time       | Search API call SHALL complete and render results within 1000 ms (excluding debounce delay). Measured from request initiation to UI render on a stable network connection. |
| HS-NFR-02 | Debounce Implementation | Debounce implementation uses a 300 ms timeout (±50 ms variance acceptable due to browser scheduling)                                                                       |
| HF-NFR-01 | Filter Performance      | Client-side filtering SHALL be instantaneous (no perceived delay for the user).                                                                                            |
| ED-NFR-01 | Detail API Response     | Detail API call SHALL complete and render initial content within 1500 ms.                                                                                                  |
| ED-NFR-02 | Trailer Load            | Trailer iframe SHALL only load after user interaction (click), not on initial page load.                                                                                   |
| ED-NFR-03 | Image Lazy Loading      | Cast headshots and secondary images SHALL use `loading="lazy"`. Hero backdrop SHALL load eagerly.                                                                          |

### UI/UX Specs

- `FilterBar` SHALL be compact and sticky below the `SearchBar` when scrolling on desktop.
- `ViewToggle` SHALL be positioned to the right of the `FilterBar`.
- Transitions between Grid and List views SHALL be smooth (CSS transitions).
- `TrendingCarousel` uses native CSS Snap-Scrolling for a high-performance, mobile-native feel.

### Responsive Design

| ID        | Requirement            | Threshold                                                                                                                              |
| --------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| HS-NFR-03 | Grid Columns (Desktop) | 5-6 columns on wide desktop (base), 4-5 columns below 1280px, 3-4 columns below 1024px, 2-3 columns below 768px, 2 columns below 640px |
| HS-NFR-04 | SearchBar Width        | Full width of the content area on all breakpoints                                                                                      |
| HS-NFR-05 | Touch Targets          | At least 44x44px on mobile                                                                                                             |
| ED-NFR-04 | Mobile Layout          | On screens below `md` breakpoint, the layout SHALL stack vertically: hero, metadata, actions, cast, trailer, streaming.                |
| ED-NFR-05 | Desktop Layout         | On screens `md` and above, metadata and actions MAY be displayed in a two-column layout alongside the poster.                          |
| ED-NFR-06 | Touch Targets          | All interactive elements (buttons, stars, carousel items) SHALL be at least 44x44px on mobile.                                         |

### Accessibility

| ID        | Requirement     | Threshold                                                                                                       |
| --------- | --------------- | --------------------------------------------------------------------------------------------------------------- |
| HS-NFR-06 | SearchBar Input | `type="search"` and `placeholder` attributes present                                                            |
| HS-NFR-07 | Clear Button    | Keyboard accessible with `aria-label="Clear search"`                                                            |
| HS-NFR-08 | Loading State   | Does not prevent keyboard navigation away from the SearchBar (Tab, Escape functional)                           |
| ED-NFR-07 | Star Rating     | Rating stars SHALL be keyboard navigable using arrow keys. Current rating SHALL be announced to screen readers. |
| ED-NFR-08 | Share Button    | Share button SHALL have `aria-label="Share"`.                                                                   |
| ED-NFR-09 | External Links  | IMDB link SHALL have `rel="noopener noreferrer"` and indicate it opens in a new tab.                            |

## Constraints

- API rate limit: approximately 40 requests per 10 seconds; debounce mitigates this for rapid typing; `append_to_response` combines multiple data types in one call
- First page only: per project pagination strategy, only the first 20 results are displayed
- Language parameter: search query goes to API with `Settings.language` for localized results
- YouTube embed privacy: Use `youtube-nocookie.com` to comply with privacy best practices
- localStorage quota: `LibraryEntry` data is small; quota is not a concern for typical usage
- Region availability: Streaming providers vary by region; users without a configured region see no streaming badges until they set `Settings.preferredRegion`

## Risks & Assumptions

### Risks

- **TMDB Genre Mismatch**: Movie and TV genre IDs overlap but have different names (e.g., ID 28 is Action for movies, but TV has "Action & Adventure" ID 10759). _Mitigation_: The domain filtering logic must handle both lists and merge them correctly in the UI.
- **Large Datasets**: Although we only fetch 20 items, if pagination is added later, client-side filtering might become a bottleneck. _Mitigation_: Keeping the scope to "currently visible" items for now.
- **Excessive API calls during typing**: 300 ms debounce reduces calls; exponential backoff handles 429 responses.
- **Missing streaming data for user's region**: User sees "Not available"; Mitigation: Link to settings to change region.

### Assumptions

- Users want to filter the browse results (trending/popular) rather than just searching.
- A year range filter is more useful than a single year picker for discovery.
- The `/search/multi` endpoint is stable and returns consistent `media_type` field values.
- `append_to_response` parameter reliably returns all requested relations in a single API call.

## Acceptance Criteria

- [x] SearchBar debounces input by 300 ms before firing an API request (HS-01)
- [x] Results are filtered to `media_type === "movie"` or `media_type === "tv"` (HS-03)
- [x] Empty state displays heading and subtitle when query returns zero results (HS-06)
- [x] Browse sections (TrendingCarousel, PopularGrid, FilterBar, ViewToggle) display when query is empty (HS-09)
- [x] Browse sections hide and SearchResults display when query is non-empty (HS-10)
- [x] `HeroBackdrop` displays the backdrop image with gradient overlay and title text (ED-01)
- [x] `MetadataPanel` shows year, runtime/seasons, genres, directors, writers, and spoken languages (ED-02)
- [x] `CastCarousel` renders horizontally scrollable list of cast members (ED-03)
- [x] `TrailerEmbed` plays the official YouTube trailer inline when clicked (ED-04)
- [x] `StreamingBadges` displays provider logos for user's region (ED-05)
- [x] `RatingStars` allows setting 0-5 star rating persisted in localStorage (ED-06)
- [x] Favorite toggle persists state in localStorage (ED-07)
- [x] Watch status toggle (watchlist/watched/none) persists in localStorage (ED-08)
- [x] IMDB link opens correct IMDB page using `imdb_id` (ED-09)
- [x] Share button uses Web Share API when supported or falls back to clipboard (ED-10)
- [x] Box office data displays budget and revenue formatted as currency for movies (ED-16)
- [x] `FilterBar` allows selecting genres, media type, and year range.
- [x] Filtering results updates the view in real-time for the currently visible items.
- [x] `ViewToggle` switches between grid and list layouts.
- [x] Layout preference persists across page reloads via `useSettings`.
- [x] Filters are reflected in and restored from the URL.
- [x] Entering a search query resets the browse filters.
