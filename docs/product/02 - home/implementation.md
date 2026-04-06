# Implementation: Home Screen

## Overview

This implementation adds search functionality, entry detail views, and a content-rich browse mode to the home screen. It follows a test-first approach across all architectural layers (Domain → Infrastructure → Application → Presentation).

**Browse functionality**: Surface trending and popular movies and TV shows when the user is not actively searching. This includes a high-impact TrendingCarousel with horizontal snap-scrolling and responsive PopularGrids for movies and shows. Data is fetched in parallel to ensure fast initial load times.

**Search functionality**: 300ms debounced input, client-side filtering of person results, and seamless mode switching between browse and search states. A SearchBar component at the top of the home screen transitions the app between search mode (displaying results in a responsive grid) and browse mode (displaying trending and popular sections).

**Entry Details functionality**: Comprehensive movie and TV show detail views including metadata, cast, trailer, streaming availability, and personal tracking features (rating, favorite, watch status) persisted in localStorage.

## Files Changed

### Created

**Domain Layer:**

- `src/domain/movie.schema.ts` — Zod schemas for MovieListItem and MovieDetailSchema (with credits, videos, watch/providers, release_dates)
- `src/domain/show.schema.ts` — Zod schemas for ShowListItem and ShowDetailSchema (with TV-specific fields)
- `src/domain/search.schema.ts` — Zod schemas for SearchResultItem (discriminated union by media_type) and SearchResponse (paginated wrapper)
- `src/domain/library.schema.ts` — LibraryEntry schema with rating (0-5), favorite, status (watchlist/watched/none)
- `src/domain/shared.schema.ts` — Shared Zod schemas for Genre, CastMember, CrewMember, Video, StreamingProvider, WatchProviderRegion, SpokenLanguage

**Infrastructure Layer:**

- `src/infrastructure/provider.client.ts` — TMDB API client with `searchMulti()`, `getTrending()`, `getPopularMovies()`, `getPopularShows()`, `getMovieDetail()`, and `getShowDetail()` methods.
- `src/infrastructure/image.helper.ts` — `buildImageUrl()` helper for constructing full image URLs from TMDB relative paths
- `src/infrastructure/storage.service.ts` — localStorage service for library entries with getLibraryEntry, saveLibraryEntry, getAllLibraryEntries, removeLibraryEntry

**Application Layer:**

- `src/application/use-settings.ts` — Stub composable returning `language: ref('en')` and `preferredRegion: ref('US')` for API localization and streaming provider filtering
- `src/application/use-search.ts` — Search composable with debounced query watching, loading/error state, results filtering, and mode detection
- `src/application/use-browse.ts` — Browse composable for parallel fetching of trending and popular content with retry logic
- `src/application/use-movie-detail.ts` — Composable returning { data, loading, error, refresh } for movie details
- `src/application/use-show-detail.ts` — Composable returning { data, loading, error, refresh } for TV show details
- `src/application/use-library-entry.ts` — Composable with setRating, toggleFavorite, setStatus methods for library management

**Presentation Layer:**

- `src/presentation/components/home/search-bar.vue` — Search input with clear button, v-model binding, and accessibility attributes
- `src/presentation/components/home/search-results.vue` — Results display with loading skeleton, error state, empty state, and MovieCard grid
- `src/presentation/components/home/trending-carousel.vue` — Horizontal carousel for top 10 trending items using native snap-scrolling
- `src/presentation/components/home/popular-grid.vue` — Responsive grid for popular movies and TV shows
- `src/presentation/components/common/movie-card.vue` — Card component displaying poster, title, year, and vote average for movies/shows
- `src/presentation/components/common/movie-card-skeleton.vue` — Loading placeholder matching MovieCard's 2:3 aspect ratio
- `src/presentation/components/details/hero-backdrop.vue` — Full-width backdrop image with gradient overlay and title/tagline
- `src/presentation/components/details/metadata-panel.vue` — Year, runtime, genres, directors, writers, spoken languages
- `src/presentation/components/details/cast-carousel.vue` — Horizontally scrollable cast list with profile images
- `src/presentation/components/details/trailer-embed.vue` — YouTube trailer with click-to-play using privacy-enhanced mode
- `src/presentation/components/details/streaming-badges.vue` — Provider logos for streaming availability by region
- `src/presentation/components/details/box-office.vue` — Budget and revenue display for movies
- `src/presentation/components/details/provider-rating-badge.vue` — TMDB rating badge with star icon
- `src/presentation/components/details/synopsis.vue` — Full overview text display
- `src/presentation/components/details/rating-stars.vue` — Interactive 5-star rating with keyboard navigation
- `src/presentation/components/details/action-buttons.vue` — Favorite, watchlist, watched, share, IMDB buttons
- `src/presentation/components/details/detail-skeleton.vue` — Loading skeleton matching detail layout

**Presentation Layer - Views:**

- `src/presentation/views/home-screen.vue` — Main screen with SearchBar and conditional display of browse sections or search results
- `src/presentation/views/movie-screen.vue` — Full movie detail view composing all detail components
- `src/presentation/views/show-screen.vue` — Full TV show detail view (no BoxOffice, no IMDB link)

**Test Files:**

- `tests/domain/search.schema.test.ts` — Schema parsing tests for movie, TV, and person results
- `tests/domain/movie-detail.schema.test.ts` — MovieDetailSchema validation tests
- `tests/domain/show-detail.schema.test.ts` — ShowDetailSchema validation tests
- `tests/domain/library-entry.schema.test.ts` — LibraryEntrySchema validation tests
- `tests/infrastructure/provider.client.browse.test.ts` — API client tests for trending and popular endpoints
- `tests/infrastructure/provider.client.search.test.ts` — API client tests for URL construction, error handling, and retry logic
- `tests/infrastructure/provider.client.movie-detail.test.ts` — getMovieDetail API tests
- `tests/infrastructure/provider.client.show-detail.test.ts` — getShowDetail API tests
- `tests/infrastructure/storage.service.test.ts` — Storage service tests
- `tests/application/use-browse.test.ts` — Composable tests for parallel fetching, state management, and error handling
- `tests/application/use-search.test.ts` — Composable tests for debounce, filtering, loading states, error handling, and mode transitions
- `tests/application/use-movie-detail.test.ts` — Movie detail composable tests
- `tests/application/use-show-detail.test.ts` — Show detail composable tests
- `tests/application/use-library-entry.test.ts` — Library entry composable tests
- `tests/presentation/components/home/trending-carousel.test.ts` — TrendingCarousel component tests
- `tests/presentation/components/home/popular-grid.test.ts` — PopularGrid component tests
- `tests/presentation/components/home/search-bar.test.ts` — Component tests for v-model binding and clear functionality
- `tests/presentation/components/home/search-results.test.ts` — Component tests for all display states and navigation
- `tests/presentation/components/common/movie-card-skeleton.test.ts` — Skeleton component tests
- `tests/presentation/components/details/*.test.ts` — Tests for all detail components
- `tests/presentation/views/home-screen.test.ts` — Updated tests for search and browse mode transitions
- `tests/presentation/views/movie-screen.test.ts` — MovieScreen view tests
- `tests/presentation/views/show-screen.test.ts` — ShowScreen view tests

### Modified

- `src/domain/constants.ts` — Added `SEARCH_DEBOUNCE_MS`, `MIN_SEARCH_QUERY_LENGTH`, `MAX_RETRY_ATTEMPTS`, `RETRY_BASE_DELAY_MS`, `IMAGE_BASE_URL`, `IMAGE_SIZES`
- `src/infrastructure/provider.client.ts` — Added trending, popular, and detail methods.
- `src/application/use-settings.ts` — Added preferredRegion ref (defaults to 'US')
- `src/presentation/views/home-screen.vue` — Integrated `useBrowse` and browse components.
- `src/presentation/i18n/locales/*.json` — Added keys for browse, search, and detail UI.

## Key Decisions

- **Media Type Injection**: TMDB's popular and trending endpoints sometimes omit the `media_type` field in the result objects. We inject it in the `provider.client.ts` (e.g., adding `media_type: 'movie'` to popular movie results) to maintain compatibility with the `SearchResponseSchema` and the `MovieCard` component's navigation logic.

- **Parallel Fetching in useBrowse**: All browse sections (Trending, Popular Movies, Popular Shows) are fetched in parallel using `Promise.all` to minimize the time the user spends looking at skeleton loaders.

- **Native Snap Scrolling**: Used CSS scroll-snap properties for the `TrendingCarousel` to achieve a "mobile app" feel for horizontal scrolling with zero JavaScript overhead and perfect performance.

- **Discriminated union for search results**: Used Zod's `z.discriminatedUnion` with `media_type` as the discriminator.

- **Single API call with append_to_response**: Movie and show details use TMDB's `append_to_response` parameter to fetch credits, videos, watch/providers, and release_dates in a single request.

- **localStorage for library data**: User ratings, favorites, and watch status are stored locally using `LibraryEntry` schema.

## Testing

**Total tests: ~450 across 55+ test files**

- **Browse Tests**: Verified parallel fetching, data mapping (including injected media_type), carousel navigation, and responsive grid rendering.
- **Search Tests**: Verified debounce timing, client-side filtering of person results, and empty/error states.
- **Detail Tests**: Verified all metadata extraction, YouTube trailer embedding, streaming provider filtering by region, and library persistence.
- **Integration Tests**: Verified seamless mode switching between browse and search on the Home Screen based on query input.

## Security Considerations

- **Privacy-enhanced YouTube embeds**: Trailers use `youtube-nocookie.com` domain to reduce tracking.
- **Input validation**: Search queries are trimmed and validated before being sent to the API.

## Error UX

- **Granular Retries**: Each browse section and the search results grid provide a "Retry" button on failure, allowing the user to recover from transient network errors without refreshing the entire page.

## Known Limitations

- **Pagination**: Browse sections only display the first page of results (20 items).
- **Filter Bar & View Toggle**: While planned in requirements, the advanced filtering and layout toggling for the home screen are slated for a subsequent roadmap item.
- **Season/episode browser**: TV show details don't include episode-level navigation.
- **Streaming region**: Defaults to 'US' until the full Settings feature is implemented.
