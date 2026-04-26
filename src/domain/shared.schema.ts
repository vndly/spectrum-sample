import { z } from 'zod'

/**
 * Schema for a genre object.
 */
export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

/** Inferred type for a genre. */
export type Genre = z.infer<typeof GenreSchema>

/**
 * Schema for a cast member from credits.
 */
export const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
})

/** Inferred type for a cast member. */
export type CastMember = z.infer<typeof CastMemberSchema>

/**
 * Schema for a crew member from credits.
 */
export const CrewMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profile_path: z.string().nullable(),
})

/** Inferred type for a crew member. */
export type CrewMember = z.infer<typeof CrewMemberSchema>

/**
 * Schema for a video (trailer, teaser, etc.).
 */
export const VideoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean(),
})

/** Inferred type for a video. */
export type Video = z.infer<typeof VideoSchema>

/**
 * Schema for a streaming provider.
 */
export const StreamingProviderSchema = z.object({
  provider_id: z.number(),
  provider_name: z.string(),
  logo_path: z.string(),
})

/** Inferred type for a streaming provider. */
export type StreamingProvider = z.infer<typeof StreamingProviderSchema>

/**
 * Schema for watch provider data for a specific region.
 */
export const WatchProviderRegionSchema = z.object({
  link: z.string(),
  flatrate: z.array(StreamingProviderSchema).optional(),
  rent: z.array(StreamingProviderSchema).optional(),
  buy: z.array(StreamingProviderSchema).optional(),
})

/** Inferred type for watch provider region data. */
export type WatchProviderRegion = z.infer<typeof WatchProviderRegionSchema>

/**
 * Schema for an image (poster or backdrop).
 */
export const ImageSchema = z.object({
  aspect_ratio: z.number(),
  file_path: z.string(),
  height: z.number(),
  width: z.number(),
  iso_639_1: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
})

/** Inferred type for an image. */
export type Image = z.infer<typeof ImageSchema>

/**
 * Schema for external IDs (social media and database links).
 */
export const ExternalIdsSchema = z.object({
  imdb_id: z.string().nullable(),
  facebook_id: z.string().nullable(),
  instagram_id: z.string().nullable(),
  twitter_id: z.string().nullable(),
})

/** Inferred type for external IDs. */
export type ExternalIds = z.infer<typeof ExternalIdsSchema>

/**
 * Schema for a spoken language.
 */
export const SpokenLanguageSchema = z.object({
  iso_639_1: z.string(),
  name: z.string(),
  english_name: z.string(),
})

/** Inferred type for a spoken language. */
export type SpokenLanguage = z.infer<typeof SpokenLanguageSchema>

/**
 * Generic factory for paginated response schemas.
 * @param resultSchema - Zod schema for the items in the results array
 * @returns Zod object schema for the paginated response
 */
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(resultSchema: T) =>
  z.object({
    page: z.number(),
    results: z.array(resultSchema),
    total_pages: z.number(),
    total_results: z.number(),
  })

/**
 * Generic type for a paginated response.
 */
export type PaginatedResponse<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
