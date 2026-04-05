---
id: R-05
title: Library Management: Watchlist, Watched, and Custom Lists
status: released
importance: high
type: functional
tags: [library, storage, lists, watchlist, watched]
---

## Intent

Provide users with a centralized way to manage their saved movies and TV shows, including categorization into "Watchlist" and "Watched" statuses, and organization into custom, user-defined lists.

## Context & Background

### Problem Statement

Users need a way to track what they want to watch and what they have already seen. Additionally, as the library grows, simple status toggles are insufficient for organization; users need the ability to create custom collections (e.g., "Horror Classics", "Date Night") to group their saved entries.

### User Stories

- As a user, I want to toggle between my Watchlist and Watched entries so I can quickly see what's next and what I've finished.
- As a user, I want to create custom lists with meaningful names so I can organize my library by genre, mood, or any other criteria.
- As a user, I want to add or remove movies/shows from my custom lists from their detail screen.
- As a user, I want to see all entries in a specific custom list in a grid view.
- As a user, I want to rename or delete my custom lists when they are no longer needed.

### Dependencies

- `R-02`: Home screen (provides initial entry points, search, and detail screens)

## Decisions

| Decision         | Choice                           | Rationale                                                                                            |
| :--------------- | :------------------------------- | :--------------------------------------------------------------------------------------------------- |
| Persistence      | `localStorage`                   | Matches the project's "local-first" approach; no backend required.                                   |
| List association | ID-based array on `LibraryEntry` | Simple to implement and query; avoids complex join logic in a local-first environment.               |
| List Schema      | Separate `List` entity           | Allows storing list metadata (name, created date) independently of the entries it contains.          |
| List IDs         | `crypto.randomUUID()`            | Ensures unique IDs without needing an external library or complex counters.                          |
| Uniqueness       | Case-insensitive                 | List names must be unique when compared case-insensitively to avoid "Horror" and "horror" confusion. |

## Scope

**In Scope:**

- `TabToggle` component to switch between Watchlist, Watched, and Lists.
- `EntryGrid` component to display `MovieCard` items for the active tab/list.
- `LibraryScreen` updates to integrate the new components and state.
- `List` domain schema and validation.
- `storage.service.ts` extensions for managing custom lists.
- `useLibraryEntries` and `useLists` application-layer composables.
- UI for creating, renaming, and deleting custom lists.
- Empty states for each tab and list.

**Out of Scope:**

- Cloud sync or multi-device support.
- Sharing lists with other users.
- Automated list suggestions or smart lists.
- Filtering or sorting within the lists (covered by a future roadmap item).

## Functional Requirements

| ID   | Requirement             | Description                                                                                                       | Priority |
| :--- | :---------------------- | :---------------------------------------------------------------------------------------------------------------- | :------- |
| L-01 | Watchlist Tab           | Display all library entries with `status: 'watchlist'` in a responsive grid.                                      | P0       |
| L-02 | Watched Tab             | Display all library entries with `status: 'watched'` in a responsive grid.                                        | P0       |
| L-03 | Custom Lists Management | Users can create, rename, and delete custom lists with non-empty, trimmed, and unique names.                      | P0       |
| L-04 | List-Entry Association  | Users can add/remove library entries to/from one or more custom lists from the entry detail screen.               | P0       |
| L-05 | List View               | Selecting a custom list displays all entries associated with that list ID.                                        | P0       |
| L-06 | Deletion Integrity      | Deleting a list removes its ID from all associated entries but does not delete the entries themselves.            | P1       |
| L-07 | Navigation              | Tapping an entry in any library grid navigates to its corresponding detail screen.                                | P0       |
| L-08 | Empty States            | Each tab and list must show a contextual empty state when no entries are present, including a CTA to add content. | P1       |

## Non-Functional Requirements

### Persistence

- **Data Integrity**: All changes to library entries or custom lists must be persisted to `localStorage` immediately.
- **Validation**: Data read from `localStorage` must be validated against Zod schemas.

### Performance

- **Grid Rendering**: The `EntryGrid` should handle up to 100 entries with smooth scrolling and no noticeable lag.
- **Filtering**: Switching between tabs/lists should be instantaneous (< 100ms).

### UI/UX

- **Responsive Design**: The `EntryGrid` must adjust the number of columns based on screen size (mobile, tablet, desktop).
- **Feedback**: Users must receive toast notifications for destructive actions (e.g., deleting a list).

## Acceptance Criteria

- [ ] `TabToggle` correctly filters the library by "Watchlist" and "Watched" status.
- [ ] Users can create a new custom list with a valid, unique name (case-insensitive).
- [ ] Custom lists are persisted across page reloads.
- [ ] Adding an entry to a list from the detail screen correctly updates the entry in storage.
- [ ] Deleting a list removes it from the "Lists" tab and clears its ID from all entries.
- [ ] `EntryGrid` displays `MovieCard` items with correct data (title, poster, rating).
- [ ] Tapping a card navigates to `/movie/:id` or `/show/:id`.
- [ ] Empty state appears when a tab or list has no entries.
