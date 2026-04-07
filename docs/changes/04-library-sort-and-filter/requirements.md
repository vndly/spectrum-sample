---
id: R-06
title: 'Library: Sort and Filter'
status: draft
importance: medium
type: functional
tags: [library, sort, filter]
---

## Intent

Provide users with advanced sorting and filtering capabilities within their saved library entries to easily manage and discover content in large collections.

## Context & Background

### Problem Statement

As users add more content to their library (Watchlist, Watched, and Custom Lists), finding specific titles or grouping them by genre, rating, or media type becomes difficult. Users need tools to narrow down their collections and order them meaningfully.

### User Stories

- As a user, I want to sort my library by date added so I can see what I saved most recently.
- As a user, I want to sort my library by title or year to find content alphabetically or by release date.
- As a user, I want to filter my library by genre or media type to find specific types of content.
- As a user, I want to filter by my own rating range to find movies I enjoyed the most (or least).
- As a user, I want to see an empty state when my filters are too restrictive so I know why no results are appearing.

### Dependencies

- `R-05`: Library Management (provides the library entries and custom lists to filter/sort)
- `R-06` (Home Filters): Reuse of the `FilterBar` component and `useFilters` logic.

## Decisions

| Decision             | Choice                           | Rationale                                                                                                                                                                 |
| :------------------- | :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Component Reuse      | Refactor `FilterBar`             | The `FilterBar` from the home screen already handles genre, media type, and year. It should be refactored to support props for additional filters (rating, status, lists). |
| Sorting Logic        | Client-side in `useSort`         | Library data is fully local; client-side sorting is instantaneous and avoids API calls.                                                                                   |
| Filter Composition   | AND logic                        | Consistent with the home screen filtering behavior; results must match all active filters.                                                                                |
| Sort Persistence     | `localStorage` via `useSettings` | Users likely have a preferred way to view their library (e.g., "Recently Added" first) and would expect it to persist.                                                    |
| Pagination           | None                             | As per roadmap, all entries are rendered; virtualization is deferred.                                                                                                     |

## Scope

**In Scope:**

- `SortDropdown` component for selecting sort criteria and order.
- `FilterBar` refactoring and extension to support rating and list filters.
- `useSort` application-layer composable for sorting `LibraryEntry` items.
- `useLibraryFilters` application-layer composable (specialized version or extension of `useFilters`).
- Integration into `LibraryScreen` (adding SortDropdown and FilterBar).
- Updating `EntryGrid` to handle empty states for filtered results.
- `FilterState` extension in `domain/filter.schema.ts`.

**Out of Scope:**

- Server-side sorting or filtering.
- Persistent filter states (except for sort preference).
- Advanced multi-column sorting.
- Grouping entries by category (e.g., "By Genre" headers).

## Functional Requirements

### Sorting

| ID    | Requirement              | Description                                                                                             | Priority |
| :---- | :----------------------- | :------------------------------------------------------------------------------------------------------ | :------- |
| LS-01 | Sort by Date Added       | Users can sort library entries by the date they were added (Newest First, Oldest First).                | P0       |
| LS-02 | Sort by Title            | Users can sort library entries alphabetically by title (A-Z, Z-A).                                      | P0       |
| LS-03 | Sort by Release Year     | Users can sort library entries by their release year (Newest to Oldest, Oldest to Newest).              | P1       |
| LS-04 | Sort by User Rating      | Users can sort library entries by the rating they assigned (Highest to Lowest, Lowest to Highest).      | P1       |
| LS-05 | Default Sort             | The default sort order for all library views SHALL be "Date Added (Newest First)".                      | P0       |
| LS-06 | Persistence              | The selected sort criteria and direction SHALL be persisted in the user's settings via `useSettings`.   | P1       |

### Filtering

| ID    | Requirement              | Description                                                                                             | Priority |
| :---- | :----------------------- | :------------------------------------------------------------------------------------------------------ | :------- |
| LF-01 | Filter by Genre          | Users can filter entries by one or more genres using the multi-select dropdown.                         | P0       |
| LF-02 | Filter by Media Type     | Users can filter entries by media type (Movie, TV Show, or All).                                        | P0       |
| LF-03 | Filter by Rating Range   | Users can filter entries by a range of user ratings (e.g., 3 to 5 stars) using a slider or range picker. | P1       |
| LF-04 | Filter by Watch Status   | Users can filter entries by their watch status (Watchlist, Watched, or All).                            | P1       |
| LF-05 | Filter by Custom List    | Users can filter entries by their membership in specific custom lists.                                  | P1       |
| LF-06 | Filter Badge             | The FilterBar SHALL display a badge with the count of active filters.                                   | P1       |
| LF-07 | Clear Filters            | A "Clear All" action SHALL reset all active filters to their default states.                            | P0       |

### UI/UX

| ID    | Requirement              | Description                                                                                             | Priority |
| :---- | :----------------------- | :------------------------------------------------------------------------------------------------------ | :------- |
| LU-01 | SortDropdown Component   | A dropdown component for choosing sort field and direction.                                             | P0       |
| LU-02 | FilterBar Integration    | The `FilterBar` SHALL be integrated into the `LibraryScreen` below the header/tabs.                     | P0       |
| LU-03 | FilterBar Customization  | The `FilterBar` SHALL allow enabling/disabling specific filters via props (to adapt to different views). | P1       |
| LU-04 | Empty State              | When filters result in zero entries, a "No items match your filters" message SHALL be displayed.        | P0       |

## Non-Functional Requirements

### Performance

- **Filtering Speed**: Applying filters to a collection of up to 500 entries SHALL take less than 50ms (instantaneous feel).
- **Sorting Speed**: Sorting a collection of up to 500 entries SHALL take less than 50ms.

### UI/UX

- **Consistency**: The `FilterBar` in the library SHALL look and behave identically to the one on the home screen.
- **Responsiveness**: Sorting and filtering controls SHALL be responsive and work well on mobile devices.

## Acceptance Criteria

- [ ] `SortDropdown` offers: Date Added (Newest/Oldest), Title (A–Z / Z–A), Release Year, User Rating (High/Low).
- [ ] Default sort is Date Added (Newest First) on fresh load.
- [ ] Sort preference persists across page reloads.
- [ ] `FilterBar` in library includes Genre, Media Type, Rating Range, and List filters.
- [ ] Filters compose with AND logic (e.g., "Action" AND "Watched").
- [ ] Active filter count is shown as a badge on the filter bar.
- [ ] Empty state shown when filters exclude all entries ("No items match your filters").
- [ ] "Clear All" resets all filters and updates the view immediately.
