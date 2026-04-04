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
 * Schema for a movie item in list endpoints (search, trending, popular, recommendations).
 * Contains the fields returned by TMDB's list endpoints.
 */
export const MovieListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string(),
  overview: z.string(),
  release_date: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  genre_ids: z.array(z.number()),
  adult: z.boolean(),
  original_language: z.string(),
  video: z.boolean(),
})

/** Inferred type for a movie list item. */
export type MovieListItem = z.infer<typeof MovieListItemSchema>

/**
 * Schema for production company.
 */
export const ProductionCompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  logo_path: z.string().nullable(),
  origin_country: z.string(),
})

/**
 * Schema for production country.
 */
export const ProductionCountrySchema = z.object({
  iso_3166_1: z.string(),
  name: z.string(),
})

/**
 * Schema for collection info.
 */
export const CollectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
})

/**
 * Schema for release date info.
 */
export const ReleaseDateSchema = z.object({
  certification: z.string(),
  iso_639_1: z.string(),
  release_date: z.string(),
  type: z.number(),
  note: z.string().optional(),
})

/**
 * Schema for release dates by country.
 */
export const ReleaseDatesResultSchema = z.object({
  iso_3166_1: z.string(),
  release_dates: z.array(ReleaseDateSchema),
})

/**
 * Schema for movie detail response from TMDB with appended relations.
 * Fetched via /movie/{id}?append_to_response=credits,videos,watch/providers,release_dates
 */
export const MovieDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string(),
  overview: z.string(),
  tagline: z.string().nullable(),
  release_date: z.string(),
  runtime: z.number().nullable(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  imdb_id: z.string().nullable(),
  budget: z.number(),
  revenue: z.number(),
  status: z.string(),
  homepage: z.string().nullable(),
  adult: z.boolean(),
  original_language: z.string(),
  video: z.boolean(),
  genres: z.array(GenreSchema),
  spoken_languages: z.array(SpokenLanguageSchema),
  production_companies: z.array(ProductionCompanySchema),
  production_countries: z.array(ProductionCountrySchema),
  belongs_to_collection: CollectionSchema.nullable(),
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
  release_dates: z.object({
    results: z.array(ReleaseDatesResultSchema),
  }),
})

/** Inferred type for movie detail. */
export type MovieDetail = z.infer<typeof MovieDetailSchema>
