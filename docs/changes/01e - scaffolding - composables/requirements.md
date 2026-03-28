---
id: R-01e
title: App Scaffolding — Composables
status: under_test
type: infrastructure
importance: critical
tags: [composables, toast, modal, state]
---

## Intent

Create the `useToast` and `useModal` composables — module-level singleton reactive state for toast notifications and modal dialogs — along with their unit tests.

## Context & Background

### Problem Statement

Downstream features (01g — Toast Container, 01h — Error Handling) require shared reactive state for toast notifications and modal dialogs. These composables must be available both inside and outside Vue component `setup()` so the global error handler can dispatch toast notifications.

### Dependencies

- **01a** — Test infrastructure (vitest config, setup file, `@vue/test-utils`).
- **01c** — `TOAST_DISMISS_MS` constant in `src/domain/constants.ts`.

## Decisions

| Decision                 | Choice                 | Rationale                                                                                                                                                                                                   |
| :----------------------- | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Composable state pattern | Module-level singleton | Toast and modal composables use module-level reactive state so they work both inside and outside component `setup()` (needed for the global error handler).                                                 |
| Composable return shape  | Custom per composable  | The `{ data, loading, error, refresh? }` return convention applies to Application-layer composables wrapping async operations. Presentation-layer UI-state composables use a shape suited to their purpose. |

## Scope

### In Scope

- Create `src/presentation/composables/use-toast.ts` and `use-modal.ts`.
- Write unit tests for both composables.
- Define `MAX_VISIBLE_TOASTS` constant in `src/domain/constants.ts`.

### Out of Scope

- Toast container component (`toast-container.vue`) — covered by 01g.
- Modal dialog component (`modal-dialog.vue`) — covered by 01g.
- Global error handler integration — covered by 01h.
- Toast animations and transitions — covered by 01g.

## Functional Requirements

| ID    | Requirement               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Priority |
| :---- | :------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-13 | Toast notification system | `useToast()` composable with module-level reactive state. `addToast(options)` pushes a toast (options: `{ message, type, action?: { label: string, handler: () => void } }`) with a generated unique ID (incrementing counter) and auto-dismiss after `TOAST_DISMISS_MS` (default 4000ms, from `src/domain/constants.ts`). `removeToast(id)` removes it and clears its auto-dismiss timer. Toast types: error (red), success (green), info (teal). Enforces a maximum of `MAX_VISIBLE_TOASTS` (5) simultaneous toasts; when exceeded, the oldest toast is evicted before the new one is added. | P0       |
| SC-12 | Modal/dialog              | `useModal()` composable (single-instance). `open(props)` sets visible true and stores props (shape: `{ title: string, content?: string, confirmLabel?: string, cancelLabel?: string, onConfirm?: () => void, onCancel?: () => void }`). `close()` sets visible false and clears props. Opening a new modal while one is active replaces the current modal. The composable stores callback references in props; invocation of callbacks is the consuming component's responsibility (see 01g).                                                                                                  | P1       |
| SC-23 | Composable unit tests     | `useToast`: add/remove toast, auto-dismiss after timeout, toast types. `useModal`: open/close state, callback storage in props.                                                                                                                                                                                                                                                                                                                                                                                                                                                                | P0       |

## Non-Functional Requirements

### Architecture Compliance

- **Composable location:** Toast and modal composables live in `src/presentation/composables/` rather than `src/application/` because they manage UI-only state with no domain or infrastructure dependencies. This introduces a `composables/` subdirectory under `src/presentation/` not currently defined in `architecture.md` — both `architecture.md` and the glossary entry for "Composable" should be updated to acknowledge that purely UI-state composables may reside in the Presentation layer.

## Constraints

- Composables must work both inside and outside Vue component `setup()` context (needed by the global error handler in 01h).
- `MAX_VISIBLE_TOASTS` must be defined as a named constant in `src/domain/constants.ts`.

## Risks & Assumptions

### Assumptions

- Module-level singleton state persists correctly during Vite HMR in development.
- The `TOAST_DISMISS_MS` constant from 01c exists and exports the expected value (4000ms).

### Risks

| Risk                                         | Likelihood | Impact | Mitigation                                                                              |
| :------------------------------------------- | :--------- | :----- | :-------------------------------------------------------------------------------------- |
| Leaked timers during HMR                     | Low        | Low    | Tests validate timer cleanup; HMR invalidation replaces module state.                   |
| Module-level state not cleared between tests | Medium     | Medium | Expose a `_resetForTesting()` helper or clear state in `beforeEach` via the public API. |

## Acceptance Criteria

- [ ] `useToast` adds toasts to the queue with unique IDs
- [ ] `useToast` removes toasts via `removeToast(id)`
- [ ] Toasts auto-dismiss after `TOAST_DISMISS_MS`
- [ ] Maximum `MAX_VISIBLE_TOASTS` (5) simultaneous toasts; when exceeded, the oldest toast is evicted
- [ ] `removeToast(id)` with a non-existent ID has no effect and does not throw
- [ ] `useModal` `open(props)` sets the modal visible and stores props (including optional callbacks)
- [ ] `useModal` `close()` hides the modal and clears props
- [ ] Calling `close()` when no modal is open has no effect and does not throw
- [ ] Opening a second modal replaces the first — single-instance behavior
- [ ] `addToast` works correctly when the optional `action` field is omitted
- [ ] `removeToast(id)` clears the auto-dismiss timer for that toast
- [ ] `architecture.md` updated to document `src/presentation/composables/` for UI-only state composables
- [ ] Glossary "Composable" entry updated to acknowledge Presentation-layer composables
- [ ] `MAX_VISIBLE_TOASTS` constant documented in `data-model.md` constants table
- [ ] All composable unit tests pass
