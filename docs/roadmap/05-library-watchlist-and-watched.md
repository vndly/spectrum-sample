# Library: Watchlist and Watched Tabs

* Toggle between watchlist and watched
* View details of movies in your library
* Open the details of an entry
* **Key components:** TabToggle (watchlist/watched/lists), EntryGrid

## Custom List Management

* Create a new custom list (name required, trimmed and sanitized)
* Rename an existing list
* Delete a list (entries are not deleted — only the list association is removed from each `LibraryEntry.lists`)
* Add an entry to one or more lists from the entry detail screen
* Remove an entry from a list
* View all entries belonging to a specific list via the "Lists" tab

## Acceptance Criteria

- [ ] `TabToggle` switches between Watchlist, Watched, and Lists tabs
- [ ] `EntryGrid` displays saved entries as `MovieCard` items in a responsive grid
- [ ] Tapping a card navigates to `/movie/:id` or `/tv/:id`
- [ ] Empty state shown per tab when no entries exist (with contextual message and CTA)
- [ ] Users can create a new custom list with a trimmed, non-empty name
- [ ] Users can rename and delete existing custom lists
- [ ] Deleting a list removes the list association from entries but does not delete the entries themselves
- [ ] Users can add/remove entries to/from lists from the entry detail screen
- [ ] Lists tab displays all custom lists; selecting a list shows its entries in the grid

## Key Decisions

* **localStorage-only persistence** — all library data is stored client-side; no backend or user accounts required
* **List association stored on entries** — each `LibraryEntry.lists` array holds list IDs, avoiding a separate join structure
