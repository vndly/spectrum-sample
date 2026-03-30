# Implementation Plan: Error Handling

---

## Step 1 — Write error-boundary tests

- [ ] Create `tests/presentation/components/error/error-boundary.test.ts` covering:

- **SC-18-01** — Shows fallback UI with error title, description, and reload button when an error is captured
- **SC-18-02** — Reload button calls `window.location.reload()`
- **SC-18-03** — `onErrorCaptured` returns `false` to prevent propagation to global error handler
- `(implementation detail)` — Renders slot content in normal state

---

## Step 2 — Write global error handler test

- [ ] Create `tests/global-error-handler.test.ts` covering:

- **SC-19-01** — `app.config.errorHandler` dispatches an error toast via `useToast()` and logs to `console.error`

  **Setup:** Create a test Vue app instance, register the error handler function on it, invoke the handler with a synthetic error. Use `vi.spyOn(console, 'error')` to verify logging. Assert that `useToast().addToast` was called with type `'error'`. Call `_resetForTesting()` in `beforeEach` for test isolation.

---

## Step 3 — Create error boundary

- [ ] Create `src/presentation/components/error/error-boundary.vue`:

- Uses `onErrorCaptured` lifecycle hook
- Returns `false` from `onErrorCaptured` to prevent propagation to global error handler
- Normal state: renders `<slot />`
- Error state: centered fallback with `$t('common.error.title')`, `$t('common.error.description')`, and reload button calling `window.location.reload()`
- Fallback container uses `role="alert"` for accessibility
- Style fallback UI with Tailwind classes consistent with other common components

---

## Step 4 — Add global error handler

- [ ] Modify `src/main.ts` to add `app.config.errorHandler` (after existing plugin registrations):

- Import `useToast` from `./presentation/composables/use-toast`
- Import `i18n` from `./presentation/i18n`
- Logs the error to `console.error`
- Calls `useToast().addToast({ message: i18n.global.t('toast.error'), type: 'error' })`

> Note: `main.ts` importing from `src/presentation/composables/` is an intentional exception to typical layer boundaries, consistent with the module-level singleton decision in requirements. The `i18n.global.t()` function is used because the handler runs outside Vue component lifecycle.

---

## Step 5 — Verification

- [ ] Run `npm test` to verify all tests pass
- [ ] Run `npm run lint` to verify no linting errors
- [ ] Run `npm run typecheck` to verify no type errors
- [ ] Verify error boundary fallback displays correctly when child throws
- [ ] Verify global error handler shows toast for uncaught errors
