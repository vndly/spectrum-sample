# Implementation - Release Calendar Sync

- **Feature ID**: FEAT-06
- **Status**: review
- **Owner**: @max

## Overview

The Release Calendar Sync provides a monthly grid view of upcoming movie releases, integrated with the user's preferred region from settings.

## Technical Approach

### Architecture

Following the 4-layer client-only architecture:

- **Infrastructure**: `provider.client.ts` extended to fetch upcoming movies from TMDB `/movie/upcoming` (`FR-06-04`).
- **Domain**: `calendar.logic.ts` handles pure date calculations and movie grouping, using UTC to ensure consistent day placement (`FR-06-01`, `FR-06-02`).
- **Application**: `use-calendar` manages month/year state and URL persistence (`FR-06-03`). `use-upcoming-movies` orchestrates multi-page data fetching and state (`FR-06-04`, `FR-06-05`).
- **Presentation**: `CalendarGrid` uses Tailwind CSS for the 7-column grid with a list-view fallback for mobile (`FR-06-01`, `NFR-UI/UX`). `ReleaseCard` is a optimized version of `MovieCard` for grid density (`FR-06-02`).

### Data Flow

1. User navigates to `/calendar`.
2. `use-calendar` initializes with the current month/year from URL parameters.
3. `use-upcoming-movies` fetches data for the range, including `region` from `use-settings`.
4. `calendar.logic.ts` groups the results by `release_date`.
5. `CalendarGrid` renders the grouped data, using `SkeletonLoader` for pending states and `EmptyState` for no-data results (`FR-06-06`).

## Key Files

- `src/domain/calendar.logic.ts`: Pure functions for calendar math.
- `src/application/use-calendar.ts`: Composable for navigation and persistence.
- `src/application/use-upcoming-movies.ts`: Composable for fetching/state.
- `src/presentation/components/calendar/CalendarGrid.vue`: Container component.
- `src/presentation/components/calendar/ReleaseCard.vue`: Grid cell component.
- `src/presentation/views/calendar-screen.vue`: Feature entry point.

## Testing Coverage

Testing follows the `docs/technical/testing.md` patterns:

- **Unit (Domain)**: `tests/domain/calendar.logic.test.ts` covers grid generation, leap years, and movie grouping.
- **Unit (Infrastructure)**: `tests/infrastructure/provider.client.calendar.test.ts` validates API mapping.
- **Integration (Application)**: `tests/application/use-calendar.test.ts` and `tests/application/use-upcoming-movies.test.ts` verify state transitions and navigation logic.
- **Component (Presentation)**: Coverage for `CalendarGrid` and `ReleaseCard` ensuring responsive layout and interaction.

## Internationalization

- All UI strings (month names, day headers, empty states) use the `vue-i18n` system.
- Date formatting for the calendar grid uses localized day/month names from the project's translation files.

## Performance Considerations

- **Caching**: API responses are cached in the application layer to optimize navigation between previously loaded months.
- **Density Handling**: For days with more than 3 releases, the grid cell displays the first 2 and a "+X more" indicator to maintain consistent row height.
- **Lazy Loading**: `ReleaseCard` images utilize native lazy-loading and skeleton placeholders.

## Security Considerations

- **Data Validation**: The API response from TMDB is validated against a Zod schema in the Infrastructure layer before entering the Domain layer.
- **Settings Integrity**: `preferredRegion` is validated before being passed as a query parameter.

## Migration & Rollback

- **Migration**: No data migration required as this feature uses live API data.
- **Rollback**: Standard reversal of incremental commits. Deleting the `/calendar` route and new components restores the app to its prior state.
