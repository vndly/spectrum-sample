# Implementation Plan: Composables

---

## Step 1 — Write toast composable tests

- [ ] Create `tests/presentation/composables/use-toast.test.ts` covering:

- **SC-13-01** — `addToast()` adds a toast to the queue with a unique id
- **SC-13-02** — `removeToast(id)` removes the toast from the queue
- **SC-13-03** — Auto-dismiss removes the toast after timeout (~4s, use `vi.useFakeTimers()`)
- **SC-14-03** — Adding a 6th toast evicts the oldest toast (max 5 cap)
- `(implementation detail)` — Toast types: `'error'`, `'success'`, `'info'`
- `(implementation detail)` — Optional action object is preserved on the toast

---

## Step 2 — Write modal composable tests

- [ ] Create `tests/presentation/composables/use-modal.test.ts` covering:

- **SC-15-01** — `open(props)` sets `isOpen` to true and stores props
- `(implementation detail)` — `close()` sets `isOpen` to false and clears props
- **SC-15-06** — Calling `open()` a second time replaces the first modal's props (single-instance behavior)
- `(implementation detail)` — Props include `title`, optional `content`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`

---

## Step 3 — Create toast composable

- [ ] Create `src/presentation/composables/use-toast.ts`:

- Module-level `ref<Toast[]>` (singleton — shared across all callers, works outside `setup()`)
- `Toast` type: `{ id: string, message: string, type: 'error' | 'success' | 'info', action?: { label: string, handler: () => void } }`
- `addToast(options)` — generates unique id, pushes toast, starts `setTimeout` (using `TOAST_DISMISS_MS` from `src/domain/constants.ts`) for auto-removal. Enforces max 5 simultaneous toasts with oldest-first eviction.
- `removeToast(id)` — removes from array; also clears the associated `setTimeout` to prevent stale timer callbacks
- Returns `{ toasts: Readonly<Ref<Toast[]>>, addToast, removeToast }`

---

## Step 4 — Create modal composable

- [ ] Create `src/presentation/composables/use-modal.ts`:

- Module-level `ref<boolean>` + `shallowRef<ModalProps | null>` (single modal at a time)
- `ModalProps` type: `{ title: string, content?: string, confirmLabel?: string, cancelLabel?: string, onConfirm?: () => void, onCancel?: () => void }`
- `open(props)` — sets visible true, stores props
- `close()` — sets visible false, clears props
- Returns `{ isOpen: Readonly<Ref<boolean>>, props: Readonly<ShallowRef<ModalProps | null>>, open, close }`
