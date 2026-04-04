# Implementation: Home Screen Search

## Overview

This implementation adds search functionality to the home screen, enabling users to search for movies and TV shows using TMDB's multi-search API. The implementation follows a test-first approach across all architectural layers (Domain → Infrastructure → Application → Presentation) with 300ms debounced input, client-side filtering of person results, and seamless mode switching between browse and search states.

The feature introduces a SearchBar component at the top of the home screen. When the user types a query, the app transitions to search mode, displaying results in a responsive grid. When the query is empty, the app displays browse mode (stubbed for future implementation of TrendingCarousel, PopularGrid, etc.).

## Files Changed

### Created

**Domain Layer:**

- `src/domain/movie.schema.ts` — Zod schema for MovieListItem returned by list endpoints
- `src/domain/show.schema.ts` — Zod schema for ShowListItem returned by list endpoints
- `src/domain/search.schema.ts` — Zod schemas for SearchResultItem (discriminated union by media_type) and SearchResponse (paginated wrapper)

**Infrastructure Layer:**

- `src/infrastructure/provider.client.ts` — TMDB API client with `searchMulti()` method, Bearer token auth, and exponential backoff retry for 429 responses
- `src/infrastructure/image.helper.ts` — `buildImageUrl()` helper for constructing full image URLs from TMDB relative paths

**Application Layer:**

- `src/application/use-settings.ts` — Stub composable returning `language: ref('en')` for API localization
- `src/application/use-search.ts` — Search composable with debounced query watching, loading/error state, results filtering, and mode detection

**Presentation Layer:**

- `src/presentation/components/home/search-bar.vue` — Search input with clear button, v-model binding, and accessibility attributes
- `src/presentation/components/home/search-results.vue` — Results display with loading skeleton, error state, empty state, and MovieCard grid
- `src/presentation/components/common/movie-card.vue` — Card component displaying poster, title, year, and vote average for movies/shows
- `src/presentation/components/common/movie-card-skeleton.vue` — Loading placeholder matching MovieCard's 2:3 aspect ratio

**Test Files:**

- `tests/domain/search.schema.test.ts` — Schema parsing tests for movie, TV, and person results
- `tests/infrastructure/provider.client.search.test.ts` — API client tests for URL construction, error handling, and retry logic
- `tests/application/use-search.test.ts` — Composable tests for debounce, filtering, loading states, error handling, and mode transitions
- `tests/presentation/components/home/search-bar.test.ts` — Component tests for v-model binding and clear functionality
- `tests/presentation/components/home/search-results.test.ts` — Component tests for all display states and navigation
- `tests/presentation/components/common/movie-card-skeleton.test.ts` — Skeleton component tests

### Modified

- `src/domain/constants.ts` — Added `SEARCH_DEBOUNCE_MS`, `MIN_SEARCH_QUERY_LENGTH`, `MAX_RETRY_ATTEMPTS`, `RETRY_BASE_DELAY_MS`, `IMAGE_BASE_URL`, `IMAGE_SIZES`
- `src/presentation/views/home-screen.vue` — Replaced EmptyState placeholder with SearchBar and conditional SearchResults/browse sections
- `src/presentation/i18n/locales/en.json` — Added 6 new keys for search UI text
- `src/presentation/i18n/locales/es.json` — Added Spanish translations
- `src/presentation/i18n/locales/fr.json` — Added French translations
- `tests/presentation/views/home-screen.test.ts` — Updated tests for search mode behavior
- `tests/presentation/i18n/locale-keys.test.ts` — Updated expected key count from 24 to 30
- `tests/App.test.ts` — Added lucide-vue-next icon mocks and updated home content assertion

## Key Decisions

- **Discriminated union for search results**: Used Zod's `z.discriminatedUnion` with `media_type` as the discriminator. This allows type-safe handling of movie, TV, and person results while enabling compile-time filtering.

- **Client-side person filtering**: Filter `media_type === 'person'` results in the `useSearch` composable rather than calling separate movie/TV endpoints. This keeps API usage minimal and aligns with the single-endpoint design decision in requirements.

- **Debounce in composable, not component**: The 300ms debounce is implemented in `useSearch` using `watch()` with `setTimeout`/`clearTimeout`. This centralizes the timing logic and makes it testable without component rendering.

- **Stub browse mode**: Browse sections (TrendingCarousel, PopularGrid, FilterBar, ViewToggle) are planned for a future feature. The current implementation shows an empty `<div data-testid="browse-sections">` as a placeholder.

- **MovieCard component for both types**: A single `MovieCard` component handles both movies and TV shows, using computed properties to normalize `title`/`name` and `release_date`/`first_air_date`.

## Deviations from Plan

- **useSettings stub**: Created a minimal stub implementation instead of a full settings composable with localStorage persistence. This satisfies the immediate need for `language` without introducing scope creep. The stub returns a hardcoded `ref('en')` which can be replaced when the Settings feature is implemented.

- **Phase 0 order**: Created the provider client base structure before search schema exists. The `searchMulti` method was added in Phase 2 after the schema was available for Zod validation.

## Testing

**Test files created:**

- Domain: `tests/domain/search.schema.test.ts` (7 tests)
- Infrastructure: `tests/infrastructure/provider.client.search.test.ts` (12 tests)
- Application: `tests/application/use-search.test.ts` (18 tests)
- Presentation:
  - `tests/presentation/components/home/search-bar.test.ts` (8 tests)
  - `tests/presentation/components/home/search-results.test.ts` (15 tests)
  - `tests/presentation/components/common/movie-card-skeleton.test.ts` (4 tests)
  - `tests/presentation/views/home-screen.test.ts` (11 tests)

**Coverage:**

- Schema parsing: valid/invalid inputs for all media types
- API client: URL construction, parameter encoding, empty query rejection, error handling, exponential backoff
- Composable: debounce behavior, result filtering, loading/error states, mode transitions, retry functionality
- Components: v-model binding, conditional rendering, navigation, accessibility attributes

## Dependencies

No new dependencies. The implementation uses existing project dependencies:

- `zod` for schema validation
- `vue` for reactivity and components
- `vue-router` for navigation
- `vue-i18n` for translations
- `lucide-vue-next` for icons

## Security Considerations

**Input validation**: Search queries are trimmed before use in API calls. The `searchMulti` function in `provider.client.ts` rejects empty/whitespace-only queries before making requests.

**XSS prevention**: All user input is rendered through Vue's template escaping. No `v-html` usage. Query strings are passed to URLSearchParams which handles encoding.

**API token**: The TMDB read access token is embedded in the client bundle (existing behavior). This is documented as acceptable per `docs/technical/security.md`.

## Error UX

- **Network/server errors**: Display inline error message "Failed to load search results" with a Retry button. The error is not full-page; the SearchBar remains interactive.
- **Rate limiting (429)**: Automatic retry with exponential backoff (1s, 2s, 4s). After 3 retries, falls through to error state with Retry button.
- **Empty results**: Display centered empty state with heading "No results found" and subtitle "Try different keywords or check your spelling".

## Internationalization

All user-facing strings use vue-i18n's `$t()` or `useI18n()`:

- `home.search.placeholder` — SearchBar placeholder text
- `home.search.clear` — Clear button aria-label
- `home.search.empty.title` — Empty state heading
- `home.search.empty.subtitle` — Empty state subtitle
- `home.search.error.message` — Error state message
- `home.search.error.retry` — Retry button label

Translations provided for English, Spanish, and French.

## Performance Considerations

- **Debounce**: 300ms debounce prevents excessive API calls during typing
- **First page only**: Per project pagination strategy, only 20 results are fetched
- **Lazy loading**: Poster images use `loading="lazy"` attribute
- **No caching**: Per project conventions, no response caching is implemented

## Known Limitations

- **Browse mode placeholder**: TrendingCarousel, PopularGrid, FilterBar, and ViewToggle components are stubbed. They will be implemented as part of a separate home-browse feature.
- **Settings stub**: `useSettings` returns a hardcoded language value. Full settings persistence will come with the Settings feature.
- **No search history**: Out of scope per requirements.
- **No infinite scroll**: First page only per project pagination strategy.
- **Single page results**: Maximum 20 results displayed.

## Rollback Strategy

To roll back this feature:

1. Revert `src/presentation/views/home-screen.vue` to the EmptyState placeholder version
2. Remove the created files in domain, infrastructure, application, and presentation layers
3. Revert the i18n files to remove the `home.search.*` keys
4. Revert `tests/presentation/i18n/locale-keys.test.ts` expected key count
5. Revert `tests/App.test.ts` icon mocks and assertions

No data migrations are required. No localStorage schema changes.
