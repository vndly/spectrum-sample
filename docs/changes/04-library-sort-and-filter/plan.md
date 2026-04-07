# Plan: Library Sort and Filter (R-06)

Implement advanced sorting and filtering for the library screen by refactoring existing filter components and creating new sorting logic.

## Phase 1: Domain and Infrastructure

1.  **Extend Filter Schema**: Update `src/domain/filter.schema.ts` to include `ratingRange`, `listIds`, and `status` in `FilterStateSchema`.
    - `ratingRange`: `z.tuple([z.number(), z.number()]).nullable()`
    - `listIds`: `z.array(z.string())`
    - `status`: `z.enum(['all', 'watchlist', 'watched'])`
2.  **Add Sort Types**: Define `SortField` and `SortOrder` types in `src/domain/filter.schema.ts`.
    - `SortField`: `dateAdded`, `title`, `year`, `rating`
    - `SortOrder`: `asc`, `desc`
3.  **Update Settings Schema**: Update the existing `Settings` schema in `src/domain/filter.schema.ts` to include `librarySortField` and `librarySortOrder`.

## Phase 2: Application Layer (Composables)

1.  **Refactor `useFilters`**: Update `src/application/use-filters.ts` to support the new filter fields. Update `syncToUrl` and `restoreFromUrl` to handle new fields.
2.  **Create `useSort`**: Create `src/application/use-sort.ts` to manage sorting state and provide a sorting function for `LibraryEntry` items. Support persistence via `useSettings`.
3.  **Update `useLibraryEntries`**: Update `src/application/use-library-entries.ts` to accept `FilterState` and `SortState`. Provide a computed `entries` property that applies filtering and sorting logic.

## Phase 3: Presentation Layer (Components)

1.  **Refactor `FilterBar`**: Update `src/presentation/components/home/filter-bar.vue` and move to `src/presentation/components/common/filter-bar.vue`.
    - Accept `filters` as a prop.
    - Add visibility toggles via props (e.g., `showRating`, `showStatus`, `showLists`).
    - Implement numeric range inputs for Rating Range (matches `LF-03`).
    - Implement List selector using `useLists`.
2.  **Create `SortDropdown`**: Create `src/presentation/components/common/sort-dropdown.vue`. Options: Date Added, Title, Year, Rating. Toggle for Ascending/Descending.
3.  **Update `EntryGrid`**: Add a scoped slot for an empty state when filters return no results.

## Phase 4: Integration and Regression

1.  **Update `LibraryScreen`**:
    - Integrate `FilterBar` and `SortDropdown` above the `EntryGrid`.
    - Pass library-specific filter state to `FilterBar`.
    - Use computed sorted/filtered entries from `useLibraryEntries`.
2.  **Update i18n**: Add labels for new filters and sort options to `locales/*.json`.
3.  **Home Screen Regression**: Verify that `HomeScreen` still functions correctly after the `FilterBar` move and refactor.

## Phase 5: Testing Phase

> **Test-First Order**: All tests below must be written before implementation code and run to confirm failure before the corresponding logic is added.

1.  **Unit Tests**:
    - `tests/application/use-filters.test.ts`: Verify new filter fields and URL sync. (covering: `LF-01` through `LF-05`)
    - `tests/application/use-sort.test.ts`: Verify sorting logic for all fields and orders. (covering: `LS-01` through `LS-04`)
    - `tests/application/use-library-entries.test.ts`: Verify combined filtering and sorting. (covering: `LF-01` through `LS-04`)
2.  **Component Tests**:
    - `tests/presentation/components/common/sort-dropdown.test.ts`: Verify selection and event emission. (covering: `LU-01`)
    - `tests/presentation/components/common/filter-bar.test.ts`: Verify visibility and interaction of new filters. (covering: `LU-02`, `LU-03`, `LU-05`)
    - `tests/presentation/views/library-screen.test.ts`: Verify integration and empty state. (covering: `LU-04`)

## Phase 6: Final Verification

1.  **Build and Lint**: Run `npm run type-check`, `npm run lint`, and `npm run build` to ensure no regressions.
2.  **Manual Verification**:
    - Verify filtering "Watchlist" by "Genre".
    - Verify sorting "Custom List" by "Rating".
    - Verify persistence of sort order survives page reload (covering: `LS-06`).
