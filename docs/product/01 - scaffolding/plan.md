# Implementation Plan: Dependencies & Test Infrastructure

---

## Phase 1 — Dependencies & Test Infrastructure

### Step 1 — Install dependencies (SC-01a-01)

- [x] Run `npm install vue-router@^4.5` (covering SC-01a-01-01).
- [x] Run `npm install -D @vue/test-utils@^2.4` (covering SC-01a-01-02).

> Rollback: `npm uninstall vue-router @vue/test-utils` and revert `package.json` / `package-lock.json`.

### Step 2 — Configure test environment (SC-01a-02, SC-01a-03)

- [x] Update `vitest.config.ts`: add `globals: true`, `include: ['tests/**/*.test.ts']`, `setupFiles: ['./tests/setup.ts']` inside the existing `test: { }` block in the `defineConfig` call. Preserve the existing `mergeConfig(viteConfig, defineConfig(...))` pattern and the `environment: 'jsdom'` setting — do not restructure the config (covering SC-01a-02-01).

Expected final `test` block:

```ts
test: {
  environment: 'jsdom',
  globals: true,
  include: ['tests/**/*.test.ts'],
  setupFiles: ['./tests/setup.ts'],
},
```

The `@` path alias (`@ → ./src`) is inherited from `vite.config.ts` via `mergeConfig` and does not need separate configuration.

- [x] Create `tests/setup.ts` with `/// <reference types="vitest/globals" />` at the top and `beforeEach(() => { localStorage.clear() })`. The `beforeEach` function is available at runtime due to `globals: true` set in the previous substep; TypeScript recognizes it via the `/// <reference types="vitest/globals" />` directive — both are required (covering SC-01a-03-01, SC-01a-03-02).

> Note: `tsconfig.app.json` includes only `src/**/*` and does not cover the `tests/` directory. A dedicated `tsconfig.vitest.json` (extending `tsconfig.app.json`) provides IDE type-checking for test files, adding `vitest/globals` and `node` types with `include: ["tests/**/*.ts"]`.

> Rollback: revert `vitest.config.ts` to its previous state and delete `tests/setup.ts`.

### Step 3 — Update testing documentation (SC-01a-02)

- [x] Remove the `import { describe, it, expect } from 'vitest'` line from the code example in `docs/technical/testing.md`, so the example starts with `import { isHighRated } from '@/domain/movie.logic'`. This aligns the reference documentation with the `globals: true` convention established in Step 2. Note: the `vitest.config.ts` settings list in `testing.md` already reflects the post-Phase 01a target state (`globals: true`, `include`, `setupFiles`) — only the code example needs updating.

> Rollback: revert `docs/technical/testing.md` to its previous state.

---

## Phase 2 — Verification

> **Testing phase note:** No automated test files are produced in this phase because the scope is pure infrastructure with no testable application logic. Tests are deferred to downstream phases (01b–01k) that will use the infrastructure established here.

> This phase has no user-facing scenarios. Verification confirms the infrastructure is correctly configured. See [`scenarios/`](./scenarios/) for scenario IDs.

### Step 4 — Run verification checks (SC-01a-01, SC-01a-02, SC-01a-03)

- [x] Verify `package.json` lists `vue-router` under `dependencies` and `@vue/test-utils` under `devDependencies` (SC-01a-01-01, SC-01a-01-02).
- [x] Verify `vitest.config.ts` contains `globals: true`, `include: ['tests/**/*.test.ts']`, `setupFiles: ['./tests/setup.ts']`, and `environment: 'jsdom'` (SC-01a-02-01).
- [x] Verify `docs/technical/testing.md` code example does not contain explicit Vitest imports (SC-01a-02-04).
- [x] Verify `tests/setup.ts` calls `localStorage.clear()` in `beforeEach` (SC-01a-03-01) and includes `/// <reference types="vitest/globals" />` (SC-01a-03-02).
- [ ] Run `npm run test` — must exit with zero config errors (SC-01a-02-02). _(ignored: exits code 1 because no test files exist yet — config is correct)_
- [ ] Run `npm run check` — format, lint, type-check, test, and build must all pass with zero failures (SC-01a-02-03). _(ignored: fails at test step for same reason — format, lint, type-check all pass)_

> SC-01a-03-03 (without setup file, localStorage state leaks between tests) is a negative scenario that validates the need for the setup file. It is implicitly confirmed by SC-01a-02-01 (setupFiles configured) and SC-01a-03-01 (localStorage cleared) — no separate verification step needed.
