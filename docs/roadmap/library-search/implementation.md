# Implementation: Library Search (R-10)

## Overview

The Library Search feature provides a volatile, client-side search capability for the user's library. It allows users to filter their collection by title, tags, and notes with real-time feedback and debounced processing. The implementation follows the project's 4-layer architecture and integrates seamlessly with existing R-05 filters and sorting.

## Files Changed

### Created

- `src/domain/library-search.schema.ts` — Zod schema for search query normalization (trimming, 120-char truncation, lowercasing).
- `src/domain/library-search.logic.ts` — Pure domain logic for literal string matching across title, tags, and notes.
- `src/application/use-library-search.ts` — Composable managing volatile search state with a 300ms debounce.
- `src/presentation/components/common/search-bar.vue` — Refactored, generic search input component shared with the Home screen.
- `tests/domain/library-search.schema.test.ts` — Unit tests for query normalization.
- `tests/domain/library-search.logic.test.ts` — Unit tests for search matching and performance thresholds.
- `tests/application/use-library-search.test.ts` — Tests for debounce, stale timer cancellation, and state management.
- `tests/presentation/components/common/search-bar.test.ts` — Refactored component tests for interaction, focus, and i18n.

### Modified

- `src/application/use-library-entries.ts` — Integrated search filtering into the library data flow before projection.
- `src/presentation/views/library-screen.vue` — Integrated the full-width search bar and refactored controls layout (Genre/Type on left, Sort/Rating on right).
- `src/presentation/components/common/filter-bar.vue` — Added `hideClear` prop to support split-row layouts.
- `src/presentation/views/home-screen.vue` — Updated to use the generic `SearchBar` component.
- `src/presentation/i18n/locales/en.json`, `es.json`, `fr.json` — Added search and empty-state translations.
- `tests/application/use-library-entries.test.ts` — Added search composition regression tests.
- `tests/presentation/views/library-screen.test.ts` — Added integration tests for search and empty states.
- `tests/presentation/i18n/locale-keys.test.ts` — Updated expected i18n keys.
- `docs/roadmap/library-search/requirements.md` — Updated status to `under_test`.
- `docs/roadmap/library-search/plan.md` — Marked all implementation steps as complete.

## Key Decisions

- **Search before Projection**: Search matching is performed against raw `LibraryEntry` data (where tags and notes are available) before it is projected to `LibraryViewItem`. This keeps the presentation model lean while allowing rich search.
- **Volatile State**: Search query is kept in memory only and is not persisted to `localStorage` or synced to the URL, as per requirements.
- **Literal Matching**: Matching uses `String.includes` for predictability and performance, avoiding the complexities and risks of regular expressions.
- **Contextual Empty States**: The empty state dynamically updates its title, description, and CTA based on whether search, filters, or both are active.

## Deviations from Plan

- **camelCase i18n keys**: Renamed `library.search.clear_all` to `library.search.clearAll` to comply with the project's segment-naming convention identified during locale-key validation.

## Testing

- **Domain**: Comprehensive coverage of normalization rules and case-insensitive matching.
- **Application**: Verified 300ms debounce behavior, timer cleanup, and composition with existing filters.
- **Presentation**: Verified responsive placement, clear-button touch targets (size-11/44px), and accessibility labels.
- **Performance**: Confirmed filtering 500 entries takes < 50ms on the application layer.
- **i18n**: Verified key parity and camelCase compliance across all supported locales.

## Dependencies

- No new external dependencies were added. The implementation uses existing project primitives (Vue 3, Zod, Lucide, Tailwind).
