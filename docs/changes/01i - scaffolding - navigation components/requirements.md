---
id: R-01i
title: App Scaffolding — Navigation Components
status: approved
type: infrastructure
importance: critical
tags: [layout, navigation, sidebar, responsive]
---

## Intent

Create the page header, desktop sidebar navigation, and mobile bottom navigation components — the structural navigation UI that frames the four currently scaffolded routes.

## Context & Background

### Dependencies

- **01a** — Test infrastructure (Vitest config, test setup)
- **01b** — i18n keys for nav labels and page titles
- **01d** — Router for `RouterLink` and route matching

### Phase Sequencing

This phase targets the four routes already scaffolded in the current sequence: Home, Calendar, Library, and Settings. Recommendations remains deferred to its own feature phase and will be inserted between Home and Calendar once that route exists.

## Decisions

| Decision                 | Choice                            | Rationale                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :----------------------- | :-------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nav items                | Home, Calendar, Library, Settings | **Known deviation from UI/UX doc:** The UI/UX doc lists 5 primary nav items including Recommendations (position 2, between Home and Calendar). Recommendations is intentionally deferred to its own feature phase because its route, screen, and recommendation-seed UX/composables are not implemented at this stage. When added, it will be inserted at index 1 per the UI/UX doc order. Stats excluded from primary nav per UI/UX doc — accessed via internal link on Library screen. |
| Sidebar branding         | `app.title` only                  | The existing `app.title` i18n key is available in all supported locales, but no dedicated logo asset exists in the repo yet. This phase carries the localized app name only; a visual logo asset is deferred to a future branding-focused change.                                                                                                                                                                                                                                        |
| Desktop-first responsive | `max-md:` breakpoints             | Per conventions §10. Base styles target desktop; `max-md:` overrides adapt for mobile.                                                                                                                                                                                                                                                                                                                                                                                                   |
| Home route matching      | Exact match only                  | Prevents the Home nav item from appearing active on every route.                                                                                                                                                                                                                                                                                                                                                                                                                         |

## Scope

### In Scope

- Create `page-header.vue`, `sidebar-nav.vue`, and `bottom-nav.vue` in `src/presentation/components/layout/`
- Render navigation items for Home, Calendar, Library, and Settings using the existing `nav.*` and `page.*.title` i18n keys
- Write component tests for `sidebar-nav.vue`, `bottom-nav.vue`, and `page-header.vue`

### Out of Scope

- Creating new routes or changing router configuration
- Placeholder view content for the scaffolded routes (`01j`)
- App-shell assembly, content-area bottom padding clearance, and responsive shell switching verification (`01k`)
- Final overlay stacking verification against toasts and modals in the assembled shell (`01k`)
- Adding the Recommendations nav item before its route and view exist
- Adding a dedicated logo asset to the sidebar branding block

## UI/UX Specs

- **Desktop sidebar branding:** Top branding block renders the existing `app.title` i18n key. A dedicated logo asset is deferred until the project has a real brand asset to display.
- **Desktop sidebar nav items:** `/` -> `nav.home` with `House`; `/calendar` -> `nav.calendar` with `CalendarDays`; `/library` -> `nav.library` with `Bookmark`; `/settings` -> `nav.settings` with `Settings`
- **Mobile bottom nav items:** Same routes, order, icons, and translation keys as the desktop sidebar
- **Page header title keys:** `/` -> `page.home.title`; `/calendar` -> `page.calendar.title`; `/library` -> `page.library.title`; `/settings` -> `page.settings.title`
- **Active states:** Sidebar uses a teal left border and background tint; bottom nav uses teal text/icon styling; Home uses exact-match route detection

## Functional Requirements

| ID    | Requirement               | Description                                                                                                                                                                                                                                                                                  | Priority |
| :---- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-05 | Desktop sidebar           | Fixed left panel (`w-56`, dark background) with the `app.title` branding block at top. A dedicated logo asset is out of scope for this phase. Contains exactly 4 `<RouterLink>` nav items for Home, Calendar, Library, and Settings, each using its mapped lucide icon and translated label. | P0       |
| SC-06 | Mobile bottom nav         | Fixed bottom bar visible below `md` breakpoint. Uses the same exact 4 nav items, order, icon mappings, and translated labels as the desktop sidebar. Each item meets the 44x44px minimum touch target on mobile.                                                                             | P0       |
| SC-07 | Active route highlighting | Active nav item highlighted with accent color (left border + background tint in sidebar, accent-colored icon/text in bottom nav). Home route uses exact matching.                                                                                                                            | P0       |
| SC-08 | Page header               | Sticky header at the top of the content area showing the current page name, translated via route `meta.titleKey`, and updating when the active route changes.                                                                                                                                | P0       |
| SC-25 | Layout component tests    | Component tests cover sidebar rendering and active-state behavior, bottom-nav rendering and touch-target sizing, and page-header title rendering, locale output, route updates, and sticky positioning.                                                                                      | P0       |

## Non-Functional Requirements

### Responsive Design

- **Breakpoint behavior:** Below `md` (768px): sidebar hidden, bottom nav visible. At `md` and above: sidebar visible, bottom nav hidden.
- **Touch targets:** All bottom nav items meet the 44x44px minimum on mobile.

### Stacking Order

- **Bottom nav layer:** Mobile bottom nav uses `z-10` so it stays above page content and below modal/toast overlays in the assembled shell.
- **Page header layer:** Sticky page header uses `z-10` within the content area so it remains above scrolling page content.

## Acceptance Criteria

- [ ] Sidebar renders the `app.title` branding block plus Home, Calendar, Library, and Settings with their mapped icons and translated `nav.*` labels
- [ ] Sidebar and bottom nav render exactly 4 primary items in the same order; Recommendations, Stats, and detail routes are absent from navigation in this phase
- [ ] Sidebar and bottom nav apply teal active-state styling, and Home uses exact-match route detection on desktop and mobile
- [ ] Bottom nav is visible below `md`, uses `z-10`, and each item meets the 44x44px minimum touch target
- [ ] Page header renders the translated `meta.titleKey` value for the active route and updates when the route changes
- [ ] Page header uses sticky positioning and `z-10` content-layer stacking at the top of the content area
- [ ] At least one component test verifies translated output in a non-default locale
- [ ] `sidebar-nav.test.ts`, `bottom-nav.test.ts`, and `page-header.test.ts` pass for the documented scenarios
