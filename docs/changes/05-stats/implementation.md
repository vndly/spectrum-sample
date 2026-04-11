# Implementation: Stats: Insights and Overview (R-07)

## Architectural Overview

The Stats feature follows the project's 4-layer architecture. It is a strictly "read-only" view that derives insights from the existing local library entries.

### Logic Layer (Domain)

Computation logic is isolated in `src/domain/stats.logic.ts`. These are pure functions that take an array of `LibraryEntry` and return the calculated metrics. This ensures high testability and performance.

### Orchestration Layer (Application)

The `useStats` composable (`src/application/use-stats.ts`) provides reactive access to the calculated stats. It listens to changes in `useLibraryEntries` and recomputes the stats automatically.

### UI Integration

The `StatsScreen` component and its sub-components consume the reactive data exposed by `useStats`. For example:

```ts
const { metrics, genreData, monthlyData, topRated } = useStats()
```

This ensures that any change in the library status or rating is immediately reflected in the charts without a manual refresh.

### UI Layer (Presentation)

The dashboard is composed of specialized, lazy-loaded components to keep the main bundle size small.

## Component Hierarchy

```
StatsScreen.vue
├── StatCards.vue (Summary Metrics)
├── GenreChart.vue (Bar Chart)
├── MonthlyChart.vue (Line/Bar Chart)
└── TopRatedList.vue (List of Top 10)
```

## Charting Library

We use `chart.js` with `vue-chartjs`. To optimize performance:

- Charts are lazily rendered only when the Stats screen is visited.
- Tree-shaking is used to only include the necessary Chart.js components (Bar, Line, etc.).
