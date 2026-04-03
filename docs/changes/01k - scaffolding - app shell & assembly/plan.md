# Implementation Plan: App Shell & Assembly

## Phase 1 — Tests

1. [ ] Create `tests/presentation/components/layout/app-shell.test.ts` covering `SC-04-01`, `SC-04-02`, `SC-04-03`, `SC-04-04`, `SC-09-01`, `SC-09-02`, and `SC-10-03`. Assert the desktop sidebar offset, mobile shell switching, bottom-nav clearance, route fade behavior, reduced-motion behavior, and overlay stacking contract.
2. [ ] Create `tests/App.test.ts` covering `SC-10-01` and `SC-10-02`. Verify `App.vue` renders the routed experience through `ErrorBoundary` and `AppShell`, shows the current four-item scaffolded nav set, and places routed content beneath the shared shell chrome.
3. [ ] Run `npm run test -- tests/presentation/components/layout/app-shell.test.ts tests/App.test.ts` and confirm the new suites fail before implementation begins.

## Phase 2 — AppShell

1. [ ] Create `src/presentation/components/layout/app-shell.vue` with a desktop-first shell wrapper that keeps `SidebarNav` fixed at `w-56`, offsets the content column with `md:pl-56`, and uses a full-height content column as the scroll owner.
2. [ ] Render `PageHeader` at the top of the content column and a route content region with `flex-1 overflow-y-auto pb-16 md:pb-0` so the final routed content clears the fixed mobile bottom nav.
3. [ ] Render `<RouterView v-slot="{ Component }">` with `<component :is="Component" />` inside `<Transition name="fade" mode="out-in">` so routed views use the shared fade contract.
4. [ ] Mount `<BottomNav />`, `<ToastContainer />`, and `<ModalDialog />` inside `AppShell` so assembled-shell z-order remains page content < bottom nav < modal < toast.

## Phase 3 — Root Assembly

1. [ ] Update `src/App.vue` so `ErrorBoundary` wraps `<AppShell />` directly and `RouterView` no longer renders outside the shell.
2. [ ] Preserve the current scaffolded route set (Home, Calendar, Library, Settings) and document Recommendations as a follow-up dependency instead of introducing a fifth route in this change.

## Phase 4 — Verification

1. [ ] Run `npm run type-check` `(implementation detail)` and confirm zero TypeScript errors.
2. [ ] Run `npm run lint` `(implementation detail)` and confirm zero ESLint errors.
3. [ ] Run `npm run format:check` `(implementation detail)` and confirm zero formatting issues.
4. [ ] Run `npm run test` covering `SC-04-01`, `SC-04-02`, `SC-04-03`, `SC-04-04`, `SC-09-01`, `SC-09-02`, `SC-10-01`, `SC-10-02`, and `SC-10-03`.
5. [ ] Run `npm run build` `(implementation detail)`, then gzip the emitted main entry chunk and each emitted route-view chunk in `dist/assets/`; confirm the main entry remains under 150 KB and each lazy-loaded route chunk remains under 20 KB.
6. [ ] Run `npm run dev` and manually confirm:
   - `(SC-10-01)` The header and routed view render together inside the assembled shell on first load.
   - `(SC-10-02)` Sidebar and bottom nav show Home, Calendar, Library, and Settings in the documented order for the current scaffolded route set.
   - `(SC-04-01)` Desktop layout keeps routed content offset from the fixed sidebar.
   - `(SC-04-02)` and `(SC-04-03)` Resizing below and above `768px` switches shell chrome correctly.
   - `(SC-04-04)` The final routed content remains visible above the fixed mobile bottom nav.
   - `(SC-09-01)` Route changes use the 200ms opacity-only fade.
   - `(SC-09-02)` `prefers-reduced-motion: reduce` removes the animated route fade.
   - `(SC-10-03)` Modal overlays shell chrome and toast remains visible above the modal.
   - Re-verify dependency behaviors from `01d` and `01i`: document title updates, clean URLs, catch-all redirect, scroll reset, active route highlighting, and `44x44` mobile touch targets.
