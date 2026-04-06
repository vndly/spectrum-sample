# Plan: Home Screen Filters and View Toggle

## Phase 1: Infrastructure & Schemas

1.  [ ] **Define Filter State & Types**
    - Create `src/domain/filter.schema.ts` defining `FilterState` (genres, mediaType, yearRange).
    - Add `useFilters` application logic in `src/application/use-filters.ts`.
    - Unit test for `useFilters` covering: initial state, updating filters, AND filtering logic.
    - *Covering: HF-04, HF-05*

2.  [ ] **Genre Fetching & Caching**
    - Update `src/infrastructure/provider.client.ts` with `getGenres` method.
    - Implement genre list fetching and session-based caching in `useFilters`.
    - *Covering: HF-01*

## Phase 2: Filtering Components

1.  [ ] **Implement FilterBar Component**
    - Create `src/presentation/components/home/filter-bar.vue`.
    - Add genre multi-select dropdown (using `useFilters`).
    - Add media type toggle (using `useFilters`).
    - Add year range inputs (using `useFilters`).
    - *Covering: HF-01, HF-02, HF-03*

2.  [ ] **Testing: Filtering Logic (Component/Integration)**
    - Write `tests/presentation/components/home/filter-bar.test.ts` to verify filter updates and state persistence.
    - *Covering: HF-01, HF-02, HF-03, HF-09 (scenarios HF-01-01 to HF-01-05)*

## Phase 3: Layout Toggle & MovieCard List Variant

1.  [ ] **Implement ViewToggle Component**
    - Create `src/presentation/components/home/view-toggle.vue`.
    - Use `localStorage` to persist the chosen layout.
    - Add logic to switch between "grid" and "list".
    - *Covering: HF-06, HF-07*

2.  [ ] **MovieCard List Variant**
    - Update `src/presentation/components/common/movie-card.vue` to support a `variant="list"` prop.
    - Implement the list layout with title, year, and key metadata shown horizontally.
    - *Covering: HF-06*

3.  [ ] **Testing: Layout & Persistence**
    - Write `tests/presentation/components/home/view-toggle.test.ts` to verify layout switching and localStorage persistence.
    - *Covering: HF-06, HF-07 (scenarios HF-06-01 to HF-06-03)*

## Phase 4: Home Screen Integration & URL Sync

1.  [ ] **Integration into Home Screen**
    - Update `src/presentation/views/home-screen.vue` to include `FilterBar` and `ViewToggle`.
    - Ensure filters apply correctly to `TrendingCarousel` and `PopularGrid` (browse results).
    - Handle search mode vs. browse mode interactions.
    - *Covering: HF-04, HF-05*

2.  [ ] **URL Query String Synchronization**
    - Update `useFilters` to reflect and restore filter state from the URL query string using `vue-router`.
    - Ensure URL updates correctly on filter change.
    - *Covering: HF-08*

## Phase 5: Verification

1.  [ ] **Run Unit & Integration Tests**
    - `npm run test` to verify all new and existing tests pass.
2.  [ ] **Check TypeScript Types**
    - `npm run type-check` to ensure no regressions in typing.
3.  [ ] **Build Verification**
    - `npm run build` to confirm the project builds successfully.
