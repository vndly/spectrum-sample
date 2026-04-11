---
id: R-07
title: 'Stats: Insights and Overview'
status: draft
importance: medium
type: functional
tags: [stats, library, charts]
---

## Intent

Provide users with meaningful insights and a visual overview of their library through charts and statistics derived from their local collection.

## Context & Background

### Problem Statement

Users who track their media consumption often want to see high-level metrics, such as how much time they've spent watching movies, their favorite genres, and their rating trends. Currently, the application only provides list views, making it difficult to grasp the "big picture" of a user's collection.

### User Stories

- As a user, I want to see how many titles I have watched vs. how many are in my watchlist.
- As a user, I want to see my average rating across all watched items.
- As a user, I want to see the total time I've spent watching movies and TV shows.
- As a user, I want to see a breakdown of my watched items by genre to understand my preferences.
- As a user, I want to see my watch activity over the current year to see when I am most active.
- As a user, I want to see a list of my highest-rated titles to quickly find my favorites.

### Dependencies

- `R-05`: Library Management (provides the library entries to compute stats from).
- `R-06`: Library: Sort and Filter (provides `genreIds` in the library snapshot).
- `src/application/use-genres.ts`: Provides genre name mapping for the genre chart.

## Decisions

| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| Computation | Client-side derivation | All stats are computed locally from the `localStorage` library entries to maintain privacy and offline capability. |
| Metadata | Add `runtime` to `LibraryEntry` | To support "Total Watch Time" without per-stat API calls, the runtime must be captured in the library entry snapshot when an item is added or updated. |
| Charting | Chart.js with `vue-chartjs` | Provides a robust, well-documented, and relatively lightweight charting solution that integrates well with Vue. |
| Time Range | Current Year for Monthly Chart | Limits the dataset for the monthly activity chart to the current calendar year to keep it focused and performant. |
| Genre Source | `useGenres` Cache | Uses the existing genre fetching logic to map TMDB genre IDs to localized names. |

## Scope

**In Scope:**

- `StatCards` component showing: Total Watched, Total Watchlist, Average Rating, and Total Watch Time.
- `GenreChart` component: A bar chart showing the distribution of watched items across genres.
- `MonthlyChart` component: A line or bar chart showing items watched per month in the current year.
- `TopRatedList` component: A list of the top 10 highest-rated watched items.
- Stats logic implementation (composables/domain logic) to compute these metrics from `LibraryEntry[]`.
- Updating `LibraryEntry` schema and creation logic to include `runtime`.
- Migration/Backfill strategy for existing library entries to include `runtime` (optional/best-effort).
- Empty state handling when no items are marked as "watched".

**Out of Scope:**

- Comparison with global community stats.
- Advanced filtering of stats (e.g., stats for a specific custom list).
- Exporting stats as images or PDF.
- Historical stats beyond the current year (deferred).

## Functional Requirements

### Statistics Computation

| ID | Requirement | Description | Priority |
| :--- | :--- | :--- | :--- |
| ST-01 | Stat Calculations | The system SHALL compute: Total Watched count, Total Watchlist count, Mean User Rating (excluding unrated), and Total Watch Time (sum of runtimes for watched items). | P0 |
| ST-02 | Genre Distribution | The system SHALL compute the count of watched items per genre, using the cached genre names from TMDB. | P0 |
| ST-03 | Monthly Activity | The system SHALL compute the count of items watched per month for the current calendar year, based on the `watchDates` array in `LibraryEntry`. | P1 |
| ST-04 | Top Rated Ranking | The system SHALL identify the top 10 watched items with the highest user ratings, sorted by rating descending, then by title ascending. | P1 |
| ST-05 | Reactivity | Stats SHALL update automatically whenever the library entries in storage are modified. | P0 |

### UI Components

| ID | Requirement | Description | Priority |
| :--- | :--- | :--- | :--- |
| SU-01 | StatCards Layout | Display the four key metrics in a responsive grid of cards at the top of the stats screen. | P0 |
| SU-02 | GenreChart Display | Display genre distribution as a horizontal bar chart for readability with many genres. | P0 |
| SU-03 | MonthlyChart Display | Display monthly activity for the current year as a line or bar chart. | P1 |
| SU-04 | TopRatedList Display | Display the top 10 titles with their posters and ratings in a concise list. | P1 |
| SU-05 | Empty State | Show a specialized empty state if the user has zero "watched" entries, encouraging them to add and rate content. | P0 |

### Data Model Enhancements

| ID | Requirement | Description | Priority |
| :--- | :--- | :--- | :--- |
| SD-01 | Runtime Snapshot | `LibraryEntry` SHALL include an optional `runtime` field (number, in minutes) to store the duration of the movie or average episode duration of the TV show. | P0 |
| SD-02 | Runtime Capture | When adding an item to the library or viewing its details, the `runtime` from the provider metadata SHALL be saved into the library entry snapshot. | P0 |

## Non-Functional Requirements

### Performance

| ID | Requirement | Description |
| :--- | :--- | :--- |
| SN-01 | Computation Time | Stats for a library of 1,000 entries SHALL be computed in < 100ms. |
| SN-02 | Chart Rendering | Charts SHALL render smoothly and be responsive to container size changes. |

### UI/UX Consistency

| ID | Requirement | Description |
| :--- | :--- | :--- |
| SN-03 | Visual Style | Components SHALL use existing Tailwind theme tokens and Lucide icons consistent with the rest of the app. |
| SN-04 | Accessibility | Charts SHALL include ARIA labels and be navigable or described for screen readers. |

### Internationalization

| ID | Requirement | Description |
| :--- | :--- | :--- |
| SN-05 | Localized Labels | All stats-related labels, chart axes, and month names SHALL be localized via `vue-i18n`. |

## Constraints

- **Storage Limits**: Stats remain client-side; no persistent "stats" object is stored; they are always derived from the `LibraryEntry` collection.
- **Data Accuracy**: Total watch time depends on the availability of `runtime` in the snapshot. Items added before this change may contribute 0 minutes until their metadata is refreshed.
- **Chart Library**: Must use a library compatible with Vue 3 and Vite, preferably with tree-shaking support to minimize bundle impact.

## Risks & Assumptions

### Risks

- **Bundle Size**: Adding a charting library could significantly increase the initial bundle size. _Mitigation_: Use a lightweight library or ensure it is code-split/lazy-loaded for the stats screen.
- **Missing Data**: Legacy library entries won't have `runtime`. _Mitigation_: Display a disclaimer or use a default/placeholder, and capture runtime whenever a detail page is visited.

### Assumptions

- **Local Metadata**: `LibraryEntry` contains enough information (`genreIds`, `rating`, `watchDates`) to compute most stats without further API calls.
- **Current Year**: Monthly stats are only required for the current year to simplify the initial implementation.

## Acceptance Criteria

- [ ] `StatCards` accurately displays counts for watched, watchlist, and average rating.
- [ ] Total Watch Time correctly sums runtimes and formats them into a human-readable string (e.g., "5d 12h 30m").
- [ ] `GenreChart` shows a bar for each genre with at least one watched item, sorted by count.
- [ ] `MonthlyChart` shows 12 months for the current year with correct item counts.
- [ ] `TopRatedList` shows exactly 10 items (or fewer if library is small) with correct ratings and titles.
- [ ] Navigating to the Stats screen with no watched items displays the "No watched items" empty state.
- [ ] Stats update immediately if an item's rating or status is changed in another tab (via storage events or shared state).
- [ ] `LibraryEntry` schema is updated to include `runtime`, and new entries capture this value.
- [ ] All charts and labels are fully localized in English and at least one other language.
