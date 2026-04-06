import { z } from 'zod'

/**
 * Schema for the filter state on the home screen.
 */
export const FilterStateSchema = z.object({
  genres: z.array(z.number()),
  mediaType: z.enum(['all', 'movie', 'tv']),
  yearFrom: z.number().nullable(),
  yearTo: z.number().nullable(),
})

/** Inferred type for the filter state. */
export type FilterState = z.infer<typeof FilterStateSchema>

/**
 * Default filter state.
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  genres: [],
  mediaType: 'all',
  yearFrom: null,
  yearTo: null,
}
