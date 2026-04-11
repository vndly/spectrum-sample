# Plan: Stats: Insights and Overview (R-07)

Implement a statistics dashboard for the library, including key metrics cards and distribution charts, by extending the `LibraryEntry` metadata snapshot and computing insights locally.

## Phase 1: Domain and Infrastructure

1. [ ] **Update `LibraryEntry` Schema**: Add optional `runtime` (number) to `LibraryEntrySchema` in `src/domain/library.schema.ts`.
   - Document that `runtime` stores minutes.
   - (covering: `SD-01`)
2. [ ] **Capture Runtime in `useLibraryEntry`**: Update `src/application/use-library-entry.ts` to accept and store `runtime`.
   - Ensure `createDefaultEntry` and mutation methods handle the new field.
   - (covering: `SD-02`)
3. [ ] **Implement Stats Computation Logic**: Create `src/domain/stats.logic.ts` with pure functions to compute:
   - `calculateKeyMetrics`: Total watched, watchlist, average rating, total watch time.
   - `calculateGenreDistribution`: Map of genre ID/name to count.
   - `calculateMonthlyActivity`: Count of items watched per month for the current year (derived from `new Date().getFullYear()`).
   - `getTopRatedItems`: Filter and sort logic for top 10 items.
   - (covering: `ST-01`, `ST-02`, `ST-03`, `ST-04`)
4. [ ] **Write Domain and Infrastructure Tests**:
   - `tests/domain/stats.logic.test.ts`: Test all computation functions with various library fixtures (empty, small, large, missing runtimes).
   - (covering: `ST-01`, `ST-02`, `ST-03`, `ST-04`, `SN-01`, `(implementation detail)` runtime fallback)

## Phase 2: Application Layer (Composables)

1. [ ] **Install Charting Dependencies**: Install `chart.js` and `vue-chartjs`.
   - `npm install chart.js vue-chartjs`
   - (covering: `(implementation detail)` tech stack update)
2. [ ] **Create `useStats` Composable**: Create `src/application/use-stats.ts` to orchestrate stats computation.
   - Use `useLibraryEntries` as the data source.
   - Expose reactive computed properties for metrics and chart data.
   - Integrate with `useGenres` to resolve genre names, handling its loading state.
   - (covering: `ST-05`)
3. [ ] **Write Application Tests**:
   - `tests/application/use-stats.test.ts`: Verify reactivity when library entries change and integration with genre names.
   - (covering: `ST-05`, `(implementation detail)` genre name mapping)

## Phase 3: Presentation Layer (Components)

1. [ ] **Create `StatCards` Component**: Create `src/presentation/components/stats/stat-cards.vue`.
   - Responsive grid of 4 cards (Watched, Watchlist, Avg Rating, Total Time).
   - Use Lucide icons for each metric.
   - (covering: `SU-01`)
2. [ ] **Create `GenreChart` Component**: Create `src/presentation/components/stats/genre-chart.vue`.
   - Uses `Bar` chart from `vue-chartjs`.
   - Configured as a horizontal bar chart.
   - (covering: `SU-02`, `SN-02`, `SN-04`)
3. [ ] **Create `MonthlyChart` Component**: Create `src/presentation/components/stats/monthly-chart.vue`.
   - Uses `Line` or `Bar` chart from `vue-chartjs`.
   - Shows activity for the current calendar year.
   - (covering: `SU-03`, `SN-02`)
4. [ ] **Create `TopRatedList` Component**: Create `src/presentation/components/stats/top-rated-list.vue`.
   - Vertical list of top 10 posters with rating badges.
   - (covering: `SU-04`)
5. [ ] **Update `StatsScreen`**: Update `src/presentation/views/stats-screen.vue`.
   - Integrate all new components into a scrollable layout.
   - Implement the "No watched items" empty state logic.
   - (covering: `SU-05`, `SN-03`)
6. [ ] **Write Presentation Tests**:
   - `tests/presentation/components/stats/*.test.ts`: Verify rendering and localization.
   - `tests/presentation/views/stats-screen.test.ts`: Verify empty state vs. populated state.
   - (covering: `SU-05`, `SN-03`, `SN-05`, `(implementation detail)` chart responsiveness)

## Phase 4: Integration and Finalization

1. [ ] **Update i18n**: Add all stats-related strings to `src/presentation/i18n/locales/*.json`.
   - (covering: `SN-05`)
2. [ ] **Capture Runtime from Details**: Update `src/presentation/views/movie-screen.vue` and `show-screen.vue` to ensure `runtime` is passed to `useLibraryEntry` when loaded.
   - (covering: `SD-02`)
3. [ ] **Verify and Build**: Run full check suite.
   - `npm run check`
   - (covering: `(implementation detail)` verification)

## Phase 5: Testing Phase

> **Test-First Order**: Unit tests in Phase 1 and 2 are written before implementation and run to confirm failure. This phase is for end-to-end and integration verification.

1. [ ] **Domain Logic**: `tests/domain/stats.logic.test.ts` (covering `ST-01`, `ST-02`, `ST-03`, `ST-04`)
2. [ ] **Application Logic**: `tests/application/use-stats.test.ts` (covering `ST-05`)
3. [ ] **UI Components**: `tests/presentation/views/stats-screen.test.ts` (covering `SU-05`, `SU-01`, `SU-02`)

## Phase 6: Final Verification

1. [ ] **Performance Check**: Verify stats computation < 100ms for 1,000 entries. (`SN-01`)
2. [ ] **Visual/Responsive Check**: Verify charts on mobile and desktop. (`SN-03`, `SN-02`)
3. [ ] **Localization Check**: Verify charts labels in English and French. (`SN-05`)
       SN-03`, `SN-02`)
4. [ ] **Localization Check**: Verify charts labels in English and French. (`SN-05`)
       e Check\*\*: Verify charts on mobile and desktop. (`SN-03`, `SN-02`)
5. [ ] **Localization Check**: Verify charts labels in English and French. (`SN-05`)
