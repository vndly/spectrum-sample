---
id: R-01j
title: App Scaffolding — Placeholder Views
status: draft
type: infrastructure
importance: P0/P1
tags: [views, placeholder]
---

## Intent

Create the 4 placeholder view components (one per route) that display an EmptyState with the page's icon and translated title, providing visible content for every route.

## Prerequisites

- **01b** — i18n keys for page titles and empty description
- **01f** — EmptyState component

## Decisions

None specific to this sub-change.

## Scope

- Create `home-screen.vue`, `calendar-screen.vue`, `library-screen.vue`, `settings-screen.vue` in `src/presentation/views/`
- Write component tests for each

## Functional Requirements

| ID    | Requirement            | Description                                                                                                                    | Priority |
| :---- | :--------------------- | :----------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-20 | Placeholder views      | 4 view components (one per route), each rendering `<EmptyState>` with the page's lucide icon and translated title.             | P0       |
| SC-26 | Placeholder view tests | Each of the 4 view components renders an `<EmptyState>` with the expected icon and translated title.                           | P1       |

## Non-Functional Requirements

### Architecture Compliance

- **SFC block order:** `<script setup>` then `<template>` then `<style>` (rare).

## Acceptance Criteria

- [ ] Each view renders EmptyState with correct lucide icon and translated title
- [ ] Component tests pass for all 4 views
