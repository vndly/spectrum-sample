# Implementation Plan: Placeholder Views

---

### Step 1 — Write view tests

- [ ] Create one test file per view in `tests/presentation/views/` covering:

- **SC-20-01** — Each view renders `<EmptyState>` with the correct icon and translated title/description

| Test File                 | Verifies                                                                  |
| :------------------------ | :------------------------------------------------------------------------ |
| `home-screen.test.ts`     | Renders `<EmptyState>` with `Home` icon and `page.home.title`             |
| `calendar-screen.test.ts` | Renders `<EmptyState>` with `CalendarDays` icon and `page.calendar.title` |
| `library-screen.test.ts`  | Renders `<EmptyState>` with `Bookmark` icon and `page.library.title`      |
| `settings-screen.test.ts` | Renders `<EmptyState>` with `Settings` icon and `page.settings.title`     |

---

### Step 2 — Create placeholder views

- [ ] Create placeholder views in `src/presentation/views/`:

| File                  | Icon Import    | Title Key             | Description Key            |
| :-------------------- | :------------- | :-------------------- | :------------------------- |
| `home-screen.vue`     | `Home`         | `page.home.title`     | `common.empty.description` |
| `calendar-screen.vue` | `CalendarDays` | `page.calendar.title` | `common.empty.description` |
| `library-screen.vue`  | `Bookmark`     | `page.library.title`  | `common.empty.description` |
| `settings-screen.vue` | `Settings`     | `page.settings.title` | `common.empty.description` |

Each view follows the same pattern: `<script setup>` imports `EmptyState`, the lucide icon, and `useI18n`. Template renders `<EmptyState>` with the icon, translated title (from `page.*.title`), and the shared description (`common.empty.description`).
