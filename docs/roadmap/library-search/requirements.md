---
id: R-10
title: Library Search
status: draft
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

## Scope

### In Scope

- Search input field on the Library screen
- Real-time filtering as the user types
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

| ID     | Requirement          | Description                                                                                                                                                                                                  | Priority |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| LBS-01 | Search input         | A text input field is displayed on the Library screen, above or alongside existing filter controls. The input has placeholder text indicating searchable fields (e.g., "Search titles, tags, notes...").     | P0       |
| LBS-02 | Real-time filtering  | As the user types, library entries are filtered in real-time to show only entries matching the search query. Matching is performed against the entry's `title`, `tags` array, and `notes` field.             | P0       |
| LBS-03 | Case-insensitive     | Search matching is case-insensitive. Searching "batman" matches "Batman", "BATMAN", and "The Batman".                                                                                                        | P0       |
| LBS-04 | Partial matching     | Search matches partial strings. Searching "bat" matches "Batman", "Combat", and any entry with "bat" in title, tags, or notes.                                                                               | P0       |
| LBS-05 | Input debouncing     | Search input is debounced (300ms delay) to avoid filtering on every keystroke and improve performance with large libraries.                                                                                  | P1       |
| LBS-06 | Clear search         | A clear button (X icon) appears when the search input has text. Clicking it clears the search query and shows all entries (subject to other active filters).                                                 | P0       |
| LBS-07 | Filter integration   | Search results are combined with existing filters. If a user searches "action" while the genre filter is set to "Comedy", only Comedy entries containing "action" in title/tags/notes are shown.             | P0       |
| LBS-08 | Empty search results | When no entries match the search query (combined with active filters), an empty state is displayed with a message like "No entries match your search" and a suggestion to adjust the query or clear filters. | P0       |
| LBS-09 | Search persistence   | The search query persists while navigating between Watchlist and Watched tabs. Switching tabs applies the same search query to the new tab's entries.                                                        | P1       |
| LBS-10 | Keyboard support     | Pressing Enter in the search input does not submit a form or trigger navigation. Pressing Escape clears the search input.                                                                                    | P1       |

## Non-Functional Requirements

### Performance

- Search filtering completes in < 50ms for libraries up to 500 entries.
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
- Unit tests for filter integration (search + genre/media type filters).
- Unit tests for edge cases: empty query, special characters, whitespace-only input.

## UI/UX Specs

### Search Input

- Positioned at the top of the Library screen content area, above the TabToggle or alongside filter controls.
- Uses the same input styling as the Home screen SearchBar for visual consistency.
- Includes a search icon (magnifying glass) on the left side of the input.
- Clear button (X icon) appears on the right when input has text.
- Placeholder text: "Search titles, tags, notes..." (localized via i18n).

### Empty State

- Displayed when search returns zero results.
- Centered layout with:
  - Icon: Search or empty-results icon
  - Heading: "No matches found"
  - Supporting text: "Try a different search term or clear your filters"
  - No CTA button (user can simply modify the search)

### Interaction

- Typing in the search input filters results after debounce delay.
- Clicking the clear button resets the search and shows all entries (subject to other filters).
- The search input does not steal focus on page load.

## Acceptance Criteria

- [ ] A search input is visible on the Library screen above the entry grid.
- [ ] Typing "batman" (case-insensitive) filters to show only entries with "batman" in title, tags, or notes.
- [ ] Searching "action" with genre filter set to "Comedy" shows only Comedy entries containing "action".
- [ ] Clearing the search input shows all entries (subject to other active filters).
- [ ] Empty state is displayed when no entries match the search query.
- [ ] Search query persists when switching between Watchlist and Watched tabs.
- [ ] Pressing Escape in the search input clears the query.
- [ ] Search filtering completes in < 50ms for a library of 500 entries.
- [ ] Search input is responsive: full-width on mobile, inline on desktop.
- [ ] Clear button has a touch target of at least 44×44px on mobile.
- [ ] All user-facing text uses i18n keys (no hardcoded strings).
