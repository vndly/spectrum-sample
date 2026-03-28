# Implementation Plan: Composables

---

## Step 1 — Write toast composable tests

- [ ] Create `tests/presentation/composables/use-toast.test.ts` covering:

- **SC-13-01, SC-23-01** — `addToast()` adds a toast to the queue with a unique ID
- **SC-13-02, SC-23-01** — `removeToast(id)` removes the toast from the queue
- **SC-13-01, SC-23-02** — Auto-dismiss removes the toast after `TOAST_DISMISS_MS` (use `vi.useFakeTimers()`)
- **SC-13-03** — Toast with action preserves the action label and handler
- **SC-13-04, SC-23-08** — Adding a 6th toast evicts the oldest toast (`MAX_VISIBLE_TOASTS` cap)
- **SC-13-05** — `removeToast()` with a non-existent ID has no effect
- **SC-23-03** — Toast types: `'error'`, `'success'`, `'info'`
- `(implementation detail)` — Cleared timer does not fire after manual `removeToast()`

---

## Step 2 — Write modal composable tests

- [ ] Create `tests/presentation/composables/use-modal.test.ts` covering:

- **SC-15-01, SC-23-04** — `open(props)` sets `isOpen` to true and stores props
- **SC-15-02, SC-23-04** — `close()` sets `isOpen` to false and clears props
- **SC-15-03, SC-23-07** — Calling `open()` a second time replaces the first modal's props (single-instance behavior)
- **SC-23-05** — `onConfirm` callback is stored and accessible in modal props
- **SC-23-06** — `onCancel` callback is stored and accessible in modal props
- `(implementation detail)` — `close()` when no modal is open has no effect
- `(implementation detail)` — Props include `title`, optional `content`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`

---

## Step 3 — Create toast composable

- [ ] Add `MAX_VISIBLE_TOASTS = 5` to `src/domain/constants.ts`.
- [ ] Create `src/presentation/composables/use-toast.ts`:

- Module-level `ref<Toast[]>` (singleton — shared across all callers, works outside `setup()`)
- `Toast` type: `{ id: string, message: string, type: 'error' | 'success' | 'info', action?: { label: string, handler: () => void } }`
- ID generation: incrementing counter (`let nextId = 1`) — predictable in tests, unique within session
- Timer tracking: `Map<string, ReturnType<typeof setTimeout>>` to associate each toast with its auto-dismiss timer
- `addToast(options)` — generates unique id, pushes toast, starts `setTimeout` (using `TOAST_DISMISS_MS` from `src/domain/constants.ts`) for auto-removal. Enforces `MAX_VISIBLE_TOASTS` (from `src/domain/constants.ts`) with oldest-first eviction.
- `removeToast(id)` — removes from array; clears the associated `setTimeout` from the timer map
- Returns `{ toasts: Readonly<Ref<Toast[]>>, addToast, removeToast }`
- JSDoc comments on all exported functions and the `Toast` type

> **Note:** The `{ data, loading, error }` return convention applies to Application-layer composables wrapping async operations. This Presentation-layer composable uses a shape suited to UI state management.

---

## Step 4 — Create modal composable

- [ ] Create `src/presentation/composables/use-modal.ts`:

- Module-level `ref<boolean>` + `shallowRef<ModalProps | null>` (single modal at a time; `shallowRef` is intentional — props are always replaced via `open()`, never mutated in place)
- `ModalProps` type: `{ title: string, content?: string, confirmLabel?: string, cancelLabel?: string, onConfirm?: () => void, onCancel?: () => void }`
- `open(props)` — sets visible true, stores props
- `close()` — sets visible false, clears props
- Returns `{ isOpen: Readonly<Ref<boolean>>, props: Readonly<ShallowRef<ModalProps | null>>, open, close }`
- JSDoc comments on all exported functions and the `ModalProps` type

> **Note:** The `{ data, loading, error }` return convention applies to Application-layer composables wrapping async operations. This Presentation-layer composable uses a shape suited to UI state management.

---

## Step 5 — Update architecture documentation

- [ ] Update `docs/technical/architecture.md` to document `src/presentation/composables/` as the location for UI-only state composables.
- [ ] Update the glossary entry for "Composable" to acknowledge that UI-state composables may reside in the Presentation layer, distinct from Application-layer composables that wrap infrastructure calls.

---

## Step 6 — Verification

- [ ] `npx vitest run tests/presentation/composables/` — all composable tests pass
- [ ] `npx tsc --noEmit` — no type errors
- [ ] `npx eslint src/presentation/composables/` — no lint violations
