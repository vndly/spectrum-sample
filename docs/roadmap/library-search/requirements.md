---
id: R-10
title: Library Search
status: approved
type: functional
importance: medium
tags: [library, search, filtering]
---

# Library Search

## Intent

Enable users to quickly find entries in their library by searching across titles, tags, and notes. As libraries grow, scrolling and manual scanning become inefficient — a search bar provides instant access to specific entries.

## Context & Background

### Problem Statement

Users with large libraries (50+ entries) struggle to locate specific movies or shows. The existing filter and sort controls narrow results by metadata (genre, media type, rating) but do not support free-text search. Users must scroll through potentially hundreds of entries to find what they're looking for.

### User Stories

- As a user with a large library, I want to search by title so that I can quickly find a specific movie or show.
- As a user who uses tags extensively, I want to search by tag name so that I can find all entries with a particular tag.
- As a user who writes notes, I want to search within my notes so that I can find entries based on what I wrote about them.

### Dependencies

- **R-05 (Library Management: Sorting and Filtering)**: The Library screen, `useLibraryEntries` composable, and filter infrastructure must be in place.

### Affected Documentation

- **docs/product/03 - library**: When promoted, update the Library Management sections for library controls, filter composition, filtered empty states, responsive layout, and `useLibraryEntries` behavior.

## Decisions

| Decision            | Choice                                                     | Rationale                                                                                                                                |
| ------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Search Data Source  | Search local, validated `LibraryEntry` data only           | Titles, tags, and notes already live in localStorage and must not require TMDB or server-side search.                                    |
| Searchable Fields   | Search validated `LibraryEntry` data before projection     | `tags` and `notes` exist on `LibraryEntry`; searching before `LibraryViewItem` projection avoids widening the view item only for search. |
| Query Normalization | Parse with a domain Zod schema, then trim and case-fold    | This satisfies boundary validation and user-input sanitization rules while keeping matching predictable and literal.                     |
| URL/Storage State   | Keep search query in volatile screen state only            | R-05 keeps persistent filters out of scope except sort preference, and this feature excludes URL query sync.                             |
| Component Coupling  | Use `LibrarySearchBar` or a shared presentation-only input | The Home `SearchBar` is tied to API search behavior and must not be coupled to local library search.                                     |

## Scope

### In Scope

- Search input field in the Library screen's sticky controls area
- Filtering after the user stops typing for 300ms
- Case-insensitive matching across title, tags, and notes
- Debounced input to optimize performance
- Clear/reset search functionality
- Empty state when no entries match the search query
- Integration with existing filters (search results are further filtered by active genre/media type/rating filters)
- Responsive design (search bar adapts to mobile layout)

### Out of Scope

- Fuzzy matching or typo tolerance
- Search history or recent searches
- Highlighted/bold matching terms in results
- Search suggestions or autocomplete
- Server-side search (all search is client-side against localStorage data)
- Saved searches
- URL query parameter sync for search state
- Result count display

## Functional Requirements

| ID     | Requirement          | Description                                                                                                                                                                                                                                                                                                                                                                                  | Priority |
| ------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| LBS-01 | Search input         | A text input field is displayed in the Library screen's sticky controls area: full-width above filters below `md`, and inline with filters at `md` and above. The input has placeholder text indicating searchable fields (e.g., "Search titles, tags, notes...").                                                                                                                           | P0       |
| LBS-02 | Debounced filtering  | After the user stops typing for 300ms, library entries are filtered to show only entries matching the normalized search query. Matching is performed by pure domain logic against validated `LibraryEntry.title`, `LibraryEntry.tags`, and `LibraryEntry.notes`; `useLibraryEntries` applies search before projecting entries to `LibraryViewItem` for existing filter and sort composition. | P0       |
| LBS-03 | Case-insensitive     | Search matching is case-insensitive. Searching "batman" matches "Batman", "BATMAN", and "The Batman".                                                                                                                                                                                                                                                                                        | P0       |
| LBS-04 | Partial matching     | Search matches partial strings. Searching "bat" matches "Batman", "Combat", and any entry with "bat" in title, tags, or notes.                                                                                                                                                                                                                                                               | P0       |
| LBS-05 | Query normalization  | Search queries are parsed through a domain-level Zod schema (for example, `LibrarySearchQuerySchema`) before matching, then trimmed and case-folded. Whitespace-only queries are treated as empty, special characters are matched as literal text, and matching must not interpret the query as a raw regular expression.                                                                    | P0       |
| LBS-06 | Clear search         | A clear button (X icon) appears when the search input has text. Clicking it clears the search query immediately, returns focus to the input, and shows all entries (subject to other active filters).                                                                                                                                                                                        | P0       |
| LBS-07 | Filter integration   | Search results are combined with existing filters. If a user searches "action" while the genre filter is set to "Comedy", only Comedy entries containing "action" in title/tags/notes are shown.                                                                                                                                                                                             | P0       |
| LBS-08 | Empty search results | When a non-empty base library scope is reduced to zero entries by the search query combined with active filters, a search/filter empty state is displayed with a message like "No entries match your search" and a suggestion to adjust the query or clear filters. Base empty Watchlist/Watched states remain unchanged when the selected tab has no entries before search/filtering.       | P0       |
| LBS-09 | Tab-state retention  | The search query remains in volatile Library screen state while switching between Watchlist and Watched tabs. It is not persisted to localStorage, synced to URL query parameters, or retained across page reloads.                                                                                                                                                                          | P1       |
| LBS-10 | Keyboard support     | Pressing Enter in the search input does not submit a form or trigger navigation. Pressing Escape clears the search input immediately and shows all entries subject to other active filters.                                                                                                                                                                                                  | P1       |

## Non-Functional Requirements

### Performance

- Search filtering completes in < 50ms for libraries up to 500 entries. The measured duration applies to pure search/filter computation and composable recomputation after the debounce fires, excluding DOM rendering.
- Debounce delay of 300ms balances responsiveness with performance.

### Responsive Design

- On desktop (`md` and above): Search input is displayed inline with filter controls.
- On mobile (below `md`): Search input spans full width, stacked above filter controls.
- Touch target for clear button is at least 44×44px.

### Accessibility

- Search input has an associated label (visible or `aria-label`).
- Clear button has accessible name (e.g., `aria-label="Clear search"`).
- Focus remains in search input after clearing.

### Testing

- Unit tests for search matching logic (title, tags, notes matching).
- Unit tests for filter integration (search + genre/media type/rating filters).
- Unit tests for edge cases: empty query, whitespace-only query, special characters as literal text, and preserved internal whitespace.
- Unit tests use fake timers for the 300ms debounce and a fixed 500-entry fixture for the < 50ms pure filtering/composable update threshold.
- Unit tests verify that clear and Escape cancel any pending debounce so advancing timers cannot re-apply a stale query.

## UI/UX Specs

### Search Input

- Positioned in the Library screen's sticky controls area. On desktop (`md` and above), it appears inline with filter controls; on mobile (below `md`), it spans full width above filter controls.
- Uses the same input styling as the Home screen search input for visual consistency, but the implementation must use a `LibrarySearchBar` component or a shared presentation-only input without Home/API search behavior.
- Includes a search icon (magnifying glass) on the left side of the input.
- Clear button (X icon) appears on the right when input has text.
- Placeholder text: "Search titles, tags, notes..." (localized via i18n).

### Empty State

- Displayed only when a non-empty Watchlist or Watched base scope is reduced to zero results by search and active filters.
- Centered layout with:
  - Icon: Search or empty-results icon
  - Heading: "No matches found"
  - Supporting text: "Try a different search term or clear your filters"
  - CTA button: contextual clear action such as "Clear search", "Clear filters", or "Clear all" depending on the active state

### Interaction

- Typing in the search input filters results after debounce delay.
- Clicking the clear button resets the search and shows all entries (subject to other filters).
- Pressing Escape resets the search immediately and shows all entries (subject to other filters).
- Pressing Enter does not submit a form or trigger navigation.
- The search input does not steal focus on page load.

## Risks & Assumptions

### Risks

| Risk                        | Likelihood | Impact | Mitigation                                                                                                                                       |
| --------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Missing searchable fields   | Medium     | High   | Specify that search runs against validated `LibraryEntry` data before projection, where `tags` and `notes` are still available.                  |
| Debounce behavior ambiguity | Low        | Medium | Acceptance criteria and tests explicitly cover 300ms idle behavior plus immediate clear/Escape behavior.                                         |
| Large local libraries       | Medium     | Medium | Keep matching client-side and literal, test against a fixed 500-entry fixture, and require filtering to complete in < 50ms after debounce fires. |
| Empty-state regression      | Low        | Medium | Preserve R-05 base tab empty states and use the search/filter empty state only when a non-empty base scope is reduced to zero.                   |

### Assumptions

- Library search only reads existing localStorage-backed `LibraryEntry` data and does not change the persisted schema.
- The search query is UI state for the mounted Library screen, not a saved preference.
- Vue template escaping remains the only rendering path for user-provided tags, notes, and query text; no `v-html` is introduced.

## Acceptance Criteria

- [ ] **LBS-01**: A search input is visible in the Library screen's sticky controls area, above the entry grid.
- [ ] **LBS-01**: Search input is responsive: full-width above filters on mobile and inline with filters on desktop.
- [ ] **LBS-02, LBS-03, LBS-04**: Typing "batman" and waiting 300ms filters to entries with "batman" in title, tags, or notes regardless of case.
- [ ] **LBS-02**: Search matching runs before projection and uses data that includes `LibraryEntry.title`, `LibraryEntry.tags`, and `LibraryEntry.notes`.
- [ ] **LBS-04**: Searching "bat" matches entries with "bat" anywhere in title, tags, or notes, including examples like "Batman" and "Combat".
- [ ] **LBS-05**: Searching " bat " behaves the same as searching "bat".
- [ ] **LBS-05**: The search query is parsed through a domain-level Zod schema before matching.
- [ ] **LBS-05**: A whitespace-only query is treated as empty and shows all entries subject to other active filters.
- [ ] **LBS-05**: Special characters in the query are matched as literal text and do not behave as regular expressions.
- [ ] **LBS-06**: Clearing the search input immediately shows all entries subject to other active filters and returns focus to the search input.
- [ ] **LBS-07**: Searching "action" with genre filter set to "Comedy" shows only Comedy entries containing "action".
- [ ] **LBS-07**: Searching with an active user rating filter shows only entries that match both the search query and the selected rating range.
- [ ] **LBS-08**: The search/filter empty state appears only when a non-empty tab scope is reduced to zero entries by search and filters.
- [ ] **LBS-09**: Search query remains applied when switching between Watchlist and Watched tabs, but is not retained after page reload.
- [ ] **LBS-10**: Pressing Escape in the search input clears the query immediately.
- [ ] **LBS-10, Testing NFR**: If the user types a query, clears or presses Escape before 300ms, and timers advance, the old query is not reapplied.
- [ ] **LBS-10**: Pressing Enter in the search input does not submit a form or navigate.
- [ ] **Performance NFR**: Pure search/filter computation and composable recomputation complete in < 50ms for a library of 500 entries after the debounce fires, excluding DOM rendering.
- [ ] **Responsive NFR**: Clear button has a touch target of at least 44×44px on mobile.
- [ ] **Accessibility NFR**: Search input has a visible label or `aria-label`, clear button has an accessible name, and focus remains in the input after clearing.
- [ ] **i18n**: All user-facing text uses i18n keys (no hardcoded strings).
