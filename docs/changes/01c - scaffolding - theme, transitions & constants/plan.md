# Implementation Plan: Theme, Transitions & Constants

---

## Phase 1 — Domain Constants & Theme CSS

### Step 1 — Create domain constants

- [ ] Create `src/domain/constants.ts`:

- `TOAST_DISMISS_MS = 4000` — auto-dismiss timeout for toast notifications

> This is the only Domain layer change in this phase, acknowledged as an exception in the Architecture Compliance NFR.

### Step 2 — Update Tailwind theme & transition CSS

- [ ] Add to the existing `@theme { }` block in `src/assets/main.css` (do not create a new block):

- `--color-success: #22c55e`
- `--color-error: #ef4444`

- [ ] Add fade transition CSS after the `@theme` block:

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

- [ ] Add toast transition CSS:

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

- [ ] Add modal transition CSS:

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

- [ ] Add reduced-motion override:

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
