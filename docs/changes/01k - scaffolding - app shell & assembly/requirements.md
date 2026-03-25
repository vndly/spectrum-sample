---
id: R-01k
title: App Scaffolding — App Shell & Assembly
status: draft
type: infrastructure
importance: critical
tags: [layout, app-shell, assembly, transitions]
---

## Intent

Create the AppShell layout component that assembles all navigation, overlay, and content components, update App.vue to use ErrorBoundary + AppShell, and perform final verification of the complete scaffolding.

## Prerequisites

- **01d** — Router (`RouterView`)
- **01g** — ToastContainer, ModalDialog
- **01h** — ErrorBoundary
- **01i** — SidebarNav, BottomNav, PageHeader
- **01j** — Placeholder views (for verification)

## Decisions

| Decision                 | Choice                | Rationale                                                                                          |
| :----------------------- | :-------------------- | :------------------------------------------------------------------------------------------------- |
| Desktop-first responsive | `max-md:` breakpoints | Per conventions §10. Base styles target desktop; `max-md:` overrides adapt for mobile.             |

## Scope

- Create `src/presentation/components/layout/app-shell.vue`
- Update `src/App.vue`
- Run full verification

## Functional Requirements

| ID    | Requirement       | Description                                                                                                                                    | Priority |
| :---- | :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-04 | App shell layout  | Flexbox layout with fixed sidebar on the left and scrollable content area on the right. Sidebar hidden below `md`, bottom nav shown instead.   | P0       |
| SC-09 | Route transitions | `<Transition name="fade" mode="out-in">` wrapping `<RouterView>`. 200ms opacity fade between views. Respects `prefers-reduced-motion`.         | P1       |

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

## Acceptance Criteria

- [ ] `npm run dev` starts and renders app shell with sidebar (desktop)
- [ ] Resizing below 768px switches sidebar/bottom nav
- [ ] All 4 nav items navigate correctly
- [ ] Route transitions fade in/out at 200ms
- [ ] Content area has bottom padding clearance on mobile
- [ ] `npm run test` passes with zero failures
- [ ] `npm run check` passes (full pipeline)
