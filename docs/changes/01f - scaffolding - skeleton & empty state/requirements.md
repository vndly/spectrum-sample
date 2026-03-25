---
id: R-01f
title: App Scaffolding — Skeleton & Empty State
status: draft
type: infrastructure
importance: P0/P1
tags: [components, ui-primitives]
---

## Intent

Create the SkeletonLoader and EmptyState reusable UI primitives with their component tests.

## Prerequisites

- **01a** — Test infrastructure (vitest config, setup file, `@vue/test-utils`).

## Decisions

None specific to this sub-phase.

## Scope

- Create `src/presentation/components/common/skeleton-loader.vue` and `empty-state.vue`.
- Write component tests for both.

## Functional Requirements

| ID    | Requirement        | Description                                                                                                                                                                                                                                                                                    | Priority |
| :---- | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-16 | Empty state component | Centered layout with optional lucide icon, title (white bold), description (muted), optional CTA (call-to-action) button. Props: `icon` (Component, optional), `title` (string), `description` (string, optional), `ctaLabel` (string, optional), `ctaAction` (() => void, optional).                                   | P0       |
| SC-17 | Skeleton loader    | Reusable shimmer placeholder. Props: `width` (string, default `'100%'`), `height` (string, default `'1rem'`), `rounded` (string, default `'rounded-md'`). Renders a div with `animate-pulse bg-surface`.                                                                                       | P1       |
| SC-24 | UI primitive tests (partial) | Component tests for EmptyState (renders icon/title/description/CTA props) and SkeletonLoader (renders with width/height/rounded props).                                                                                                                                                 | P0       |

## Non-Functional Requirements

### Architecture Compliance

- **SFC block order:** `<script setup>` then `<template>` then `<style>` (rare).
- **File naming:** kebab-case for all component files.

## Acceptance Criteria

- [ ] SkeletonLoader renders with configurable `width`, `height`, and `rounded` props
- [ ] SkeletonLoader applies `animate-pulse bg-surface` classes
- [ ] EmptyState renders icon, title, description, and CTA button when all props provided
- [ ] EmptyState renders only title when optional props are omitted
- [ ] CTA button invokes `ctaAction` handler when clicked
- [ ] Component tests for EmptyState pass
- [ ] Component tests for SkeletonLoader pass
