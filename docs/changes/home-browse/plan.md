# Plan: Home Screen Browse Mode

## Phase 1: Infrastructure & Data Fetching

1.  [ ] **Update Provider Client**
    - Add `getTrending`, `getPopularMovies`, and `getPopularShows` to `src/infrastructure/provider.client.ts`.
    - Unit test for `provider.client.ts` to verify API calls.
    - *Covering: HB-01, HB-02, HB-03*

2.  [ ] **Application Logic: useBrowse**
    - Create `src/application/use-browse.ts` to handle parallel data fetching and state management.
    - Unit test for `useBrowse` to verify successful data loading and error handling.
    - *Covering: HB-01, HB-02, HB-03, HB-08, HB-09*

## Phase 2: Browse Components

1.  [ ] **Implement TrendingCarousel Component**
    - Create `src/presentation/components/home/trending-carousel.vue`.
    - Display backdrop or poster and title for top items.
    - Handle horizontal scrolling.
    - *Covering: HB-04*

2.  [ ] **Implement PopularGrid Component**
    - Create `src/presentation/components/home/popular-grid.vue`.
    - Display popular movies and shows in a responsive grid.
    - *Covering: HB-05*

3.  [ ] **Testing: Browse Components**
    - Write unit/integration tests for `TrendingCarousel` and `PopularGrid` verifying data rendering and navigation.
    - *Covering: HB-04, HB-05, HB-07 (scenarios HB-01 to HB-05)*

## Phase 3: Home Screen Integration

1.  [ ] **Integrate Browse Sections**
    - Update `src/presentation/views/home-screen.vue` to include browse sections when in browse mode.
    - Ensure correct state management between search and browse modes.
    - *Covering: HB-06*

## Phase 4: Verification

1.  [ ] **Run Unit & Integration Tests**
    - `npm run test` to verify all tests pass.
2.  [ ] **Check TypeScript Types**
    - `npm run type-check` to ensure type safety.
3.  [ ] **Build Verification**
    - `npm run build` to confirm the project builds successfully.
