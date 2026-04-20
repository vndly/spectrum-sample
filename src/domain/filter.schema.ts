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
 * Schema for sorting field.
 */
export const SortFieldSchema = z.enum(['dateAdded', 'title', 'releaseYear', 'userRating'])

/** Inferred type for sorting field. */
export type SortField = z.infer<typeof SortFieldSchema>

/**
 * Schema for sorting order.
 */
export const SortOrderSchema = z.enum(['asc', 'desc'])

/** Inferred type for sorting order. */
export type SortOrder = z.infer<typeof SortOrderSchema>

/**
 * Schema for the library-specific filter state.
 */
export const LibraryFilterStateSchema = z.object({
  genres: z.array(z.number()),
  mediaType: z.enum(['all', 'movie', 'tv']),
  ratingMin: z.number().min(0).max(5),
  ratingMax: z.number().min(0).max(5),
})

/** Inferred type for the library filter state. */
export type LibraryFilterState = z.infer<typeof LibraryFilterStateSchema>

/**
 * Default filter state.
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  genres: [],
  mediaType: 'all',
  yearFrom: null,
  yearTo: null,
}

/**
 * Default library filter state.
 */
export const DEFAULT_LIBRARY_FILTER_STATE: LibraryFilterState = {
  genres: [],
  mediaType: 'all',
  ratingMin: 0,
  ratingMax: 5,
}
