# Requirements

---

id: 02-home-search
title: Home Screen Search
status: released
importance: high
type: functional
tags: [home, search, api]

---

## Intent

Enable users to search for movies and TV shows from the home screen, displaying results in a responsive grid with seamless transitions between browse and search modes.

## Context & Background

### Problem Statement

Users need a way to find specific movies and TV shows by name. The home screen currently displays trending and popular content, but users cannot search for specific titles they want to add to their library.

### User Stories

- As a user, I want to search for movies and TV shows by title so that I can find specific content to add to my watchlist.
- As a user, I want to see search results as I type so that I can quickly find what I'm looking for without waiting.
- As a user, I want to easily return to browsing trending/popular content after searching so that I can discover new titles.
- As a user, I want to retry a failed search so that temporary network issues don't prevent me from finding content.

### Personas

- **Casual viewer**: Searches for specific movies they've heard about
- **TV enthusiast**: Searches for TV shows by name to track episodes

### Dependencies

- **R-01a (Scaffolding)**: Provides routing, SkeletonLoader, EmptyState, useToast composable
- **Browse mode components** (TrendingCarousel, PopularGrid, FilterBar, ViewToggle): Required for HS-09. These components are planned for a future home-browse feature; stub implementations will be used during initial development and replaced when the browse feature is implemented.
- **MovieCard component**: Required for HS-04 — created as part of this change if not already implemented
- **useSettings composable**: Required for HS-02 to access `Settings.language` — created as part of this change if not already implemented

## Decisions

| Decision                | Choice                                          | Rationale                                                                                                                                  |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| API endpoint            | `/search/multi`                                 | Single request covers both movies and TV shows, reducing API calls compared to separate `/search/movie` and `/search/tv` requests          |
| Person result filtering | Client-side                                     | Simpler than calling two separate endpoints and merging results; `/search/multi` returns person results which are not relevant to this app |
| Debounce duration       | 300 ms                                          | Balances responsiveness with avoiding excessive API calls during typing                                                                    |
| Retry strategy          | 3 retries with exponential backoff (1s, 2s, 4s) | Per project API rate limit handling in `docs/technical/api.md`                                                                             |

## Scope

### In Scope

- SearchBar component with debounced input
- API integration with `/search/multi` endpoint
- Search results display as MovieCard grid (note: MovieCard renders both movies and TV shows)
- MovieCard component (if not already implemented) — reusable card displaying poster, title, year, and vote average for movies and TV shows
- useSettings composable (if not already implemented) — provides `Settings.language` for API localization
- Client-side filtering to exclude person results
- Loading skeleton during API requests (8 placeholders)
- Empty state when no results found
- Inline error message for API failures
- Mode switching between browse and search states

### Out of Scope

- Infinite scroll / pagination (first page only per [API pagination strategy](../../technical/api.md#pagination-strategy))
- Search history / recent searches
- Voice search
- Advanced filters within search (genre, year)
- Typeahead suggestions / autocomplete dropdown

## Functional Requirements

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

## Non-Functional Requirements

### Performance

| ID        | Requirement             | Threshold                                                                                                                                                                  |
| --------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HS-NFR-01 | API Response Time       | Search API call SHALL complete and render results within 1000 ms (excluding debounce delay). Measured from request initiation to UI render on a stable network connection. |
| HS-NFR-02 | Debounce Implementation | Debounce implementation uses a 300 ms timeout (±50 ms variance acceptable due to browser scheduling)                                                                       |

### Responsive Design

| ID        | Requirement            | Threshold                                                                                                                              |
| --------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| HS-NFR-03 | Grid Columns (Desktop) | 5-6 columns on wide desktop (base), 4-5 columns below 1280px, 3-4 columns below 1024px, 2-3 columns below 768px, 2 columns below 640px |
| HS-NFR-04 | SearchBar Width        | Full width of the content area on all breakpoints                                                                                      |
| HS-NFR-05 | Touch Targets          | At least 44x44px on mobile                                                                                                             |

### Accessibility

| ID        | Requirement     | Threshold                                                                             |
| --------- | --------------- | ------------------------------------------------------------------------------------- |
| HS-NFR-06 | SearchBar Input | `type="search"` and `placeholder` attributes present                                  |
| HS-NFR-07 | Clear Button    | Keyboard accessible with `aria-label="Clear search"`                                  |
| HS-NFR-08 | Loading State   | Does not prevent keyboard navigation away from the SearchBar (Tab, Escape functional) |

## Constraints

- API rate limit: approximately 40 requests per 10 seconds; debounce mitigates this for rapid typing
- First page only: per project pagination strategy, only the first 20 results are displayed
- Language parameter: search query goes to API with `Settings.language` for localized results

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

## Risks & Assumptions

### Risks

| Risk                                          | Likelihood | Impact                       | Mitigation                                                               |
| --------------------------------------------- | ---------- | ---------------------------- | ------------------------------------------------------------------------ |
| Excessive API calls during typing             | Medium     | Rate limiting, degraded UX   | 300 ms debounce reduces calls; exponential backoff handles 429 responses |
| Search results include unexpected media types | Low        | Irrelevant results displayed | Client-side filter ensures only movie/tv types render                    |

### Assumptions

- The `/search/multi` endpoint is stable and returns consistent `media_type` field values
- TrendingCarousel, PopularGrid, FilterBar, and ViewToggle components will be implemented as part of home screen browse mode (separate change or prerequisite) — may be stubbed for initial implementation
- MovieCard and useSettings may need to be created as part of this change if not already implemented

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
