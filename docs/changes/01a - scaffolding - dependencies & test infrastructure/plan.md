# Implementation Plan: Dependencies & Test Infrastructure

---

## Phase 1 — Dependencies & Test Infrastructure

### Step 1 — Install dependencies

- [ ] Run `npm install vue-router@^4`.
- [ ] Run `npm install -D @vue/test-utils@^2`.

### Step 2 — Configure test environment

- [ ] Update `vitest.config.ts`: add `globals: true`, `include: ["tests/**/*.test.ts"]`, `setupFiles: ["./tests/setup.ts"]` inside the existing `test: { }` block in the `defineConfig` call (do not create a separate config object).
- [ ] Create `tests/setup.ts` with `beforeEach(() => { localStorage.clear() })`.
