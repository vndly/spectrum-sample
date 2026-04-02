# Implementation: App Scaffolding — Placeholder Views

## Overview

Implemented `SC-20` by replacing the four route-level placeholder stubs in `src/presentation/views/` with `EmptyState`-based SFCs. Each view now imports its mapped Lucide icon, uses `useI18n()` to resolve `common.empty.title` and `common.empty.description`, and leaves route-title rendering unchanged so `PageHeader` continues to own that concern through router metadata.

Implemented `SC-26` with one view test per route in `tests/presentation/views/`. Each test mounts the view with a local vue-i18n instance in both English and French, verifies the mapped icon component, and checks the shared translated heading plus description. The tests were added before the view changes, failed against the original `<div>` stubs as expected, and passed after the placeholder views were updated.

## Files Changed

### Created

- `tests/presentation/views/home-screen.test.ts` — Adds English and French placeholder coverage for the Home view.
- `tests/presentation/views/calendar-screen.test.ts` — Adds English and French placeholder coverage for the Calendar view.
- `tests/presentation/views/library-screen.test.ts` — Adds English and French placeholder coverage for the Library view.
- `tests/presentation/views/settings-screen.test.ts` — Adds English and French placeholder coverage for the Settings view.

### Modified

- `src/presentation/views/home-screen.vue` — Replaces the `Home` stub with `EmptyState`, `House`, and shared translated placeholder copy.
- `src/presentation/views/calendar-screen.vue` — Replaces the `Calendar` stub with `EmptyState`, `CalendarDays`, and shared translated placeholder copy.
- `src/presentation/views/library-screen.vue` — Replaces the `Library` stub with `EmptyState`, `Bookmark`, and shared translated placeholder copy.
- `src/presentation/views/settings-screen.vue` — Replaces the `Settings` stub with `EmptyState`, `Settings`, and shared translated placeholder copy.
- `docs/changes/01j - scaffolding - placeholder views/requirements.md` — Advances the feature status through `in_development` to `under_test` after verification passed.
- `docs/changes/01j - scaffolding - placeholder views/plan.md` — Checks off the completed implementation and verification steps.
- `docs/changes/01j - scaffolding - placeholder views/index.md` — Adds the implementation entry for this completed feature folder.

## Key Decisions

- Shared placeholder text stays bound to `common.empty.title` and `common.empty.description` in every view so localization remains centralized and no new route-specific strings are introduced.
- Each view test constructs its own minimal vue-i18n instance for `en` and `fr`, which proves the rendered placeholder strings come from translation lookup rather than hardcoded English literals.
- No migration work is required because the change is limited to route-level presentation placeholders and test files. Rollback is straightforward: revert the four view files and four new test files.

## Deviations from Plan

- None — implementation followed the plan exactly.

## Testing

- `tests/presentation/views/home-screen.test.ts`, `tests/presentation/views/calendar-screen.test.ts`, `tests/presentation/views/library-screen.test.ts`, and `tests/presentation/views/settings-screen.test.ts` cover `SC-20-01` and `SC-26-01` for each route in both English and French.
- `npm run test -- tests/presentation/views/home-screen.test.ts tests/presentation/views/calendar-screen.test.ts tests/presentation/views/library-screen.test.ts tests/presentation/views/settings-screen.test.ts` failed against the original stub views, then passed after the `EmptyState` implementations were added.
- Source inspection of `src/presentation/views/home-screen.vue`, `src/presentation/views/calendar-screen.vue`, `src/presentation/views/library-screen.vue`, and `src/presentation/views/settings-screen.vue` confirmed `<script setup lang="ts">` appears before `<template>`, no local `<style>` block was added, and placeholder copy is sourced from `common.empty.title` plus `common.empty.description`.
- `npm run format` passed.
- `npm run type-check` passed before verification and again during the verification phase.
- `npm run test` passed with 18 test files and 122 tests.

## Dependencies

- No new dependencies.
