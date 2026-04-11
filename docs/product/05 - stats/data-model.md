# Data Model: Stats: Insights and Overview (R-07)

## Schema Updates

This feature enhances the `LibraryEntry` metadata to support "Total Watch Time" without requiring a network call for every statistic refresh.

### LibraryEntry Enhancement

The `LibraryEntry` schema is updated with an optional `runtime` field.

```ts
// src/domain/library.schema.ts extension
export const LibraryEntrySchema = z.object({
  // ... existing fields
  runtime: z
    .number()
    .optional()
    .describe('Runtime in minutes (movie duration or average episode duration)'),
})
```

### Rationale

- **Performance**: Storing the runtime at the time of addition prevents thousands of API calls during stats computation.
- **Privacy**: No external tracking of watch history is required; it's all derived from local snapshots.

## Migration Strategy

- **New Entries**: Captured automatically during the "Add to Library" flow or when visiting details.
- **Existing Entries**: Best-effort backfill. If an entry is visited, its `runtime` is updated. Entries without `runtime` contribute `0` (zero) minutes to the total watch time until updated, as per the calculation logic.
