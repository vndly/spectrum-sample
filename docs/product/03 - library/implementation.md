# Implementation: Library Management, Sorting, and Filtering

## Overview

The Library Management system provides users with a focused set of tools to organize and discover their media collection. It implements categorization into "Watchlist" and "Watched" statuses plus advanced client-side sorting and filtering. The implementation follows the project's 4-layer architecture, ensuring strict separation between UI, orchestration, business rules, and persistence.

Key highlights:

- **Local-first persistence**: All data is stored in `localStorage` with Zod validation.
- **Advanced Filtering/Sorting**: Logic runs locally on metadata snapshots, ensuring instantaneous responses (< 50ms).
- **Shared UI Components**: Extracted a generic `FilterBar` to maintain consistency between Home and Library screens.
- **Status Integration**: Watchlist and watched controls are integrated into individual detail screens.

## Files Changed

### Created

- `src/domain/settings.schema.ts` — Canonical settings schema for preferences.
- `src/application/use-library-entries.ts` — Composable for filtering and retrieving library entries.
- `src/application/use-library-filters.ts` — Orchestrates library-specific filter state.
- `src/application/use-sort.ts` — Manages persistent library sort preferences.
- `src/application/use-genres.ts` — Shared composable for caching genres in memory.
- `src/presentation/components/common/tab-toggle.vue` — Reusable tab switcher.
- `src/presentation/components/common/entry-grid.vue` — Responsive grid for cards.
- `src/presentation/components/common/filter-bar.vue` — Generic presentation-only filter bar.
- `src/presentation/components/common/sort-dropdown.vue` — Localized sorting control.

### Modified

- `src/domain/library.schema.ts` — Updated `LibraryEntrySchema` with `voteAverage`, `releaseDate`, and `genreIds`.
- `src/domain/filter.schema.ts` — Added `LibraryFilterStateSchema`, `SortField`, and `SortOrder`.
- `src/domain/filter.logic.ts` — Added predicates and comparators for library logic.
- `src/infrastructure/storage.service.ts` — Added methods for settings persistence and metadata snapshots.
- `src/application/use-settings.ts` — Migrated to the new canonical settings object.
- `src/presentation/views/library-screen.vue` — Implemented the full dashboard with sticky filters and sorting.
- `src/presentation/views/movie-screen.vue` & `show-screen.vue` — Integrated status controls and metadata capture.

## Key Decisions

- **Metadata Snapshotting**: Storing `voteAverage`, `releaseDate`, and `genreIds` directly in `LibraryEntry` avoids expensive API calls during rendering and allows fully local sorting/filtering.
- **Canonical Settings Object**: Grouped standalone settings into a single `settings` object in `localStorage` for better maintainability.
- **Shared FilterBar**: Extracted UI patterns into a shared component to ensure visual consistency while keeping Library state isolated from Home's URL-synced state.
- **AND Logic for Filters**: Filters refine the currently active tab rather than replacing it.

## Deviations from Plan

- **useGenres Composable**: Added to share genre caching between screens, which was identified as a technical necessity during implementation.
- **Metadata Redundancy**: Expanded the snapshot beyond the initial plan to support the full range of requirements for card rendering and sorting.

## Testing

- **Domain**: 100% coverage for schemas, predicates, and comparators.
- **Infrastructure**: Verified library entry CRUD and settings migration.
- **Application**: Verified reactive composition of the library dataset with active filters and sort.
- **Presentation**: Verified tab switching, grid rendering, sticky behavior, and empty states.
- **Performance**: Confirmed filtering and sorting on 500 entries completes in ~2ms.

## Dependencies

- **lucide-vue-next**: Core icon set.
- **vue-i18n**: Localization.
- **chart.js & vue-chartjs**: (Note: used by Stats feature, but integrated with Library data).

## Internationalization

- Full support for English, Spanish, and French.
- Specialized attention to localized sort labels (e.g., "Date d'ajout").
