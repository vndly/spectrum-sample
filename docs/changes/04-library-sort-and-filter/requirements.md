---
id: R-06
title: 'Library: Sort and Filter'
status: approved
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

- `R-05`: Library Management (provides the library entries and custom lists to filter/sort).
- `02-home`: Home screen (provides the reusable `FilterBar` presentation patterns and shared filter UX language; Home URL query sync remains Home-only).
- When this change is promoted, update the released Home and Library product docs so the shared `FilterBar` contract and old "sorting/filtering is out of scope" note stay accurate.

## Decisions

| Decision           | Choice                                         | Rationale                                                                                                                                                                  |
| :----------------- | :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component Reuse    | Extract a presentation-only `FilterBar` shell  | Reuse the Home filter UI patterns while keeping Library filter state in a library-local composable. Home URL query sync and singleton browse state remain untouched.       |
| Metadata Source    | Application-layer `LibraryViewItem` read model | Title, release year, and genres come from validated provider metadata joined onto each `LibraryEntry` for Library views. Persisted `LibraryEntry` remains the user record. |
| Sorting Logic      | Client-side domain comparators                 | The library dataset is local and bounded; pure comparators/predicates run locally while application composables orchestrate reactive state.                                |
| Filter Composition | AND logic within the active library scope      | Filters refine the currently selected tab or custom list; they do not replace the base Watchlist, Watched, or selected-list scope.                                         |
| Sort Persistence   | Optional settings fields via canonical storage | Persist only `librarySortField` and `librarySortOrder`, defaulting to LS-05 when absent. Non-sort filters remain session-local.                                            |
| Pagination         | None                                           | As per roadmap, all entries are rendered; virtualization is deferred.                                                                                                      |

## Scope

**In Scope:**

- `SortDropdown` component for selecting sort criteria and order.
- Extracting the `FilterBar` presentation shell so Library can enable rating, watch-status, and custom-list filters without reusing Home's URL-synced state.
- A non-persisted `LibraryViewItem` composition step that joins `LibraryEntry` user state with validated provider metadata required for title, release-year, and genre operations.
- Domain-level sort/filter helpers plus library-local `useSort` and `useLibraryFilters` orchestration.
- Integration into `LibraryScreen`, including filtered-result empty-state handling that preserves existing `R-05` base empty states.
- Library-specific filter-state schema/types and optional persisted sort settings.

**Out of Scope:**

- Server-side sorting or filtering.
- Persistent filter states (except for sort preference).
- Advanced multi-column sorting.
- Grouping entries by category (e.g., "By Genre" headers).

## Functional Requirements

### Sorting

| ID    | Requirement          | Description                                                                                                                                                                                                                   | Priority |
| :---- | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| LS-01 | Sort by Date Added   | Users can sort library entries by the date they were added (Newest First, Oldest First).                                                                                                                                      | P0       |
| LS-02 | Sort by Title        | Users can sort the active library scope alphabetically using a normalized display title derived from validated provider metadata (`movie.title`, `tv.name`) with A-Z and Z-A variants.                                        | P0       |
| LS-03 | Sort by Release Year | Users can sort the active library scope by release year derived from validated provider metadata (Newest to Oldest, Oldest to Newest).                                                                                        | P1       |
| LS-04 | Sort by User Rating  | Users can sort library entries by the rating they assigned (Highest to Lowest, Lowest to Highest).                                                                                                                            | P1       |
| LS-05 | Default Sort         | The default sort order for all library views SHALL be "Date Added (Newest First)".                                                                                                                                            | P0       |
| LS-06 | Persistence          | The selected sort criteria and direction SHALL be persisted as optional `Settings` fields `librarySortField` and `librarySortOrder` managed by the canonical storage service. When absent, the view SHALL fall back to LS-05. | P1       |

### Filtering

| ID    | Requirement            | Description                                                                                                                                                                                                                         | Priority |
| :---- | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| LF-01 | Filter by Genre        | Users can filter the active library scope by one or more genres using the multi-select dropdown. Genre values SHALL come from validated provider metadata joined onto the library view model.                                       | P0       |
| LF-02 | Filter by Media Type   | Users can filter the active library scope by media type (Movie, TV Show, or All) without changing the selected library tab or custom list.                                                                                          | P0       |
| LF-03 | Filter by Rating Range | Users can filter entries by a range of user ratings (0.0 to 5.0 stars) using numeric inputs or a selection widget. `0` represents unrated and SHALL be handled explicitly.                                                          | P1       |
| LF-04 | Filter by Watch Status | On the Lists view, users can filter the selected custom list by watch status (Watchlist, Watched, or All). On the Watchlist and Watched tabs, this control SHALL be hidden because the active tab already defines the status scope. | P1       |
| LF-05 | Filter by Custom List  | On the Watchlist and Watched tabs, users can filter the active tab dataset by membership in specific custom lists. On the Lists view, this control SHALL be hidden because the selected list already defines scope.                 | P1       |
| LF-06 | Filter Badge           | The FilterBar SHALL display a badge showing the count of active filter categories (genre, media type, rating range, watch status, custom list). Selecting multiple values within one category still counts as one active filter.    | P1       |
| LF-07 | Clear Filters          | A "Clear All" action SHALL reset all currently visible filters to their default states while preserving the active library tab or selected custom list.                                                                             | P0       |

### UI/UX Specs

| ID    | Requirement             | Description                                                                                                                                                                                                                                                                                             | Priority |
| :---- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| LU-01 | SortDropdown Component  | A user-visible sort control for choosing sort field and direction, using the labels Date Added, Title, Release Year, and User Rating.                                                                                                                                                                   | P0       |
| LU-02 | FilterBar Integration   | The `FilterBar` SHALL be integrated into the `LibraryScreen` directly below the header/tabs and remain sticky while library content scrolls.                                                                                                                                                            | P0       |
| LU-03 | FilterBar Customization | The `FilterBar` SHALL enable/disable filters by screen context: watch status appears only on Lists; custom list filtering appears only on Watchlist and Watched; Home continues to expose only its existing browse filters.                                                                             | P1       |
| LU-04 | Empty State             | When the active library scope contains entries but additional filters reduce the result set to zero, a "No items match your filters" state with a Clear All action SHALL be displayed. Existing `R-05` base empty states SHALL remain responsible for scopes that are empty before filters are applied. | P0       |

## Non-Functional Requirements

### Performance

- **Filtering Speed**: Applying filters to a collection of up to 500 entries SHALL complete in < 50ms.
- **Sorting Speed**: Sorting a collection of up to 500 entries SHALL complete in < 50ms.

### UI/UX Consistency

- **Visual Parity**: The `FilterBar` in the library SHALL use the same Tailwind theme tokens and layout patterns as the Home screen implementation (`02-home`).
- **Responsive Layout**: Filtering controls SHALL adapt to screen sizes per `docs/technical/ui-ux.md`, maintaining 44x44px touch targets for all interactive elements.

### Testing

- **Scenario Traceability**: Automated tests SHALL map every scenario ID in `scenarios/` to at least one test case, or explicitly mark extra tests as `(implementation detail)`.
- **Home Regression Coverage**: Regression tests SHALL confirm that extracting the shared `FilterBar` presentation shell does not change Home screen filter fields or URL query synchronization.

## Constraints

- **Canonical Data Model**: `LibraryEntry` remains the canonical persisted user-state record. Title, release-year, and genre operations must use a separate validated library read model rather than expanding the persisted contract further.
- **State Isolation**: Library filter state must be owned by a library-specific composable and must not reuse Home's URL query synchronization or global singleton filter state.
- **Internationalization**: All new sort/filter labels and messages must be backed by `vue-i18n` keys in `src/presentation/i18n/locales/*.json`; at least one non-default locale must be verified in scenarios/tests.
- **Persistence Contract**: Optional `Settings` fields `librarySortField` and `librarySortOrder` must be read/written through the canonical storage service with documented default behavior and schema-version impact.
- **Documentation Sync**: Promotion of `R-06` must update the released Home and Library docs so their scope boundaries and shared filter contract remain accurate.

## Risks & Assumptions

### Risks

- **Performance**: Large library collections (> 500 entries) may experience lag if filtering/sorting is not efficient. _Mitigation_: Ensure logic is optimized in `useSort` and `useLibraryFilters`; consider virtualization if performance degrades.
- **HomeScreen Regression**: Refactoring `FilterBar` into a common component might break existing functionality on the Home Screen. _Mitigation_: Run regression tests on `HomeScreen` after refactoring.

### Assumptions

- **Local Data**: All library entries are available locally for instantaneous client-side processing.
- **Metadata Availability**: A validated metadata source for each saved title can be composed into the library read model without widening the persisted `LibraryEntry` contract.

## Acceptance Criteria

- [ ] `SortDropdown` offers Date Added, Title, Release Year, and User Rating with the expected ascending/descending variants for each field. (`LS-01`, `LS-02`, `LS-03`, `LS-04`, `LU-01`)
- [ ] On a fresh load with no persisted sort settings, every library view defaults to Date Added (Newest First). (`LS-05`)
- [ ] Changing sort persists optional `Settings.librarySortField` and `Settings.librarySortOrder`; after reload, the same selection and rendered order are restored, and missing fields fall back to LS-05. (`LS-06`)
- [ ] Title sorting uses the normalized display title from validated provider metadata for both movies and TV shows. (`LS-02`)
- [ ] Release-year sorting uses validated provider metadata for both movies and TV shows. (`LS-03`)
- [ ] Genre filtering uses validated provider metadata joined onto the active library scope. (`LF-01`)
- [ ] Media type filtering refines the active library scope to Movie, TV Show, or All without replacing the current tab/list selection. (`LF-02`)
- [ ] Rating-range filtering supports 0.0-5.0, treats `0` as unrated, and updates results immediately. (`LF-03`)
- [ ] On the Lists view, watch-status filtering refines the selected custom list by Watchlist, Watched, or All; on Watchlist and Watched tabs, the watch-status control is hidden. (`LF-04`)
- [ ] On Watchlist and Watched tabs, custom-list filtering refines the active tab by selected list membership; on the Lists view, the custom-list filter is hidden because the selected list already defines scope. (`LF-05`, `LU-03`)
- [ ] The filter badge counts active filter categories, not selected values; selecting multiple genres still counts as one active filter. (`LF-06`)
- [ ] `Clear All` resets every visible library filter while preserving the active tab or selected custom list. (`LF-07`)
- [ ] `FilterBar` is rendered directly below the library header/tabs, uses the same theme tokens as Home, and keeps Library state isolated from Home URL query sync. (`LU-02`)
- [ ] When a populated tab/list is narrowed to zero results by filters, the screen shows "No items match your filters" plus Clear All; when the base tab/list is empty before filters, the existing `R-05` empty states remain in control. (`LU-04`)
- [ ] Filtering and sorting a 500-entry library dataset completes in under 50 ms in the documented benchmark/test environment. (`Performance`)
- [ ] Library sort/filter controls preserve responsive layout and 44x44px touch targets across supported breakpoints. (`UI/UX Consistency`)
- [ ] All new Library sort/filter labels and messages are delivered through `vue-i18n` locale keys, with at least one non-default locale verified in scenarios/tests. (`Constraints`)
