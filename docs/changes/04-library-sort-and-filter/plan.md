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
3.  **Update Settings Schema**: Update `Settings` schema (if exists) to include `librarySortField` and `librarySortOrder`.

## Phase 2: Application Layer (Composables)

1.  **Refactor `useFilters`**: Update `src/application/use-filters.ts` to:
    - Support the new filter fields.
    - (Optional) Allow creating a "local" filter state instead of always using the global one, enabling separate filters for Home and Library.
    - Update `syncToUrl` and `restoreFromUrl` to handle new fields.
2.  **Create `useSort`**: Create `src/application/use-sort.ts` to manage sorting state and provide a sorting function for `LibraryEntry` items.
    - Support persistence via `useSettings`.
3.  **Update `useLibraryEntries`**: Update `src/application/use-library-entries.ts` to:
    - Accept `FilterState` and `SortState`.
    - Provide a computed `entries` property that applies filtering and sorting logic.

## Phase 3: Presentation Layer (Components)

1.  **Refactor `FilterBar`**: Update `src/presentation/components/home/filter-bar.vue` (and potentially move to `common/`):
    - Accept `filters` as a prop (default to global state if not provided).
    - Add visibility toggles for different filter types (e.g., `showRating`, `showStatus`, `showLists`).
    - Implement Rating Range slider/inputs.
    - Implement List selector (fetching lists via `useLists`).
2.  **Create `SortDropdown`**: Create `src/presentation/components/common/sort-dropdown.vue`.
    - Options: Date Added, Title, Year, Rating.
    - Toggle for Ascending/Descending.
3.  **Update `EntryGrid`**: Add a scoped slot or prop for an empty state when filters return no results.

## Phase 4: Integration

1.  **Update `LibraryScreen`**:
    - Integrate `FilterBar` and `SortDropdown` above the `EntryGrid`.
    - Pass library-specific filter state to `FilterBar`.
    - Use computed sorted/filtered entries from `useLibraryEntries`.
2.  **Update i18n**: Add labels for new filters and sort options to `locales/*.json`.

## Phase 5: Verification

1.  **Unit Tests**:
    - `useFilters.test.ts`: Verify new filter fields and URL sync.
    - `useSort.test.ts`: Verify sorting logic for all fields and orders.
    - `useLibraryEntries.test.ts`: Verify combined filtering and sorting.
2.  **Component Tests**:
    - `SortDropdown.test.ts`: Verify selection and event emission.
    - `FilterBar.test.ts`: Verify visibility of new filters.
3.  **End-to-End/Manual**:
    - Verify filtering "Watchlist" by "Genre".
    - Verify sorting "Custom List" by "Rating".
    - Verify persistence of sort order.
