# Implementation Plan: Dependencies & Test Infrastructure

---

## Phase 1 — Dependencies & Test Infrastructure

### Step 1 — Install dependencies (SC-01)

- [ ] Run `npm install vue-router@^4`.
- [ ] Run `npm install -D @vue/test-utils@^2`.

> Rollback: `npm uninstall vue-router @vue/test-utils` and revert `package.json` / `package-lock.json`.

### Step 2 — Configure test environment (SC-27)

- [ ] Update `vitest.config.ts`: add `globals: true`, `include: ["tests/**/*.test.ts"]`, `setupFiles: ["./tests/setup.ts"]` inside the existing `test: { }` block in the `defineConfig` call. Preserve the existing `mergeConfig(viteConfig, defineConfig(...))` pattern — do not restructure the config. The `@` path alias (`@ → ./src`) is inherited from `vite.config.ts` via `mergeConfig` and does not need separate configuration.
- [ ] Create `tests/setup.ts` with `beforeEach(() => { localStorage.clear() })`. Since `globals: true` is set in the previous substep, `beforeEach` is available without importing from `vitest`.
- [ ] Ensure TypeScript recognizes Vitest globals: add `/// <reference types="vitest/globals" />` at the top of `tests/setup.ts`, or add `"vitest/globals"` to the `types` array in the appropriate tsconfig. Verify that `describe`, `it`, `expect`, and `beforeEach` are recognized without imports in `.test.ts` files.

> Rollback: revert `vitest.config.ts` to its previous state and delete `tests/setup.ts`.

---

## Phase 2 — Verification

> This phase has no user-facing scenarios. Verification confirms the infrastructure is correctly configured. See `scenarios.md` for scenario IDs.

### Step 3 — Run verification checks (SC-01, SC-27)

- [ ] Verify `package.json` lists `vue-router` under `dependencies` and `@vue/test-utils` under `devDependencies` (SC-01-01, SC-01-02).
- [ ] Run `npm run test` — must exit with zero config errors (SC-27-05).
- [ ] Run `npm run check` — format, lint, type-check, test, and build must all pass with zero failures (SC-27-06).
