# Implementation: Home Screen

## Overview

This implementation adds search functionality, entry detail views, and a content-rich browse mode to the home screen. It follows a test-first approach across all architectural layers (Domain → Infrastructure → Application → Presentation).

**Browse functionality**: Surface trending and popular movies and TV shows when the user is not actively searching. This includes a high-impact TrendingCarousel with horizontal snap-scrolling and responsive PopularGrids for movies and shows. Data is fetched in parallel to ensure fast initial load times.

**Search functionality**: 300ms debounced input, client-side filtering of person results, and seamless mode switching between browse and search states. A SearchBar component at the top of the home screen transitions the app between search mode (displaying results in a responsive grid) and browse mode (displaying trending and popular sections).

**Entry Details functionality**: Comprehensive movie and TV show detail views including metadata, cast, trailer, streaming availability, and personal tracking features (rating, favorite, watch status) persisted in localStorage.

**Filtering & View Toggle functionality**: Enhance browse mode with client-side filtering by genre, media type, and year range. Introduce a layout toggle to switch between grid and list views for browse results, with persistence in user settings and URL query parameter synchronization.

## Files Changed

### Created

**Domain Layer:**

- `src/domain/movie.schema.ts` — Zod schemas for MovieListItem and MovieDetailSchema.
- `src/domain/show.schema.ts` — Zod schemas for ShowListItem and ShowDetailSchema.
- `src/domain/search.schema.ts` — Zod schemas for SearchResultItem and SearchResponse.
- `src/domain/library.schema.ts` — LibraryEntry schema.
- `src/domain/shared.schema.ts` — Shared Zod schemas (Genre, CastMember, Video, etc.).
- `src/domain/filter.schema.ts` — Zod schemas for `FilterState`.
- `src/domain/filter.logic.ts` — Pure filtering logic (AND-composition).

**Infrastructure Layer:**

- `src/infrastructure/storage.service.ts` — localStorage service for library entries.

**Application Layer:**

- `src/application/use-search.ts` — Search composable.
- `src/application/use-browse.ts` — Browse composable.
- `src/application/use-movie-detail.ts` — Movie details composable.
- `src/application/use-show-detail.ts` — Show details composable.
- `src/application/use-library-entry.ts` — Library management composable.
- `src/application/use-filters.ts` — Manages filter state, URL sync, and genre fetching.

**Presentation Layer:**

- `src/presentation/components/home/search-bar.vue` — Search input component.
- `src/presentation/components/home/search-results.vue` — Results display component.
- `src/presentation/components/home/trending-carousel.vue` — Horizontal carousel.
- `src/presentation/components/home/popular-grid.vue` — Responsive grid component.
- `src/presentation/components/home/filter-bar.vue` — UI for filtering.
- `src/presentation/components/home/view-toggle.vue` — UI for switching layouts.
- `src/presentation/components/common/movie-card-skeleton.vue` — Skeleton placeholder.
- `src/presentation/components/details/*.vue` — Detail view components (HeroBackdrop, MetadataPanel, etc.).

**Test Files:**

- `tests/domain/filter.logic.test.ts` — Verified filtering logic.
- `tests/application/use-filters.test.ts` — Verified filter state and URL sync.
- `tests/presentation/components/home/filter-bar.test.ts` — Verified FilterBar UI interaction.
- (All search, browse, and detail test files listed in original product doc)

### Modified

**Infrastructure Layer:**

- `src/infrastructure/provider.client.ts` — Added search, browse, detail, and genre methods.

**Application Layer:**

- `src/application/use-settings.ts` — Added preferredRegion and layoutMode with persistence.

**Presentation Layer:**

- `src/presentation/components/common/movie-card.vue` — Added `variant="list"` support.
- `src/presentation/views/home-screen.vue` — Integrated Search, Browse, FilterBar, and ViewToggle.

## Key Decisions

- **Media Type Injection**: TMDB results are normalized to include `media_type` in the provider client.
- **Parallel Fetching**: Browse sections are fetched in parallel for performance.
- **Native Snap Scrolling**: Used for the TrendingCarousel to provide a mobile-native feel.
- **Single API call with append_to_response**: Used for movie and show details.
- **Client-Side Filtering**: Trending/popular data is filtered in-memory for instantaneous UI response.
- **URL Persistence for Filters**: Filter state is reflected in query parameters for shareability and state restoration on reload.

## Testing

- **Automated Tests**: Over 480 tests across 60+ test files covering domain logic, API integration, composables, and components.
- **Manual Verification**:
  - Search, Browse, and Details functionality verified across desktop/mobile.
  - HF-01 to HF-09 (Filtering and Layout Toggle) verified, including persistence and URL sync.

## Dependencies

- **TMDB API**: Primary data source.
- **vue-router**: For navigation and URL query sync.
- **localStorage**: For library entries and user settings persistence.
- **lucide-vue-next**: For iconography.
