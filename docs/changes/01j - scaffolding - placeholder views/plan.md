# Implementation Plan: Placeholder Views

## Phase 1 — Test-First View Coverage

1. [ ] Add one component test file per existing placeholder view in `tests/presentation/views/` before changing the implementations. Each test includes both the `en` and `fr` cases from `SC-20-01` to prove the placeholder copy is sourced from vue-i18n.

| Test File                 | Covers                 | Verifies                                                                                                                                                 |
| :------------------------ | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home-screen.test.ts`     | `SC-20-01`, `SC-26-01` | `/` renders the `House` icon, translated `common.empty.title`, and `common.empty.description` in the active locale for both `en` and `fr`                |
| `calendar-screen.test.ts` | `SC-20-01`, `SC-26-01` | `/calendar` renders the `CalendarDays` icon, translated `common.empty.title`, and `common.empty.description` in the active locale for both `en` and `fr` |
| `library-screen.test.ts`  | `SC-20-01`, `SC-26-01` | `/library` renders the `Bookmark` icon, translated `common.empty.title`, and `common.empty.description` in the active locale for both `en` and `fr`      |
| `settings-screen.test.ts` | `SC-20-01`, `SC-26-01` | `/settings` renders the `Settings` icon, translated `common.empty.title`, and `common.empty.description` in the active locale for both `en` and `fr`     |

2. [ ] Run the targeted view tests and confirm they fail against the current stub implementations before editing the view files:

`npm run test -- tests/presentation/views/home-screen.test.ts tests/presentation/views/calendar-screen.test.ts tests/presentation/views/library-screen.test.ts tests/presentation/views/settings-screen.test.ts`

## Phase 2 — Placeholder View Implementation

1. [ ] Update the existing placeholder view SFCs in `src/presentation/views/` to replace the current `<div>` stubs with `EmptyState`-based implementations:

| File                  | Icon Import    | Title Key            | Description Key            |
| :-------------------- | :------------- | :------------------- | :------------------------- |
| `home-screen.vue`     | `House`        | `common.empty.title` | `common.empty.description` |
| `calendar-screen.vue` | `CalendarDays` | `common.empty.title` | `common.empty.description` |
| `library-screen.vue`  | `Bookmark`     | `common.empty.title` | `common.empty.description` |
| `settings-screen.vue` | `Settings`     | `common.empty.title` | `common.empty.description` |

Each view follows the same pattern: `<script setup lang="ts">` imports `EmptyState`, the mapped lucide icon, and `useI18n`. The template renders `<EmptyState>` with the icon, the shared translated heading from `common.empty.title`, and the shared supporting text from `common.empty.description`. Route-title rendering remains owned by route `meta.titleKey` and `PageHeader`.

## Phase 3 — Verification

1. [ ] Re-run the targeted placeholder view tests and expect all `SC-20-01` and `SC-26-01` cases to pass:

`npm run test -- tests/presentation/views/home-screen.test.ts tests/presentation/views/calendar-screen.test.ts tests/presentation/views/library-screen.test.ts tests/presentation/views/settings-screen.test.ts`

2. [ ] Inspect `home-screen.vue`, `calendar-screen.vue`, `library-screen.vue`, and `settings-screen.vue` to verify `SC-20-02` and `SC-20-03`: `<script setup lang="ts">` appears before `<template>`, no local `<style>` block is added, and all placeholder copy is sourced from `common.empty.title` plus `common.empty.description`.

3. [ ] Run the full automated test suite after the targeted view tests pass (`implementation detail`):

`npm run test`

4. [ ] Run static type-checking after the view updates (`implementation detail`):

`npm run type-check`
