import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getPersonDetail } from '@/infrastructure/provider.client'

describe('getPersonDetail', () => {
  const mockFetch = vi.fn()
  const originalFetch = global.fetch

  const mockPersonDetail = {
    id: 287,
    name: 'Brad Pitt',
    biography: 'An actor and producer.',
    birthday: '1963-12-18',
    deathday: null,
    place_of_birth: 'Shawnee, Oklahoma, USA',
    profile_path: '/profile.jpg',
    known_for_department: 'Acting',
    also_known_as: ['William Bradley Pitt'],
    homepage: null,
    combined_credits: {
      cast: [
        {
          id: 550,
          media_type: 'movie',
          title: 'Fight Club',
          character: 'Tyler Durden',
          release_date: '1999-10-15',
          poster_path: '/fight-club.jpg',
          order: 1,
        },
      ],
      crew: [],
    },
    external_ids: {
      imdb_id: 'nm0000093',
      instagram_id: 'bradpitt',
      twitter_id: null,
    },
  }

  beforeEach(() => {
    global.fetch = mockFetch
    mockFetch.mockReset()
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.useRealTimers()
  })

  it('passes language and appended person responses to the API', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPersonDetail,
    })

    // Act
    await getPersonDetail(287, 'es')

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/3/person/287')
    expect(url.searchParams.get('language')).toBe('es')
    expect(url.searchParams.get('append_to_response')).toBe('combined_credits,external_ids')
  })

  it('returns a response parsed through PersonDetailWithCreditsSchema', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPersonDetail,
    })

    // Act
    const result = await getPersonDetail(287, 'en')

    // Assert
    expect(result.id).toBe(287)
    expect(result.name).toBe('Brad Pitt')
    expect(result.profile_path).toBe('/profile.jpg')
    expect(result.known_for_department).toBe('Acting')
    expect(result.combined_credits.cast[0]).toMatchObject({
      media_type: 'movie',
      title: 'Fight Club',
    })
  })

  it('preserves 404 status information for inline not-found handling', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    // Act & Assert
    await expect(getPersonDetail(999999, 'en')).rejects.toMatchObject({
      message: expect.stringContaining('404 Not Found'),
      status: 404,
    })
  })

  it('retries 429 responses with exponential backoff', async () => {
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
        json: async () => mockPersonDetail,
      })

    // Act
    const resultPromise = getPersonDetail(287, 'en')
    await vi.advanceTimersByTimeAsync(1000)
    const result = await resultPromise

    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result.id).toBe(287)
  })

  it('surfaces network errors with a stable network message and without automatic retry', async () => {
    // Arrange
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    // Act & Assert
    await expect(getPersonDetail(287, 'en')).rejects.toThrow('Network error: Failed to fetch')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('surfaces 500+ server errors without automatic retry', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    // Act & Assert
    await expect(getPersonDetail(287, 'en')).rejects.toMatchObject({
      message: expect.stringContaining('500 Internal Server Error'),
      status: 500,
    })
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('rejects invalid person payloads', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockPersonDetail, id: 'invalid' }),
    })

    // Act & Assert
    await expect(getPersonDetail(287, 'en')).rejects.toBeInstanceOf(Error)
  })
})
