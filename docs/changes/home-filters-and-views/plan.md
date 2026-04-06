# Plan: Home Screen Filters and View Toggle

## Phase 1: Infrastructure & Schemas

1.  [ ] **Define Filter State & Domain Logic**
    - Create `src/domain/filter.schema.ts` defining `FilterState` (genres, mediaType, yearRange).
    - Implement pure `filterResults(items, filters)` function in the domain layer (AND logic).
    - Add `useFilters` application logic in `src/application/use-filters.ts` to manage the UI state.
    - Unit test for domain logic and `useFilters`.
    - *Covering: HF-04-01, HF-05-01*

2.  [ ] **Genre Fetching & Caching**
    - Update `src/infrastructure/provider.client.ts` with `getGenres` method.
    - Implement genre list fetching and session-based caching in `useFilters`.
    - *Covering: HF-01-01*

## Phase 2: Filtering Components

1.  [ ] **Implement FilterBar Component**
    - Create `src/presentation/components/home/filter-bar.vue`.
    - Add genre multi-select dropdown, media type toggle, and year range inputs using `useFilters`.
    - *Covering: HF-01-01, HF-02-01, HF-03-01*

2.  [ ] **Testing: Filtering Logic (Component/Integration)**
    - Write `tests/presentation/components/home/filter-bar.test.ts` to verify filter updates and interaction.
    - *Covering: HF-01-01, HF-02-01, HF-03-01, HF-09-01*

## Phase 3: Layout Toggle & MovieCard List Variant

1.  [ ] **Implement ViewToggle Component**
    - Create `src/presentation/components/home/view-toggle.vue`.
    - Integrate with `useSettings` (or create it if needed) to persist the chosen layout.
    - *Covering: HF-06-01, HF-06-02, HF-07-01*

2.  [ ] **MovieCard List Variant**
    - Update `src/presentation/components/common/movie-card.vue` to support a `variant="list"` prop.
    - Implement the list layout with title, year, and key metadata shown horizontally.
    - *Covering: HF-06-01*

## Phase 4: Home Screen Integration & URL Sync

1.  [ ] **Integration into Home Screen**
    - Update `src/presentation/views/home-screen.vue` to include `FilterBar` and `ViewToggle`.
    - Apply filters to `TrendingCarousel` and `PopularGrid` by wrapping their results in computed filtered properties.
    - **Logic:** Reset filters when `searchQuery` becomes non-empty (Search Mode) via `useFilters.clearAll()`.
    - *Covering: HF-04-01, HF-05-01, HF-09-02*

2.  [ ] **URL Query String Synchronization**
    - Update `useFilters` to reflect and restore filter state from the URL query string using `vue-router`.
    - *Covering: HF-08-01, HF-08-02*

## Phase 5: Verification

1.  [ ] **Run Unit & Integration Tests**
    - `npm run test`
2.  [ ] **Check TypeScript Types**
    - `npm run type-check`
3.  [ ] **Build Verification**
    - `npm run build`
