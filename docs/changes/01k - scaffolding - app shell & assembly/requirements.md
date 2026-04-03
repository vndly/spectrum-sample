---
id: R-01k
title: App Scaffolding — App Shell & Assembly
status: in_development
type: infrastructure
importance: critical
tags: [layout, app-shell, assembly, transitions, testing, verification]
---

## Intent

Define the assembled app shell for the current scaffolding sequence so the app boots into a responsive shell that combines shared navigation chrome, routed content, global overlays, and root-level error recovery.

## Context & Background

### Dependencies

- **01d** — Router (`RouterView`)
- **01g** — ToastContainer, ModalDialog
- **01h** — ErrorBoundary
- **01i** — SidebarNav, BottomNav, PageHeader
- **01j** — Placeholder views (for verification)

### Current Scaffolding Boundaries

- This change assembles the current scaffolded route set: Home, Calendar, Library, and Settings.
- Recommendations remains a follow-up dependency. The shell preserves its documented insertion point between Home and Calendar, but the route and view stay out of scope until the Recommendations feature phase exists.

## Decisions

| Decision                   | Choice                            | Rationale                                                                                             |
| :------------------------- | :-------------------------------- | :---------------------------------------------------------------------------------------------------- |
| Desktop-first responsive   | `max-md:` breakpoints             | Per conventions §10. Base styles target desktop; `max-md:` overrides adapt for mobile.                |
| Current scaffolded nav set | Home, Calendar, Library, Settings | Matches the routes currently delivered by `01 - scaffolding`; Recommendations stays deferred for now. |

## Scope

### In Scope

- Create `src/presentation/components/layout/app-shell.vue`.
- Update `src/App.vue` so the routed experience boots through `ErrorBoundary` and `AppShell`.
- Assemble the current scaffolded navigation chrome, routed content, and global overlays in one shell.
- Add local shell scenarios plus test-first verification for shell assembly.

### Out of Scope

- Adding the Recommendations route, view, or nav item before its feature phase exists.
- Changing router definitions, navigation-component internals, or overlay implementations outside shell assembly.
- New motion systems beyond the existing `fade`, `toast`, and `modal` transition contracts.

## Functional Requirements

| ID    | Requirement         | Description                                                                                                                                                                                                                                          | Priority |
| :---- | :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-04 | App shell layout    | `AppShell` renders a fixed desktop sidebar and a mobile bottom nav around the current scaffolded routes (Home, Calendar, Library, Settings). At `md` and above, the routed content column is offset so it does not render beneath the fixed sidebar. | P0       |
| SC-09 | Route transitions   | Route changes between scaffolded views use the existing `fade` transition contract for a 200ms opacity-only fade. When `prefers-reduced-motion: reduce` is enabled, route changes occur without animated fade.                                       | P1       |
| SC-10 | Root shell assembly | `App.vue` boots the routed experience through `ErrorBoundary` and `AppShell`. `AppShell` renders `PageHeader`, the routed view outlet, `ToastContainer`, and `ModalDialog` so navigation, content, and global overlays can be verified together.     | P0       |

## Non-Functional Requirements

### Responsive Design

- **Breakpoint behavior:** Below `md` (768px): sidebar hidden, bottom nav visible, single-column content. At `md` and above: sidebar visible, bottom nav hidden.

### Performance

- **Initial load:** The main bundle (before lazy-loaded route chunks) should remain under 150 KB gzipped, establishing a baseline before feature code is added.
- **Lazy chunks:** Each route's lazy-loaded chunk should remain under 20 KB gzipped.

### Stacking Order

- Page content: default (`z-0`)
- Bottom nav: `z-10`
- Modal backdrop: `z-40`
- Modal content card: `z-40` (same layer as backdrop; stacks above via DOM order)
- Toast container: `z-50` (renders above modals — toasts remain visible when a modal is open)

### Testing

- **Automated coverage:** `tests/App.test.ts` and `tests/presentation/components/layout/app-shell.test.ts` cover shell assembly, responsive switching, overlay stacking, and route-transition behavior in Vitest + jsdom.
- **Verification commands:** Final verification uses non-mutating commands only: `npm run type-check`, `npm run lint`, `npm run format:check`, `npm run test`, and `npm run build`.

## Acceptance Criteria

- [ ] `(SC-10)` `App.vue` renders the current scaffolded routes through `ErrorBoundary` and `AppShell`, with `PageHeader`, routed content, `ToastContainer`, and `ModalDialog` mounted in the assembled shell.
- [ ] `(SC-04)` Desktop (`>= 768px`) renders the sidebar; mobile (`< 768px`) hides the sidebar, shows the bottom nav, and keeps the final routed content visible above the fixed bottom nav.
- [ ] `(SC-04)` The current scaffolded nav items `Home`, `Calendar`, `Library`, and `Settings` navigate correctly in both shell navs. Recommendations remains deferred until its prerequisite route/view feature exists.
- [ ] `(SC-09)` Route changes between scaffolded views use a 200ms opacity-only fade, and `prefers-reduced-motion: reduce` removes the animated fade.
- [ ] `(SC-10, Stacking Order)` With a modal open, the modal overlays page content and shell chrome, and a toast remains visible above the modal.
- [ ] `(Testing)` `tests/App.test.ts` and `tests/presentation/components/layout/app-shell.test.ts` pass and cover the local shell scenarios.
- [ ] `(Verification)` `npm run type-check`, `npm run lint`, `npm run format:check`, `npm run test`, and `npm run build` pass without mutating the worktree.
- [ ] `(Performance)` Running `npm run build` followed by gzip inspection of the emitted main entry and route-view chunks confirms the main entry remains under 150 KB and each lazy-loaded route chunk remains under 20 KB.
