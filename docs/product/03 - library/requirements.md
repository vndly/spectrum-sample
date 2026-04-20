---
id: R-05
title: 'Library Management: Sorting and Filtering'
status: released
importance: high
type: functional
tags: [library, storage, watchlist, watched, sort, filter]
---

## Intent

Provide users with a centralized way to manage saved movies and TV shows, including categorization into "Watchlist" and "Watched" statuses plus sorting and filtering capabilities for larger libraries.

## Context & Background

### Problem Statement

Users need a way to track what they want to watch and what they have already seen. As the library grows, simple status toggles are insufficient; users need tools to narrow entries by genre, rating, or media type, and order them meaningfully.

### User Stories

- As a user, I want to toggle between my Watchlist and Watched entries so I can quickly see what's next and what I've finished.
- As a user, I want to sort my library by date added, title, or release year to find content easily.
- As a user, I want to filter my library by genre, media type, or my own rating range.
- As a user, I want to see an empty state when my filters are too restrictive so I know why no results are appearing.

### Dependencies

- `R-02`: Home screen (provides initial entry points, search, and detail screens).
- `02-home`: Home screen (provides shared `FilterBar` presentation patterns).

## Decisions

| Decision            | Choice                                     | Rationale                                                                                                                                          |
| :------------------ | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| Persistence         | `localStorage`                             | Matches the project's "local-first" approach; no backend required.                                                                                 |
| Metadata Redundancy | Persisted `LibraryEntry` metadata snapshot | Stores `title`, `posterPath`, `releaseDate`, `voteAverage`, and `genreIds` locally to allow instantaneous sorting/filtering without TMDB API hits. |
| Component Reuse     | Shared `FilterBar` shell                   | Reuse the Home filter UI patterns while keeping Library filter state local.                                                                        |
| Sorting Logic       | Client-side domain comparators             | The library dataset is local and bounded; pure comparators/predicates run locally.                                                                 |
| Filter Composition  | AND logic within the active library scope  | Filters refine the currently selected tab; they do not replace the base scope.                                                                     |
| Sort Persistence    | Canonical `Settings` storage               | Persist `librarySortField` and `librarySortOrder` in a grouped `settings` object.                                                                  |

## Scope

**In Scope:**

- `TabToggle`, `EntryGrid`, `FilterBar`, and `SortDropdown` components.
- `LibraryScreen` integration with sticky filtering and sorting.
- `Settings` domain schema and validation.
- `storage.service.ts` extensions for settings and metadata snapshots.
- `useLibraryEntries`, `useSort`, and `useLibraryFilters` composables.
- Filtered-result empty states.
- Support for genre, media type, and rating range filtering.

**Out of Scope:**

- Cloud sync or multi-device support.
- Server-side sorting or filtering.
- Persistent filter states (except for sort preference).

## Functional Requirements

### Core Management

| ID   | Requirement   | Description                                                                              | Priority |
| :--- | :------------ | :--------------------------------------------------------------------------------------- | :------- |
| L-01 | Watchlist Tab | Display all library entries with `status: 'watchlist'` in a responsive grid.             | P0       |
| L-02 | Watched Tab   | Display all library entries with `status: 'watched'` in a responsive grid.               | P0       |
| L-08 | Empty States  | Tabs show contextual empty states when no entries are present with a CTA to add content. | P1       |

### Sorting

| ID    | Requirement          | Description                                                                                           | Priority |
| :---- | :------------------- | :---------------------------------------------------------------------------------------------------- | :------- |
| LS-01 | Sort by Date Added   | Users can sort library entries by the date they were added (Newest/Oldest First).                     | P0       |
| LS-02 | Sort by Title        | Users can sort alphabetically using normalized snapshot titles (A-Z, Z-A).                            | P0       |
| LS-03 | Sort by Release Year | Users can sort by release year derived from metadata snapshots.                                       | P1       |
| LS-04 | Sort by User Rating  | Users can sort library entries by the rating they assigned.                                           | P1       |
| LS-06 | Persistence          | Sort selection SHALL be persisted in `Settings`. Falls back to "Date Added (Newest First)" if absent. | P1       |

### Filtering

| ID    | Requirement            | Description                                                                       | Priority |
| :---- | :--------------------- | :-------------------------------------------------------------------------------- | :------- |
| LF-01 | Filter by Genre        | Users can filter the active scope by one or more genres using persisted metadata. | P0       |
| LF-02 | Filter by Media Type   | Users can filter the active scope by media type (Movie, TV Show, or All).         | P0       |
| LF-03 | Filter by Rating Range | Users can filter by a range of user ratings (0.0 to 5.0) with immediate updates.  | P1       |
| LF-07 | Clear Filters          | A "Clear All" action resets all visible filters while preserving the active tab.  | P0       |

### UI/UX Specs

| ID    | Requirement           | Description                                                                                                        | Priority |
| :---- | :-------------------- | :----------------------------------------------------------------------------------------------------------------- | :------- |
| LU-02 | FilterBar Integration | The `FilterBar` SHALL be sticky below the header/tabs.                                                             | P0       |
| LU-04 | Filtered Empty State  | Shows "No items match your filters" with a Clear All action when filters reduce a non-empty scope to zero results. | P0       |

## Non-Functional Requirements

### Performance

| ID    | Requirement     | Description                                               |
| :---- | :-------------- | :-------------------------------------------------------- |
| LN-01 | Filtering Speed | Applying filters to 500 entries SHALL complete in < 50ms. |
| LN-02 | Sorting Speed   | Sorting 500 entries SHALL complete in < 50ms.             |

### UI/UX Consistency

- **Visual Parity**: Uses the same Tailwind theme tokens and layout patterns as the Home screen.
- **Responsive Layout**: Maintains 44x44px touch targets across all breakpoints.

## Acceptance Criteria

- [ ] `TabToggle` correctly filters the library by status.
- [ ] `SortDropdown` and `FilterBar` correctly refine the active library scope.
- [ ] Sort selection is persisted across page reloads.
- [ ] Empty states correctly distinguish between empty scopes and restrictive filters.
- [ ] Metadata snapshots (genre, rating, etc.) allow fully local, instantaneous operations.
