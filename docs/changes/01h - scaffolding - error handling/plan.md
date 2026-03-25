# Implementation Plan: Error Handling

---

## Step 1 — Write error-boundary tests

- [ ] Create `tests/presentation/components/error/error-boundary.test.ts` covering:

- **SC-18-01** — Shows fallback UI with error title, description, and reload button when an error is captured
- **SC-18-02** — Reload button calls `window.location.reload()`
- `(implementation detail)` — Renders slot content in normal state

---

## Step 2 — Write global error handler test

- [ ] Create `tests/presentation/global-error-handler.test.ts` covering:

- **SC-19-01** — `app.config.errorHandler` dispatches an error toast via `useToast()` and logs to `console.error`

  **Setup:** Create a test Vue app instance, register the error handler function on it, invoke the handler with a synthetic error, and assert that `useToast().addToast` was called with type `'error'` and that `console.error` was invoked.

---

## Step 3 — Create error boundary

- [ ] Create `src/presentation/components/error/error-boundary.vue`:

- Uses `onErrorCaptured` lifecycle hook
- Normal state: renders `<slot />`
- Error state: centered fallback with `$t('common.error.title')`, `$t('common.error.description')`, and reload button calling `window.location.reload()`

---

## Step 4 — Add global error handler

- [ ] Modify `src/main.ts` to add `app.config.errorHandler` (after existing plugin registrations):

- Logs the error to `console.error`
- Calls `useToast().addToast({ message: i18n.global.t('toast.error'), type: 'error' })`

> Note: `main.ts` importing from `src/presentation/composables/` is an intentional exception to typical layer boundaries, consistent with the module-level singleton decision in requirements.
