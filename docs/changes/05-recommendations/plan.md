# Plan - Recommendations

Implementation of personalized recommendations based on library seeds.

## Phase 1: Domain & Infrastructure

Implement the core logic for seed selection, deduplication, and API integration.

- [ ] **Step 1.1: Add Recommendations to API Client**: Extend `provider.client.ts` to include `getMovieRecommendations(id, language)` and `getShowRecommendations(id, language)` methods. (RE-02)
  - **File**: `src/infrastructure/provider.client.ts`
  - **Details**: Use `/movie/{id}/recommendations` and `/tv/{id}/recommendations`. (Rollback: Additive, non-destructive).
- [ ] **Step 1.2: Unit Tests for Seed Selection**: Write tests for the seed selection logic with various library states. (RE-01)
  - **File**: `tests/domain/recommendations.logic.test.ts`
  - **Covering**: SC-RE-01-01, SC-RE-01-02, SC-RE-01-03
- [ ] **Step 1.3: Implement Seed Selection Logic**: Create a domain function to select up to 5 seed entries from the library based on ratings and recency. (RE-01)
  - **File**: `src/domain/recommendations.logic.ts`
  - **Details**: Priority: Rating (5-1) > Last Added/Watched date. (Implementation detail: Use most recent date in `watchDates`).
- [ ] **Step 1.4: Unit Tests for Deduplication**: Write tests for deduplication and library filtering. (RE-03, RE-04)
  - **File**: `tests/domain/recommendations.logic.test.ts`
  - **Covering**: SC-RE-03-01
- [ ] **Step 1.5: Implement Deduplication Logic**: Create a domain function to deduplicate results across multiple seeds and filter out library entries. (RE-03, RE-04)
  - **File**: `src/domain/recommendations.logic.ts`

## Phase 2: Application Logic

Create the composable to orchestrate seed selection and recommendation fetching.

- [ ] **Step 2.1: Create useRecommendations Composable**: Implement `useRecommendations` to manage the lifecycle of fetching recommendations for all seeds. (RE-02, RE-08, RE-09)
  - **File**: `src/application/use-recommendations.ts`
  - **Details**: Fetches seeds, then calls API in parallel for each. Manages loading/error states for the whole set or individual sections.

## Phase 3: Presentation

Integrate recommendations into the Home screen.

- [ ] **Step 3.1: Create RecommendationCarousel Component**: Build a new carousel component for recommendation sections that follows the `TrendingCarousel` layout. (RE-05)
  - **File**: `src/presentation/components/home/RecommendationCarousel.vue`
  - **Details**: Use `vue-i18n` for dynamic labels like "Because you liked {title}".
- [ ] **Step 3.2: Update Home View**: Integrate the recommendations sections into `home-screen.vue`. (RE-05, RE-06, RE-07)
  - **File**: `src/presentation/views/home-screen.vue`
  - **Details**: Display "Recommended for You" sections above Trending if seeds exist.
- [ ] **Step 3.3: Handle Loading/Error States**: Ensure skeleton loaders and error states are correctly displayed for each recommendation section. (RE-08, RE-09)

## Phase 4: Verification

- [ ] **Step 4.1: Automated Tests**: Run all unit and integration tests.
  - **Command**: `npm run test`
- [ ] **Step 4.2: Manual Verification**:
  - [ ] Verify recommendations appear for a library with rated items. (SC-RE-01-01)
  - [ ] Verify "Because you liked {title}" labels are correct. (RE-05)
  - [ ] Verify no duplicates across sections. (SC-RE-03-01)
  - [ ] Verify library entries are excluded. (SC-RE-03-01)
  - [ ] Verify fallback to Trending/Popular when library is empty. (SC-RE-02-01)
  - [ ] Verify independent error handling by mocking a failed API call for one seed. (RE-08)
