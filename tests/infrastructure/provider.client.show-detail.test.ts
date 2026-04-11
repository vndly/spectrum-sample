import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getShowDetail } from '@/infrastructure/provider.client'

describe('getShowDetail', () => {
  const mockFetch = vi.fn()
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = mockFetch
    mockFetch.mockReset()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  const mockShowDetail = {
    id: 1396,
    name: 'Breaking Bad',
    original_name: 'Breaking Bad',
    overview: 'A chemistry teacher diagnosed with inoperable lung cancer.',
    tagline: 'All Hail the King',
    first_air_date: '2008-01-20',
    last_air_date: '2013-09-29',
    number_of_seasons: 5,
    number_of_episodes: 62,
    episode_run_time: [45, 47],
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    vote_average: 8.9,
    vote_count: 12000,
    popularity: 400.5,
    status: 'Ended',
    homepage: null,
    adult: false,
    original_language: 'en',
    in_production: false,
    type: 'Scripted',
    genres: [{ id: 18, name: 'Drama' }],
    spoken_languages: [{ iso_639_1: 'en', name: 'English', english_name: 'English' }],
    production_companies: [],
    production_countries: [],
    origin_country: ['US'],
    networks: [{ id: 174, name: 'AMC', logo_path: '/amc.png', origin_country: 'US' }],
    created_by: [
      { id: 66633, name: 'Vince Gilligan', profile_path: '/vince.jpg', credit_id: 'abc123' },
    ],
    next_episode_to_air: null,
    credits: {
      cast: [
        {
          id: 17419,
          name: 'Bryan Cranston',
          character: 'Walter White',
          profile_path: '/bryan.jpg',
          order: 0,
        },
      ],
      crew: [
        {
          id: 66633,
          name: 'Vince Gilligan',
          job: 'Creator',
          department: 'Production',
          profile_path: '/vince.jpg',
        },
      ],
    },
    videos: {
      results: [
        {
          id: 'video123',
          key: 'HhesaQXLuRY',
          name: 'Official Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: true,
        },
      ],
    },
    'watch/providers': {
      results: {
        US: {
          link: 'https://tmdb.org/watch/US',
          flatrate: [{ provider_id: 8, provider_name: 'Netflix', logo_path: '/netflix.png' }],
        },
      },
    },
    content_ratings: {
      results: [{ iso_3166_1: 'US', rating: 'TV-MA' }],
    },
  }

  it('constructs correct URL with append_to_response parameter (ED-12-01)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockShowDetail),
    })

    // Act
    await getShowDetail(1396, 'en')

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/3/tv/1396')
    expect(url.searchParams.get('language')).toBe('en')
    expect(url.searchParams.get('append_to_response')).toBe(
      'credits,videos,watch/providers,content_ratings',
    )
  })

  it('returns validated ShowDetail response (ED-12-02)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockShowDetail),
    })

    // Act
    const result = await getShowDetail(1396, 'en')

    // Assert
    expect(result.id).toBe(1396)
    expect(result.name).toBe('Breaking Bad')
    expect(result.number_of_seasons).toBe(5)
    expect(result.number_of_episodes).toBe(62)
    expect(result.credits.cast).toHaveLength(1)
    expect(result.videos.results).toHaveLength(1)
    expect(result.content_ratings.results).toHaveLength(1)
  })

  it('throws NotFoundError on 404 response (ED-12-03)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    // Act & Assert
    await expect(getShowDetail(999999, 'en')).rejects.toThrow('API request failed: 404 Not Found')
  })

  it('throws error on network failure (ED-12-04)', async () => {
    // Arrange
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    // Act & Assert
    await expect(getShowDetail(1396, 'en')).rejects.toThrow('Network error')
  })

  it('retries on 429 rate limit response (ED-12-05)', async () => {
    // Arrange
    vi.useFakeTimers()

    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockShowDetail),
      })

    // Act
    const resultPromise = getShowDetail(1396, 'en')
    await vi.advanceTimersByTimeAsync(1000) // First retry delay
    const result = await resultPromise

    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result.id).toBe(1396)

    vi.useRealTimers()
  })

  it('includes Authorization header', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockShowDetail),
    })

    // Act
    await getShowDetail(1396, 'en')

    // Assert
    const options = mockFetch.mock.calls[0][1]
    expect(options.headers.Authorization).toMatch(/^Bearer .+/)
  })

  it('passes language parameter to API', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockShowDetail),
    })

    // Act
    await getShowDetail(1396, 'fr')

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.searchParams.get('language')).toBe('fr')
  })
})
