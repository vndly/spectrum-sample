# Plan - Release Calendar Sync

Implementation plan for the monthly release calendar.

## Phase 1: Infrastructure Updates

- [ ] **Step 1.1**: Update `src/infrastructure/provider.client.ts` to include `getUpcomingMovies(language: string, region: string, page: number)`.
- [ ] **Step 1.2**: Add test for `getUpcomingMovies` in `tests/infrastructure/provider.client.calendar.test.ts`.

## Phase 2: Domain Layer

- [ ] **Step 2.1**: Update `src/domain/movie.schema.ts` if any additional fields are needed for `MovieListItem` (likely `release_date` is already there).
- [ ] **Step 2.2**: Create `src/domain/calendar.logic.ts` for pure functions like getting days of a month, determining day of the week, and grouping movies by date.

## Phase 3: Application Layer

- [ ] **Step 3.1**: Create `src/application/use-upcoming-movies.ts` to fetch and manage upcoming movies state (loading, error, list).
- [ ] **Step 3.2**: Create `src/application/use-calendar.ts` to manage calendar state (current month, year, navigation methods).
- [ ] **Step 3.3**: Write tests for `use-upcoming-movies` and `use-calendar`.

## Phase 4: Presentation Layer

- [ ] **Step 4.1**: Create `src/presentation/components/calendar/ReleaseCard.vue` to display a single release in a grid cell.
- [ ] **Step 4.2**: Create `src/presentation/components/calendar/CalendarGrid.vue` for the monthly view.
- [ ] **Step 4.3**: Update `src/presentation/views/calendar-screen.vue` to integrate the grid and navigation.
- [ ] **Step 4.4**: Add internationalization keys for the calendar in `src/presentation/i18n/locales/en.json` (and other languages if applicable).

## Verification Phase

- [ ] **Run all tests**: `npm run test`
- [ ] **Visual check**: Open `/calendar` and verify month rendering.
- [ ] **Interaction check**: Verify month navigation and detail page navigation.
- [ ] **Region check**: Change region in settings (when implemented) and verify calendar updates.

## Rollback Plan

All changes are incremental. Reverting to the previous state involves deleting the new files and removing the `getUpcomingMovies` call from `provider.client.ts`.
