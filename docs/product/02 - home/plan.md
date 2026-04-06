# Plan

## Phase 0: Prerequisites

### 0.1 Verify or Create Base Schemas

- [x] Verify `src/domain/movie.schema.ts` exists with `MovieListItemSchema`
  - If missing, create it with fields: `id`, `title`, `poster_path`, `release_date`, `vote_average`, `media_type`
  - Export inferred type: `MovieListItem`
- [x] Verify `src/domain/show.schema.ts` exists with `ShowListItemSchema`
  - If missing, create it with fields: `id`, `name`, `poster_path`, `first_air_date`, `vote_average`, `media_type`
  - Export inferred type: `ShowListItem`

### 0.2 Verify or Create Provider Client

- [x] Verify `src/infrastructure/provider.client.ts` exists
  - If missing, create it with base API client setup (Bearer token auth, base URL, error handling)
  - See `docs/technical/api.md` for configuration details

### 0.3 Verify or Create Settings Composable

- [x] Verify `src/application/use-settings.ts` exists with `useSettings()` returning `Settings.language`
  - If missing, create stub with default language `'en'`:
    ```typescript
    export function useSettings() {
      return {
        language: ref('en'),
      }
    }
    ```

### 0.4 Verify or Create MovieCard Component

- [x] Verify `src/presentation/components/common/movie-card.vue` exists
  - If missing, create it with props: `item: MovieListItem | ShowListItem`
  - Displays: poster image, title (or name for TV), year (from release_date or first_air_date), vote_average
  - Emits: `click` event for navigation

## Phase 1: Testing — Domain Layer

### 1.1 Write Search Schema Tests

- [x] Create `tests/domain/search.schema.test.ts` (covering: HS-03; scenario IDs: HS-03-01 through HS-03-05, plus schema parsing tests as implementation detail)
  - Test `SearchResultItemSchema` parses valid movie result
  - Test `SearchResultItemSchema` parses valid TV result
  - Test `SearchResultItemSchema` parses valid person result (before filtering)
  - Test `SearchResponseSchema` parses paginated response
  - Run tests: expect failure (schema not yet implemented)

### 1.2 Create Search Schema

- [x] Create `src/domain/search.schema.ts`
  - Define `SearchResultItemSchema` as a discriminated union based on `media_type`:
    - For `media_type === 'movie'`: extends `MovieListItemSchema` fields (from `src/domain/movie.schema.ts`)
    - For `media_type === 'tv'`: extends `ShowListItemSchema` fields (from `src/domain/show.schema.ts`)
    - For `media_type === 'person'`: minimal fields (id, name, media_type)
  - Define `SearchResponseSchema` wrapping paginated results with `SearchResultItemSchema` items
  - Export inferred types: `SearchResultItem`, `SearchResponse`
  - Run tests: expect pass

### 1.3 Create Search Constants

- [x] Update `src/domain/constants.ts`
  - Add `SEARCH_DEBOUNCE_MS = 300`
  - Add `MIN_SEARCH_QUERY_LENGTH = 1` (minimum characters to trigger search)

## Phase 2: Testing — Infrastructure Layer

### 2.1 Write Search API Tests

- [x] Create `tests/infrastructure/provider.client.search.test.ts` (covering: HS-02, HS-08; scenario IDs: HS-02-01 through HS-02-06, HS-08-06, HS-08-07)
  - Test `searchMulti()` constructs correct URL with all query params (HS-02-01, HS-02-02, HS-02-03, HS-02-04, HS-02-06)
  - Test `searchMulti()` returns validated response
  - Test `searchMulti()` rejects empty/whitespace query (HS-02-05)
  - Test `searchMulti()` handles API error responses (network error, 5xx, 429)
  - Test exponential backoff on 429 rate limit (HS-08-06, HS-08-07)
  - Run tests: expect failure (method not yet implemented)

### 2.2 Add Search API Method

- [x] Update `src/infrastructure/provider.client.ts` (verified to exist in Phase 0.2)
  - Add `searchMulti(query: string, language: string): Promise<SearchResponse>` method
  - Construct URL: `${API_BASE_URL}/search/multi` with query params: `query`, `language`, `page=1`, `include_adult=false`
  - Validate response with `SearchResponseSchema.parse()`
  - Rollback: method can be removed without affecting other client methods
  - Run tests: expect pass

## Phase 3: Testing — Application Layer

### 3.1 Write Search Composable Tests

- [x] Create `tests/application/use-search.test.ts` (covering: HS-01, HS-03, HS-06, HS-07, HS-08, HS-09, HS-10, HS-11; scenario IDs: HS-01-01 through HS-01-05, HS-03-01 through HS-03-05, HS-06-01, HS-07-01, HS-07-05, HS-07-06, HS-07-08, HS-08-01, HS-08-03, HS-08-04, HS-08-08, HS-08-09, HS-09-01, HS-09-03, HS-10-01, HS-10-02, HS-11-01, HS-11-06)
  - Test debounce behavior: multiple rapid inputs trigger single API call (HS-01-02)
  - Test debounce timer reset on continued typing (HS-01-03)
  - Test no API call before debounce completes (HS-01-04)
  - Test clearing input cancels pending request (HS-01-05)
  - Test movie results are returned (HS-03-01)
  - Test TV show results are returned (HS-03-02)
  - Test results filtering: person results excluded (HS-03-03, HS-03-05)
  - Test all-person results yields empty array (HS-03-04)
  - Test loading state transitions: idle → loading → success (HS-07-01, HS-07-06)
  - Test SearchBar interactive during loading (HS-07-05)
  - Test keyboard navigation during loading (HS-07-08)
  - Test error state: API failure sets error ref (HS-08-01)
  - Test retry triggers new API call with current query (HS-08-03)
  - Test successful retry replaces error with results (HS-08-04)
  - Test new search clears previous error (HS-08-08)
  - Test retry uses current query value (HS-08-09)
  - Test clear: resets query, results, and error (HS-11-01, HS-11-06)
  - Test empty results: results array empty when API returns no matches (HS-06-01)
  - Test browse/search mode state based on query (HS-09-01, HS-09-03, HS-10-01, HS-10-02)
  - Run tests: expect failure (composable not yet implemented)

### 3.2 Create Search Composable

- [x] Create `src/application/use-search.ts`
  - Signature: `useSearch()` returns `{ query, results, loading, error, search, clear }`
  - `query`: `Ref<string>` bound to SearchBar input
  - `results`: `Ref<(MovieListItem | ShowListItem)[]>` filtered to exclude `media_type === 'person'`
  - `loading`: `Ref<boolean>` true while API request in flight
  - `error`: `Ref<Error | null>` set on API failure
  - `search(query: string)`: triggers API call (called by debounced watcher)
  - `clear()`: resets query to empty string, clears results and error
  - Implement 300 ms debounce using `watch(query, ...)` with `setTimeout`/`clearTimeout`
  - Filter results client-side: `results.filter(r => r.media_type === 'movie' || r.media_type === 'tv')`
  - Pass `Settings.language` from `useSettings()` to API call (verified to exist in Phase 0.3)
  - Run tests: expect pass

## Phase 4: Testing — Presentation Layer

### 4.1 Write SearchBar Component Tests

- [x] Create `tests/presentation/components/home/search-bar.test.ts` (covering: HS-01, HS-11; scenario IDs: HS-01-01, HS-11-02, HS-11-03)
  - Test v-model binding updates on input
  - Test clear button appears when input non-empty
  - Test clear button click emits empty string (HS-11-03)
  - Test backspace to empty emits empty string (HS-11-02)
  - Test clear button has `aria-label="Clear search"` for accessibility
  - Run tests: expect failure (component not yet implemented)

### 4.2 Create SearchBar Component

- [x] Create `src/presentation/components/home/search-bar.vue`
  - Props: `modelValue: string` (v-model binding)
  - Emits: `update:modelValue`
  - Template structure:
    - Wrapper `div` with `relative` positioning
    - Search icon (lucide `Search`) positioned left
    - `<input type="search">` with full width, padding for icons, dark background, white text
    - Clear button (lucide `X`) positioned right, visible only when input non-empty, `aria-label="Clear search"`
  - Styling: `rounded-lg`, `bg-slate-800`, `text-white`, `placeholder-slate-400`
  - Placeholder text: use i18n key `home.search.placeholder` ("Search movies and shows...")
  - Clear button click: emit empty string
  - Run tests: expect pass

### 4.3 Write SearchResults Component Tests

- [x] Create `tests/presentation/components/home/search-results.test.ts` (covering: HS-04, HS-05, HS-06, HS-07, HS-08; scenario IDs: HS-04-01 through HS-04-08, HS-05-01, HS-05-02, HS-05-04, HS-06-01 through HS-06-07, HS-07-01 through HS-07-09, HS-08-01, HS-08-02, HS-08-05)
  - Test renders skeleton grid when loading (HS-07-01)
  - Test skeleton grid has responsive columns (HS-07-02, HS-07-07)
  - Test skeleton has 2:3 aspect ratio (HS-07-03)
  - Test exactly 8 skeleton placeholders displayed (HS-07-09)
  - Test renders error message with retry button when error (HS-08-01, HS-08-02)
  - Test error is inline, not full-page (HS-08-05)
  - Test renders empty state when results empty and query non-empty (HS-06-01)
  - Test empty state shows heading and subtitle (HS-06-02)
  - Test empty state is centered (HS-06-03)
  - Test empty state after filtering person-only results (HS-06-05)
  - Test user can type new query from empty state (HS-06-06)
  - Test renders MovieCard grid when results present (HS-04-01 through HS-04-06)
  - Test grid responsive columns (HS-04-07, HS-04-08)
  - Test MovieCard click navigates to correct route (HS-05-01, HS-05-02)
  - Test keyboard navigation on MovieCard (HS-05-04)
  - Run tests: expect failure (component not yet implemented)

### 4.4 Create SearchResults Component

- [x] Create `src/presentation/components/home/search-results.vue`
  - Props: `results: (MovieListItem | ShowListItem)[]`, `loading: boolean`, `error: Error | null`, `query: string`
  - Emits: `retry`
  - Template structure:
    - Loading state: render skeleton grid using Tailwind responsive classes (`grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`)
    - Error state: inline error message with Retry button (red accent, `text-red-500`)
    - Empty state: centered message when `results.length === 0` and `!loading` and `query.trim().length > 0`
    - Results state: responsive grid of MovieCard components
  - MovieCard click handler: `router.push()` to `/movie/:id` or `/show/:id` based on `media_type`
  - Note: "MovieCard" is a component name that renders both movies and TV shows
  - Run tests: expect pass

### 4.5 Write MovieCardSkeleton Component Tests

- [x] Create `tests/presentation/components/common/movie-card-skeleton.test.ts` (covering: HS-07; scenario IDs: HS-07-03, HS-07-04, HS-07-09)
  - Test skeleton has 2:3 aspect ratio
  - Test skeleton has shimmer animation class
  - Test skeleton component can be rendered 8 times for loading grid (HS-07-09)
  - Run tests: expect failure (component not yet implemented)

### 4.6 Create MovieCardSkeleton Component

- [x] Create `src/presentation/components/common/movie-card-skeleton.vue`
  - Note: This is a specialized skeleton for MovieCard's 2:3 poster aspect ratio, distinct from R-01a's generic SkeletonLoader. R-01a's SkeletonLoader provides basic shimmer primitives; MovieCardSkeleton composes them into the specific card layout.
  - Matches MovieCard dimensions (2:3 aspect ratio poster, title/year text lines)
  - Shimmer animation using `animate-pulse` or custom shimmer keyframe
  - No props needed
  - Run tests: expect pass

### 4.7 Write HomeScreen Integration Tests

- [x] Update `tests/presentation/views/home-screen.test.ts` (covering: HS-05, HS-06, HS-09, HS-10, HS-11; scenario IDs: HS-05-03, HS-06-04, HS-09-01 through HS-09-04, HS-10-01 through HS-10-05, HS-11-01, HS-11-04, HS-11-05)
  - Test browse sections visible on initial load (HS-09-01)
  - Test SearchBar visible in browse mode (HS-09-02)
  - Test no search results in browse mode (HS-09-03)
  - Test browse sections maintain state (HS-09-04)
  - Test empty state not shown when query is empty (HS-06-04)
  - Test browse sections hidden when query entered (HS-10-01)
  - Test SearchResults displayed when query entered (HS-10-02)
  - Test SearchBar remains visible in search mode (HS-10-03)
  - Test single character triggers search mode (HS-10-04)
  - Test whitespace-only query stays in browse mode (HS-10-05)
  - Test clearing query restores browse sections (HS-11-01)
  - Test no mixed state during transition (HS-11-04)
  - Test mode transition is instant (HS-11-05)
  - Test navigation preserves search state on back (HS-05-03)
  - Run tests: expect failure (integration not yet implemented)

### 4.8 Update HomeScreen View

- [x] Update `src/presentation/views/home-screen.vue`
  - Import and use `useSearch()` composable
  - Add `SearchBar` at top of content area, bound to `query`
  - Conditional rendering:
    - If `query.trim()` is empty: render browse sections (TrendingCarousel, PopularGrid, FilterBar, ViewToggle) — stub if not yet implemented
    - If `query.trim()` is non-empty: render `SearchResults` with results, loading, error, query props
  - Handle retry event from SearchResults: call `search()` with current query value
  - Run tests: expect pass

### 4.9 Add i18n Keys

- [x] Update `src/presentation/i18n/locales/en.json`
  - Add `home.search.placeholder`: "Search movies and shows..."
  - Add `home.search.empty.title`: "No results found"
  - Add `home.search.empty.subtitle`: "Try different keywords or check your spelling"
  - Add `home.search.error.message`: "Failed to load search results"
  - Add `home.search.error.retry`: "Retry"
  - Add `home.search.clear`: "Clear search" (for aria-label)

- [x] Update `src/presentation/i18n/locales/es.json`
  - Add Spanish translations for all keys above

- [x] Update `src/presentation/i18n/locales/fr.json`
  - Add French translations for all keys above

## Phase 5: Search Verification

- [x] Run `npm run lint` — no ESLint errors
- [x] Run `npm run build` — production build succeeds
- [x] Run `npm run test` — all tests pass (254 tests)
- [x] Verify touch targets: SearchBar clear button and MovieCard components are at least 44x44px on mobile viewports (HS-NFR-05)
- [x] Manual verification:
  - Type in SearchBar, observe 300 ms debounce before results appear
  - Verify only movie/TV results shown (no person cards)
  - Verify each card shows poster, title, year, vote average
  - Verify tapping movie card navigates to `/movie/:id`
  - Verify tapping TV card navigates to `/show/:id`
  - Search for nonexistent term, verify empty state
  - Verify loading skeleton appears during API call
  - Simulate API error (offline), verify inline error with Retry
  - Clear search, verify browse sections return
  - Navigate to detail page and back, verify search state preserved
  - Test keyboard navigation (Tab through cards, Enter to select)

---

# Browse Mode Plan

## Phase B1: Infrastructure & Data Fetching

1.  [x] **Update Provider Client**
    - Add `getTrending`, `getPopularMovies`, and `getPopularShows` to `src/infrastructure/provider.client.ts`.
    - Unit test for `provider.client.ts` to verify API calls.
    - *Covering: HB-01, HB-02, HB-03*

2.  [x] **Application Logic: useBrowse**
    - Create `src/application/use-browse.ts` to handle parallel data fetching and state management.
    - Unit test for `useBrowse` to verify successful data loading and error handling.
    - *Covering: HB-01, HB-02, HB-03, HB-08, HB-09*

## Phase B2: Browse Components

1.  [x] **Implement TrendingCarousel Component**
    - Create `src/presentation/components/home/trending-carousel.vue`.
    - Display backdrop or poster and title for top items.
    - Handle horizontal scrolling.
    - *Covering: HB-04*

2.  [x] **Implement PopularGrid Component**
    - Create `src/presentation/components/home/popular-grid.vue`.
    - Display popular movies and shows in a responsive grid.
    - *Covering: HB-05*

3.  [x] **Testing: Browse Components**
    - Write unit/integration tests for `TrendingCarousel` and `PopularGrid` verifying data rendering and navigation.
    - *Covering: HB-04, HB-05, HB-07 (scenarios HB-01 to HB-05)*

## Phase B3: Home Screen Integration

1.  [x] **Integrate Browse Sections**
    - Update `src/presentation/views/home-screen.vue` to include browse sections when in browse mode.
    - Ensure correct state management between search and browse modes.
    - *Covering: HB-06*

## Phase B4: Verification

1.  [x] **Run Unit & Integration Tests**
    - `npm run test` to verify all tests pass.
2.  [x] **Check TypeScript Types**
    - `npm run type-check` to ensure type safety.
3.  [x] **Build Verification**
    - `npm run build` to confirm the project builds successfully.

---

# Entry Details Plan

## Phase 6: Entry Details Prerequisites

### 6.1 Create Detail Schemas

- [x] Create `MovieDetailSchema` in `src/domain/movie.schema.ts`
  - Fields: `id`, `title`, `overview`, `tagline`, `release_date`, `runtime`, `poster_path`, `backdrop_path`, `vote_average`, `imdb_id`, `budget`, `revenue`, `status`, `homepage`, `genres`, `spoken_languages`, `production_companies`, `production_countries`, `belongs_to_collection`, `credits`, `videos`, `'watch/providers'` (quoted key for Zod), `release_dates`
  - Export inferred type: `MovieDetail`
- [x] Create `ShowDetailSchema` in `src/domain/show.schema.ts`
  - Fields: `id`, `name`, `overview`, `tagline`, `first_air_date`, `last_air_date`, `number_of_seasons`, `number_of_episodes`, `episode_run_time`, `poster_path`, `backdrop_path`, `vote_average`, `status`, `homepage`, `genres`, `spoken_languages`, `production_companies`, `production_countries`, `origin_country`, `networks`, `created_by`, `credits`, `videos`, `'watch/providers'` (quoted key for Zod), `content_ratings`, `next_episode_to_air`
  - Note: TV shows do not have `imdb_id` in the main response; IMDB link may not be available for TV shows
  - Export inferred type: `ShowDetail`

### 6.2 Create LibraryEntry Schema

- [x] Create `src/domain/library.schema.ts` with `LibraryEntrySchema`:
  - Fields per `docs/technical/data-model.md`: `id`, `mediaType`, `title`, `posterPath`, `rating` (0-5), `favorite` (boolean), `status` (`'watchlist' | 'watched' | 'none'`), `lists`, `tags`, `notes`, `watchDates`, `addedAt`
  - Export inferred type: `LibraryEntry`
  - Note: `rating: 0` means unrated, `1-5` are valid ratings

### 6.3 Create Shared Sub-schemas

- [x] Create `src/domain/shared.schema.ts` with the following schemas:
  - `GenreSchema`: `{ id: number, name: string }`
  - `CastMemberSchema`: `{ id: number, name: string, character: string, profile_path: string | null, order: number }`
  - `CrewMemberSchema`: `{ id: number, name: string, job: string, department: string, profile_path: string | null }`
  - `VideoSchema`: `{ id: string, key: string, name: string, site: string, type: string, official: boolean }`
  - `StreamingProviderSchema`: `{ provider_id: number, provider_name: string, logo_path: string }`
  - `WatchProviderRegionSchema`: `{ link: string, flatrate?: StreamingProvider[], rent?: StreamingProvider[], buy?: StreamingProvider[] }`
  - `SpokenLanguageSchema`: `{ iso_639_1: string, name: string, english_name: string }`
  - Export inferred types for all schemas

### 6.4 Create Storage Service

- [x] Create `src/infrastructure/storage.service.ts` with:
  - `STORAGE_KEY = 'plot-twisted-library'`
  - `getLibraryEntry(id: number, mediaType: 'movie' | 'tv'): LibraryEntry | null` - reads from localStorage, returns entry matching id and mediaType or null
  - `saveLibraryEntry(entry: LibraryEntry): void` - upserts entry to localStorage by id and mediaType
  - `getAllLibraryEntries(): LibraryEntry[]` - returns all entries
  - Validate with `LibraryEntrySchema` on read per `docs/technical/data-model.md`
  - Rollback: file can be removed without affecting other infrastructure

### 6.5 Update Settings Composable

- [x] Update `src/application/use-settings.ts` to add `preferredRegion`:
  - Add `preferredRegion: ref('US')` to the returned object
  - Note: This is a stub with default value until Settings feature (roadmap 11) is implemented
  - ED-05 (StreamingBadges) depends on this value for region filtering

## Phase 7: Entry Details - Domain Layer Testing

### 7.1 Write Detail Schema Tests

- [x] Create `tests/domain/movie-detail.schema.test.ts` (covering: ED-02, ED-03, ED-04, ED-05; implementation detail)
  - Test `MovieDetailSchema` parses valid movie detail response with all appended relations
  - Test schema handles null values for optional fields (`backdrop_path`, `imdb_id`, `tagline`)
  - Test `credits.cast` and `credits.crew` arrays parse correctly
  - Test `videos.results` array parses video objects
  - Test `watch/providers.results` parses region-keyed provider data
  - Run tests: expect failure (schema not yet implemented)

- [x] Create `tests/domain/show-detail.schema.test.ts` (covering: ED-02, ED-03, ED-04, ED-05; implementation detail)
  - Test `ShowDetailSchema` parses valid TV show detail response
  - Test schema handles TV-specific fields (`number_of_seasons`, `number_of_episodes`, `episode_run_time`, `created_by`)
  - Run tests: expect failure (schema not yet implemented)

### 7.2 Create Detail Schemas

- [x] Create/update `src/domain/movie.schema.ts` with `MovieDetailSchema`
  - Define schema with all fields per `docs/technical/api.md#MovieDetail`
  - Import and use shared sub-schemas for nested objects
  - Run tests: expect pass

- [x] Create/update `src/domain/show.schema.ts` with `ShowDetailSchema`
  - Define schema with all fields per `docs/technical/api.md#ShowDetail`
  - Import and use shared sub-schemas for nested objects
  - Run tests: expect pass

### 7.3 Write Library Entry Tests

- [x] Create `tests/domain/library-entry.schema.test.ts` (covering: ED-06, ED-07, ED-08; implementation detail)
  - Test `LibraryEntrySchema` validates all fields
  - Test rating range validation (0-5)
  - Test status enum validation (`watchlist`, `watched`, `none`)
  - Run tests: expect failure or pass depending on existing implementation

## Phase 8: Entry Details - Infrastructure Layer Testing

### 8.1 Write Detail API Tests

- [x] Create `tests/infrastructure/provider.client.movie-detail.test.ts` (covering: ED-12; scenario IDs: ED-12-01 through ED-12-05)
  - Test `getMovieDetail(id)` constructs correct URL with `append_to_response` parameter
  - Test `getMovieDetail(id)` returns validated `MovieDetail` response
  - Test `getMovieDetail(id)` handles 404 response (returns specific error type)
  - Test `getMovieDetail(id)` handles network errors
  - Test `getMovieDetail(id)` handles rate limiting with retry
  - Run tests: expect failure (method not yet implemented)

- [x] Create `tests/infrastructure/provider.client.show-detail.test.ts` (covering: ED-12; scenario IDs: ED-12-01 through ED-12-05)
  - Test `getShowDetail(id)` constructs correct URL with `append_to_response` parameter
  - Test `getShowDetail(id)` returns validated `ShowDetail` response
  - Test `getShowDetail(id)` handles 404 response
  - Run tests: expect failure (method not yet implemented)

### 8.2 Add Detail API Methods

- [x] Update `src/infrastructure/provider.client.ts`
  - Add `getMovieDetail(id: number, language: string): Promise<MovieDetail>`
    - URL: `${API_BASE_URL}/movie/${id}?language=${language}&append_to_response=credits,videos,watch/providers,release_dates`
    - Validate response with `MovieDetailSchema.parse()`
  - Add `getShowDetail(id: number, language: string): Promise<ShowDetail>`
    - URL: `${API_BASE_URL}/tv/${id}?language=${language}&append_to_response=credits,videos,watch/providers,content_ratings`
    - Validate response with `ShowDetailSchema.parse()`
  - Rollback: methods can be removed without affecting other client methods
  - Run tests: expect pass

### 8.3 Write Storage Tests

- [x] Create/update `tests/infrastructure/storage.service.test.ts` (covering: ED-06, ED-07, ED-08; scenario IDs: ED-06-01 through ED-06-04, ED-07-01 through ED-07-03, ED-08-01 through ED-08-04)
  - Test `getLibraryEntry()` returns null for non-existent entry
  - Test `saveLibraryEntry()` creates new entry
  - Test `saveLibraryEntry()` updates existing entry
  - Test entry persists rating, favorite, and status fields
  - Run tests: expect pass if storage already implemented

## Phase 9: Entry Details - Application Layer Testing

### 9.1 Write Movie Detail Composable Tests

- [x] Create `tests/application/use-movie-detail.test.ts` (covering: ED-01 through ED-15; scenario IDs: ED-01-01, ED-02-01 through ED-02-06, ED-11-01 through ED-11-03, ED-12-01 through ED-12-05)
  - Test `useMovieDetail(id)` returns `{ data, loading, error, refresh }`
  - Test loading state transitions: idle -> loading -> success
  - Test loading state transitions: idle -> loading -> error
  - Test error state for 404 response sets specific error type
  - Test error state for network error
  - Test refresh re-fetches data
  - Test data includes all expected fields from MovieDetail
  - Run tests: expect failure (composable not yet implemented)

### 9.2 Write Show Detail Composable Tests

- [x] Create `tests/application/use-show-detail.test.ts` (covering: ED-01 through ED-15; scenario IDs: same as movie but for TV)
  - Test `useShowDetail(id)` returns `{ data, loading, error, refresh }`
  - Test loading and error state transitions
  - Test data includes TV-specific fields
  - Run tests: expect failure (composable not yet implemented)

### 9.3 Create Detail Composables

- [x] Create `src/application/use-movie-detail.ts`
  - Signature: `useMovieDetail(id: Ref<number> | number)` returns `{ data, loading, error, refresh }`
  - Fetch from `providerClient.getMovieDetail(id, language)`
  - Pass `Settings.language` from `useSettings()`
  - Run tests: expect pass

- [x] Create `src/application/use-show-detail.ts`
  - Signature: `useShowDetail(id: Ref<number> | number)` returns `{ data, loading, error, refresh }`
  - Fetch from `providerClient.getShowDetail(id, language)`
  - Run tests: expect pass

### 9.4 Write Library Composable Tests

- [x] Create `tests/application/use-library-entry.test.ts` (covering: ED-06, ED-07, ED-08; scenario IDs: ED-06-01 through ED-06-04, ED-07-01 through ED-07-03, ED-08-01 through ED-08-04)
  - Test `useLibraryEntry(id, mediaType)` returns current entry or null
  - Test `setRating(value)` updates entry and persists
  - Test `toggleFavorite()` toggles and persists
  - Test `setStatus(status)` updates and persists
  - Test entry is created if it doesn't exist when first action taken
  - Run tests: expect failure (composable not yet implemented)

### 9.5 Create Library Entry Composable

- [x] Create `src/application/use-library-entry.ts`
  - Signature: `useLibraryEntry(id: number, mediaType: 'movie' | 'tv')` returns `{ entry, setRating, toggleFavorite, setStatus }`
  - `entry`: `Ref<LibraryEntry | null>` - current entry from storage
  - `setRating(value: number)`: updates `entry.rating`, persists to storage
  - `toggleFavorite()`: toggles `entry.favorite`, persists to storage
  - `setStatus(status: 'watchlist' | 'watched' | 'none')`: updates `entry.status`, persists to storage
  - Creates entry with defaults if not exists on first mutation
  - Run tests: expect pass

## Phase 10: Entry Details - Presentation Layer Testing

### 10.1 Write HeroBackdrop Component Tests

- [x] Create `tests/presentation/components/details/hero-backdrop.test.ts` (covering: ED-01, ED-14; scenario IDs: ED-01-01 through ED-01-03, ED-14-01 through ED-14-03)
  - Test renders backdrop image when `backdrop_path` provided
  - Test renders gradient overlay
  - Test renders title text
  - Test renders tagline when provided (ED-14-01)
  - Test renders solid gradient when `backdrop_path` is null (ED-01-03)
  - Test tagline not rendered when empty or null (ED-14-02, ED-14-03)
  - Run tests: expect failure (component not yet implemented)

### 10.2 Create HeroBackdrop Component

- [x] Create `src/presentation/components/details/hero-backdrop.vue`
  - Props: `backdropPath: string | null`, `title: string`, `tagline?: string`
  - Template: backdrop image with gradient overlay, title positioned at bottom-left
  - Use `buildImageUrl()` with `w780` size for backdrop
  - Fallback to solid gradient when no image
  - Run tests: expect pass

### 10.3 Write MetadataPanel Component Tests

- [x] Create `tests/presentation/components/details/metadata-panel.test.ts` (covering: ED-02; scenario IDs: ED-02-01 through ED-02-06)
  - Test renders year from release_date
  - Test renders runtime formatted as hours/minutes for movies
  - Test renders season/episode count for TV shows
  - Test renders genres as comma-separated list
  - Test renders directors list
  - Test renders writers list
  - Test renders spoken languages
  - Test omits missing fields instead of showing empty
  - Run tests: expect failure (component not yet implemented)

### 10.4 Create MetadataPanel Component

- [x] Create `src/presentation/components/details/metadata-panel.vue`
  - Props: movie-specific or show-specific metadata object
  - Conditionally render each section only if data exists
  - Format runtime: `{hours}h {minutes}m`
  - Extract directors: `crew.filter(c => c.job === 'Director')`
  - Extract writers: `crew.filter(c => c.department === 'Writing')`
  - Run tests: expect pass

### 10.5 Write CastCarousel Component Tests

- [x] Create `tests/presentation/components/details/cast-carousel.test.ts` (covering: ED-03; scenario IDs: ED-03-01 through ED-03-05)
  - Test renders horizontally scrollable container
  - Test renders cast members sorted by order
  - Test renders profile image for each cast member
  - Test renders placeholder when profile_path is null
  - Test renders actor name and character name
  - Test limits to 20 cast members maximum
  - Run tests: expect failure (component not yet implemented)

### 10.6 Create CastCarousel Component

- [x] Create `src/presentation/components/details/cast-carousel.vue`
  - Props: `cast: CastMember[]`
  - Template: horizontal scroll container with cast cards
  - Use `buildImageUrl()` with `w185` size for profile images
  - Limit to first 20 members
  - Run tests: expect pass

### 10.7 Write TrailerEmbed Component Tests

- [x] Create `tests/presentation/components/details/trailer-embed.test.ts` (covering: ED-04; scenario IDs: ED-04-01 through ED-04-04)
  - Test renders play button overlay initially
  - Test clicking play embeds YouTube iframe
  - Test uses privacy-enhanced domain (youtube-nocookie.com)
  - Test component not rendered when no trailer available
  - Run tests: expect failure (component not yet implemented)

### 10.8 Create TrailerEmbed Component

- [x] Create `src/presentation/components/details/trailer-embed.vue`
  - Props: `videos: Video[]`
  - Computed: find first video where `type === 'Trailer'` and `site === 'YouTube'`
  - State: `isPlaying` ref to track embed state
  - Template: thumbnail with play button, replaced by iframe on click
  - Use `youtube-nocookie.com` for privacy
  - Run tests: expect pass

### 10.9 Write StreamingBadges Component Tests

- [x] Create `tests/presentation/components/details/streaming-badges.test.ts` (covering: ED-05; scenario IDs: ED-05-01 through ED-05-04)
  - Test renders provider logos for given region
  - Test displays "Not available" when no providers for region
  - Test handles missing region data gracefully
  - Run tests: expect failure (component not yet implemented)

### 10.10 Create StreamingBadges Component

- [x] Create `src/presentation/components/details/streaming-badges.vue`
  - Props: `providers: Record<string, WatchProviderRegion>`, `region: string`
  - Computed: extract `flatrate` array for user's region
  - Template: row of provider logos or "Not available" text
  - Use `buildImageUrl()` for provider logos
  - Run tests: expect pass

### 10.11 Write BoxOffice Component Tests

- [x] Create `tests/presentation/components/details/box-office.test.ts` (covering: ED-16; scenario IDs: ED-16-01 through ED-16-05)
  - Test renders budget and revenue when both available
  - Test renders only budget when revenue is 0
  - Test renders only revenue when budget is 0
  - Test component not rendered when both are 0
  - Test values formatted as currency with commas
  - Run tests: expect failure (component not yet implemented)

### 10.12 Create BoxOffice Component

- [x] Create `src/presentation/components/details/box-office.vue`
  - Props: `budget: number`, `revenue: number`
  - Template: labeled values for budget and revenue
  - Format values as currency: `$${value.toLocaleString()}`
  - Conditionally render only if budget > 0 or revenue > 0
  - Run tests: expect pass

### 10.13 Write ProviderRatingBadge Component Tests

- [x] Create `tests/presentation/components/details/provider-rating-badge.test.ts` (covering: ED-13; scenario IDs: ED-13-01 through ED-13-03)
  - Test renders vote average as badge (e.g., "8.4")
  - Test formats value to one decimal place
  - Test rounds correctly (7.856 → "7.9")
  - Test displays star icon alongside the number
  - Test uses teal accent styling
  - Run tests: expect failure (component not yet implemented)

### 10.14 Create ProviderRatingBadge Component

- [x] Create `src/presentation/components/details/provider-rating-badge.vue`
  - Props: `voteAverage: number`
  - Template: badge with star icon and formatted rating
  - Format: `voteAverage.toFixed(1)`
  - Style: teal accent background, white text
  - Run tests: expect pass

### 10.15 Write Synopsis Component Tests

- [x] Create `tests/presentation/components/details/synopsis.test.ts` (covering: ED-15; scenario IDs: ED-15-01 through ED-15-02)
  - Test renders full overview text when provided
  - Test component not rendered when overview is empty
  - Test component not rendered when overview is null
  - Run tests: expect failure (component not yet implemented)

### 10.16 Create Synopsis Component

- [x] Create `src/presentation/components/details/synopsis.vue`
  - Props: `overview: string | null`
  - Template: paragraph with full overview text
  - Conditionally render only if overview is non-empty
  - Run tests: expect pass

### 10.17 Write RatingStars Component Tests

- [x] Create `tests/presentation/components/details/rating-stars.test.ts` (covering: ED-06; scenario IDs: ED-06-01 through ED-06-06)
  - Test renders 5 star icons
  - Test filled stars match current rating value
  - Test hover previews selection
  - Test click sets rating and emits update
  - Test clicking same star clears rating
  - Test keyboard navigation (arrow keys, Enter)
  - Run tests: expect failure (component not yet implemented)

### 10.18 Create RatingStars Component

- [x] Create `src/presentation/components/details/rating-stars.vue`
  - Props: `modelValue: number` (0-5)
  - Emits: `update:modelValue`
  - State: `hoveredValue` ref for preview
  - Template: 5 star icons with hover/click handlers
  - Filled vs outline based on value comparison
  - Keyboard accessibility with arrow keys
  - Run tests: expect pass

### 10.19 Write ActionButtons Component Tests

- [x] Create `tests/presentation/components/details/action-buttons.test.ts` (covering: ED-07, ED-08, ED-09, ED-10; scenario IDs: ED-07-01 through ED-07-04, ED-08-01 through ED-08-05, ED-09-01 through ED-09-04, ED-10-01 through ED-10-03)
  - Test favorite button toggles state and emits event
  - Test watch status cycles through states
  - Test IMDB button renders when imdb_id present
  - Test IMDB button not rendered when imdb_id null
  - Test IMDB link has `rel="noopener noreferrer"` and indicates new tab (ED-NFR-09)
  - Test share button has `aria-label="Share"` (ED-NFR-08)
  - Test share button triggers Web Share API when available
  - Test share button copies to clipboard when Web Share not available
  - Run tests: expect failure (component not yet implemented)

### 10.20 Create ActionButtons Component

- [x] Create `src/presentation/components/details/action-buttons.vue`
  - Props: `favorite: boolean`, `status: string`, `imdbId: string | null`, `shareUrl: string`, `shareTitle: string`
  - Emits: `toggle-favorite`, `update-status`, `share`
  - Template: row of icon buttons with tooltips
  - Share button with `aria-label="Share"` (ED-NFR-08)
  - IMDB link with `rel="noopener noreferrer"`, `target="_blank"`, and external link indicator (ED-NFR-09)
  - Run tests: expect pass

### 10.21 Write DetailSkeleton Component Tests

- [x] Create `tests/presentation/components/details/detail-skeleton.test.ts` (covering: ED-11; scenario IDs: ED-11-01 through ED-11-04)
  - Test renders backdrop placeholder
  - Test renders title line placeholders
  - Test renders metadata line placeholders
  - Test renders cast circle placeholders
  - Test has shimmer animation
  - Run tests: expect failure (component not yet implemented)

### 10.22 Create DetailSkeleton Component

- [x] Create `src/presentation/components/details/detail-skeleton.vue`
  - No props needed
  - Template: structured skeleton matching detail layout
  - Use `animate-pulse` for shimmer effect
  - Run tests: expect pass

### 10.23 Write MovieScreen View Tests

- [x] Create `tests/presentation/views/movie-screen.test.ts` (covering: ED-01 through ED-16; scenario IDs: all ED scenarios for movie context)
  - Test renders skeleton while loading
  - Test renders all detail components when data loaded (including ProviderRatingBadge, Synopsis)
  - Test renders error state on API failure
  - Test renders "Not found" on 404
  - Test Retry button triggers refresh
  - Test rating changes persist to storage
  - Test favorite toggle persists
  - Test watch status changes persist
  - Run tests: expect failure (view not yet implemented beyond stub)

### 10.24 Update MovieScreen View

- [x] Update `src/presentation/views/movie-screen.vue`
  - Import and use `useMovieDetail(id)` and `useLibraryEntry(id, 'movie')`
  - Get `id` from route params (`useRoute().params.id`)
  - Conditional rendering: skeleton (loading), error (error), content (data)
  - Compose all detail components: HeroBackdrop, ProviderRatingBadge, MetadataPanel, Synopsis, BoxOffice, CastCarousel, TrailerEmbed, StreamingBadges, RatingStars, ActionButtons
  - Wire up library actions (rating, favorite, status) to composable methods
  - Handle share action with Web Share API / clipboard fallback
  - Run tests: expect pass

### 10.25 Write ShowScreen View Tests

- [x] Create `tests/presentation/views/show-screen.test.ts` (covering: ED-01 through ED-15; scenario IDs: all ED scenarios for TV context)
  - Same tests as MovieScreen but for TV show context
  - Test TV-specific metadata (seasons, episodes, created_by)
  - Run tests: expect failure (view not yet implemented beyond stub)

### 10.26 Update ShowScreen View

- [x] Update `src/presentation/views/show-screen.vue`
  - Import and use `useShowDetail(id)` and `useLibraryEntry(id, 'tv')`
  - Same structure as MovieScreen with TV-specific adaptations (no BoxOffice)
  - Run tests: expect pass

### 10.27 Add i18n Keys

- [x] Update `src/presentation/i18n/locales/en.json`
  - Add `details.loading`: "Loading..."
  - Add `details.error.title`: "Something went wrong"
  - Add `details.error.retry`: "Retry"
  - Add `details.notFound.title`: "Not found"
  - Add `details.notFound.message`: "This title doesn't exist or has been removed."
  - Add `details.notFound.home`: "Back to Home"
  - Add `details.streaming.notAvailable`: "Not available for streaming"
  - Add `details.actions.favorite`: "Add to favorites"
  - Add `details.actions.unfavorite`: "Remove from favorites"
  - Add `details.actions.watchlist`: "Add to watchlist"
  - Add `details.actions.watched`: "Mark as watched"
  - Add `details.actions.removeStatus`: "Remove from list"
  - Add `details.actions.share`: "Share"
  - Add `details.actions.imdb`: "View on IMDB"
  - Add `details.share.copied`: "Link copied to clipboard"
  - Add `details.metadata.director`: "Director"
  - Add `details.metadata.directors`: "Directors"
  - Add `details.metadata.writer`: "Writer"
  - Add `details.metadata.writers`: "Writers"
  - Add `details.metadata.seasons`: "Seasons"
  - Add `details.metadata.episodes`: "Episodes"
  - Add `details.cast.title`: "Cast"
  - Add `details.trailer.title`: "Trailer"
  - Add `details.trailer.play`: "Play trailer"
  - Add `details.boxOffice.title`: "Box Office"
  - Add `details.boxOffice.budget`: "Budget"
  - Add `details.boxOffice.revenue`: "Revenue"

- [x] Update `src/presentation/i18n/locales/es.json`
  - Add Spanish translations for all keys above

- [x] Update `src/presentation/i18n/locales/fr.json`
  - Add French translations for all keys above

## Phase 11: Entry Details Verification

- [x] Run `npm run lint` - no ESLint errors
- [x] Run `npm run build` - production build succeeds
- [x] Run `npm run test` - all tests pass (420 tests)
- [x] Verify touch targets: in Chrome DevTools mobile emulation at 375px width, verify all buttons measure at least 44x44px (ED-NFR-06)
- [x] Verify accessibility: run axe-core audit on detail pages, verify screen reader announces rating changes (ED-NFR-07)
- [x] Manual verification:
  - Navigate to `/movie/550` (Fight Club), verify all components render
  - Navigate to `/show/1396` (Breaking Bad), verify TV-specific metadata
  - Verify backdrop image loads with gradient overlay
  - Verify metadata panel shows year, runtime, genres, directors, writers
  - Verify box office shows budget and revenue for movies
  - Verify box office section not shown for TV shows
  - Verify cast carousel scrolls horizontally
  - Click trailer play button, verify YouTube embed loads
  - Verify streaming badges show providers for default region
  - Click rating stars, verify rating persists on refresh
  - Click favorite button, verify state persists on refresh
  - Change watch status, verify state persists on refresh
  - Click IMDB link, verify opens correct IMDB page in new tab
  - Click share button, verify Web Share API or clipboard copy with toast
  - Test on mobile viewport, verify responsive layout
  - Disconnect network, verify error state with Retry button
  - Navigate to `/movie/999999999`, verify "Not found" message
  - Test keyboard navigation on rating stars
