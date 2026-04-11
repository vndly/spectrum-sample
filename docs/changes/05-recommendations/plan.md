# Plan - Recommendations

Implementation of personalized recommendations based on library seeds as a dedicated page.

## Phase 1: Domain & Infrastructure

Implement the core logic for seed selection, deduplication, and API integration.

- [ ] **Step 1.1: Add Recommendations to API Client**: Extend `provider.client.ts` to include `getMovieRecommendations(id, language)` and `getShowRecommendations(id, language)` methods. (RE-02)
  - **File**: `src/infrastructure/provider.client.ts`
  - **Details**: Use `/movie/{id}/recommendations` and `/tv/{id}/recommendations`. Ensure `language` parameter is passed. (Rollback: Additive, non-destructive).
- [ ] **Step 1.2: Unit Tests for Seed Selection**: Write tests for the seed selection logic with various library states. (RE-01)
  - **File**: `tests/domain/recommendations.logic.test.ts`
  - **Covering**: SC-RE-01-01, SC-RE-01-02, SC-RE-01-03
- [ ] **Step 1.3: Implement Seed Selection Logic**: Create a domain function to select up to 5 seed entries from the library based on ratings and recency. (RE-01)
  - **File**: `src/domain/recommendations.logic.ts`
  - **Details**: Priority: Rating (5-1) > Last Activity (latest of `addedAt` and `watchDates`).
- [ ] **Step 1.4: Unit Tests for Deduplication & Exclusion**: Write tests for deduplication and library filtering. (RE-03, RE-04)
  - **File**: `tests/domain/recommendations.logic.test.ts`
  - **Covering**: SC-RE-03-01, SC-RE-04-01
- [ ] **Step 1.5: Implement Deduplication & Exclusion Logic**: Create a domain function to deduplicate results across multiple seeds and filter out library entries. (RE-03, RE-04)
  - **File**: `src/domain/recommendations.logic.ts`

## Phase 2: Application Logic

Create the composable to orchestrate seed selection and recommendation fetching.

- [ ] **Step 2.1: Create useRecommendations Composable**: Implement `useRecommendations` to manage the lifecycle of fetching recommendations for all seeds. (RE-02, RE-08, RE-09)
  - **File**: `src/application/use-recommendations.ts`
  - **Details**: Fetches seeds, then provides a reactive interface for fetching recommendations per seed. Supports independent loading/error states.

## Phase 3: Presentation

Create the dedicated Recommendations screen and register the route.

- [ ] **Step 3.1: Create RecommendationCarousel Component**: Build a new carousel component for recommendation sections that follows the `TrendingCarousel` layout and supports lazy loading. (RE-05, RE-10)
  - **File**: `src/presentation/components/recommendations/RecommendationCarousel.vue`
  - **Details**: Use `IntersectionObserver` or a library for lazy-loading. Use `vue-i18n` for dynamic labels: "Because you liked {title}" (rating >= 3) or "Because you watched {title}" (rating < 3 or unrated).
- [ ] **Step 3.2: Create Recommendations View**: Create the `recommendations-screen.vue` component. (RE-06, RE-07, RE-08, RE-09)
  - **File**: `src/presentation/views/recommendations-screen.vue`
  - **Details**: Display "Recommended for You" heading followed by the carousels for each seed. Render "Trending" and "Popular" fallbacks if no seeds exist.
- [ ] **Step 3.3: Register Recommendations Route**: Update the router to include the `/recommendations` route. (RE-06)
  - **File**: `src/presentation/router.ts`
  - **Details**: Ensure the route uses lazy-loading and has the correct `meta.titleKey`.

## Phase 4: Verification

- [ ] **Step 4.1: Automated Tests**: Run all unit and integration tests.
  - **Command**: `npm run test`
- [ ] **Step 4.2: Manual Verification**:
  - [ ] Verify navigation to `/recommendations` via sidebar/bottom nav works. (SC-RE-06-01)
  - [ ] Verify document title is correct on the Recommendations screen. (SC-RE-06-02)
  - [ ] Verify recommendations appear for a library with rated items. (SC-RE-01-01)
  - [ ] Verify "Because you liked {title}" vs "Because you watched {title}" labels are correct. (SC-RE-05-01, SC-RE-05-02, SC-RE-05-03)
  - [ ] Verify no duplicates across sections. (SC-RE-03-01)
  - [ ] Verify library entries are excluded. (SC-RE-04-01)
  - [ ] Verify fallback to Trending/Popular when library is empty. (SC-RE-07-01)
  - [ ] Verify independent error handling by mocking a failed API call for one seed. (SC-RE-08-01)
  - [ ] Verify empty result handling for a seed with no recommendations. (SC-RE-09-01)
  - [ ] Verify lazy loading: carousels only fetch data when approaching the viewport. (SC-RE-10-01)
