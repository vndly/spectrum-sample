# Plan: Library Management, Sorting, and Filtering

Comprehensive implementation of library status tracking and advanced client-side sorting/filtering.

## Phase 1: Core Management (Infrastructure & Domain)

1. [x] **Define schemas**: Add `LibraryEntrySchema` with `voteAverage` and `releaseDate`.
2. [x] **Storage Service**: Implement CRUD for library entries.
3. [x] **Unit Tests**: Verify schema validation and storage logic.

## Phase 2: Status Tabs (Application & Presentation)

1. [x] **Composables**: Create `useLibraryEntries`.
2. [x] **UI Components**: Create `TabToggle` and `EntryGrid`.
3. [x] **Integration**: Implement `LibraryScreen` with tab-based filtering.
4. [x] **Verification**: Verify status toggling.

## Phase 3: Sorting and Filtering (Domain & Infrastructure)

1. [x] **Settings Schema**: Define canonical `settings` object for persistent preferences.
2. [x] **Logic**: Implement pure predicates and comparators for title, release year, rating, and genre.
3. [x] **Snapshot Extension**: Add `genreIds` to the metadata snapshot on `LibraryEntry`.
4. [x] **Unit Tests**: Verify filtering predicates and sorting comparators.

## Phase 4: Sorting and Filtering (Application & Presentation)

1. [x] **Orchestration**: Create `useLibraryFilters` and `useSort`.
2. [x] **Shared UI**: Extract `FilterBar` shell and create `SortDropdown`.
3. [x] **Integration**: Add sticky filters and sort controls to `LibraryScreen`.
4. [x] **Empty States**: Implement filtered-empty-state logic.

## Phase 5: Refinement and Regressions

1. [x] **i18n**: Add localized labels for all new features (EN, ES, FR).
2. [x] **Home Regression**: Verify `FilterBar` refactor doesn't break Home screen browse filters.
3. [x] **Benchmarks**: Verify < 50ms performance for filtering/sorting 500 entries.

## Phase 6: Final Verification

1. [x] **Automated Suite**: Run all unit, integration, and E2E tests.
2. [x] **Visual Check**: Verify responsive layout and touch targets on mobile.
