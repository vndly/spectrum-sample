# Implementation Plan: Theme, Transitions & Constants

---

## Phase 1 — Tests

> Test-first: tests are written and run before implementation code. CSS structural scenarios (SC-21-01, SC-09a-01, SC-22-01, SC-23-01, SC-24-04) are verified via CSS inspection in Phase 3. Behavioral scenarios requiring downstream components (SC-22-02, SC-23-02, SC-24-01 through SC-24-03) are verified after R-01g and R-01k are complete.

### Step 1 — Write domain constants unit test

- [ ] Create `tests/domain/constants.test.ts` — covering: SC-25-01
  - Assert `TOAST_DISMISS_MS` is exported and equals `4000`
  - Assert `TOAST_DISMISS_MS` is of type `number`

### Step 2 — Confirm test failure

- [ ] Run `npx vitest run tests/domain/constants.test.ts` — expect failure (module does not exist yet)

## Phase 2 — Implementation

### Step 3 — Create domain constants [SC-25]

- [ ] Create `src/domain/constants.ts`:

```ts
/** Auto-dismiss timeout for toast notifications (in milliseconds). */
export const TOAST_DISMISS_MS = 4000
```

### Step 4 — Add theme color tokens [SC-21]

- [ ] Add to the existing `@theme { }` block in `src/assets/main.css` (do not create a new block):
  - `--color-success: #22c55e`
  - `--color-error: #ef4444`

### Step 5 — Add fade transition CSS [SC-09a]

> Vue `<Transition>` requires class-based CSS. Centralizing in `main.css` avoids duplication. Acknowledged exception to the "Tailwind only" rule (see Decisions table in requirements.md).

- [ ] Add after the `@theme` block in `src/assets/main.css`:

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### Step 6 — Add toast transition CSS [SC-22]

- [ ] Add toast transition CSS in `src/assets/main.css`:

```css
.toast-enter-active {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
}
.toast-leave-active {
  transition: opacity 0.2s ease-in;
}
.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.toast-leave-to {
  opacity: 0;
}
```

### Step 7 — Add modal transition CSS [SC-23]

- [ ] Add modal transition CSS in `src/assets/main.css`. These classes apply to the content card only; backdrop transition is managed separately by the modal component in R-01g:

```css
.modal-enter-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}
.modal-leave-active {
  transition:
    opacity 0.15s ease-in,
    transform 0.15s ease-in;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
```

### Step 8 — Add reduced-motion override [SC-24]

- [ ] Add reduced-motion override in `src/assets/main.css`. The `.animate-pulse` rule disables Tailwind's built-in skeleton shimmer animation used in loading states (R-01f), ensuring all visual motion is suppressed:

```css
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .toast-enter-active,
  .toast-leave-active,
  .modal-enter-active,
  .modal-leave-active {
    transition: none;
  }

  .animate-pulse {
    animation: none;
  }
}
```

## Phase 3 — Verification

### Step 9 — Run tests

- [ ] Run `npx vitest run` — all tests pass, including `tests/domain/constants.test.ts` (covering: SC-25-01)

### Step 10 — Build and lint check

- [ ] Run `npm run check` — passes with no errors

### Step 11 — CSS verification

> Covers CSS structural scenarios: SC-21-01, SC-09a-01, SC-22-01, SC-23-01, SC-24-04.

- [ ] `--color-success` and `--color-error` exist in the `@theme` block of `src/assets/main.css`
- [ ] `.fade-enter-active`, `.toast-enter-active`, `.modal-enter-active` classes present in `src/assets/main.css`
- [ ] `@media (prefers-reduced-motion: reduce)` block present
- [ ] No transition duration exceeds 300ms
