# Implementation Plan: Theme, Transitions & Constants

---

## Phase 1 — Tests

> Test-first: tests are written and run before implementation code. CSS structural scenarios (SC-01c-21-01, SC-01c-09a-01, SC-01c-22-01, SC-01c-23-01, SC-01c-24-04, SC-01c-24-05) are verified via CSS inspection in Phase 3. Behavioral scenarios requiring downstream components (SC-01c-22-02, SC-01c-22-03, SC-01c-23-02, SC-01c-24-01 through SC-01c-24-03) are verified after R-01g and R-01k are complete.

### Step 1 — Write domain constants unit test

- [ ] Create `tests/domain/constants.test.ts` — covering: SC-01c-25-01
  - Assert `TOAST_DISMISS_MS` is exported and equals `4000`
  - Assert `TOAST_DISMISS_MS` is of type `number`

### Step 2 — Confirm test failure

- [ ] Run `npx vitest run tests/domain/constants.test.ts` — expect failure (module does not exist yet)

## Phase 2 — Implementation

> **Rollback:** Revert modified files via `git checkout src/assets/main.css src/domain/constants.ts`.

### Step 3 — Create domain constants [SC-01c-25]

- [ ] Create `src/domain/constants.ts`:

```ts
/** Auto-dismiss timeout for toast notifications (in milliseconds). */
export const TOAST_DISMISS_MS = 4000
```

### Step 4 — Add theme color tokens [SC-01c-21]

- [ ] Append to the existing `@theme { }` block in `src/assets/main.css` after the `--font-sans` line (do not create a new block):
  - `--color-success: #22c55e`
  - `--color-error: #ef4444`

### Step 5 — Add fade transition CSS [SC-01c-09a]

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

### Step 6 — Add toast transition CSS [SC-01c-22]

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

### Step 7 — Add modal transition CSS [SC-01c-23]

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

### Step 8 — Add reduced-motion override [SC-01c-24]

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

- [ ] Run `npx vitest run` — all tests pass, including `tests/domain/constants.test.ts` (covering: SC-01c-25-01)

### Step 10 — Build and lint check

- [ ] Run `npm run check` — passes with no errors

### Step 11 — CSS verification

> Covers CSS structural scenarios: SC-01c-21-01, SC-01c-09a-01, SC-01c-22-01, SC-01c-23-01, SC-01c-24-04, SC-01c-24-05.

- [ ] `--color-success` and `--color-error` exist in the `@theme` block of `src/assets/main.css`
- [ ] Existing theme variables (`--color-bg-primary`, `--color-bg-secondary`, `--color-surface`, `--color-accent`, `--font-sans`) are preserved
- [ ] `.fade-enter-active`, `.toast-enter-active`, `.modal-enter-active` classes present in `src/assets/main.css`
- [ ] `.animate-pulse` animation disabled in the `@media (prefers-reduced-motion: reduce)` block
- [ ] `@media (prefers-reduced-motion: reduce)` block present
- [ ] No transition duration exceeds 300ms

### Step 12 — Deferred behavioral verification

> Behavioral scenarios requiring downstream components are verified in their respective feature phases:

- [ ] SC-01c-22-02, SC-01c-22-03 — Verified in R-01g (Toast Container & Modal Dialog) integration testing
- [ ] SC-01c-23-02 — Verified in R-01g (Toast Container & Modal Dialog) integration testing
- [ ] SC-01c-24-01 — Verified in R-01k (App Shell & Assembly) with route transition wiring
- [ ] SC-01c-24-02, SC-01c-24-03 — Verified in R-01g and R-01k with reduced-motion testing
