---
id: R-01f
title: App Scaffolding — Skeleton & Empty State
status: approved
type: infrastructure
importance: critical
tags: [components, ui-primitives]
---

## Intent

Create the SkeletonLoader and EmptyState reusable UI primitives with their component tests.

## Context & Background

### Dependencies

- **01a** — Test infrastructure (vitest config, setup file, `@vue/test-utils`).

## Decisions

None specific to this sub-phase.

## Scope

### In Scope

- Create `src/presentation/components/common/skeleton-loader.vue` and `empty-state.vue`.
- Write component tests for both.

### Out of Scope

- Skeleton composition variants (card skeleton, hero skeleton, detail skeleton, grid skeleton) — deferred to consuming features.
- i18n integration within these primitives — consuming components pass pre-translated strings via props.
- Responsive-specific skeleton behavior beyond standard Tailwind responsiveness.

## Functional Requirements

| ID    | Requirement                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Priority |
| :---- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| SC-16 | Empty state component        | Centered layout with optional lucide icon, title (white bold), description (muted), optional CTA button styled as a primary teal button (`bg-accent text-white rounded-md px-4 py-2`) per ui-ux.md section 9. Props: `icon` (Component, optional), `title` (string), `description` (string, optional), `ctaLabel` (string, optional), `ctaAction` (() => void, optional). All string props receive pre-translated values from the consuming component — this primitive does not call `$t()` internally. | P0       |
| SC-17 | Skeleton loader              | Reusable shimmer placeholder. Props: `width` (string, default `'100%'`), `height` (string, default `'1rem'`), `rounded` (string, default `'rounded-md'`). Renders a div with `animate-pulse bg-surface`.                                                                                                                                                                                                                                                                                                | P1       |
| SC-24 | UI primitive tests (partial) | Component tests for EmptyState (renders icon/title/description/CTA props) and SkeletonLoader (renders with width/height/rounded props). This feature covers scenarios SC-24-01 and SC-24-02; sibling features 01g and 01h cover the remaining SC-24 scenarios.                                                                                                                                                                                                                                          | P0       |

## Non-Functional Requirements

### Architecture Compliance

- **SFC block order:** `<script setup>` then `<template>` then `<style>` (rare). Verifiable by linting SFC files.
- **File naming:** kebab-case for all component files. Verifiable by checking file names match `[a-z0-9-]+\.vue`.

### Accessibility

- SkeletonLoader div uses `aria-hidden="true"` since it is purely decorative. Verifiable by inspecting rendered HTML.

## UI/UX Specs

Visual contracts per `docs/technical/ui-ux.md`:

- **SkeletonLoader** (section 8 — Loading States): `animate-pulse bg-surface` shimmer, configurable dimensions and border radius.
- **EmptyState** (section 9 — Empty States): Centered layout with muted icon, bold heading, slate-400 supporting text, optional primary teal CTA button.

## Risks & Assumptions

### Assumptions

- `animate-pulse` is sufficient for the shimmer effect (no custom keyframe needed).
- The `bg-surface` theme color (`--color-surface`) is already defined in `src/assets/main.css` before this feature is implemented.
- `@vue/test-utils` is available from prerequisite 01a.

## Acceptance Criteria

- [ ] [SC-17] SkeletonLoader renders with configurable `width`, `height`, and `rounded` props
- [ ] [SC-17] SkeletonLoader applies `animate-pulse bg-surface` classes
- [ ] [SC-16] EmptyState renders icon, title, description, and CTA button when all props provided
- [ ] [SC-16] EmptyState renders only title when optional props are omitted
- [ ] [SC-16] CTA button invokes `ctaAction` handler when clicked
- [ ] [SC-24] Component tests for EmptyState pass
- [ ] [SC-24] Component tests for SkeletonLoader pass
