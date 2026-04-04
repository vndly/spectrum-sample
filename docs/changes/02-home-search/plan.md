# Plan

## Phase 0: Prerequisites

### 0.1 Verify or Create Base Schemas

- [ ] Verify `src/domain/movie.schema.ts` exists with `MovieListItemSchema`
  - If missing, create it with fields: `id`, `title`, `poster_path`, `release_date`, `vote_average`, `media_type`
  - Export inferred type: `MovieListItem`
- [ ] Verify `src/domain/show.schema.ts` exists with `ShowListItemSchema`
  - If missing, create it with fields: `id`, `name`, `poster_path`, `first_air_date`, `vote_average`, `media_type`
  - Export inferred type: `ShowListItem`

### 0.2 Verify or Create Provider Client

- [ ] Verify `src/infrastructure/provider.client.ts` exists
  - If missing, create it with base API client setup (Bearer token auth, base URL, error handling)
  - See `docs/technical/api.md` for configuration details

### 0.3 Verify or Create Settings Composable

- [ ] Verify `src/application/use-settings.ts` exists with `useSettings()` returning `Settings.language`
  - If missing, create stub with default language `'en'`:
    ```typescript
    export function useSettings() {
      return {
        language: ref('en'),
      }
    }
    ```

### 0.4 Verify or Create MovieCard Component

- [ ] Verify `src/presentation/components/common/movie-card.vue` exists
  - If missing, create it with props: `item: MovieListItem | ShowListItem`
  - Displays: poster image, title (or name for TV), year (from release_date or first_air_date), vote_average
  - Emits: `click` event for navigation

## Phase 1: Testing — Domain Layer

### 1.1 Write Search Schema Tests

- [ ] Create `tests/domain/search.schema.test.ts` (covering: HS-03, implementation detail)
  - Test `SearchResultItemSchema` parses valid movie result
  - Test `SearchResultItemSchema` parses valid TV result
  - Test `SearchResultItemSchema` parses valid person result (before filtering)
  - Test `SearchResponseSchema` parses paginated response
  - Run tests: expect failure (schema not yet implemented)

### 1.2 Create Search Schema

- [ ] Create `src/domain/search.schema.ts`
  - Define `SearchResultItemSchema` as a discriminated union based on `media_type`:
    - For `media_type === 'movie'`: extends `MovieListItemSchema` fields (from `src/domain/movie.schema.ts`)
    - For `media_type === 'tv'`: extends `ShowListItemSchema` fields (from `src/domain/show.schema.ts`)
    - For `media_type === 'person'`: minimal fields (id, name, media_type)
  - Define `SearchResponseSchema` wrapping paginated results with `SearchResultItemSchema` items
  - Export inferred types: `SearchResultItem`, `SearchResponse`
  - Run tests: expect pass

### 1.3 Create Search Constants

- [ ] Update `src/domain/constants.ts`
  - Add `SEARCH_DEBOUNCE_MS = 300`
  - Add `MIN_SEARCH_QUERY_LENGTH = 1` (minimum characters to trigger search)

## Phase 2: Testing — Infrastructure Layer

### 2.1 Write Search API Tests

- [ ] Create `tests/infrastructure/provider.client.search.test.ts` (covering: HS-02-01, HS-02-02, HS-02-03, HS-02-04, HS-02-05, HS-02-06, HS-08-06, HS-08-07, implementation detail)
  - Test `searchMulti()` constructs correct URL with all query params (HS-02-01, HS-02-02, HS-02-03, HS-02-04, HS-02-06)
  - Test `searchMulti()` returns validated response
  - Test `searchMulti()` rejects empty/whitespace query (HS-02-05)
  - Test `searchMulti()` handles API error responses (network error, 5xx, 429)
  - Test exponential backoff on 429 rate limit (HS-08-06, HS-08-07)
  - Run tests: expect failure (method not yet implemented)

### 2.2 Add Search API Method

- [ ] Update `src/infrastructure/provider.client.ts` (verified to exist in Phase 0.2)
  - Add `searchMulti(query: string, language: string): Promise<SearchResponse>` method
  - Construct URL: `${API_BASE_URL}/search/multi` with query params: `query`, `language`, `page=1`, `include_adult=false`
  - Validate response with `SearchResponseSchema.parse()`
  - Rollback: method can be removed without affecting other client methods
  - Run tests: expect pass

## Phase 3: Testing — Application Layer

### 3.1 Write Search Composable Tests

- [ ] Create `tests/application/use-search.test.ts` (covering: HS-01-01, HS-01-02, HS-01-03, HS-01-04, HS-01-05, HS-03-01, HS-03-02, HS-03-03, HS-03-04, HS-03-05, HS-06-01, HS-07-01, HS-07-05, HS-07-06, HS-07-08, HS-08-01, HS-08-03, HS-08-04, HS-08-08, HS-08-09, HS-09-01, HS-09-03, HS-10-01, HS-10-02, HS-11-01, HS-11-06)
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

- [ ] Create `src/application/use-search.ts`
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

- [ ] Create `tests/presentation/components/home/search-bar.test.ts` (covering: HS-01-01, HS-11-02, HS-11-03, implementation detail)
  - Test v-model binding updates on input
  - Test clear button appears when input non-empty
  - Test clear button click emits empty string (HS-11-03)
  - Test backspace to empty emits empty string (HS-11-02)
  - Test clear button has `aria-label="Clear search"` for accessibility
  - Run tests: expect failure (component not yet implemented)

### 4.2 Create SearchBar Component

- [ ] Create `src/presentation/components/home/search-bar.vue`
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

- [ ] Create `tests/presentation/components/home/search-results.test.ts` (covering: HS-04-01, HS-04-02, HS-04-03, HS-04-04, HS-04-05, HS-04-06, HS-04-07, HS-04-08, HS-05-01, HS-05-02, HS-05-04, HS-06-01, HS-06-02, HS-06-03, HS-06-05, HS-06-06, HS-07-01, HS-07-02, HS-07-03, HS-07-07, HS-07-09, HS-08-01, HS-08-02, HS-08-05)
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

- [ ] Create `src/presentation/components/home/search-results.vue`
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

- [ ] Create `tests/presentation/components/common/movie-card-skeleton.test.ts` (covering: HS-07-03, HS-07-04, HS-07-09, implementation detail)
  - Test skeleton has 2:3 aspect ratio
  - Test skeleton has shimmer animation class
  - Test skeleton component can be rendered 8 times for loading grid (HS-07-09)
  - Run tests: expect failure (component not yet implemented)

### 4.6 Create MovieCardSkeleton Component

- [ ] Create `src/presentation/components/common/movie-card-skeleton.vue`
  - Matches MovieCard dimensions (2:3 aspect ratio poster, title/year text lines)
  - Shimmer animation using `animate-pulse` or custom shimmer keyframe
  - No props needed
  - Run tests: expect pass

### 4.7 Write HomeScreen Integration Tests

- [ ] Update `tests/presentation/views/home-screen.test.ts` (covering: HS-05-03, HS-06-04, HS-09-01, HS-09-02, HS-09-03, HS-09-04, HS-10-01, HS-10-02, HS-10-03, HS-10-04, HS-10-05, HS-11-01, HS-11-04, HS-11-05)
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

- [ ] Update `src/presentation/views/home-screen.vue`
  - Import and use `useSearch()` composable
  - Add `SearchBar` at top of content area, bound to `query`
  - Conditional rendering:
    - If `query.trim()` is empty: render browse sections (TrendingCarousel, PopularGrid, FilterBar, ViewToggle) — stub if not yet implemented
    - If `query.trim()` is non-empty: render `SearchResults` with results, loading, error, query props
  - Handle retry event from SearchResults: call `search()` with current query value
  - Run tests: expect pass

### 4.9 Add i18n Keys

- [ ] Update `src/presentation/i18n/locales/en.json`
  - Add `home.search.placeholder`: "Search movies and shows..."
  - Add `home.search.empty.title`: "No results found"
  - Add `home.search.empty.subtitle`: "Try different keywords or check your spelling"
  - Add `home.search.error.message`: "Failed to load search results"
  - Add `home.search.error.retry`: "Retry"
  - Add `home.search.clear`: "Clear search" (for aria-label)

- [ ] Update `src/presentation/i18n/locales/es.json`
  - Add Spanish translations for all keys above

- [ ] Update `src/presentation/i18n/locales/fr.json`
  - Add French translations for all keys above

## Phase 5: Verification

- [ ] Run `npm run lint` — no ESLint errors
- [ ] Run `npm run build` — production build succeeds
- [ ] Run `npm run test` — all tests pass
- [ ] Manual verification:
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
