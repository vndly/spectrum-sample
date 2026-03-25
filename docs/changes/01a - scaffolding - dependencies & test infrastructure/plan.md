# Implementation Plan: Dependencies & Test Infrastructure

---

## Phase 1 — Dependencies & Test Infrastructure

### Step 1 — Install dependencies (SC-01)

- [ ] Run `npm install vue-router@^4`.
- [ ] Run `npm install -D @vue/test-utils@^2`.

> Rollback: `npm uninstall vue-router @vue/test-utils` and revert `package.json` / `package-lock.json`.

### Step 2 — Configure test environment (SC-27, SC-28)

- [ ] Update `vitest.config.ts`: add `globals: true`, `include: ["tests/**/*.test.ts"]`, `setupFiles: ["./tests/setup.ts"]` inside the existing `test: { }` block in the `defineConfig` call. Preserve the existing `mergeConfig(viteConfig, defineConfig(...))` pattern — do not restructure the config. The `@` path alias (`@ → ./src`) is inherited from `vite.config.ts` via `mergeConfig` and does not need separate configuration (covering SC-27-01, SC-27-02, SC-27-03).
- [ ] Create `tests/setup.ts` with `/// <reference types="vitest/globals" />` at the top and `beforeEach(() => { localStorage.clear() })`. Since `globals: true` is set in the previous substep, `beforeEach` is available without importing from `vitest` (covering SC-28-01, SC-28-02).
- [ ] Update the code example in `docs/technical/testing.md` to remove the `import { describe, it, expect } from 'vitest'` line, aligning it with the `globals: true` convention.

> Rollback: revert `vitest.config.ts` to its previous state and delete `tests/setup.ts`.

---

## Phase 2 — Verification

> This phase has no user-facing scenarios. Verification confirms the infrastructure is correctly configured. See `scenarios.md` for scenario IDs.

### Step 3 — Run verification checks (SC-01, SC-27, SC-28)

- [ ] Verify `package.json` lists `vue-router` under `dependencies` and `@vue/test-utils` under `devDependencies` (SC-01-01, SC-01-02).
- [ ] Verify `vitest.config.ts` contains `globals: true` (SC-27-01), `include: ["tests/**/*.test.ts"]` (SC-27-02), and `setupFiles: ["./tests/setup.ts"]` (SC-27-03).
- [ ] Verify `tests/setup.ts` calls `localStorage.clear()` in `beforeEach` (SC-28-01) and includes `/// <reference types="vitest/globals" />` (SC-28-02).
- [ ] Run `npm run test` — must exit with zero config errors (SC-27-05).
- [ ] Run `npm run check` — format, lint, type-check, test, and build must all pass with zero failures (SC-27-06).

> SC-28-03 (missing setup file causes localStorage leaks) is a design-rationale scenario validated implicitly by SC-27-03 and SC-28-01 — no separate verification step needed.
