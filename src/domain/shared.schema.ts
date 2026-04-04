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
 * Schema for a spoken language.
 */
export const SpokenLanguageSchema = z.object({
  iso_639_1: z.string(),
  name: z.string(),
  english_name: z.string(),
})

/** Inferred type for a spoken language. */
export type SpokenLanguage = z.infer<typeof SpokenLanguageSchema>
