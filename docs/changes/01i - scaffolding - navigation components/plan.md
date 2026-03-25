# Implementation Plan: Navigation Components

---

### Step 1 — Write sidebar tests

- [ ] Create `tests/presentation/components/layout/sidebar-nav.test.ts` covering:

- **SC-05-01** — Renders all 4 nav items with correct icons and translated labels
- **SC-07-01** — Active route item has teal accent classes (`border-accent`, `bg-accent/10`)
- **SC-07-02** — Home route uses exact match (`route.path === '/'`)
- `(implementation detail)` — Inactive items have muted classes (`text-slate-400`)

---

### Step 2 — Write bottom nav tests

- [ ] Create `tests/presentation/components/layout/bottom-nav.test.ts` covering:

- **SC-06-01** — Renders all 4 nav items with icons and labels
- **SC-07-03** — Active route item has teal accent styling
- `(implementation detail)` — Inactive items have muted styling

---

### Step 3 — Write page header tests

- [ ] Create `tests/presentation/components/layout/page-header.test.ts` covering:

- **SC-08-01** — Displays translated title from route `meta.titleKey`
- **SC-08-02** — Updates displayed title when route changes

---

### Step 4 — Create sidebar-nav component

- [ ] Create `src/presentation/components/layout/sidebar-nav.vue`:

- Fixed left sidebar, `w-56`, `bg-bg-secondary`
- App title at top using `$t('app.title')`
- Nav items array: `{ to: string, labelKey: string, icon: Component }`
- Icons from lucide-vue-next: `Home`, `CalendarDays`, `Bookmark`, `Settings`
- Each item is a `<RouterLink>` with icon + `$t(labelKey)`
- Active state: `border-l-2 border-accent bg-accent/10 text-white`
- Inactive state: `text-slate-400 hover:text-white`
- Home route: exact match only (`route.path === '/'`)

---

### Step 5 — Create bottom-nav component

- [ ] Create `src/presentation/components/layout/bottom-nav.vue`:

- Fixed bottom bar (`fixed bottom-0 inset-x-0`), `z-10`
- Same 4 nav items with icons and short labels
- Active item: teal accent color, inactive: muted
- Dark background with subtle top border
- Classes: `hidden max-md:fixed max-md:flex` (visible below `md`, hidden at `md+`)

---

### Step 6 — Create page-header component

- [ ] Create `src/presentation/components/layout/page-header.vue`:

- Reads `route.meta.titleKey`, translates via `$t()`
- White text, `text-xl font-bold`
- Classes: `sticky top-0 z-10 bg-bg-primary`
