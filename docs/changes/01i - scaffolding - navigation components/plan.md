# Implementation Plan: Navigation Components

## Phase 1 — Sidebar

### Step 1 — Write sidebar tests

- [ ] Create `tests/presentation/components/layout/sidebar-nav.test.ts` covering:
  - **SC-05-01** — Renders a fixed desktop sidebar with the `app.title` branding block, exactly 4 scaffolded nav links, and no Recommendations/Stats/detail nav items
  - **SC-05-02** — Renders the documented French labels (`Accueil`, `Calendrier`, `Bibliothèque`, `Paramètres`) with the mapped icons
  - **SC-07-01** — Active route item has teal accent classes (`border-accent`, `bg-accent/10`)
  - **SC-07-02** — Home route uses exact match (`route.path === '/'`)
  - **SC-07-04** — Home route is highlighted on `/`
  - **SC-25-01** — Sidebar test covers nav item rendering and exact 4-item navigation
  - **SC-25-02** — Sidebar test covers desktop active-state behavior
  - **SC-25-07** — Sidebar test covers Home exact-match positive behavior
  - `(implementation detail)` — Inactive items use muted classes (`text-slate-400`)
- [ ] Run `npx vitest run tests/presentation/components/layout/sidebar-nav.test.ts` and confirm the new assertions fail before implementing `sidebar-nav.vue`

### Step 2 — Create sidebar-nav component

- [ ] Create `src/presentation/components/layout/sidebar-nav.vue`:
  - Fixed left sidebar, `w-56`, `bg-bg-secondary`
  - App title at top using `$t('app.title')`; a dedicated logo asset remains out of scope for this phase
  - Nav items array: `{ to: string, labelKey: string, icon: Component }`
  - Icons from lucide-vue-next: `House`, `CalendarDays`, `Bookmark`, `Settings`
  - Routes and labels: `/` + `nav.home`, `/calendar` + `nav.calendar`, `/library` + `nav.library`, `/settings` + `nav.settings`
  - Exactly 4 items; Recommendations intentionally remains out of scope until its route exists
  - Each item is a `<RouterLink>` with icon + `$t(labelKey)`
  - Active state: `border-l-2 border-accent bg-accent/10 text-white`
  - Inactive state: `text-slate-400 hover:text-white`
  - Home route: exact match only (`route.path === '/'`)

### Step 3 — Run sidebar tests

- [ ] Run `npx vitest run tests/presentation/components/layout/sidebar-nav.test.ts` and confirm all sidebar assertions pass before moving to the next phase

## Phase 2 — Bottom Nav

### Step 4 — Write bottom nav tests

- [ ] Create `tests/presentation/components/layout/bottom-nav.test.ts` covering:
  - **SC-06-01** — Renders a fixed mobile bottom nav with the same exact 4 scaffolded nav links in documented order and no Recommendations/Stats/detail nav items
  - **SC-06-03** — Each bottom-nav item meets the 44x44px minimum touch target
  - **SC-07-03** — Active route item has teal accent styling
  - **SC-07-05** — Home route item uses exact match on `/`
  - **SC-25-03** — Bottom-nav test covers mobile rendering and exact 4-item navigation
  - **SC-25-04** — Bottom-nav test covers active state and touch targets
  - **SC-25-08** — Bottom-nav test covers Home exact-match positive behavior
  - `(implementation detail)` — Inactive items use muted styling
- [ ] Run `npx vitest run tests/presentation/components/layout/bottom-nav.test.ts` and confirm the new assertions fail before implementing `bottom-nav.vue`

### Step 5 — Create bottom-nav component

- [ ] Create `src/presentation/components/layout/bottom-nav.vue`:
  - Fixed bottom bar (`fixed bottom-0 inset-x-0 z-10`)
  - Same 4 nav items, order, icons, and translation keys as the sidebar
  - Each interactive item uses `min-h-11` / `min-w-11` or equivalent sizing to meet the 44x44px minimum touch target
  - Active item: teal accent color; Home route uses exact match only (`route.path === '/'`)
  - Inactive item: muted
  - Dark background with subtle top border
  - Classes: `hidden max-md:fixed max-md:flex` (visible below `md`, hidden at `md+`)
  - Keep the component focused on nav rendering and mobile presentation; `01k` owns content-area clearance in the assembled shell

### Step 6 — Run bottom-nav tests

- [ ] Run `npx vitest run tests/presentation/components/layout/bottom-nav.test.ts` and confirm all bottom-nav assertions pass before moving to the next phase

## Phase 3 — Page Header

### Step 7 — Write page header tests

- [ ] Create `tests/presentation/components/layout/page-header.test.ts` covering:
  - **SC-08-01** — Displays translated title from route `meta.titleKey`
  - **SC-08-02** — Updates displayed title when route changes
  - **SC-08-03** — Applies sticky positioning classes
  - **SC-08-04** — Renders translated title in a non-default locale
  - **SC-25-05** — Page-header test covers title rendering and route updates
  - **SC-25-06** — Page-header test covers sticky positioning and non-default locale output
- [ ] Run `npx vitest run tests/presentation/components/layout/page-header.test.ts` and confirm the new assertions fail before implementing `page-header.vue`

### Step 8 — Create page-header component

- [ ] Create `src/presentation/components/layout/page-header.vue`:
  - Reads `route.meta.titleKey`, translates via `$t()`
  - Updates immediately when the active route changes
  - White text, `text-xl font-bold`
  - Classes: `sticky top-0 z-10 bg-bg-primary`

### Step 9 — Run page-header tests

- [ ] Run `npx vitest run tests/presentation/components/layout/page-header.test.ts` and confirm all page-header assertions pass before moving to project-wide verification

## Phase 4 — Verification

### Step 10 — Run targeted layout component tests

- [ ] Run and confirm all pass:
  - `npx vitest run tests/presentation/components/layout/sidebar-nav.test.ts`
  - `npx vitest run tests/presentation/components/layout/bottom-nav.test.ts`
  - `npx vitest run tests/presentation/components/layout/page-header.test.ts`

### Step 11 — Run project verification

- [ ] Run and confirm all pass:
  - `npm run test`
  - `npm run lint`
  - `npm run format:check`
  - `npm run type-check`
  - `npm run build`

> App-shell integration checks for responsive switching and content-area clearance remain in `01k`, after `AppShell` assembles these components.
