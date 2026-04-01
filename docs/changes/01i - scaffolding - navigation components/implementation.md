# Implementation: App Scaffolding — Navigation Components

## Overview

This change implemented the three presentation-layer navigation pieces planned for the scaffolding phase: the desktop sidebar, the mobile bottom navigation bar, and the sticky page header. The work followed the plan's test-first sequence, adding dedicated Vitest suites before each Vue component and then implementing only the presentation files required to satisfy those tests.

The implementation satisfies the feature requirements by keeping navigation limited to the four currently scaffolded routes, reusing the existing `nav.*`, `page.*.title`, and `app.title` i18n keys, and deriving active state directly from `route.path` and `route.meta.titleKey`. No router configuration, route definitions, placeholder views, API code, storage code, or logo assets were changed in this feature.

## Requirement Coverage

- `SC-05` — `src/presentation/components/layout/sidebar-nav.vue` renders the fixed `w-56` desktop sidebar, localized `app.title` branding, exactly four `RouterLink` items, and the documented lucide icon mapping.
- `SC-06` — `src/presentation/components/layout/bottom-nav.vue` renders the fixed mobile bottom nav with the same four routes and labels as the sidebar, `z-10` layering, and `min-h-11` / `min-w-11` touch-target sizing.
- `SC-07` — Both nav components use exact-match Home route detection and accent styling for the active item while keeping inactive items muted.
- `SC-08` — `src/presentation/components/layout/page-header.vue` reads `route.meta.titleKey`, translates it through vue-i18n, and keeps the header sticky with `top-0` and `z-10`.
- `SC-25` — The new test files cover sidebar rendering and exact-match behavior, bottom-nav rendering and touch-target classes, and page-header translation, route updates, and sticky positioning.

## Files Changed

### Created

- `src/presentation/components/layout/sidebar-nav.vue` — Desktop sidebar component with localized branding, four primary links, and exact-match active styling.
- `src/presentation/components/layout/bottom-nav.vue` — Mobile bottom navigation component with responsive visibility classes, accent active state, and 44x44 touch-target classes.
- `src/presentation/components/layout/page-header.vue` — Sticky route-title header driven by `route.meta.titleKey`.
- `tests/presentation/components/layout/sidebar-nav.test.ts` — Test-first sidebar coverage for structure, icon mapping, French labels, active state, and exact-match Home behavior.
- `tests/presentation/components/layout/bottom-nav.test.ts` — Test-first bottom-nav coverage for route order, icon mapping, touch-target classes, active state, and exact-match Home behavior.
- `tests/presentation/components/layout/page-header.test.ts` — Test-first page-header coverage for translated titles, route updates, sticky classes, and Spanish output.
- `docs/changes/01i - scaffolding - navigation components/implementation.md` — Feature-level implementation summary, verification log, and documented scope boundaries.

### Modified

- `docs/changes/01i - scaffolding - navigation components/requirements.md` — Advanced feature status from `approved` to `in_development`, then to `under_test` after verification passed.
- `docs/changes/01i - scaffolding - navigation components/plan.md` — Checked off all completed implementation and verification steps for resumability.
- `docs/changes/01i - scaffolding - navigation components/index.md` — Added the implementation entry for this feature folder.

## Key Decisions

- Reused the existing route metadata and locale keys instead of adding new strings or router changes, which kept the implementation inside the planned presentation scope.
- Duplicated the four-item nav definitions inside the sidebar and bottom-nav components rather than introducing a new shared module, because the plan did not authorize additional files outside the listed component paths.
- Used exact `route.path === '/'` matching for Home and exact path matching for the other scaffolded routes to prevent false-positive active states.
- Kept the components presentation-only: no new user inputs, async flows, storage writes, API calls, authentication changes, or environment/config changes were introduced.

## Rollback Strategy

- Remove the three layout components and their three associated test files.
- Revert the `requirements.md`, `plan.md`, `index.md`, and `implementation.md` changes in this feature folder.
- Re-run `npm run test`, `npm run lint`, `npm run format:check`, `npm run type-check`, and `npm run build` to confirm the repo returns to its pre-feature state.

## Deviations from Plan

None — implementation followed the plan exactly.

## Testing

- Added `tests/presentation/components/layout/sidebar-nav.test.ts`, `tests/presentation/components/layout/bottom-nav.test.ts`, and `tests/presentation/components/layout/page-header.test.ts`.
- Testing approach: presentation-layer component tests in Vitest, followed by full-repo lint, type-check, test, and build verification.
- Confirmed the planned test-first failures before each component existed by running the dedicated Vitest command for each new suite.
- Ran targeted verification:
  - `npx vitest run tests/presentation/components/layout/sidebar-nav.test.ts`
  - `npx vitest run tests/presentation/components/layout/bottom-nav.test.ts`
  - `npx vitest run tests/presentation/components/layout/page-header.test.ts`
- Ran project verification:
  - `npm run format`
  - `npm run type-check`
  - `npm run test`
  - `npm run lint`
  - `npm run format:check`
  - `npm run type-check`
  - `npm run build`

## Dependencies

No new dependencies.

## Known Limitations

- Recommendations remains intentionally absent from both navigation components until its route exists in a later feature phase.
- App-shell assembly, content-area bottom clearance, and overlay stacking validation remain owned by feature `01k`.
- Sidebar branding uses the existing localized `app.title` text only; a dedicated logo asset is still deferred.
