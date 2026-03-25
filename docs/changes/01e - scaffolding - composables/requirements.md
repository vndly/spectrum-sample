---
id: R-01e
title: App Scaffolding — Composables
status: draft
type: infrastructure
importance: critical
tags: [composables, toast, modal, state]
---

## Intent

Create the `useToast` and `useModal` composables — module-level singleton reactive state for toast notifications and modal dialogs — along with their unit tests.

## Prerequisites

- **01a** — Test infrastructure (vitest config, setup file, `@vue/test-utils`).
- **01c** — `TOAST_DISMISS_MS` constant in `src/domain/constants.ts`.

## Decisions

| Decision                 | Choice                 | Rationale                                                                                                                                     |
| :----------------------- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| Composable state pattern | Module-level singleton | Toast and modal composables use module-level reactive state so they work both inside and outside component `setup()` (needed for the global error handler). |

## Scope

- Create `src/presentation/composables/use-toast.ts` and `use-modal.ts`.
- Write unit tests for both composables.

## Functional Requirements

| ID    | Requirement             | Description                                                                                                                                                                                                                                                                                                               | Priority |
| :---- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| SC-13 | Toast notification system | `useToast()` composable with module-level reactive state. `addToast(options)` pushes a toast (options: `{ message, type, action?: { label: string, handler: () => void } }`) with auto-dismiss after `TOAST_DISMISS_MS` (default 4000ms, from `src/domain/constants.ts`). `removeToast(id)` removes it. Toast types: error (error color), success (success color), info (accent color). | P0       |
| SC-15 | Modal/dialog            | `useModal()` composable (single-instance). `open(props)` sets visible true and stores props. `close()` sets visible false and clears props. Opening a new modal while one is active replaces the current modal.                                                                                                           | P1       |
| SC-23 | Composable unit tests   | `useToast`: add/remove toast, auto-dismiss after timeout, toast types. `useModal`: open/close state, confirm/cancel callbacks.                                                                                                                                                                                            | P0       |

## Non-Functional Requirements

### Architecture Compliance

- **Composable location:** Toast and modal composables live in `src/presentation/composables/` rather than `src/application/` because they manage UI-only state with no domain or infrastructure dependencies. This introduces a `composables/` subdirectory under `src/presentation/` not currently defined in `architecture.md` — architecture.md should be updated to acknowledge that purely UI-state composables may reside in the Presentation layer.

## Acceptance Criteria

- [ ] `useToast` adds toasts to the queue with unique IDs
- [ ] `useToast` removes toasts via `removeToast(id)`
- [ ] Toasts auto-dismiss after `TOAST_DISMISS_MS`
- [ ] Maximum 5 simultaneous toasts; when exceeded, the oldest toast is evicted
- [ ] `useModal` `open(props)` sets the modal visible and stores props
- [ ] `useModal` `close()` hides the modal and clears props
- [ ] Opening a second modal replaces the first — single-instance behavior
- [ ] All composable unit tests pass
