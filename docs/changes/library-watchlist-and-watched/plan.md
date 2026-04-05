# Implementation Plan: Library Management

---

## Phase 1 — Domain & Infrastructure

### Step 1 — Unit tests for List schema and storage

- [ ] Create `tests/domain/list.schema.test.ts` to verify `ListSchema` (id, name, createdAt).
- [ ] Create `tests/infrastructure/storage.service.lists.test.ts` to verify CRUD operations for lists and list-entry association logic.
  - `covering: L-03, L-06`

### Step 2 — Implement List schema and storage extensions

- [ ] Update `src/domain/library.schema.ts` to include `ListSchema` and `List` type.
  - `id: z.string().uuid()`
  - `name: z.string().min(1)`
  - `createdAt: z.string()` (ISO date)
- [ ] Update `src/infrastructure/storage.service.ts` with:
  - `getAllLists(): List[]`
  - `saveList(list: List): void`
  - `removeList(id: string): void`
  - `getListEntries(listId: string): LibraryEntry[]`
  - `updateEntryLists(id: number, mediaType: MediaType, listIds: string[]): void`
  - `removeListFromAllEntries(listId: string): void` (for deletion integrity)

---

## Phase 2 — Application Layer

### Step 3 — Unit tests for Composables

- [ ] Create `tests/application/use-lists.test.ts` to verify list management logic.
  - `covering: L-03`
- [ ] Create `tests/application/use-library-entries.test.ts` to verify filtering by status and list.
  - `covering: L-01, L-02, L-05`

### Step 4 — Implement Composables

- [ ] Create `src/application/use-lists.ts`:
  - `lists: ComputedRef<List[]>`
  - `createList(name: string): void`
  - `renameList(id: string, newName: string): void`
  - `deleteList(id: string): void`
- [ ] Create `src/application/use-library-entries.ts`:
  - `getEntriesByStatus(status: WatchStatus): LibraryEntry[]`
  - `getEntriesByList(listId: string): LibraryEntry[]`
  - `getAllEntries(): LibraryEntry[]`

---

## Phase 3 — Presentation Layer (Components)

### Step 5 — Component tests

- [ ] Create `tests/presentation/components/common/tab-toggle.test.ts`.
- [ ] Create `tests/presentation/components/common/entry-grid.test.ts`.
- [ ] Create `tests/presentation/components/details/list-manager-modal.test.ts`.

### Step 6 — Implement UI Components

- [ ] Create `src/presentation/components/common/tab-toggle.vue`:
  - Props: `tabs: Array<{ id: string, label: string }>`, `activeTab: string`
  - Events: `update:activeTab`
- [ ] Create `src/presentation/components/common/entry-grid.vue`:
  - Props: `entries: LibraryEntry[]`
  - Uses `MovieCard` for rendering.
- [ ] Create `src/presentation/components/details/list-manager-modal.vue`:
  - Allows toggling list associations for the current entry.
  - `covering: L-04`

### Step 7 — Update Views

- [ ] Update `src/presentation/views/library-screen.vue`:
  - Integrate `TabToggle` for Watchlist/Watched/Lists.
  - If "Lists" is active, show list selector.
  - Show `EntryGrid` for the selected filter.
  - `covering: L-01, L-02, L-05, L-08`
- [ ] Surgically update `src/presentation/views/movie-screen.vue` and `show-screen.vue`:
  - Add button to open `ListManagerModal` (likely near the Watchlist/Watched buttons).
  - `covering: L-04`

---

## Phase 4 — Verification

### Step 8 — Final Verification

- [ ] Run `npm run check` (lint, type-check, test, build).
- [ ] Manual verification of scenarios:
  - [ ] Switch between Watchlist and Watched tabs.
  - [ ] Create, rename, and delete a custom list.
  - [ ] Add an entry to a list from the detail screen.
  - [ ] Verify entry appears in the custom list grid.
  - [ ] Delete a list and verify entries still exist in "All" but are removed from the deleted list.
  - [ ] Verify empty states for each tab.
