import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getMovieGenres,
  getTvGenres,
  getTrending,
  getMovieRecommendations,
  getShowRecommendations,
} from '@/infrastructure/provider.client'

describe('provider.client (additional coverage)', () => {
  const mockFetch = vi.fn()
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = mockFetch
    mockFetch.mockReset()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('fetches and validates movie genres', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        genres: [{ id: 28, name: 'Action' }],
      }),
    })

    const result = await getMovieGenres('en')

    expect(new URL(mockFetch.mock.calls[0][0]).pathname).toBe('/3/genre/movie/list')
    expect(result.genres).toEqual([{ id: 28, name: 'Action' }])
  })

  it('fetches and validates TV genres', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        genres: [{ id: 18, name: 'Drama' }],
      }),
    })

    const result = await getTvGenres('fr')

    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/3/genre/tv/list')
    expect(url.searchParams.get('language')).toBe('fr')
    expect(result.genres[0].name).toBe('Drama')
  })

  it('logs and rethrows invalid trending payloads', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        page: 1,
        results: [{ foo: 'bar' }],
        total_pages: 1,
        total_results: 1,
      }),
    })

    await expect(getTrending('en')).rejects.toBeInstanceOf(Error)
    expect(consoleError).toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('fetches movie recommendations and injects media_type', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        page: 1,
        results: [
          {
            id: 10,
            title: 'Recommended Movie',
            original_title: 'Recommended Movie',
            overview: 'Overview',
            release_date: '2024-01-01',
            poster_path: '/poster.jpg',
            backdrop_path: '/backdrop.jpg',
            vote_average: 8,
            vote_count: 10,
            popularity: 10,
            genre_ids: [1],
            adult: false,
            original_language: 'en',
            video: false,
          },
        ],
        total_pages: 1,
        total_results: 1,
      }),
    })

    const result = await getMovieRecommendations(550, 'en')

    expect(new URL(mockFetch.mock.calls[0][0]).pathname).toBe('/3/movie/550/recommendations')
    expect(result.results[0].media_type).toBe('movie')
  })

  it('fetches show recommendations and injects media_type', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        page: 1,
        results: [
          {
            id: 20,
            name: 'Recommended Show',
            original_name: 'Recommended Show',
            overview: 'Overview',
            first_air_date: '2024-01-01',
            poster_path: '/poster.jpg',
            backdrop_path: '/backdrop.jpg',
            vote_average: 7,
            vote_count: 10,
            popularity: 10,
            genre_ids: [2],
            adult: false,
            original_language: 'en',
            origin_country: ['US'],
          },
        ],
        total_pages: 1,
        total_results: 1,
      }),
    })

    const result = await getShowRecommendations(1396, 'en')

    expect(new URL(mockFetch.mock.calls[0][0]).pathname).toBe('/3/tv/1396/recommendations')
    expect(result.results[0].media_type).toBe('tv')
  })
})
