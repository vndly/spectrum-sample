# Implementation: Library Sort and Filter (R-06)

## Overview

Implemented advanced client-side sorting and filtering for the Library screen. The implementation follows a 4-layer architecture, centralizing logic in the Domain layer and orchestrating it through Application layer composables. A shared `FilterBar` component was extracted to maintain UI consistency between Home and Library screens while supporting context-specific controls.

## Files Changed

### Created

- `src/domain/settings.schema.ts` — Defined canonical settings schema including theme, language, and library sort preferences.
- `src/application/use-library-filters.ts` — Orchestrates library-specific filter state and active filter counting.
- `src/application/use-sort.ts` — Manages persistent library sort field and order using the settings API.
- `src/application/use-genres.ts` — Shared composable for fetching and caching genres in memory.
- `src/presentation/components/common/filter-bar.vue` — Generic presentation-only filter bar supporting both Home and Library field sets.
- `src/presentation/components/common/sort-dropdown.vue` — Localized sorting control for the library.
- `tests/infrastructure/storage.service.settings.test.ts` — Unit tests for settings persistence and migration.
- `tests/application/use-library-filters.test.ts` — Unit tests for library filter orchestration.
- `tests/presentation/components/common/sort-dropdown.test.ts` — Unit tests for sort dropdown rendering.

### Modified

- `src/domain/filter.schema.ts` — Added `LibraryFilterStateSchema`, `SortField`, and `SortOrder`.
- `src/domain/library.schema.ts` — Added `genreIds` to `LibraryEntrySchema` for local filtering.
- `src/domain/filter.logic.ts` — Added `LibraryViewItem` normalization and pure predicates/comparators for library logic.
- `src/infrastructure/storage.service.ts` — Added settings persistence and migration from standalone `layoutMode` key.
- `src/application/use-library-entries.ts` — Updated to compose, filter, and sort the library dataset reactively.
- `src/application/use-filters.ts` — Refactored to use `useGenres` and `ref` for better `v-model` compatibility.
- `src/application/use-settings.ts` — Migrated to the new canonical settings object.
- `src/presentation/components/home/filter-bar.vue` — Refactored to use the new shared `FilterBar` component.
- `src/presentation/views/library-screen.vue` — Integrated filtering, sorting, and new empty-state branches.
- `src/presentation/components/home/popular-grid.vue` — Fixed missing import for `MediaResult`.
- `src/infrastructure/provider.client.ts` — Fixed `any` types in popular movie/show fetching.
- `src/presentation/i18n/locales/*.json` — Added localized labels for sorting and filtering.
- `docs/technical/data-model.md` — Updated documentation for `LibraryEntry` and `Settings`.
- `tests/domain/filter.logic.test.ts` — Added unit tests for library-specific logic.
- `tests/application/use-library-entries.test.ts` — Added tests for filtered and sorted dataset composition.
- `tests/presentation/components/home/filter-bar.test.ts` — Updated to match new `FilterBar` contract.

## Key Decisions

- **Local Metadata Snapshot**: Expanded `LibraryEntry` to include `genreIds`, `releaseDate`, and `voteAverage`. This allows fully local sorting and filtering without TMDB API hits on every interaction.
- **Shared FilterBar Component**: Extracted logic from Home's filter bar into a shared component to ensure visual consistency and reduce code duplication.
- **Canonical Settings Object**: Grouped standalone settings (like `layoutMode`) into a single `settings` object in `localStorage` for better maintainability and extensibility.
- **AND Logic for Genres**: Followed the project standard of `AND` logic for genre filtering within the active library scope.

## Deviations from Plan

- **useGenres Composable**: Added `src/application/use-genres.ts` to share genre caching between Home and Library, which was not explicitly listed in the plan but identified as a technical necessity during implementation.
- **useFilters Refactor**: Changed `filters` from `reactive` to `ref` in `useFilters.ts` to improve compatibility with `v-model` on the new shared `FilterBar` component.

## Testing

- **Unit Tests**:
  - `filter.logic.test.ts`: Verified normalization, filtering predicates, and sorting comparators.
  - `storage.service.settings.test.ts`: Verified settings persistence and migration from old schema.
  - `use-library-filters.test.ts`: Verified active filter counting and clear-all behavior.
- **Integration Tests**:
  - `use-library-entries.test.ts`: Verified reactive composition of the library dataset with active filters and sort.
  - `library-screen.test.ts`: Verified correct rendering of empty states and component integration.
- **Regression Tests**:
  - `home-screen.test.ts`: Confirmed no breakage on the home screen after `FilterBar` refactor.
- **Automated Suite**: `npm run test` passed with 501 tests successful.

## Dependencies

- No new external dependencies were added. Existing dependencies (Vue 3, Zod, Vitest, Lucide Vue Next) were utilized.

## Performance Impact

- **Client-side Filtering/Sorting**: Logic runs in O(N log N) for sorting and O(N) for filtering. With typical library sizes (< 1000 items), performance is well within the 50ms requirement.
- **Genre Caching**: `useGenres` prevents redundant TMDB API calls when switching between screens.

## Internationalization

- All new strings are integrated into the `vue-i18n` system.
- Support added for English, Spanish, and French locales.
- Special attention given to the default sort label in French: "Date d'ajout (plus récent d'abord)".
