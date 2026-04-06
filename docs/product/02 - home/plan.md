# Plan: Home Screen

## Phase 0: Prerequisites

### 0.1 Verify or Create Base Schemas

- [x] Verify `src/domain/movie.schema.ts` exists with `MovieListItemSchema`
- [x] Verify `src/domain/show.schema.ts` exists with `ShowListItemSchema`

### 0.2 Verify or Create Provider Client

- [x] Verify `src/infrastructure/provider.client.ts` exists

### 0.3 Verify or Create Settings Composable

- [x] Verify `src/application/use-settings.ts` exists

### 0.4 Verify or Create MovieCard Component

- [x] Verify `src/presentation/components/common/movie-card.vue` exists

## Phase 1: Testing — Domain Layer

### 1.1 Write Search Schema Tests

- [x] Create `tests/domain/search.schema.test.ts` (covering: HS-03)

### 1.2 Create Search Schema

- [x] Create `src/domain/search.schema.ts`

### 1.3 Create Search Constants

- [x] Update `src/domain/constants.ts`

## Phase 2: Testing — Infrastructure Layer

### 2.1 Write Search API Tests

- [x] Create `tests/infrastructure/provider.client.search.test.ts` (covering: HS-02, HS-08)

### 2.2 Add Search API Method

- [x] Update `src/infrastructure/provider.client.ts`

## Phase 3: Testing — Application Layer

### 3.1 Write Search Composable Tests

- [x] Create `tests/application/use-search.test.ts` (covering: HS-01, HS-03, HS-06, HS-07, HS-08, HS-09, HS-10, HS-11)

### 3.2 Create Search Composable

- [x] Create `src/application/use-search.ts`

## Phase 4: Testing — Presentation Layer

### 4.1 Write SearchBar Component Tests

- [x] Create `tests/presentation/components/home/search-bar.test.ts` (covering: HS-01, HS-11)

### 4.2 Create SearchBar Component

- [x] Create `src/presentation/components/home/search-bar.vue`

### 4.3 Write SearchResults Component Tests

- [x] Create `tests/presentation/components/home/search-results.test.ts` (covering: HS-04, HS-05, HS-06, HS-07, HS-08)

### 4.4 Create SearchResults Component

- [x] Create `src/presentation/components/home/search-results.vue`

### 4.5 Write MovieCardSkeleton Component Tests

- [x] Create `tests/presentation/components/common/movie-card-skeleton.test.ts` (covering: HS-07)

### 4.6 Create MovieCardSkeleton Component

- [x] Create `src/presentation/components/common/movie-card-skeleton.vue`

### 4.7 Write HomeScreen Integration Tests

- [x] Update `tests/presentation/views/home-screen.test.ts` (covering: HS-05, HS-06, HS-09, HS-10, HS-11)

### 4.8 Update HomeScreen View

- [x] Update `src/presentation/views/home-screen.vue`

### 4.9 Add i18n Keys

- [x] Update `src/presentation/i18n/locales/*.json`

## Phase 5: Search Verification

- [x] Run `npm run lint`
- [x] Run `npm run build`
- [x] Run `npm run test`
- [x] Manual verification of search functionality

---

## Browse Mode Plan

### Phase B1: Infrastructure & Data Fetching

1.  [x] **Update Provider Client** (HB-01, HB-02, HB-03)
2.  [x] **Application Logic: useBrowse** (HB-01, HB-02, HB-03, HB-08, HB-09)

### Phase B2: Browse Components

1.  [x] **Implement TrendingCarousel Component** (HB-04)
2.  [x] **Implement PopularGrid Component** (HB-05)
3.  [x] **Testing: Browse Components** (HB-04, HB-05, HB-07)

### Phase B3: Home Screen Integration

1.  [x] **Integrate Browse Sections** (HB-06)

### Phase B4: Browse Verification

1.  [x] **Run Unit & Integration Tests**
2.  [x] **Check TypeScript Types**
3.  [x] **Build Verification**

---

## Entry Details Plan

### Phase 6: Entry Details Prerequisites

- [x] 6.1 Create Detail Schemas
- [x] 6.2 Create LibraryEntry Schema
- [x] 6.3 Create Shared Sub-schemas
- [x] 6.4 Create Storage Service
- [x] 6.5 Update Settings Composable

### Phase 7: Entry Details - Domain Layer Testing

- [x] 7.1 Write Detail Schema Tests
- [x] 7.2 Create Detail Schemas
- [x] 7.3 Write Library Entry Tests

### Phase 8: Entry Details - Infrastructure Layer Testing

- [x] 8.1 Write Detail API Tests
- [x] 8.2 Add Detail API Methods
- [x] 8.3 Write Storage Tests

### Phase 9: Entry Details - Application Layer Testing

- [x] 9.1 Write Movie Detail Composable Tests
- [x] 9.2 Write Show Detail Composable Tests
- [x] 9.3 Create Detail Composables
- [x] 9.4 Write Library Composable Tests
- [x] 9.5 Create Library Entry Composable

### Phase 10: Entry Details - Presentation Layer Testing

- [x] 10.1-10.22 Create Detail Components (HeroBackdrop, MetadataPanel, CastCarousel, etc.)
- [x] 10.23-10.26 Update MovieScreen and ShowScreen Views
- [x] 10.27 Add i18n Keys

### Phase 11: Entry Details Verification

- [x] Run all tests and manual verification for details functionality

---

## Home Screen Filters and View Toggle Plan

### Phase 12: Infrastructure & Schemas

1.  [x] **Define Filter State & Domain Logic**
    - Create `src/domain/filter.schema.ts` defining `FilterState` (genres, mediaType, yearRange).
    - Implement pure `filterResults(items, filters)` function in `src/domain/filter.logic.ts` (AND logic).
    - Add `useFilters` application logic in `src/application/use-filters.ts` to manage the UI state.
    - Unit test for `filter.logic.ts` and `useFilters.ts`.
    - _Covering: HF-04-01, HF-05-01_

2.  [x] **Genre Fetching & Caching**
    - Update `src/infrastructure/provider.client.ts` with `getGenres` method.
    - Implement genre list fetching and session-based caching in `useFilters`.
    - _Covering: HF-01-01_

### Phase 13: Filtering Components

1.  [x] **Implement FilterBar Component**
    - Create `src/presentation/components/home/filter-bar.vue`.
    - Add genre multi-select dropdown, media type toggle, and year range inputs using `useFilters`.
    - _Covering: HF-01-01, HF-02-01, HF-03-01_

2.  [x] **Testing: Filtering Logic (Component/Integration)**
    - Write `tests/presentation/components/home/filter-bar.test.ts` to verify filter updates and interaction.
    - _Covering: HF-01-01, HF-02-01, HF-03-01, HF-09-01_

### Phase 14: Layout Toggle & MovieCard List Variant

1.  [x] **Implement ViewToggle Component**
    - Create `src/presentation/components/home/view-toggle.vue`.
    - Integrate with `useSettings` to persist the chosen layout.
    - _Covering: HF-06-01, HF-06-02, HF-07-01_

2.  [x] **MovieCard List Variant**
    - Update `src/presentation/components/common/movie-card.vue` to support a `variant="list"` prop.
    - Implement the list layout with title, year, and key metadata shown horizontally.
    - _Covering: HF-06-01_

### Phase 15: Home Screen Integration & URL Sync

1.  [x] **Integration into Home Screen**
    - Update `src/presentation/views/home-screen.vue` to include `FilterBar` and `ViewToggle`.
    - Apply filters to `TrendingCarousel` and `PopularGrid` by wrapping their results in computed filtered properties.
    - **Logic:** Reset filters when `searchQuery` becomes non-empty (Search Mode) via `useFilters.clearAll()`.
    - _Covering: HF-04-01, HF-05-01, HF-09-02_

2.  [x] **URL Query String Synchronization**
    - Update `useFilters` to reflect and restore filter state from the URL query string using `vue-router`.
    - _Covering: HF-08-01, HF-08-02_

### Phase 16: Filters & Views Verification

1.  [x] **Run Unit & Integration Tests**
    - `npm run test`
2.  [x] **Manual UI Verification**
    - Verify layout switching and persistence.
    - Verify URL query parameters update and restoration.
3.  [x] **Check TypeScript Types**
    - `npm run type-check`
4.  [x] **Build Verification**
    - `npm run build`
