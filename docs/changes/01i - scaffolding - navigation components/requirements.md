---
id: R-01i
title: App Scaffolding — Navigation Components
status: draft
type: infrastructure
importance: critical
tags: [layout, navigation, sidebar, responsive]
---

## Intent

Create the page header, desktop sidebar navigation, and mobile bottom navigation components — the structural navigation UI that frames every screen.

## Prerequisites

- **01a** — Test infrastructure (Vitest config, test setup)
- **01b** — i18n keys for nav labels and page titles
- **01d** — Router for `RouterLink` and route matching

## Decisions

| Decision                 | Choice                            | Rationale                                                                                                                                                                                                                                                                                                                     |
| :----------------------- | :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nav items                | Home, Calendar, Library, Settings | **Known deviation from UI/UX doc:** The UI/UX doc lists 5 primary nav items including Recommendations (position 2, between Home and Calendar). Recommendations is intentionally deferred to its own feature phase because it has no backing data or functionality at this stage. When added, it will be inserted at index 1 per the UI/UX doc order. Stats excluded from primary nav per UI/UX doc — accessed via internal link on Library screen. |
| Desktop-first responsive | `max-md:` breakpoints             | Per conventions §10. Base styles target desktop; `max-md:` overrides adapt for mobile.                                                                                                                                                                                                                                        |
| Home route matching      | Exact match only                  | Prevents the Home nav item from appearing active on every route.                                                                                                                                                                                                                                                              |

## Scope

- Create `page-header.vue`, `sidebar-nav.vue`, `bottom-nav.vue` in `src/presentation/components/layout/`
- Write component tests for all three

## Functional Requirements

| ID    | Requirement                | Description                                                                                                                                                                                                                                                                                    | Priority |
| :---- | :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-05 | Desktop sidebar            | Fixed left panel (`w-56`, dark background), app title at top, 4 nav items as `<RouterLink>` elements with lucide icons and translated labels.                                                                                                                                                  | P0       |
| SC-06 | Mobile bottom nav          | Fixed bottom bar visible below `md` breakpoint. Same 4 nav items with icons. `z-10` stacking above content, below modals/toasts.                                                                                                                                                               | P0       |
| SC-07 | Active route highlighting  | Active nav item highlighted with accent color (left border + background tint in sidebar, accent-colored icon/text in bottom nav). Home route uses exact matching.                                                                                                                               | P0       |
| SC-08 | Page header                | Sticky header at the top of the content area showing the current page name, translated via route `meta.titleKey`.                                                                                                                                                                              | P0       |
| SC-25 | Navigation component tests | Sidebar and BottomNav render all 4 nav items with correct icons and labels. Active route item is highlighted. Home route uses exact matching.                                                                                                                                                  | P0       |

## Non-Functional Requirements

### Responsive Design

- **Desktop-first:** Base styles target desktop (`md+`). Mobile overrides use `max-md:` breakpoints.
- **Breakpoint behavior:** Below `md` (768px): sidebar hidden, bottom nav visible, single-column content. At `md` and above: sidebar visible, bottom nav hidden.
- **Touch targets:** All nav items and buttons meet the 44x44px minimum on mobile.

## Acceptance Criteria

- [ ] Sidebar renders 4 nav items with icons and translated labels
- [ ] Active route has teal accent
- [ ] Home uses exact match
- [ ] Bottom nav visible below `md` breakpoint with same items
- [ ] Page header shows translated title from route meta
- [ ] Page header is sticky
- [ ] Mobile touch targets 44x44px minimum
- [ ] Component tests pass
