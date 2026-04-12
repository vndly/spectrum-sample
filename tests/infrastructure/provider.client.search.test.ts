/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { searchMulti } from '@/infrastructure/provider.client'

describe('searchMulti', () => {
  const mockFetch = vi.fn()
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = mockFetch
    mockFetch.mockReset()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  const mockSearchResponse = {
    page: 1,
    results: [
      {
        id: 550,
        title: 'Fight Club',
        original_title: 'Fight Club',
        overview: 'A movie.',
        release_date: '1999-10-15',
        poster_path: '/path.jpg',
        backdrop_path: '/backdrop.jpg',
        vote_average: 8.4,
        vote_count: 27000,
        popularity: 73.4,
        genre_ids: [18],
        adult: false,
        original_language: 'en',
        video: false,
        media_type: 'movie',
      },
    ],
    total_pages: 1,
    total_results: 1,
  }

  it('constructs correct URL with trimmed query parameter (HS-02-01)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    // Act
    await searchMulti('  Fight Club  ', 'en')

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.searchParams.get('query')).toBe('Fight Club')
  })

  it('includes language parameter in URL (HS-02-02)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    // Act
    await searchMulti('test', 'es')

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.searchParams.get('language')).toBe('es')
  })

  it('uses page 1 in URL (HS-02-03)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    // Act
    await searchMulti('test', 'en')

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.searchParams.get('page')).toBe('1')
  })

  it('excludes adult content in URL (HS-02-04)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    // Act
    await searchMulti('test', 'en')

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.searchParams.get('include_adult')).toBe('false')
  })

  it('rejects empty query after trim (HS-02-05)', async () => {
    // Act & Assert
    await expect(searchMulti('   ', 'en')).rejects.toThrow('Search query cannot be empty')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('includes all required parameters in URL (HS-02-06)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    // Act
    await searchMulti('inception', 'fr')

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/3/search/multi')
    expect(url.searchParams.get('query')).toBe('inception')
    expect(url.searchParams.get('language')).toBe('fr')
    expect(url.searchParams.get('page')).toBe('1')
    expect(url.searchParams.get('include_adult')).toBe('false')
  })

  it('returns validated response', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    // Act
    const result = await searchMulti('Fight Club', 'en')

    // Assert
    expect(result.page).toBe(1)
    expect(result.results).toHaveLength(1)
    expect(result.results[0].id).toBe(550)
  })

  it('throws error on API failure (5xx)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    // Act & Assert
    await expect(searchMulti('test', 'en')).rejects.toThrow(
      'API request failed: 500 Internal Server Error',
    )
  })

  it('throws error on network failure', async () => {
    // Arrange
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    // Act & Assert
    await expect(searchMulti('test', 'en')).rejects.toThrow('Network error')
  })

  it('retries on 429 with exponential backoff (HS-08-06)', async () => {
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
        json: () => Promise.resolve(mockSearchResponse),
      })

    // Act
    const resultPromise = searchMulti('test', 'en')
    await vi.advanceTimersByTimeAsync(1000) // First retry delay
    const result = await resultPromise

    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result.page).toBe(1)

    vi.useRealTimers()
  })

  it('throws error after max retries on 429 (HS-08-07)', async () => {
    // Arrange
    vi.useFakeTimers()

    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    })

    // Act - wrap in try/catch to avoid unhandled rejection warning
    let error: Error | null = null
    const resultPromise = searchMulti('test', 'en').catch((e) => {
      error = e
    })

    // Advance through all retry delays (1s + 2s + 4s = 7s total)
    await vi.advanceTimersByTimeAsync(1000) // First retry
    await vi.advanceTimersByTimeAsync(2000) // Second retry
    await vi.advanceTimersByTimeAsync(4000) // Third retry

    await resultPromise

    // Assert
    expect(error).not.toBeNull()
    expect((error as any)?.message).toContain('API request failed: 429 Too Many Requests')
    expect(mockFetch).toHaveBeenCalledTimes(4) // Initial + 3 retries

    vi.useRealTimers()
  })

  it('includes Authorization header', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse),
    })

    // Act
    await searchMulti('test', 'en')

    // Assert
    const options = mockFetch.mock.calls[0][1]
    expect(options.headers.Authorization).toMatch(/^Bearer .+/)
  })
})
