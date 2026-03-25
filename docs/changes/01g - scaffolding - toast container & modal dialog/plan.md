# Implementation Plan: Toast Container & Modal Dialog

---

## Step 1 — Write toast-container tests

- [ ] Create `tests/presentation/components/common/toast-container.test.ts` covering:

- **SC-14-01** — Multiple toasts stack vertically without overlapping
- **SC-14-02** — Container is fixed top-right with `z-50`
- `(implementation detail)` — Renders nothing when toast queue is empty; renders toast items when present
- `(implementation detail)` — Each toast shows message, dismiss button, type-colored border, and optional action button

---

## Step 2 — Write modal-dialog tests

- [ ] Create `tests/presentation/components/common/modal-dialog.test.ts` covering:

- **SC-15-01** — Opens and renders title, body, confirm, and cancel buttons
- **SC-15-02** — Closes on backdrop click
- **SC-15-03** — Closes on Escape key
- **SC-15-04** — Confirm button invokes `onConfirm` callback and closes
- **SC-15-05** — Cancel button invokes `onCancel` callback and closes
- `(implementation detail)` — Does not render when `isOpen` is false

---

## Step 3 — Create toast-container component

- [ ] Create `src/presentation/components/common/toast-container.vue`:

- Fixed `top-4 right-4 z-50`
- Uses `useToast()` to read the toast queue
- Each toast: dark surface card, type-colored left border (error -> red, success -> green, info -> teal)
- Dismiss X button + optional action button
- `<TransitionGroup>` for animated enter (slide from right) / leave (fade out)

---

## Step 4 — Create modal-dialog component

- [ ] Create `src/presentation/components/common/modal-dialog.vue`:

- Uses `useModal()` to read open/close state and props
- Backdrop: `fixed inset-0 z-40 bg-black/50`, click-to-close
- Content card: centered, `bg-surface rounded-lg`
- Title, optional body text, confirm (teal) and cancel buttons
- Escape key closes via `@keydown.escape` listener
- `<Transition>`: fade backdrop + scale content
