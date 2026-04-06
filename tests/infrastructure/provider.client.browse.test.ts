import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as providerClient from '@/infrastructure/provider.client'

// Mock fetch
const globalFetch = vi.fn()
vi.stubGlobal('fetch', globalFetch)

describe('provider.client (browse)', () => {
  const mockResponse = (data: any) => ({
    ok: true,
    status: 200,
    json: async () => data,
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock environment variable
    vi.stubEnv('VITE_MEDIA_PROVIDER_TOKEN', 'mock-token')
  })

  it('getTrending fetches trending items and parses correctly', async () => {
    const mockData = {
      page: 1,
      results: [
        {
          id: 1,
          media_type: 'movie',
          title: 'Trending Movie',
          original_title: 'Trending Movie',
          overview: 'Overview',
          release_date: '2024-01-01',
          poster_path: '/poster.jpg',
          backdrop_path: '/backdrop.jpg',
          vote_average: 8.0,
          vote_count: 100,
          popularity: 100,
          genre_ids: [1],
          adult: false,
          original_language: 'en',
          video: false,
        },
      ],
      total_pages: 1,
      total_results: 1,
    }
    globalFetch.mockResolvedValue(mockResponse(mockData))

    const result = await providerClient.getTrending('en')

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining('/trending/all/day?language=en'),
      expect.any(Object),
    )
    expect(result.results[0].id).toBe(1)
  })

  it('getPopularMovies fetches and injects media_type', async () => {
    const mockData = {
      page: 1,
      results: [
        {
          id: 10,
          title: 'Popular Movie',
          original_title: 'Popular Movie',
          overview: 'Overview',
          release_date: '2024-01-01',
          poster_path: '/poster.jpg',
          backdrop_path: '/backdrop.jpg',
          vote_average: 8.0,
          vote_count: 100,
          popularity: 100,
          genre_ids: [1],
          adult: false,
          original_language: 'en',
          video: false,
        },
      ],
      total_pages: 1,
      total_results: 1,
    }
    globalFetch.mockResolvedValue(mockResponse(mockData))

    const result = await providerClient.getPopularMovies('en')

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining('/movie/popular?language=en'),
      expect.any(Object),
    )
    expect(result.results[0].media_type).toBe('movie')
  })

  it('getPopularShows fetches and injects media_type', async () => {
    const mockData = {
      page: 1,
      results: [
        {
          id: 20,
          name: 'Popular Show',
          original_name: 'Popular Show',
          overview: 'Overview',
          first_air_date: '2024-01-01',
          poster_path: '/poster.jpg',
          backdrop_path: '/backdrop.jpg',
          vote_average: 7.0,
          vote_count: 100,
          popularity: 100,
          genre_ids: [2],
          adult: false,
          original_language: 'en',
          origin_country: ['US'],
        },
      ],
      total_pages: 1,
      total_results: 1,
    }
    globalFetch.mockResolvedValue(mockResponse(mockData))

    const result = await providerClient.getPopularShows('en')

    expect(globalFetch).toHaveBeenCalledWith(
      expect.stringContaining('/tv/popular?language=en'),
      expect.any(Object),
    )
    expect(result.results[0].media_type).toBe('tv')
  })
})
