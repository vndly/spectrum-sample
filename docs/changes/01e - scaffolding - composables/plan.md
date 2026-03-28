# Implementation Plan: Composables

---

## Phase 1 — Test Scaffolding

### Step 1 — Write toast composable tests

- [x] Create `tests/presentation/composables/use-toast.test.ts` covering:

- **SC-13-01, SC-23-01** — `addToast()` adds a toast to the queue with a unique ID
- **SC-23-09** — `removeToast(id)` removes the toast from the queue
- **SC-13-01, SC-23-02** — Auto-dismiss removes the toast after `TOAST_DISMISS_MS` (use `vi.useFakeTimers()`)
- **SC-13-03** — Toast with action preserves the action object in state (composable stores the action; button click interaction is 01g's scope)
- **SC-13-04, SC-23-08** — Adding a 6th toast evicts the oldest toast (`MAX_VISIBLE_TOASTS` cap)
- **SC-13-05, SC-23-12** — `removeToast()` with a non-existent ID has no effect and does not throw
- **SC-23-03** — Toast types: `'error'`, `'success'`, `'info'`
- **SC-23-11** — `removeToast()` clears the auto-dismiss timer; the cleared timer does not fire
- **SC-23-13** — Two sequentially added toasts receive distinct, incrementing IDs

> **State isolation:** Each test must reset composable state in `beforeEach` — either via the public API (remove all toasts) or a `_resetForTesting()` helper (see Risks in requirements.md).

> **Note:** `tests/presentation/composables/` is a new directory mirroring the new `src/presentation/composables/` location established by this feature.

---

### Step 2 — Write modal composable tests

- [x] Create `tests/presentation/composables/use-modal.test.ts` covering:

- **SC-12-01, SC-23-04** — `open(props)` sets `isOpen` to true and stores props
- **SC-12-02, SC-23-04** — `close()` sets `isOpen` to false and clears props to null
- **SC-12-03, SC-23-07** — Calling `open()` a second time replaces the first modal's props (single-instance behavior)
- **SC-23-05** — `onConfirm` callback is stored and accessible in modal props
- **SC-23-06** — `onCancel` callback is stored and accessible in modal props
- **SC-12-04, SC-23-10** — `close()` when no modal is open has no effect and does not throw
- **SC-12-05** — `open(props)` with `confirmLabel` and `cancelLabel` stores the labels in props
- `(implementation detail)` — Props include `title`, optional `content`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`

> **State isolation:** Each test must reset composable state in `beforeEach` — either via the public API (`close()`) or a `_resetForTesting()` helper.

---

## Phase 2 — Implementation

### Step 3 — Create toast composable

- [x] Add `MAX_VISIBLE_TOASTS = 5` to `src/domain/constants.ts`. _(Rollback: remove the `MAX_VISIBLE_TOASTS` line from `src/domain/constants.ts`.)_
- [x] Create `src/presentation/composables/use-toast.ts`:

- Module-level `ref<Toast[]>` (singleton — shared across all callers, works outside `setup()`)
- `Toast` type: `{ id: string, message: string, type: 'error' | 'success' | 'info', action?: { label: string, handler: () => void } }`
- ID generation: `String(nextId++)` — incrementing counter coerced to string (e.g., `'1'`, `'2'`, `'3'`)
- Timer tracking: `Map<string, ReturnType<typeof setTimeout>>` to associate each toast with its auto-dismiss timer
- `addToast(options: { message: string, type: 'error' | 'success' | 'info', action?: { label: string, handler: () => void } })` — `type` is required (no default value). Generates unique id, pushes toast, starts `setTimeout` (using `TOAST_DISMISS_MS` from `src/domain/constants.ts`) for auto-removal. Enforces `MAX_VISIBLE_TOASTS` (from `src/domain/constants.ts`) with oldest-first eviction — clears the evicted toast's auto-dismiss timer and deletes its entry from the timer map before eviction.
- `removeToast(id: string)` — removes from array; calls `clearTimeout` on the associated timer **and** deletes the entry from the timer map
- Returns `{ toasts: Readonly<Ref<Toast[]>>, addToast, removeToast }`
- JSDoc comments on all exported functions and the `Toast` type

> **Note:** The `{ data, loading, error }` return convention applies to Application-layer composables wrapping async operations. This Presentation-layer composable uses a shape suited to UI state management.

---

### Step 4 — Create modal composable

- [x] Create `src/presentation/composables/use-modal.ts`:

- Module-level `ref<boolean>` + `shallowRef<ModalProps | null>` (single modal at a time; `shallowRef` is intentional — props are always replaced via `open()`, never mutated in place. Incoming props are not cloned; the caller-provided object is stored directly.)
- `ModalProps` type: `{ title: string, content?: string, confirmLabel?: string, cancelLabel?: string, onConfirm?: () => void, onCancel?: () => void }`
- `open(props: ModalProps)` — sets visible true, stores props
- `close()` — sets visible false, clears props to `null`
- Returns `{ isOpen: Readonly<Ref<boolean>>, props: Readonly<ShallowRef<ModalProps | null>>, open, close }`
- JSDoc comments on all exported functions and the `ModalProps` type

> **Note:** The `{ data, loading, error }` return convention applies to Application-layer composables wrapping async operations. This Presentation-layer composable uses a shape suited to UI state management.

---

## Phase 3 — Documentation

### Step 5 — Update architecture documentation

- [x] Update `docs/technical/architecture.md` to document `src/presentation/composables/` as the location for UI-only state composables. Add `composables/` to the Presentation-layer folder structure.
- [x] Update `docs/technical/testing.md` directory-tree example to include `tests/presentation/composables/`.
- [x] Update `docs/technical/data-model.md` constants table to include `MAX_VISIBLE_TOASTS`.
- [x] Update the glossary entry for "Composable" in `docs/reference/glossary.md`. Draft wording: _"A `use`-prefixed function providing reactive state. **Application-layer** composables (in `src/application/`) wrap Infrastructure calls with Vue reactivity and return `{ data, loading, error, refresh? }`. **Presentation-layer** composables (in `src/presentation/composables/`) manage UI-only state (e.g., toast queue, modal visibility) with a custom return shape."_

---

## Phase 4 — Verification

### Step 6 — Verification

- [x] `npx vitest run tests/presentation/composables/` — all composable tests pass
- [x] `npx tsc --noEmit` — no type errors
- [x] `npx eslint src/presentation/composables/` — no lint violations
- [x] Verify `MAX_VISIBLE_TOASTS` is exported from `src/domain/constants.ts` (e.g., `grep 'MAX_VISIBLE_TOASTS' src/domain/constants.ts`)
- [x] Verify JSDoc comments are present on all exported functions and types
