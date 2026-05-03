# Data Model: Entry Details: Movie and Show Detail Pages (R-04)

## Overview

The entry details feature fetches comprehensive metadata from the TMDB API and integrates with the local library storage for status management. This document describes the data structures used for movie and show details.

## MovieDetail Schema

The `MovieDetail` type represents a complete movie record with all appended relations.

```ts
// src/domain/movie.schema.ts
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
  imdb_id: z.string().nullable(),
  budget: z.number(),
  revenue: z.number(),
  homepage: z.string().nullable(),
  original_language: z.string(),
  genres: z.array(GenreSchema),
  spoken_languages: z.array(SpokenLanguageSchema),
  credits: CreditsSchema,
  videos: VideosSchema,
  'watch/providers': WatchProvidersSchema,
  release_dates: ReleaseDatesSchema,
  images: ImagesSchema,
  external_ids: ExternalIdsSchema,
})
```

## ShowDetail Schema

The `ShowDetail` type represents a complete TV show record with show-specific fields.

```ts
// src/domain/show.schema.ts
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
  homepage: z.string().nullable(),
  original_language: z.string(),
  origin_country: z.array(z.string()),
  genres: z.array(GenreSchema),
  spoken_languages: z.array(SpokenLanguageSchema),
  created_by: z.array(CreatorSchema),
  networks: z.array(NetworkSchema),
  credits: CreditsSchema,
  videos: VideosSchema,
  'watch/providers': WatchProvidersSchema,
  content_ratings: ContentRatingsSchema,
  images: ImagesSchema,
  external_ids: ExternalIdsSchema,
})
```

## PersonDetailWithCredits Schema

The `PersonDetailWithCredits` type represents a complete person record with appended cast credits and external IDs.

```ts
// src/domain/person.schema.ts
export const PersonDetailWithCreditsSchema = PersonDetailSchema.extend({
  combined_credits: z.object({
    cast: z.array(PersonCreditSchema),
  }),
  external_ids: PersonExternalIdsSchema,
})
```

### PersonDetail

```ts
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
```

### PersonCredit

```ts
export const PersonMovieCreditSchema = z.object({
  id: z.number(),
  media_type: z.literal('movie'),
  title: z.string(),
  character: z.string().nullable(),
  release_date: z.string().nullable(),
  poster_path: z.string().nullable(),
  order: z.number().nullable(),
})

export const PersonTvCreditSchema = z.object({
  id: z.number(),
  media_type: z.literal('tv'),
  name: z.string(),
  character: z.string().nullable(),
  first_air_date: z.string().nullable(),
  poster_path: z.string().nullable(),
  order: z.number().nullable(),
})

export const PersonCreditSchema = z.discriminatedUnion('media_type', [
  PersonMovieCreditSchema,
  PersonTvCreditSchema,
])
```

### PersonExternalIds

```ts
export const PersonExternalIdsSchema = z.object({
  imdb_id: z.string().nullable(),
  instagram_id: z.string().nullable(),
  twitter_id: z.string().nullable(),
})
```

Person filmography uses `combined_credits.cast` only. Crew credits are excluded from this release.

## Shared Types

### Genre

```ts
export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
})
```

### Credits

```ts
export const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
})

export const CrewMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profile_path: z.string().nullable(),
})

export const CreditsSchema = z.object({
  cast: z.array(CastMemberSchema),
  crew: z.array(CrewMemberSchema),
})
```

### Videos

```ts
export const VideoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean(),
})

export const VideosSchema = z.object({
  results: z.array(VideoSchema),
})
```

### Watch Providers

```ts
export const StreamingProviderSchema = z.object({
  provider_id: z.number(),
  provider_name: z.string(),
  logo_path: z.string(),
})

export const WatchProviderRegionSchema = z.object({
  link: z.string(),
  flatrate: z.array(StreamingProviderSchema).optional(),
  rent: z.array(StreamingProviderSchema).optional(),
  buy: z.array(StreamingProviderSchema).optional(),
})

export const WatchProvidersSchema = z.object({
  results: z.record(z.string(), WatchProviderRegionSchema),
})
```

### Images

```ts
export const ImageSchema = z.object({
  file_path: z.string(),
  aspect_ratio: z.number(),
  height: z.number(),
  width: z.number(),
  vote_average: z.number(),
  vote_count: z.number(),
  iso_639_1: z.string().nullable(),
})

export const ImagesSchema = z.object({
  backdrops: z.array(ImageSchema),
  posters: z.array(ImageSchema),
})
```

### External IDs

```ts
export const ExternalIdsSchema = z.object({
  imdb_id: z.string().nullable(),
  facebook_id: z.string().nullable(),
  instagram_id: z.string().nullable(),
  twitter_id: z.string().nullable(),
})
```

### Content Ratings (Shows)

```ts
export const ContentRatingSchema = z.object({
  iso_3166_1: z.string(),
  rating: z.string(),
})

export const ContentRatingsSchema = z.object({
  results: z.array(ContentRatingSchema),
})
```

### Release Dates (Movies)

```ts
export const ReleaseDateEntrySchema = z.object({
  certification: z.string(),
  type: z.number(),
  release_date: z.string(),
})

export const ReleaseDatesResultSchema = z.object({
  iso_3166_1: z.string(),
  release_dates: z.array(ReleaseDateEntrySchema),
})

export const ReleaseDatesSchema = z.object({
  results: z.array(ReleaseDatesResultSchema),
})
```

## LibraryEntry Integration

When a user interacts with a detail page, the `LibraryEntry` is synced with metadata from the detail response.

```ts
// Fields synced from detail to library entry
{
  id: number // TMDB ID
  mediaType: 'movie' | 'tv'
  title: string // From title (movie) or name (show)
  posterPath: string // From poster_path
  voteAverage: number // From vote_average
  releaseDate: string // From release_date or first_air_date
}
```

This ensures library entries always have up-to-date metadata when the detail page is visited.

## PersonPageData Integration

Person detail Presentation components receive Application-facing view models rather than raw API objects.

```ts
{
  id: number
  name: string
  knownForDepartment: string
  biography: string | null
  profileUrl: string | null
  birthInfo: string | null
  deathInfo: string | null
  externalLinks: PersonExternalLinkViewModel[]
  filmography: PersonCreditViewModel[]
}
```

The Application layer builds localized dates, profile image URLs, poster image URLs, external URLs, and `/movie/:id` or `/show/:id` routes before rendering.
