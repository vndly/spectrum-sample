import { z } from 'zod'
import {
  CastMemberSchema,
  CrewMemberSchema,
  GenreSchema,
  SpokenLanguageSchema,
  VideoSchema,
  WatchProviderRegionSchema,
} from './shared.schema'

/**
 * Schema for a TV show item in list endpoints (search, trending, popular, recommendations).
 * Contains the fields returned by TMDB's list endpoints.
 */
export const ShowListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  original_name: z.string(),
  overview: z.string(),
  first_air_date: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  genre_ids: z.array(z.number()),
  adult: z.boolean(),
  original_language: z.string(),
  origin_country: z.array(z.string()),
})

/** Inferred type for a TV show list item. */
export type ShowListItem = z.infer<typeof ShowListItemSchema>

/**
 * Schema for production company.
 */
export const ShowProductionCompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  logo_path: z.string().nullable(),
  origin_country: z.string(),
})

/**
 * Schema for production country.
 */
export const ShowProductionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
})

/**
 * Schema for network.
 */
export const NetworkSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo_path: z.string().nullable(),
  origin_country: z.string(),
})

/**
 * Schema for creator.
 */
export const CreatorSchema = z.object({
  id: z.number(),
  name: z.string(),
  profile_path: z.string().nullable(),
  credit_id: z.string(),
})

/**
 * Schema for content rating.
 */
export const ContentRatingSchema = z.object({
  iso_3166_1: z.string(),
  rating: z.string(),
})

/**
 * Schema for episode info.
 */
export const EpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  air_date: z.string().nullable(),
  episode_number: z.number(),
  season_number: z.number(),
  still_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  runtime: z.number().nullable(),
})

/**
 * Schema for TV show detail response from TMDB with appended relations.
 * Fetched via /tv/{id}?append_to_response=credits,videos,watch/providers,content_ratings
 */
export const ShowDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  original_name: z.string(),
  overview: z.string(),
  tagline: z.string().nullable(),
  first_air_date: z.string(),
  last_air_date: z.string().nullable(),
  number_of_seasons: z.number(),
  number_of_episodes: z.number(),
  episode_run_time: z.array(z.number()),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  status: z.string(),
  homepage: z.string().nullable(),
  adult: z.boolean(),
  original_language: z.string(),
  in_production: z.boolean(),
  type: z.string(),
  genres: z.array(GenreSchema),
  spoken_languages: z.array(SpokenLanguageSchema),
  production_companies: z.array(ShowProductionCompanySchema),
  production_countries: z.array(ShowProductionCountrySchema),
  origin_country: z.array(z.string()),
  networks: z.array(NetworkSchema),
  created_by: z.array(CreatorSchema),
  next_episode_to_air: EpisodeSchema.nullable(),
  credits: z.object({
    cast: z.array(CastMemberSchema),
    crew: z.array(CrewMemberSchema),
  }),
  videos: z.object({
    results: z.array(VideoSchema),
  }),
  'watch/providers': z.object({
    results: z.record(z.string(), WatchProviderRegionSchema),
  }),
  content_ratings: z.object({
    results: z.array(ContentRatingSchema),
  }),
})

/** Inferred type for TV show detail. */
export type ShowDetail = z.infer<typeof ShowDetailSchema>
