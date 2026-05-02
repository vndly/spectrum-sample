import { MAX_RETRY_ATTEMPTS, RETRY_BASE_DELAY_MS } from '@/domain/constants'
import type { MovieDetail, MovieListItem } from '@/domain/movie.schema'
import { MovieDetailSchema, MovieListItemSchema } from '@/domain/movie.schema'
import type { PersonDetailWithCredits } from '@/domain/person.schema'
import { PersonDetailWithCreditsSchema } from '@/domain/person.schema'
import type { SearchResponse } from '@/domain/search.schema'
import { SearchResponseSchema } from '@/domain/search.schema'
import type { ShowDetail } from '@/domain/show.schema'
import { ShowDetailSchema } from '@/domain/show.schema'
import { GenreSchema, createPaginatedResponseSchema } from '@/domain/shared.schema'
import type { PaginatedResponse } from '@/domain/shared.schema'
import { z } from 'zod'

/** Base URL for the TMDB API. */
export const API_BASE_URL = 'https://api.themoviedb.org/3'

/** TMDB API access token from environment variables. */
const ACCESS_TOKEN = import.meta.env.VITE_MEDIA_PROVIDER_TOKEN as string

/** Schema for the genre list response from TMDB. */
const GenreListResponseSchema = z.object({
  genres: z.array(GenreSchema),
})

/** Inferred type for the genre list response. */
type GenreListResponse = z.infer<typeof GenreListResponseSchema>

/**
 * Error thrown for provider responses that include an HTTP status code.
 */
export class ProviderRequestError extends Error {
  readonly status: number
  readonly statusText: string
  readonly url: string

  /**
   * Creates a status-aware provider request error.
   * @param status - HTTP response status code
   * @param statusText - HTTP response status text
   * @param url - Full request URL
   */
  constructor(status: number, statusText: string, url: string) {
    super(`API request failed: ${status} ${statusText} at ${url}`)
    this.name = 'ProviderRequestError'
    this.status = status
    this.statusText = statusText
    this.url = url
  }
}

/**
 * Delays execution for the specified duration.
 * @param ms - Milliseconds to delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Makes an authenticated fetch request to the TMDB API with retry logic for rate limiting.
 * @param url - Full URL to fetch
 * @param attempt - Current attempt number (1-based)
 * @returns Response object
 * @throws Error if all retries are exhausted or a non-retryable error occurs
 */
export async function fetchWithRetry(url: string, attempt = 1): Promise<Response> {
  let response: Response

  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown connection failure'
    throw new Error(`Network error: ${message}`, { cause: e })
  }

  if (response.status === 429 && attempt <= MAX_RETRY_ATTEMPTS) {
    const delayMs = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1)
    await delay(delayMs)
    return fetchWithRetry(url, attempt + 1)
  }

  if (!response.ok) {
    const error = new ProviderRequestError(response.status, response.statusText, url)
    console.error(error.message)
    throw error
  }

  return response
}

/**
 * Fetches the list of movie genres from TMDB.
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated list of movie genres
 * @throws Error if the API request fails
 */
export async function getMovieGenres(language: string): Promise<GenreListResponse> {
  const params = new URLSearchParams({ language })
  const url = `${API_BASE_URL}/genre/movie/list?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  return GenreListResponseSchema.parse(data)
}

/**
 * Fetches the list of TV genres from TMDB.
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated list of TV genres
 * @throws Error if the API request fails
 */
export async function getTvGenres(language: string): Promise<GenreListResponse> {
  const params = new URLSearchParams({ language })
  const url = `${API_BASE_URL}/genre/tv/list?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  return GenreListResponseSchema.parse(data)
}

/**
 * Searches for movies and TV shows using TMDB's multi-search endpoint.
 * @param query - Search query string (will be trimmed)
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated search response with paginated results
 * @throws Error if query is empty after trimming or if the API request fails
 */
export async function searchMulti(query: string, language: string): Promise<SearchResponse> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    throw new Error('Search query cannot be empty')
  }

  const params = new URLSearchParams({
    query: trimmedQuery,
    language,
    page: '1',
    include_adult: 'false',
  })

  const url = `${API_BASE_URL}/search/multi?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  return SearchResponseSchema.parse(data)
}

/**
 * Fetches trending movies and TV shows for the day.
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated search response with trending items
 * @throws Error if the API request fails
 */
export async function getTrending(language: string): Promise<SearchResponse> {
  const params = new URLSearchParams({ language })
  const url = `${API_BASE_URL}/trending/all/day?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  try {
    return SearchResponseSchema.parse(data)
  } catch (e) {
    console.error('Zod parsing failed for Trending response:', e, data)
    throw e
  }
}

/**
 * Fetches popular movies.
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated search response with popular movies
 * @throws Error if the API request fails
 */
export async function getPopularMovies(language: string): Promise<SearchResponse> {
  const params = new URLSearchParams({ language, page: '1' })
  const url = `${API_BASE_URL}/movie/popular?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  // Inject media_type for consistency with SearchResponse
  data.results = data.results.map((item: Record<string, unknown>) => ({
    ...item,
    media_type: 'movie',
  }))

  return SearchResponseSchema.parse(data)
}

/**
 * Fetches popular TV shows.
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated search response with popular TV shows
 * @throws Error if the API request fails
 */
export async function getPopularShows(language: string): Promise<SearchResponse> {
  const params = new URLSearchParams({ language, page: '1' })
  const url = `${API_BASE_URL}/tv/popular?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  // Inject media_type for consistency with SearchResponse
  data.results = data.results.map((item: Record<string, unknown>) => ({
    ...item,
    media_type: 'tv',
  }))

  return SearchResponseSchema.parse(data)
}

/**
 * Fetches detailed information about a movie including credits, videos, and streaming providers.
 * @param id - TMDB movie ID
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated movie detail response with appended relations
 * @throws Error if the API request fails
 */
export async function getMovieDetail(id: number, language: string): Promise<MovieDetail> {
  const params = new URLSearchParams({
    language,
    append_to_response: 'credits,videos,watch/providers,release_dates,images,external_ids',
  })

  const url = `${API_BASE_URL}/movie/${id}?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  return MovieDetailSchema.parse(data)
}

/**
 * Fetches detailed information about a TV show including credits, videos, and streaming providers.
 * @param id - TMDB TV show ID
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated TV show detail response with appended relations
 * @throws Error if the API request fails
 */
export async function getShowDetail(id: number, language: string): Promise<ShowDetail> {
  const params = new URLSearchParams({
    language,
    append_to_response: 'credits,videos,watch/providers,content_ratings,images,external_ids',
  })

  const url = `${API_BASE_URL}/tv/${id}?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  return ShowDetailSchema.parse(data)
}

/**
 * Fetches detailed information about a person including cast credits and external IDs.
 * @param id - TMDB person ID
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated person detail response with appended credits and external IDs
 * @throws ProviderRequestError if the API request fails with an HTTP status
 */
export async function getPersonDetail(
  id: number,
  language: string,
): Promise<PersonDetailWithCredits> {
  const params = new URLSearchParams({
    language,
    append_to_response: 'combined_credits,external_ids',
  })

  const url = `${API_BASE_URL}/person/${id}?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  return PersonDetailWithCreditsSchema.parse(data)
}

/**
 * Fetches recommended movies based on a seed movie ID.
 * @param id - TMDB movie ID
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated search response with recommended movies
 * @throws Error if the API request fails
 */
export async function getMovieRecommendations(
  id: number,
  language: string,
): Promise<SearchResponse> {
  const params = new URLSearchParams({ language, page: '1' })
  const url = `${API_BASE_URL}/movie/${id}/recommendations?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  // Inject media_type for consistency with SearchResponse
  data.results = data.results.map((item: Record<string, unknown>) => ({
    ...item,
    media_type: 'movie',
  }))

  return SearchResponseSchema.parse(data)
}

/**
 * Fetches recommended TV shows based on a seed TV show ID.
 * @param id - TMDB TV show ID
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @returns Validated search response with recommended TV shows
 * @throws Error if the API request fails
 */
export async function getShowRecommendations(
  id: number,
  language: string,
): Promise<SearchResponse> {
  const params = new URLSearchParams({ language, page: '1' })
  const url = `${API_BASE_URL}/tv/${id}/recommendations?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  // Inject media_type for consistency with SearchResponse
  data.results = data.results.map((item: Record<string, unknown>) => ({
    ...item,
    media_type: 'tv',
  }))

  return SearchResponseSchema.parse(data)
}

/**
 * Schema for the upcoming movies response from TMDB.
 */
const UpcomingMoviesResponseSchema = createPaginatedResponseSchema(MovieListItemSchema)

/**
 * Fetches upcoming movies from TMDB.
 * @param language - ISO 639-1 language code (e.g., 'en')
 * @param region - ISO 3166-1 region code (e.g., 'US')
 * @param page - Page number to fetch
 * @returns Validated paginated response of upcoming movies
 * @throws Error if the API request fails
 */
export async function getUpcomingMovies(
  language: string,
  region: string,
  page: number,
): Promise<PaginatedResponse<MovieListItem>> {
  const params = new URLSearchParams({
    language,
    region,
    page: page.toString(),
  })

  const url = `${API_BASE_URL}/movie/upcoming?${params.toString()}`
  const response = await fetchWithRetry(url)
  const data = await response.json()

  return UpcomingMoviesResponseSchema.parse(data)
}
