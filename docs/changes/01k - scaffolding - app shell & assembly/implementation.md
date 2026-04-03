# Implementation: App Scaffolding — App Shell & Assembly

## Overview

This change assembled the scaffolded application shell around the existing four-route placeholder experience. `src/presentation/components/layout/app-shell.vue` now composes the fixed desktop sidebar, mobile bottom navigation, shared page header, routed content region, route transition wrapper, modal dialog, and toast container in one presentation-layer shell. `src/App.vue` now boots the routed UI through `ErrorBoundary` and `AppShell` instead of rendering `RouterView` directly at the root.

Implementation followed the plan's test-first flow. `tests/presentation/components/layout/app-shell.test.ts` drives `SC-04`, `SC-09`, and `SC-10-03`, while `tests/App.test.ts` drives `SC-10-01` and `SC-10-02`. The existing router definition was intentionally left unchanged so the scaffolded nav set remains Home, Calendar, Library, and Settings, with Recommendations still deferred to its own feature phase.

## Files Changed

### Created

- `src/presentation/components/layout/app-shell.vue` — New shared shell component that assembles navigation chrome, routed content, fade transitions, and global overlays.
- `tests/presentation/components/layout/app-shell.test.ts` — Verifies `SC-04`, `SC-09`, and `SC-10-03` for shell layout, motion, and stacking behavior.
- `tests/App.test.ts` — Verifies `SC-10-01` and `SC-10-02` for root assembly through `ErrorBoundary` and the current scaffolded nav set.

### Modified

- `src/App.vue` — Replaced direct root-level `RouterView` rendering with `AppShell` inside `ErrorBoundary`.
- `docs/changes/01k - scaffolding - app shell & assembly/requirements.md` — Set the feature status to `in_development` while manual verification remains pending.
- `docs/changes/01k - scaffolding - app shell & assembly/plan.md` — Checked off completed implementation and automated verification steps.
- `docs/changes/01k - scaffolding - app shell & assembly/index.md` — Added the implementation entry to keep the feature folder index in sync.

## Key Decisions

- `SC-04`: `AppShell` offsets the routed content column with `md:pl-56` and gives the route region `pb-16 md:pb-0` so the fixed `SidebarNav` and fixed `BottomNav` do not cover the active view.
- `SC-09`: Route changes reuse the existing `fade` transition contract from `src/assets/main.css`, including the existing `prefers-reduced-motion: reduce` override, instead of introducing a new animation system.
- `SC-10`: `PageHeader`, `ModalDialog`, and `ToastContainer` are mounted inside `AppShell` so the root experience renders through a recoverable shell and overlay layers stay ordered above page content and navigation chrome.
- Security and data boundaries: This is a presentation-only composition change. It introduces no new user inputs, storage writes, API calls, authentication flows, or data migrations.
- Rollback strategy: Revert `src/App.vue`, remove `src/presentation/components/layout/app-shell.vue`, and delete the two new test files to restore the pre-shell root assembly.

## Deviations from Plan

- Verification step 6 is still pending. `npm run dev -- --host 127.0.0.1` was confirmed to start successfully, but the visual/manual checklist in `plan.md` could not be completed from this terminal-only environment.
- No router changes were required for the "preserve current scaffolded route set" step because `src/presentation/router.ts` already limited the scaffold to Home, Calendar, Library, and Settings.

## Testing

- `tests/presentation/components/layout/app-shell.test.ts` covers `SC-04-01`, `SC-04-02`, `SC-04-03`, `SC-04-04`, `SC-09-01`, `SC-09-02`, and `SC-10-03`.
- `tests/App.test.ts` covers `SC-10-01` and `SC-10-02`.
- Automated verification passed: `npm run type-check`, `npm run lint`, `npm run format:check`, `npm run test` (20 files, 130 tests), and `npm run build`.
- Performance verification passed. `dist/index.html` references `dist/assets/index-BkTy7rxi.js` (14,613 bytes gzipped), `dist/assets/createLucideIcon-tpZhrWTu.js` (57,724 bytes gzipped), and `dist/assets/index-KAVinTIh.css` (4,488 bytes gzipped), for an initial non-lazy payload of 76,825 bytes gzipped, which stays under the 150 KB limit.
- Route-view chunks remain well below the 20 KB limit: `dist/assets/home-screen-GX-jl3SE.js` (295 bytes gzipped), `dist/assets/calendar-screen-BAhyWapl.js` (303 bytes gzipped), `dist/assets/library-screen-B_t_wOpR.js` (300 bytes gzipped), and `dist/assets/settings-screen-DY83aBzF.js` (300 bytes gzipped). The shared lazy `dist/assets/empty-state-Cy2n-buW.js` chunk is 573 bytes gzipped.
- Manual verification remains open: the Vite dev server booted successfully, but the visual checklist from `plan.md` still needs to be performed in a browser.

## Dependencies

- No new dependencies.
