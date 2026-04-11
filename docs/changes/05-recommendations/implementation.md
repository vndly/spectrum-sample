# Implementation: Recommendations

## Overview

Implemented a dedicated Recommendations page at `/recommendations` that provides personalized "Because you liked/watched {title}" carousels based on the user's library entries. When the library is empty, the screen falls back to Trending and Popular content. To optimize performance and API usage, recommendation carousels utilize lazy loading via an Intersection Observer.

## Files Changed

### Created

- `src/domain/recommendations.logic.ts` — Core logic for seed selection (rating/recency priority) and cross-section deduplication.
- `src/application/use-recommendations.ts` — Composable that orchestrates seed selection and parallel API calls for each recommendation section.
- `src/presentation/composables/use-intersection-observer.ts` — Reusable composable for lazy-loading logic.
- `src/presentation/components/recommendations/RecommendationCarousel.vue` — Carousel component with loading skeletons and lazy-loading integration.
- `src/presentation/views/recommendations-screen.vue` — Dedicated view for the Recommendations page.
- `tests/domain/recommendations.logic.test.ts` — Unit tests for seed selection and deduplication logic.

### Modified

- `src/infrastructure/provider.client.ts` — Added `getMovieRecommendations` and `getShowRecommendations` methods with retry logic.
- `src/presentation/i18n/locales/en.json` — Added i18n keys for recommendations (camelCase).
- `src/presentation/i18n/locales/es.json` — Added i18n keys for recommendations.
- `src/presentation/i18n/locales/fr.json` — Added i18n keys for recommendations.
- `tests/presentation/i18n/locale-keys.test.ts` — Updated to include new i18n keys and verify camelCase compliance.
- `tests/presentation/views/recommendations-screen.test.ts` — Updated to verify the actual Recommendations implementation instead of the placeholder.
- `tests/setup.ts` — Added `IntersectionObserver` global mock.

## Key Decisions

- **Seed Priority**: Library entries are prioritized by Rating (5-1), then by most recent activity (latest of `addedAt` or `watchDates`).
- **Lazy Loading**: Each recommendation section only initiates its API request when it approaches the viewport (200px margin), respecting TMDB rate limits.
- **Deduplication**: Recommendations are deduplicated against the user's existing library and against previously fetched sections on the same screen.
- **Fallback**: If no library entries exist, the page automatically switches to a fallback mode showing general trending and popular content.

## Deviations from Plan

- **Lazy Loading Implementation**: Instead of fetching all seeds at once, the `useRecommendations` composable was designed to allow per-section fetching, which is triggered by the carousel's intersection observer. This provides better performance than the initial "fetch all on mount" approach.
- **i18n Keys**: Renamed keys to camelCase (e.g., `becauseYouLiked`) to comply with project linting rules discovered during testing.

## Testing

- **Unit Tests**: `recommendations.logic.ts` is fully tested for seed selection (rating/recency sorting) and deduplication (filtering library IDs and duplicates).
- **Component Tests**: `recommendations-screen.vue` is tested for correct title rendering and component composition in multiple locales.
- **Integration Tests**: Router and i18n parity tests verify the route registration and locale consistency.

## Dependencies

- No new external dependencies added.
