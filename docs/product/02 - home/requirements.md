---
id: 02-home
title: Home Screen
status: released
importance: high
type: functional
tags: [home, search, api, details, movie, show, library]
---

## Intent

Enable users to search for movies and TV shows from the home screen and view comprehensive details about each title, including metadata, cast, trailer, streaming availability, and personal tracking features (rating, favorite, watch status).

## Context & Background

### Problem Statement

Users need a way to find specific movies and TV shows by name. The home screen currently displays trending and popular content, but users cannot search for specific titles they want to add to their library. Once found, users need to see complete information about movies and TV shows to decide whether to watch them, view streaming availability, and track their personal viewing preferences.

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

### Personas

- **Casual viewer**: Searches for specific movies they've heard about; wants quick access to streaming availability and trailers before deciding what to watch. Also browses trending content when unsure what to watch.
- **TV enthusiast**: Searches for TV shows by name to track episodes and keeps up with popular series.
- **Collector**: Rates and organizes watched content, uses favorites and watchlist extensively.
- **Social viewer**: Shares recommendations with friends via the share feature.

### Dependencies

- **R-01a (Scaffolding)**: Provides routing, SkeletonLoader, EmptyState, useToast, useModal, and ErrorBoundary composables.
- **Architecture**: Uses `append_to_response` API pattern per `docs/technical/api.md`.
- **Data Model**: Uses `LibraryEntry` schema for persisting user data per `docs/technical/data-model.md`.

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

## Scope

### In Scope

- SearchBar component with debounced input.
- API integration with `/search/multi`, `/trending/all/day`, `/movie/popular`, and `/tv/popular` endpoints.
- `TrendingCarousel` component displaying top 10 trending items with horizontal snap-scrolling.
- `PopularGrid` component for movies and TV shows.
- `useBrowse` application logic (composable) for fetching trending and popular data in parallel.
- Search results display as MovieCard grid.
- MovieCard component — reusable card displaying poster, title, year, and vote average for movies and TV shows.
- useSettings composable — provides `Settings.language` for API localization.
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

## Functional Requirements

| ID    | Requirement             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Priority |
| ----- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| HS-01 | Debounced Search Input  | The SearchBar component SHALL debounce user input by 300 ms before initiating an API request. Typing within the debounce window resets the timer.                                                                                                                                                                                                                                                                                                                                               | P0       |
| HS-02 | Multi-Search API Call   | When the debounce timer fires with a non-empty query, the app SHALL call `GET /search/multi` with the trimmed query string and current `Settings.language`.                                                                                                                                                                                                                                                                                                                                     | P0       |
| HS-03 | Person Result Filtering | The app SHALL filter API results to include only items where `media_type === "movie"` or `media_type === "tv"`, discarding `"person"` results before rendering.                                                                                                                                                                                                                                                                                                                                 | P0       |
| HS-04 | Search Results Display  | Search results SHALL be displayed as MovieCard components in a responsive grid, showing poster, title, year, and vote average (displayed as rating badge per UI/UX spec) for each result.                                                                                                                                                                                                                                                                                                       | P0       |
| HS-05 | Result Navigation       | Tapping a MovieCard in search results SHALL navigate to `/movie/:id` for movies or `/show/:id` for TV shows, using the item's `id` from the API response.                                                                                                                                                                                                                                                                                                                                       | P0       |
| HS-06 | Empty State             | When the API returns zero results (after filtering), the app SHALL display an empty state message with heading "No results found" and subtitle "Try different keywords or check your spelling".                                                                                                                                                                                                                                                                                                 | P0       |
| HS-07 | Loading Skeleton        | While the API request is in flight, the app SHALL display 8 skeleton placeholders matching the MovieCard grid layout. The SearchBar SHALL remain interactive during loading (not disabled, keyboard navigation available).                                                                                                                                                                                                                                                                      | P0       |
| HS-08 | Error Handling          | If the API request fails (network error, server error, or rate limit after 3 retries with exponential backoff), the app SHALL display an inline error message "Failed to load search results" below the SearchBar with a "Retry" button. The error message SHALL NOT be a full-page error. Clicking Retry SHALL re-attempt the search with the current query value.                                                                                                                             | P0       |
| HS-09 | Browse Mode             | When the search query is empty, the home screen SHALL display the TrendingCarousel, PopularGrid, FilterBar, and ViewToggle sections (browse mode).                                                                                                                                                                                                                                                                                                                                              | P0       |
| HS-10 | Search Mode             | When the user types a non-empty query into the SearchBar, the home screen SHALL hide the browse sections and display only the SearchResults grid below the SearchBar (search mode).                                                                                                                                                                                                                                                                                                             | P0       |
| HS-11 | Mode Transition         | Clearing the search query (backspace to empty or clear button) SHALL restore the browse sections. There SHALL NOT be an intermediate state where both search results and browse sections are visible simultaneously.                                                                                                                                                                                                                                                                            | P0       |
| HB-01 | Trending Data Fetch     | The app SHALL fetch trending items (movies and TV shows) for the day from the TMDB `/trending/all/day` endpoint.                                                                                                                                                                                                                                                                                                                                                                                | P0       |
| HB-02 | Popular Movies Fetch    | The app SHALL fetch popular movies from the TMDB `/movie/popular` endpoint.                                                                                                                                                                                                                                                                                                                                                                                                                     | P0       |
| HB-03 | Popular Shows Fetch     | The app SHALL fetch popular TV shows from the TMDB `/tv/popular` endpoint.                                                                                                                                                                                                                                                                                                                                                                                                                      | P0       |
| HB-04 | Trending Carousel       | The `TrendingCarousel` SHALL display up to 10 trending items in a horizontally scrollable carousel. Each item SHALL display its backdrop or poster and title.                                                                                                                                                                                                                                                                                                                                   | P0       |
| HB-05 | Popular Grid            | The `PopularGrid` SHALL display popular movies and shows in a responsive grid. By default, it SHALL show the first 20 items of each.                                                                                                                                                                                                                                                                                                                                                            | P0       |
| HB-06 | Browse Mode Display     | When `query` is empty in `home-screen.vue`, the browse sections (Trending and Popular) SHALL be visible.                                                                                                                                                                                                                                                                                                                                                                                        | P0       |
| HB-07 | Item Navigation         | Tapping any item in browse mode SHALL navigate to its detail screen (`/movie/:id` or `/show/:id`).                                                                                                                                                                                                                                                                                                                                                                                              | P0       |
| HB-08 | Loading States          | Browse sections SHALL show appropriate skeleton loaders while data is being fetched.                                                                                                                                                                                                                                                                                                                                                                                                            | P0       |
| HB-09 | Error Handling          | If browse data fails to load, a retry option SHALL be provided for each section or the entire browse view.                                                                                                                                                                                                                                                                                                                                                                                      | P1       |
| ED-01 | Hero Backdrop           | The `HeroBackdrop` component SHALL display the backdrop image (`backdrop_path`) with a gradient overlay from transparent to the page background color. The movie/show title SHALL be overlaid on the image with sufficient contrast for readability. If no backdrop is available, a solid dark gradient matching the app background SHALL be displayed.                                                                                                                                         | P0       |
| ED-02 | Metadata Panel          | The `MetadataPanel` component SHALL display: (a) release year extracted from `release_date` or `first_air_date`, (b) runtime in hours and minutes for movies or season/episode count for TV shows, (c) genres as comma-separated list, (d) directors extracted from `credits.crew` where `job === "Director"`, (e) writers extracted from `credits.crew` where `department === "Writing"`, (f) spoken languages as comma-separated list. Missing data SHALL be omitted, not displayed as empty. | P0       |
| ED-03 | Cast Carousel           | The `CastCarousel` component SHALL render a horizontally scrollable list of cast members from `credits.cast`, sorted by `order` (billing order). Each cast item SHALL display: profile headshot (or placeholder icon if `profile_path` is null), actor name, and character name. The carousel SHALL display up to 20 cast members.                                                                                                                                                              | P0       |
| ED-04 | Trailer Embed           | The `TrailerEmbed` component SHALL display a play button over a thumbnail. When clicked, it SHALL embed the official YouTube trailer using the first video from `videos.results` where `type === "Trailer"` and `site === "YouTube"`. If no trailer is available, the component SHALL NOT be rendered. The embed SHALL use privacy-enhanced mode (`youtube-nocookie.com`).                                                                                                                      | P0       |
| ED-05 | Streaming Badges        | The `StreamingBadges` component SHALL display available streaming providers from `watch/providers.results[region].flatrate`, where `region` matches `Settings.preferredRegion`. Each badge SHALL display the provider logo. If no streaming providers are available for the region, the component SHALL display "Not available for streaming" text.                                                                                                                                             | P0       |
| ED-06 | Rating Stars            | The `RatingStars` component SHALL allow the user to set a 0-5 star personal rating (0 means unrated). The rating SHALL be persisted in localStorage via `LibraryEntry.rating`. Hovering over stars SHALL preview the selection. Clicking a star SHALL confirm the rating. Clicking the same star again SHALL clear the rating (set to 0).                                                                                                                                                       | P0       |
| ED-07 | Favorite Toggle         | A favorite button SHALL toggle the `LibraryEntry.favorite` boolean in localStorage. The button SHALL display a filled heart icon when favorited and an outline heart icon when not favorited.                                                                                                                                                                                                                                                                                                   | P0       |
| ED-08 | Watch Status            | A watch status control SHALL allow the user to set `LibraryEntry.status` to one of: `watchlist`, `watched`, or `none`. The control SHALL provide separate buttons for each state (not a cycling control). Clicking a button sets that status; clicking the active status button clears it to `none`.                                                                                                                                                                                            | P0       |
| ED-09 | IMDB Link               | If `imdb_id` is present, an IMDB button/link SHALL open `https://www.imdb.com/title/{imdb_id}` in a new tab. If `imdb_id` is null, the IMDB link SHALL NOT be rendered.                                                                                                                                                                                                                                                                                                                         | P0       |
| ED-10 | Share Button            | A share button SHALL invoke the Web Share API with the entry title and URL (`/movie/:id` or `/show/:id`). If the Web Share API is not available, clicking SHALL copy the URL to the clipboard and display a success toast "Link copied to clipboard".                                                                                                                                                                                                                                           | P0       |
| ED-11 | Loading Skeleton        | While the API request is in flight, the view SHALL display a skeleton matching the detail layout: backdrop placeholder, metadata text lines, cast headshot circles, and action button placeholders.                                                                                                                                                                                                                                                                                             | P0       |
| ED-12 | Error Handling          | If the API request fails (network error, 404, or server error), the view SHALL display an inline error message with a "Retry" button. Clicking Retry SHALL re-attempt the API call. A 404 response SHALL display "Not found" with a link back to Home.                                                                                                                                                                                                                                          | P0       |
| ED-13 | TMDB Rating             | The TMDB community rating (`vote_average`) SHALL be displayed as a badge, formatted to one decimal place (e.g., "8.4").                                                                                                                                                                                                                                                                                                                                                                         | P1       |
| ED-14 | Tagline                 | If `tagline` is present and non-empty, it SHALL be displayed below the title in the hero area.                                                                                                                                                                                                                                                                                                                                                                                                  | P2       |
| ED-15 | Synopsis                | The `overview` text SHALL be displayed in full below the metadata panel. If `overview` is empty, the synopsis section SHALL NOT be rendered.                                                                                                                                                                                                                                                                                                                                                    | P0       |
| ED-16 | Box Office Data         | For movies, the `BoxOffice` component SHALL display budget and revenue from the API response. Values SHALL be formatted as currency (e.g., "$200,000,000"). If both `budget` and `revenue` are 0 or unavailable, the section SHALL NOT be rendered. This component is only displayed for movies, not TV shows.                                                                                                                                                                                  | P1       |

## Non-Functional Requirements

### Performance

| ID        | Requirement             | Threshold                                                                                                                                                                  |
| --------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HS-NFR-01 | API Response Time       | Search API call SHALL complete and render results within 1000 ms (excluding debounce delay). Measured from request initiation to UI render on a stable network connection. |
| HS-NFR-02 | Debounce Implementation | Debounce implementation uses a 300 ms timeout (±50 ms variance acceptable due to browser scheduling)                                                                       |
| ED-NFR-01 | Detail API Response     | Detail API call SHALL complete and render initial content within 1500 ms.                                                                                                  |
| ED-NFR-02 | Trailer Load            | Trailer iframe SHALL only load after user interaction (click), not on initial page load.                                                                                   |
| ED-NFR-03 | Image Lazy Loading      | Cast headshots and secondary images SHALL use `loading="lazy"`. Hero backdrop SHALL load eagerly.                                                                          |

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

## UI/UX Specs

### SearchBar Component

- Full-width input field at the top of the home screen content area
- Placeholder text: "Search movies and shows..."
- Search icon on the left side of the input
- Clear button (X icon) appears when input has text, clears input on click, includes `aria-label="Clear search"`
- Dark surface background consistent with app theme (surface color from design tokens, e.g., `bg-slate-800` or equivalent theme variable)
- White text, muted placeholder text (`placeholder-slate-400`)
- Rounded corners (`rounded-lg`)
- No border in default state; subtle focus ring on focus

### Search Results Grid

- Same grid layout as PopularGrid (responsive columns per breakpoints)
- MovieCard components identical to those used in browse mode
- Gap between cards: `gap-4`

### Empty State

- Centered in the results area (vertically and horizontally)
- Heading: "No results found"
- Subtext: "Try different keywords or check your spelling"
- No CTA button (user can simply type a new query)

### Error State

- Inline message below SearchBar, not full-width
- Red accent for error icon/text (`text-red-500`)
- "Retry" button to re-attempt the last search

### Mode Transitions

- Instant switch between browse and search modes (no animation)
- SearchBar remains fixed at top; content below switches

### Hero Backdrop

- Full-width backdrop image with `aspect-ratio: 16/9` or similar cinematic ratio
- Gradient overlay: transparent at top, fading to page background color at bottom
- Title text: `text-2xl` to `text-4xl`, `font-bold`, white, positioned at bottom-left over gradient
- Tagline (if present): `text-sm text-slate-400` below title

### Detail Metadata Panel

- Compact layout with key-value pairs or inline text
- Year, runtime, genres on one line separated by interpuncts or pipes
- Directors and writers as labeled lists
- Spoken languages in parenthetical or secondary position

### Cast Carousel

- Horizontally scrollable container with `overflow-x-auto`
- Each cast item: circular profile image (80-100px), actor name below, character name in muted text
- Placeholder icon (person silhouette) when `profile_path` is null
- Touch/swipe enabled on mobile

### Trailer Embed

- 16:9 aspect ratio container
- Dark overlay with play button icon (centered) before interaction
- On click: replace overlay with YouTube iframe
- Responsive width, max-width on desktop

### Streaming Badges

- Horizontal row of provider logos (32-48px)
- Dark surface background with subtle border
- "Not available" text centered if no providers

### Box Office

- Displayed below metadata panel, movies only
- Two values: "Budget" and "Revenue" with labels
- Currency formatting with dollar sign and commas (e.g., "$200,000,000")
- Muted label text (`text-slate-400`), white value text
- Omit entirely if both values are 0

### Rating Stars

- 5 star icons in a row
- Empty stars: outline, muted color
- Filled stars: solid, teal accent
- Hover preview: fill stars up to hovered position
- Click: confirm rating

### Action Buttons

- Row of icon buttons: Favorite, Watchlist, Watched, Share, IMDB
- Icon-only with tooltips on hover
- Teal accent for active states (favorited, in watchlist, watched)

### Detail Loading Skeleton

- Backdrop: full-width dark rectangle with shimmer
- Title: two text-line placeholders
- Metadata: three short text-line placeholders
- Cast: row of circular placeholders
- Actions: row of square button placeholders

### Detail Error State

- Centered message in content area
- Heading: "Something went wrong" or "Not found"
- Retry button (primary) or Home link

## Risks & Assumptions

### Risks

| Risk                                          | Likelihood | Impact                       | Mitigation                                                                         |
| --------------------------------------------- | ---------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| Excessive API calls during typing             | Medium     | Rate limiting, degraded UX   | 300 ms debounce reduces calls; exponential backoff handles 429 responses           |
| Search results include unexpected media types | Low        | Irrelevant results displayed | Client-side filter ensures only movie/tv types render                              |
| Missing streaming data for user's region      | Medium     | User sees "Not available"    | Show message explaining data depends on region; link to settings to change region. |
| No trailer available for some titles          | Medium     | Empty space in UI            | Conditionally hide trailer section entirely when no video available.               |
| IMDB ID missing for some titles               | Low        | No external link             | Conditionally hide IMDB button when `imdb_id` is null.                             |
| Web Share API not supported                   | Medium     | Fallback path needed         | Implement clipboard fallback with toast confirmation.                              |

### Assumptions

- The `/search/multi` endpoint is stable and returns consistent `media_type` field values
- TrendingCarousel, PopularGrid, FilterBar, and ViewToggle components will be implemented as part of home screen browse mode (separate change or prerequisite) — may be stubbed for initial implementation
- MovieCard and useSettings may need to be created as part of this change if not already implemented
- `append_to_response` parameter reliably returns all requested relations in a single API call.
- `Settings.preferredRegion` will be implemented as part of the Settings feature (roadmap item 11); until then, streaming badges will use a default region of 'US'.
- `storage.service.ts` will be created as part of this feature to persist `LibraryEntry` data.

## Acceptance Criteria

- [x] SearchBar debounces input by 300 ms before firing an API request (HS-01)
- [x] API request uses `GET /search/multi` with trimmed query and language parameter (HS-02)
- [x] Results are filtered to `media_type === "movie"` or `media_type === "tv"` (person results discarded) (HS-03)
- [x] Each MovieCard displays poster, title, year, and vote average (HS-04)
- [x] Tapping a movie card navigates to `/movie/:id` (HS-05)
- [x] Tapping a TV show card navigates to `/show/:id` (HS-05)
- [x] Empty state displays heading and subtitle when query returns zero results after filtering (HS-06)
- [x] Loading skeleton (8 placeholders) displays while API request is in flight (HS-07)
- [x] SearchBar remains interactive during loading (not disabled, Tab/Escape work) (HS-07)
- [x] API errors surface an inline error message "Failed to load search results" with Retry button (not full-page) (HS-08)
- [x] Clicking Retry re-attempts search with current query value (HS-08)
- [x] Browse sections (TrendingCarousel, PopularGrid, FilterBar, ViewToggle) display when query is empty (HS-09)
- [x] Browse sections hide and SearchResults display when query is non-empty (HS-10)
- [x] Clearing the query restores browse sections with no intermediate mixed state (HS-11)
- [x] SearchBar input has `type="search"` and `placeholder` attributes (HS-NFR-06)
- [x] Clear button has `aria-label="Clear search"` and is keyboard accessible (HS-NFR-07)
- [x] Tab and Escape keys remain functional during loading state (HS-NFR-08)
- [x] `HeroBackdrop` displays the backdrop image with gradient overlay and title text (ED-01)
- [x] `HeroBackdrop` displays solid gradient when no backdrop is available (ED-01)
- [x] `MetadataPanel` shows year, runtime/seasons, genres, directors, writers, and spoken languages (ED-02)
- [x] `MetadataPanel` omits missing data instead of showing empty values (ED-02)
- [x] `CastCarousel` renders horizontally scrollable list of cast members with headshots and names (ED-03)
- [x] `CastCarousel` displays placeholder icon when `profile_path` is null (ED-03)
- [x] `TrailerEmbed` plays the official YouTube trailer inline when clicked (ED-04)
- [x] `TrailerEmbed` is not rendered when no trailer is available (ED-04)
- [x] `StreamingBadges` displays provider logos for user's region (ED-05)
- [x] `StreamingBadges` displays "Not available" when no providers exist for region (ED-05)
- [x] `RatingStars` allows setting 0-5 star rating persisted in localStorage (ED-06)
- [x] `RatingStars` supports keyboard navigation using arrow keys (ED-06, ED-NFR-07)
- [x] `RatingStars` clears rating when clicking the same star again (ED-06)
- [x] Favorite toggle persists state in localStorage (ED-07)
- [x] Watch status toggle (watchlist/watched/none) persists in localStorage (ED-08)
- [x] IMDB link opens correct IMDB page using `imdb_id` (ED-09)
- [x] IMDB link is not rendered when `imdb_id` is null (ED-09)
- [x] Share button uses Web Share API when supported (ED-10)
- [x] Share button falls back to clipboard copy with success toast (ED-10)
- [x] Loading skeleton matches the detail layout while API request is in flight (ED-11)
- [x] API errors display an inline error message with Retry action (ED-12)
- [x] 404 response displays "Not found" message with link to Home (ED-12)
- [x] TMDB rating badge displays vote average formatted to one decimal (ED-13)
- [x] Tagline displays below title when present and non-empty (ED-14)
- [x] Synopsis displays full `overview` text below metadata (ED-15)
- [x] Box office data displays budget and revenue formatted as currency for movies (ED-16)
- [x] Box office section is not rendered when both values are 0 or unavailable (ED-16)
- [x] Box office section is not rendered for TV shows (ED-16)
