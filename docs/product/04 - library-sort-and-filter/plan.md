# Plan: Library Sort and Filter (R-06)

Implement advanced sorting and filtering for the Library screen by reusing the Home filter presentation patterns, keeping Library state local, and normalizing the persisted `LibraryEntry` metadata snapshot into `LibraryViewItem`.

## Phase 1: Domain and Infrastructure

1. [x] **Define library-specific filter and sort state**: Update `src/domain/filter.schema.ts` to add a Library-only filter schema with `ratingMin`, `ratingMax`, `listIds`, and `status`, plus `SortField` and `SortOrder`.
   - Keep Home browse filters available without changing their existing URL-sync contract.
   - `status` is only active on the Lists view and must support `watchlist`, `watched`, `none`, and `all`.
   - `listIds` is only active on Watchlist and Watched views.
2. [x] **Extend the authoritative library metadata snapshot**: Update `src/domain/library.schema.ts` and the promotion notes so `LibraryEntry` remains the persisted source for local sort/filter metadata.
   - Preserve the existing persisted `title`, `posterPath`, `releaseDate`, and `voteAverage` snapshot fields as the authoritative inputs for Library sorting and filtering.
   - Add optional persisted `genreIds` for R-06 so genre filtering can stay local.
   - Document schema-version impact, backfill strategy, and rollback behavior when `genreIds` is absent on older entries.
3. [x] **Introduce canonical Settings persistence**: Add `src/domain/settings.schema.ts` (or an adjacent equivalent) and matching `src/infrastructure/storage.service.ts` APIs for optional `librarySortField` and `librarySortOrder`.
   - Migrate `useSettings()` off the standalone `layoutMode` key and into the canonical `settings` object.
   - Missing or ignored sort settings must safely fall back to `dateAdded` + `desc` (`LS-05`).
4. [x] **Define `LibraryViewItem` and pure logic**: Extend `src/domain/filter.logic.ts` or add an adjacent domain logic file with pure predicates and comparators for Library sorting/filtering.
   - Normalize persisted snapshot fields into `displayTitle`, `releaseYear`, `genreIds`, `rating`, `status`, `listIds`, and `addedAt`.
   - Keep interactive filtering local; no live provider fetch is required on each filter or sort interaction.
5. [x] **Write domain and infrastructure tests first**:
   - `tests/domain/filter.logic.test.ts`: library sort/filter predicates and active-filter-category counting. (covering: `LF-01-01`, `LF-01-02`, `LF-02-01`, `LF-03-01`, `LF-03-02`, `LF-04-01`, `LF-05-01`, `LF-06-01`, `LS-01-01`, `LS-01-02`, `LS-02-01`, `LS-03-01`, `LS-04-01`)
   - `tests/infrastructure/storage.service.test.ts` or `tests/infrastructure/storage.service.settings.test.ts`: sort-setting defaults, persistence, and fallback behavior. (covering: `LS-05-01`, `LS-06-01`, plus `(implementation detail)` settings migration fallback and missing-`genreIds` backfill handling)

## Phase 2: Application Layer (Composables)

1. [x] **Create Library-local filter orchestration**: Add `src/application/use-library-filters.ts` for Library-only filter state.
   - Do not change Home's `syncToUrl` / `restoreFromUrl`.
   - `Clear All` resets only the visible filters for the current scope and preserves the active tab or selected custom list.
2. [x] **Update `useLibraryEntries` to compose the Library dataset**: Update `src/application/use-library-entries.ts` to build `LibraryViewItem[]` from the persisted metadata snapshot on `LibraryEntry`.
   - Apply base tab/list scoping first, then Library filters, then sorting.
   - Treat `genreIds` as optional snapshot data with the documented backfill fallback.
3. [x] **Create `useSort`**: Create `src/application/use-sort.ts` to manage selected sort field and order using the canonical settings API and domain comparators.
4. [x] **Write application tests first**:
   - `tests/application/use-library-filters.test.ts`: scope-specific filter availability and clear-all behavior. (covering: `LF-04-02`, `LF-05-02`, `LF-07-01`, `LF-07-02`, `LU-03-01`, `LU-03-02`)
   - `tests/application/use-library-entries.test.ts`: composed dataset scoping, AND filter composition, and sort integration. (covering: `LF-01-01`, `LF-01-02`, `LF-02-01`, `LF-04-01`, `LF-05-01`, `LS-01-01`, `LS-01-02`, `LS-02-01`, `LS-03-01`, `LS-04-01`)

## Phase 3: Presentation Layer (Components)

1. [x] **Extract a presentation-only `FilterBar` shell**: Update `src/presentation/components/home/filter-bar.vue` and create `src/presentation/components/common/filter-bar.vue` if needed.
   - Accept props for visible controls, active values, active-category count, and callbacks.
   - Keep Home's existing query-sync behavior outside the shared component.
   - Support Library rating inputs, watch-status selection, custom-list selection, badge behavior, and clear-all behavior without changing Home's field set.
2. [x] **Create `SortDropdown`**: Create `src/presentation/components/common/sort-dropdown.vue` with localized options for Date Added, Title, Release Year, and User Rating plus ascending/descending selection.
3. [x] **Update `LibraryScreen` presentation behavior**:
   - Render `FilterBar` directly below the header/tab row in a sticky container.
   - Preserve the `R-05` base empty states for truly empty tabs/lists.
   - Add a dedicated filtered-empty-state branch with "No items match your filters" and `Clear All` only when filters collapse a non-empty scope to zero results.
   - Verify responsive layout and 44x44 touch targets for all interactive controls.
4. [x] **Write presentation tests first**:
   - `tests/presentation/components/common/sort-dropdown.test.ts`: visible sort control labels and selection behavior. (covering: `LU-01-01`)
   - `tests/presentation/components/common/filter-bar.test.ts`: badge semantics and context-specific controls. (covering: `LF-06-02`, `LU-03-01`, `LU-03-02`, `LU-03-03`)
   - `tests/presentation/views/library-screen.test.ts`: sticky placement, responsive behavior, default sort rendering, empty-state branches, and restore-after-clear behavior. (covering: `LU-02-01`, `LU-02-02`, `LU-04-01`, `LU-04-02`, `LS-05-01`, `LS-05-02`, `LF-07-01`, `LF-07-02`)

## Phase 4: Integration and Regression

1. [x] **Update `LibraryScreen` integration**:
   - Integrate `FilterBar` and `SortDropdown` above the `EntryGrid`.
   - Pass Library-specific filter state to `FilterBar`.
   - Respect the control-availability rules for Watchlist, Watched, and Lists contexts.
   - Use the composed, sorted, and filtered dataset from `useLibraryEntries`.
2. [x] **Update i18n**: Add labels for new filters and sort options to `src/presentation/i18n/locales/en.json`, `es.json`, and `fr.json`, and keep `tests/presentation/i18n/locale-keys.test.ts` passing.
3. [x] **Add explicit Home regression coverage**:
   - Extend `tests/presentation/components/home/filter-bar.test.ts` or `tests/presentation/views/home-screen.test.ts`.
   - Re-verify Home's existing `FilterBar` contract after extraction. (covering dependency regressions: `HF-01`, `HF-02`, `HF-03`, `HF-08`, `HF-09`, and `LU-03-03`)
4. [x] **Record affected-doc coverage**:
   - Promotion must update `docs/product/02 - home/requirements.md` and Home scenarios for the shared `FilterBar` contract.
   - Promotion must update `docs/product/03 - library/requirements.md` and `docs/product/03 - library/implementation.md` for the previous "sorting/filtering is out of scope" note and metadata snapshot contract.
   - Promotion must update `docs/technical/data-model.md` for `LibraryEntry` and canonical `Settings` changes.

## Phase 5: Testing Phase

> **Test-First Order**: All tests below must be written before implementation code and run to confirm failure before the corresponding logic is added.

1. [x] **Keep the scenario-to-test map explicit**:
   - `tests/domain/filter.logic.test.ts`: `LF-01-01`, `LF-01-02`, `LF-02-01`, `LF-03-01`, `LF-03-02`, `LF-04-01`, `LF-05-01`, `LF-06-01`, `LS-01-01`, `LS-01-02`, `LS-02-01`, `LS-03-01`, `LS-04-01`
   - `tests/infrastructure/storage.service.test.ts` or `tests/infrastructure/storage.service.settings.test.ts`: `LS-05-01`, `LS-06-01`, `(implementation detail)` settings migration fallback, `(implementation detail)` `genreIds` backfill
   - `tests/application/use-library-filters.test.ts`: `LF-04-02`, `LF-05-02`, `LF-07-01`, `LF-07-02`, `LU-03-01`, `LU-03-02`
   - `tests/application/use-library-entries.test.ts`: `LF-01-01`, `LF-01-02`, `LF-02-01`, `LF-04-01`, `LF-05-01`, `LS-01-01`, `LS-01-02`, `LS-02-01`, `LS-03-01`, `LS-04-01`
   - `tests/presentation/components/common/sort-dropdown.test.ts`: `LU-01-01`
   - `tests/presentation/components/common/filter-bar.test.ts`: `LF-06-02`, `LU-03-01`, `LU-03-02`, `LU-03-03`
   - `tests/presentation/views/library-screen.test.ts`: `LU-02-01`, `LU-02-02`, `LU-04-01`, `LU-04-02`, `LS-05-01`, `LS-05-02`, `LF-07-01`, `LF-07-02`
   - `tests/presentation/views/home-screen.test.ts` or `tests/presentation/components/home/filter-bar.test.ts`: `LU-03-03`, plus Home dependency regressions `HF-01`, `HF-02`, `HF-03`, `HF-08`, `HF-09`
2. [x] **Keep non-scenario tests labeled**:
   - Any test step that does not map to a scenario must be marked `(implementation detail)`.

## Phase 6: Final Verification

1. [x] **Automated Verification**: Run `npm run test`, `npm run type-check`, `npm run lint`, and `npm run build` (or `npm run check`) to ensure no regressions.
2. [x] **Benchmark and responsive verification**:
   - Verify filtering on a 500-entry fixture completes in under 50 ms in the documented benchmark environment. (covering: `LN-01`)
   - Verify sorting on a 500-entry fixture completes in under 50 ms in the documented benchmark environment. (covering: `LN-02`)
   - Verify mobile breakpoint layout and 44x44 touch targets for Library controls. (covering: `LU-02-02`, `LN-04`)
3. [x] **Manual Verification**:
   - Verify Watchlist scope + genre multi-select stays on the Watchlist tab and `Clear All` restores Watchlist results. (covering: `LF-01-01`, `LF-01-02`, `LF-07-01`)
   - Verify Lists scope + watch-status filtering supports Watchlist, Watched, Untracked, and All while preserving the selected list. (covering: `LF-04-01`)
   - Verify Watched scope + custom-list filtering and Lists hidden-state rules behave correctly. (covering: `LF-05-01`, `LF-05-02`, `LF-04-02`)
   - Verify the filtered-empty-state and base-empty-state branches behave correctly. (covering: `LU-04-01`, `LU-04-02`)
   - Verify the default sort label in English and French plus persisted sort restore after reload. (covering: `LS-05-01`, `LS-05-02`, `LS-06-01`)
