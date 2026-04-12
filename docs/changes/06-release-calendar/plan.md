# Plan - Release Calendar Sync

Implementation plan for the monthly release calendar.

## Phase 1: Infrastructure Updates

- [ ] **Step 1.1**: Add test for `getUpcomingMovies` in `tests/infrastructure/provider.client.calendar.test.ts`. (covering: `FR-06-04-01`)
- [ ] **Step 1.2**: Update `src/infrastructure/provider.client.ts` to include `getUpcomingMovies(language: string, region: string, page: number)`. This method should call the TMDB `/movie/upcoming` endpoint and return a `PaginatedResponse<MovieListItem>`. (`FR-06-04`)

## Phase 2: Domain Layer

- [ ] **Step 2.1**: Update `src/domain/movie.schema.ts` if any additional fields are needed for `MovieListItem` (likely `release_date` is already there). (`implementation detail`)
- [ ] **Step 2.2**: Write unit tests for calendar logic in `tests/domain/calendar.logic.test.ts`. (covering: `FR-06-01-01`, `FR-06-01-02`, `FR-06-01-03`, `FR-06-02-01`)
- [ ] **Step 2.3**: Create `src/domain/calendar.logic.ts` for pure functions like getting days of a month, determining day of the week, and grouping movies by date. Ensure dates are handled as UTC to avoid timezone shifts. (`FR-06-01`, `FR-06-02`)

## Phase 3: Application Layer

- [ ] **Step 3.1**: Write tests for composables in `tests/application/use-upcoming-movies.test.ts` and `tests/application/use-calendar.test.ts`. (covering: `FR-06-03-01`, `FR-06-05-01`)
- [ ] **Step 3.2**: Create `src/application/use-upcoming-movies.ts` to fetch and manage upcoming movies state (loading, error, list). Implement multi-page fetching to cover the entire month. (`FR-06-04`, `FR-06-05`, `FR-06-08`)
- [ ] **Step 3.3**: Create `src/application/use-calendar.ts` to manage calendar state (current month, year, navigation methods). Use URL query parameters to persist the selected month across reloads. (`FR-06-03`)

## Phase 4: Presentation Layer

- [ ] **Step 4.1**: Create `src/presentation/components/calendar/ReleaseCard.vue` to display a single release in a grid cell. This should be a specialized version or wrapper of `MovieCard` optimized for the dense grid. (`FR-06-02`, `FR-06-07`)
- [ ] **Step 4.2**: Create `src/presentation/components/calendar/CalendarGrid.vue` for the monthly view. Use Tailwind CSS for the 7-column grid and implement the mobile list-view fallback using responsive prefixes. (`FR-06-01`, `NFR-UI/UX`)
- [ ] **Step 4.3**: Integrate shared `SkeletonLoader` and `EmptyState` components into `CalendarGrid.vue`. (`FR-06-06`, `NFR-Performance`)
- [ ] **Step 4.4**: Update `src/presentation/views/calendar-screen.vue` to integrate the grid and navigation headers. (`FR-06-03`, `FR-06-07`)
- [ ] **Step 4.5**: Add internationalization keys for the calendar in `src/presentation/i18n/locales/en.json`, including localized month and day names. (`implementation detail`)

## Verification Phase

- [ ] **Run all tests**: `npm run test` (Verifies all `FR-06-XX` scenarios)
- [ ] **Visual check (Desktop)**: Open `/calendar` and verify 7-column month rendering. (`FR-06-01-01`)
- [ ] **Visual check (Mobile)**: Verify list-view fallback on viewports < 640px. (`NFR-UI/UX`)
- [ ] **Interaction check**: Verify month navigation and detail page navigation. (`FR-06-03-01`, `FR-06-07-01`)
- [ ] **Persistence check**: Navigate to a month, reload, and verify the month is still selected. (`FR-06-03-02`)
- [ ] **Region check**: Change region in settings and verify calendar updates. (`FR-06-05-01`)
- [ ] **Empty State check**: Navigate to a month with no releases and verify message. (`FR-06-06-01`)
- [ ] **Error check**: Simulate API failure and verify retry toast. (`FR-06-04-02`)

## Rollback Plan

All changes are incremental. Reverting to the previous state involves deleting the new files and removing the `getUpcomingMovies` call from `provider.client.ts`.
