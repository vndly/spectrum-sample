---
id: home-filters-and-views
title: Home Screen Filters and View Toggle
status: draft
importance: high
type: functional
tags: [home, filter, view, grid, list]
---

## Intent

Enhance the home screen browse mode with filtering capabilities (genre, year, media type) and a layout toggle (grid vs. list view).

## Context & Background

### Problem Statement

While browse mode provides trending and popular content, users need ways to narrow down these results to find specific genres or time periods. Additionally, some users prefer a compact list view over a large grid for easier scanning.

### User Stories

- As a user, I want to filter browse results by genre so that I can find content that matches my taste.
- As a user, I want to filter browse results by media type so that I can see only movies or only TV shows.
- As a user, I want to filter browse results by year range so that I can find newer or older content.
- As a user, I want to toggle between a grid and list view so that I can choose the layout that works best for me.
- As a user, I want my view preference to be saved so that the app opens in my preferred layout next time.
- As a user, I want to share my filtered results with others via a URL.

### Dependencies

- **home-browse**: Provides the base data (trending and popular) to filter.
- **MovieCard component**: Already implemented; needs to support a list variant.
- **provider.client.ts**: For fetching genres.

## Decisions

| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| Filtering Strategy | Client-side | Trending/popular data sets are small enough (20-50 items) to filter in-memory without re-fetching, providing an instantaneous UI. |
| Genre Resolution | API-driven (TMDB) | Genre names are resolved via `/genre/movie/list` and `/genre/tv/list` to ensure accuracy and support localization, rather than being hardcoded. |
| URL Persistence | Query Parameters | Using the URL query string allows users to share specific filtered views and maintains state on page refreshes. |

## Scope

### In Scope

- `FilterBar` component with genre multi-select, media type toggle, and year range inputs.
- `ViewToggle` component for switching between grid and list layouts.
- Client-side filtering logic (AND-composition).
- URL query string synchronization for filters.
- `localStorage` persistence for view mode preference.
- `MovieCard` list variant.

### Out of Scope

- Server-side filtering (TMDB API filtering).
- Persistent custom lists (already in Roadmap 05).

## Functional Requirements

| ID    | Requirement           | Description                                                                                                                                                                                                                         | Priority |
| ----- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| HF-01 | Genre Multi-Select    | The `FilterBar` SHALL provide a way to select multiple genres. The list of genres SHALL be fetched from TMDB and cached for the session.                                                                                             | P0       |
| HF-02 | Media Type Toggle     | The `FilterBar` SHALL provide a toggle for media type (Movies, TV Shows, or All).                                                                                                                                                    | P0       |
| HF-03 | Year Range Inputs     | The `FilterBar` SHALL provide inputs for a minimum and maximum year range.                                                                                                                                                          | P1       |
| HF-04 | Composite Filtering   | Filters SHALL apply using AND logic: only results matching all active filters SHALL be displayed.                                                                                                                                   | P0       |
| HF-05 | Client-Side Filtering | Filters SHALL apply to already-fetched data (trending and popular results) without re-fetching from the server.                                                                                                                     | P0       |
| HF-06 | Layout Toggle         | The `ViewToggle` SHALL switch the content layout between "Grid" (poster-focused cards) and "List" (compact rows with title and key metadata).                                                                                       | P0       |
| HF-07 | Preference Persistence | The layout preference (grid or list) SHALL be persisted in `localStorage`.                                                                                                                                                          | P0       |
| HF-08 | URL Sync              | Active filter values (genres, media type, year range) SHALL be reflected in the URL query string. Changing filters SHALL update the URL without a full page reload. Loading a URL with query parameters SHALL apply those filters. | P1       |
| HF-09 | Clear All Filters     | A "Clear All" action SHALL be provided to reset all filters to their default state.                                                                                                                                                 | P0       |

## Non-Functional Requirements

### Performance

- Client-side filtering SHALL be instantaneous (no perceived delay for the user).
- Genre list SHALL be fetched only once per session or cached.

### UI/UX Specs

- `FilterBar` should be compact and potentially sticky below the SearchBar.
- `ViewToggle` should be easily accessible, possibly next to the FilterBar.

## Acceptance Criteria

- [ ] `FilterBar` allows selecting genres, media type, and year range.
- [ ] Genre list is dynamically fetched from the API.
- [ ] Filtering results updates the view in real-time.
- [ ] `ViewToggle` switches between grid and list layouts.
- [ ] Layout preference persists across page reloads.
- [ ] Filters are reflected in and restored from the URL.
- [ ] Clearing all filters restores the original unfiltered results.
