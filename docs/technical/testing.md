# Testing

## Test Runner

The project uses [Vitest](https://vitest.dev/), a Vite-native test framework that shares the same config and transform pipeline as the dev build.

`vitest.config.ts` settings:

- `environment: "jsdom"` — DOM simulation for component tests
- `globals: true` — `describe`, `it`, `expect` available without imports
- `include: ["tests/**/*.test.ts"]`
- `setupFiles: ["./tests/setup.ts"]` — runs `localStorage.clear()` before each test
- Path alias `@` → `./src` (same as Vite config)

## Running Tests

```bash
npm run test            # Run all tests once
npx vitest --watch      # Watch mode — re-runs on file changes
npx vitest --coverage   # Run with coverage report
```

## Test File Structure

Test files live in a dedicated `tests/` folder at the project root, **mirroring** the `src/` directory structure. Files use the naming convention `*.test.ts`.

```
tests/
├── domain/
│   ├── movie.schema.test.ts      # Tests for Zod schemas
│   └── movie.logic.test.ts       # Tests for pure functions
│
├── infrastructure/
│   ├── tmdb.client.test.ts       # Tests for API client
│   └── storage.service.test.ts   # Tests for storage + migration
│
├── application/
│   └── use-library.test.ts        # Tests for composable logic
│
└── presentation/
    └── components/
        └── common/
            └── MovieCard.test.ts   # Component interaction tests (if needed)
```

## What to Test

| Layer          | What to cover                                                    | Mocking strategy                                    |
| -------------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| Domain         | Zod schema parsing (valid + invalid inputs), pure logic functions | None — zero dependencies                            |
| Infrastructure | API calls, localStorage reads/writes, schema migration           | Fresh in-memory store (no mocking localStorage)     |
| Application    | Data flow, loading/error states, composable orchestration        | Mock Infrastructure layer                           |
| Presentation   | Non-trivial interaction logic only                               | Mock Application composables                        |

## Coverage Expectations

- **Domain** — High coverage; these are pure functions and schemas with no side effects.
- **Infrastructure** — Cover happy paths, error cases, and edge cases (e.g., corrupted data, migration sequences).
- **Application** — Cover state transitions: idle → loading → success, idle → loading → error.
- **Presentation** — Only test components with complex interaction logic (e.g., multi-step forms). Simple rendering components do not need tests.

See also [Conventions — Testing](./conventions.md#7-testing) for testing conventions (file naming, mocking strategy, AAA pattern).

## Test Pattern

Every test follows the **Arrange-Act-Assert** pattern:

```ts
import { describe, it, expect } from 'vitest'
import { isHighRated } from '@/domain/movie.logic'

describe('isHighRated', () => {
  it('returns true for movies rated above 8.0', () => {
    // Arrange
    const movie = { vote_average: 8.5 }

    // Act
    const result = isHighRated(movie)

    // Assert
    expect(result).toBe(true)
  })
})
```
