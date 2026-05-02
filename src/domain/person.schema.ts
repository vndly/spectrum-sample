import { z } from 'zod'

/**
 * Schema for external person identifiers.
 */
export const ExternalIdsSchema = z.object({
  imdb_id: z.string().nullable(),
  instagram_id: z.string().nullable(),
  twitter_id: z.string().nullable(),
})

/** Inferred type for person external identifiers. */
export type ExternalIds = z.infer<typeof ExternalIdsSchema>

/**
 * Schema for base person detail data from TMDB.
 */
export const PersonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  biography: z.string(),
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  place_of_birth: z.string().nullable(),
  profile_path: z.string().nullable(),
  known_for_department: z.string(),
  also_known_as: z.array(z.string()),
  homepage: z.string().nullable(),
})

/** Inferred type for person detail data. */
export type PersonDetail = z.infer<typeof PersonDetailSchema>

/**
 * Schema for a movie cast credit in a person's combined credits.
 */
export const PersonMovieCreditSchema = z.object({
  id: z.number(),
  media_type: z.literal('movie'),
  title: z.string(),
  character: z.string().nullable(),
  release_date: z.string().nullable(),
  poster_path: z.string().nullable(),
  order: z.number().nullable(),
})

/**
 * Schema for a TV cast credit in a person's combined credits.
 */
export const PersonTvCreditSchema = z.object({
  id: z.number(),
  media_type: z.literal('tv'),
  name: z.string(),
  character: z.string().nullable(),
  first_air_date: z.string().nullable(),
  poster_path: z.string().nullable(),
  order: z.number().nullable(),
})

/**
 * Schema for a movie or TV cast credit in a person's combined credits.
 */
export const PersonCreditSchema = z.discriminatedUnion('media_type', [
  PersonMovieCreditSchema,
  PersonTvCreditSchema,
])

/** Inferred type for a person cast credit. */
export type PersonCredit = z.infer<typeof PersonCreditSchema>

/**
 * Schema for person detail data with appended cast credits and external IDs.
 */
export const PersonDetailWithCreditsSchema = PersonDetailSchema.extend({
  combined_credits: z.object({
    cast: z.array(PersonCreditSchema),
  }),
  external_ids: ExternalIdsSchema,
})

/** Inferred type for person detail data with appended credits and external IDs. */
export type PersonDetailWithCredits = z.infer<typeof PersonDetailWithCreditsSchema>
