import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getMovieDetail } from '@/infrastructure/provider.client'

describe('getMovieDetail', () => {
  const mockFetch = vi.fn()
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = mockFetch
    mockFetch.mockReset()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  const mockMovieDetail = {
    id: 550,
    title: 'Fight Club',
    original_title: 'Fight Club',
    overview: 'A ticking-Loss time bomb of a movie.',
    tagline: 'Mischief. Mayhem. Soap.',
    release_date: '1999-10-15',
    runtime: 139,
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    vote_average: 8.433,
    vote_count: 27000,
    popularity: 73.433,
    imdb_id: 'tt0137523',
    budget: 63000000,
    revenue: 100853753,
    status: 'Released',
    homepage: null,
    adult: false,
    original_language: 'en',
    video: false,
    genres: [{ id: 18, name: 'Drama' }],
    spoken_languages: [{ iso_639_1: 'en', name: 'English', english_name: 'English' }],
    production_companies: [],
    production_countries: [],
    belongs_to_collection: null,
    credits: {
      cast: [
        {
          id: 819,
          name: 'Edward Norton',
          character: 'The Narrator',
          profile_path: '/profile.jpg',
          order: 0,
        },
      ],
      crew: [
        {
          id: 7467,
          name: 'David Fincher',
          job: 'Director',
          department: 'Directing',
          profile_path: '/crew.jpg',
        },
      ],
    },
    videos: {
      results: [
        {
          id: 'abc123',
          key: 'SUXWAEX2jlg',
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
    release_dates: {
      results: [
        {
          iso_3166_1: 'US',
          release_dates: [
            { certification: 'R', iso_639_1: 'en', release_date: '1999-10-15', type: 3 },
          ],
        },
      ],
    },
  }

  it('constructs correct URL with append_to_response parameter (ED-12-01)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMovieDetail),
    })

    // Act
    await getMovieDetail(550, 'en')

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/3/movie/550')
    expect(url.searchParams.get('language')).toBe('en')
    expect(url.searchParams.get('append_to_response')).toBe(
      'credits,videos,watch/providers,release_dates',
    )
  })

  it('returns validated MovieDetail response (ED-12-02)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMovieDetail),
    })

    // Act
    const result = await getMovieDetail(550, 'en')

    // Assert
    expect(result.id).toBe(550)
    expect(result.title).toBe('Fight Club')
    expect(result.credits.cast).toHaveLength(1)
    expect(result.credits.crew).toHaveLength(1)
    expect(result.videos.results).toHaveLength(1)
    expect(result['watch/providers'].results.US.flatrate).toHaveLength(1)
  })

  it('throws NotFoundError on 404 response (ED-12-03)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    // Act & Assert
    await expect(getMovieDetail(999999, 'en')).rejects.toThrow('API request failed: 404 Not Found')
  })

  it('throws error on network failure (ED-12-04)', async () => {
    // Arrange
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    // Act & Assert
    await expect(getMovieDetail(550, 'en')).rejects.toThrow('Network error')
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
        json: () => Promise.resolve(mockMovieDetail),
      })

    // Act
    const resultPromise = getMovieDetail(550, 'en')
    await vi.advanceTimersByTimeAsync(1000) // First retry delay
    const result = await resultPromise

    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result.id).toBe(550)

    vi.useRealTimers()
  })

  it('includes Authorization header', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMovieDetail),
    })

    // Act
    await getMovieDetail(550, 'en')

    // Assert
    const options = mockFetch.mock.calls[0][1]
    expect(options.headers.Authorization).toMatch(/^Bearer .+/)
  })

  it('passes language parameter to API', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMovieDetail),
    })

    // Act
    await getMovieDetail(550, 'es')

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.searchParams.get('language')).toBe('es')
  })
})
