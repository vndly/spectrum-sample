# Implementation Plan: App Shell & Assembly

---

### Step 1 — Create app-shell component

- [ ] Create `src/presentation/components/layout/app-shell.vue`:

- Flexbox layout: `<SidebarNav>` (visible by default, `max-md:hidden`) + content area (`flex-1`)
- Content area: `pb-16 md:pb-0` (clearance for bottom nav on mobile)
- Renders `<PageHeader>` at top of content
- `<RouterView v-slot="{ Component }">` wrapped in `<Transition name="fade" mode="out-in">`
- `<BottomNav>` (component owns its fixed/mobile visibility and `z-10` contract from `01i`)
- `<ToastContainer>` as global overlay
- `<ModalDialog />` as global overlay

---

### Step 2 — Update App.vue

- [ ] Update `src/App.vue`: Import `ErrorBoundary` from `./presentation/components/error/error-boundary.vue` and `AppShell` from `./presentation/components/layout/app-shell.vue` in `<script setup>`. Replace template with `<ErrorBoundary>` wrapping `<AppShell />`.

---

### Step 3 — Verify

- [ ] Run and confirm all pass:
  - `npm run test` — zero test failures
  - `npm run type-check` — zero TypeScript errors
  - `npm run lint` — zero ESLint errors
  - `npm run format:check` — zero formatting issues
  - `npm run build` — production build succeeds
  - `npm run check` — full pipeline passes
  - `npm run dev` — manual verification:
    - **(SC-05-01, SC-04-01)** Desktop: sidebar visible with 4 nav items, flexbox layout with sidebar + scrollable content
    - **(SC-04-02, SC-06-01)** Mobile (< 768px): sidebar hides, bottom nav appears with 4 items
    - **(SC-04-03)** Resize back to desktop: sidebar restores, bottom nav hides
    - **(SC-04-04)** Mobile: scroll to bottom of page — content not obscured by bottom nav
    - **(SC-01d-02-01, SC-01d-02-02)** Navigation between pages via nav items and direct URL entry
    - **(SC-07-01, SC-07-03)** Active route highlighted in teal in both sidebar and bottom nav
    - **(SC-08-01, SC-08-02, SC-08-03)** Page header updates on navigation and remains sticky when scrolling
    - **(SC-01d-10-01, SC-01d-10-02)** Document title updates (e.g., "Library — Plot Twisted"); verify with Spanish locale
    - **(SC-09-01)** Route fade transition visible (~200ms)
    - **(SC-14-05a)** Toast slide-in animation from right
    - **(SC-15-07a, SC-15-07b)** Modal fade backdrop + scale-up animation for content card
    - **(SC-01d-11-01)** Scroll resets to top on navigation
    - **(SC-01d-02-03)** `/nonexistent` redirects to `/`
    - **(SC-01d-29-01)** URL shows clean paths without hash fragments
    - **(SC-01c-24-01, SC-01c-24-02, SC-01c-24-03)** `prefers-reduced-motion: reduce` disables route, toast, and modal animations
    - **(SC-06-03)** Mobile: bottom nav touch targets meet 44x44px minimum
