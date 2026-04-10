# Plan: Library Sort and Filter (R-06)

Implement advanced sorting and filtering for the library screen by reusing the Home filter presentation patterns, keeping Library state local, and introducing a non-persisted library read model for metadata-dependent sorting and filtering.

## Phase 1: Domain and Infrastructure

1.  **Define library-specific filter and sort state**: Update `src/domain/filter.schema.ts` to add a library-only filter schema (or equivalent adjacent domain type) with `ratingRange`, `listIds`, and `status`, plus `SortField` and `SortOrder`.
    - Keep Home browse filters available without changing their existing URL-sync contract.
    - `status` is only active on the Lists view; `listIds` is only active on Watchlist and Watched views.
2.  **Define the library read model and pure logic**: Extend `src/domain/filter.logic.ts` or add an adjacent domain logic file with pure predicates and comparators for Library sorting/filtering.
    - Operate on a non-persisted `LibraryViewItem` shape that normalizes `displayTitle`, `releaseYear`, `genreIds`, `rating`, `status`, `listIds`, and `addedAt`.
    - Treat title, release year, and genres as validated provider metadata joined onto `LibraryEntry`, not as new canonical persisted `LibraryEntry` fields.
3.  **Persist sort settings through the canonical storage path**: Introduce a real domain settings schema (for example `src/domain/settings.schema.ts`) and matching storage-service read/write APIs for optional `librarySortField` and `librarySortOrder`.
    - Missing settings must fall back to `dateAdded` + `desc` (`LS-05`).
    - If the fields are additive and optional, document that no schema-version bump is needed; if implementation makes them required, add a schema-version bump and migration before rollout.
    - Removing or ignoring the new fields must safely fall back to `LS-05` defaults.
4.  **Write domain and infrastructure tests first**:
    - `tests/domain/filter.logic.test.ts`: library sort/filter predicates and active-filter-category counting. (covering: `LF-01-01`, `LF-02-01`, `LF-03-01`, `LF-03-02`, `LF-06-01`, `LS-01-01`, `LS-01-02`, `LS-02-01`, `LS-03-01`, `LS-04-01`)
    - `tests/infrastructure/storage.service.test.ts` or `tests/infrastructure/storage.service.settings.test.ts`: optional settings defaults, persistence, and fallback behavior. (covering: `LS-05-01`, `LS-05-02`, `LS-06-01`)

## Phase 2: Application Layer (Composables)

1.  **Create library-local filter orchestration**: Add `src/application/use-library-filters.ts` for Library-only filter state.
    - Do not change Home's `syncToUrl` / `restoreFromUrl`.
    - `Clear All` resets visible filters only and preserves the active tab or selected list.
2.  **Update `useLibraryEntries` to compose the library view dataset**: Update `src/application/use-library-entries.ts` to build `LibraryViewItem[]` by joining `LibraryEntry` user state with validated provider metadata required for title, release-year, and genre operations.
    - Apply base tab/list scoping first, then Library filters, then sorting.
3.  **Create `useSort`**: Create `src/application/use-sort.ts` to manage selected sort field/order using the canonical settings API and the domain comparators.
4.  **Write application tests first**:
    - `tests/application/use-library-filters.test.ts`: context-specific filter availability and clear-all behavior. (covering: `LF-04-01`, `LF-04-02`, `LF-05-01`, `LF-06-02`, `LF-07-01`, `LU-03-01`)
    - `tests/application/use-library-entries.test.ts`: composed dataset scoping, AND filter composition, and sort integration. (covering: `LF-01-01`, `LF-02-01`, `LF-05-01`, `LS-01-01`, `LS-02-01`, `LS-03-01`, `LS-04-01`)

## Phase 3: Presentation Layer (Components)

1.  **Extract a presentation-only `FilterBar` shell**: Update `src/presentation/components/home/filter-bar.vue` and create `src/presentation/components/common/filter-bar.vue` if needed.
    - Accept filter state and visibility flags as props.
    - Keep Home's existing query-sync behavior outside the shared component.
    - Use the visible labels Date Added, Title, Release Year, and User Rating.
    - Badge counts active categories, not selected values.
2.  **Create `SortDropdown`**: Create `src/presentation/components/common/sort-dropdown.vue` with localized options for Date Added, Title, Release Year, and User Rating plus ascending/descending selection.
3.  **Keep filtered-empty-state handling in `LibraryScreen`**:
    - Preserve the `R-05` base empty states for truly empty tabs/lists.
    - Add a dedicated filtered-empty-state branch with "No items match your filters" and `Clear All` only when filters collapse a non-empty scope to zero results.
4.  **Write presentation tests first**:
    - `tests/presentation/components/common/sort-dropdown.test.ts`: visible sort control labels and selection behavior. (covering: `LU-01-01`)
    - `tests/presentation/components/common/filter-bar.test.ts`: context-specific filters, badge semantics, and clear-all behavior. (covering: `LF-06-01`, `LF-06-02`, `LU-02-01`, `LU-03-01`)
    - `tests/presentation/views/library-screen.test.ts`: scoped filtering, filtered empty state, and restore-after-clear behavior. (covering: `LU-04-01`, `LF-07-01`)

## Phase 4: Integration and Regression

1.  **Update `LibraryScreen`**:
    - Integrate `FilterBar` and `SortDropdown` above the `EntryGrid`.
    - Pass Library-specific filter state to `FilterBar`.
    - Respect the control-availability rules for Watchlist, Watched, and Lists contexts.
    - Use the composed/sorted/filtered dataset from `useLibraryEntries`.
2.  **Update i18n**: Add labels for new filters and sort options to `src/presentation/i18n/locales/en.json`, `es.json`, and `fr.json`, and keep `tests/presentation/i18n/locale-keys.test.ts` passing. (covering: `LS-05-02`)
3.  **Home Screen Regression**: Verify that `HomeScreen` still functions correctly after the shared `FilterBar` extraction without changing Home filter fields or URL query sync. (`implementation detail`)
4.  **Record affected-doc coverage**: Note that promotion must update `docs/product/03 - library/` and the shared filter references in `docs/product/02 - home/`.

## Phase 5: Testing Phase

> **Test-First Order**: All tests below must be written before implementation code and run to confirm failure before the corresponding logic is added.

1.  **Keep scenario mapping complete**:
    - Every scenario ID in `docs/changes/04-library-sort-and-filter/scenarios/` must appear in at least one test step above.
    - Tests that do not map to a scenario must be labeled `(implementation detail)`.

## Phase 6: Final Verification

1.  **Automated Verification**: Run `npm run test`, `npm run type-check`, `npm run lint`, and `npm run build` (or `npm run check`) to ensure no regressions.
2.  **Manual Verification**:
    - Verify Watchlist scope + genre filtering stays on the Watchlist tab and `Clear All` restores the Watchlist results. (covering: `LF-01-01`, `LF-07-01`)
    - Verify Lists scope + watch-status filtering refines the selected custom list without changing the selected list. (covering: `LF-04-01`, `LF-04-02`)
    - Verify the filtered-empty-state appears only from a previously populated scope and `Clear All` restores that scope. (covering: `LU-04-01`)
    - Verify default sort and sort persistence in English and one non-default locale. (covering: `LS-05-01`, `LS-05-02`, `LS-06-01`)
