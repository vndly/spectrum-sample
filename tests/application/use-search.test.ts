/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useSearch } from '@/application/use-search'
import * as providerClient from '@/infrastructure/provider.client'

vi.mock('@/infrastructure/provider.client', () => ({
  searchMulti: vi.fn(),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language: { value: 'en' },
  }),
}))

describe('useSearch', () => {
  const mockSearchMulti = vi.mocked(providerClient.searchMulti)

  const mockMovieResult = {
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
    media_type: 'movie' as const,
  }

  const mockTvResult = {
    id: 1396,
    name: 'Breaking Bad',
    original_name: 'Breaking Bad',
    overview: 'A show.',
    first_air_date: '2008-01-20',
    poster_path: '/path2.jpg',
    backdrop_path: '/backdrop2.jpg',
    vote_average: 8.9,
    vote_count: 12000,
    popularity: 400.5,
    genre_ids: [18],
    adult: false,
    original_language: 'en',
    origin_country: ['US'],
    media_type: 'tv' as const,
  }

  const mockPersonResult = {
    id: 287,
    name: 'Brad Pitt',
    media_type: 'person' as const,
  }

  beforeEach(() => {
    vi.useFakeTimers()
    mockSearchMulti.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('debounce behavior', () => {
    it('triggers single API call after debounce for rapid inputs (HS-01-02)', async () => {
      // Arrange
      mockSearchMulti.mockResolvedValue({
        page: 1,
        results: [mockMovieResult],
        total_pages: 1,
        total_results: 1,
      })

      const { query } = useSearch()

      // Act - rapid inputs
      query.value = 'f'
      await nextTick()
      query.value = 'fi'
      await nextTick()
      query.value = 'fig'
      await nextTick()
      query.value = 'figh'
      await nextTick()
      query.value = 'fight'
      await nextTick()

      // Advance past debounce
      await vi.advanceTimersByTimeAsync(300)

      // Assert
      expect(mockSearchMulti).toHaveBeenCalledTimes(1)
      expect(mockSearchMulti).toHaveBeenCalledWith('fight', 'en')
    })

    it('resets debounce timer on continued typing (HS-01-03)', async () => {
      // Arrange
      mockSearchMulti.mockResolvedValue({
        page: 1,
        results: [mockMovieResult],
        total_pages: 1,
        total_results: 1,
      })

      const { query } = useSearch()

      // Act - type, wait 200ms, type again
      query.value = 'test'
      await nextTick()
      await vi.advanceTimersByTimeAsync(200)

      query.value = 'testing'
      await nextTick()
      await vi.advanceTimersByTimeAsync(200)

      // Should not have been called yet
      expect(mockSearchMulti).not.toHaveBeenCalled()

      // Now advance past the full debounce
      await vi.advanceTimersByTimeAsync(100)

      // Assert
      expect(mockSearchMulti).toHaveBeenCalledTimes(1)
      expect(mockSearchMulti).toHaveBeenCalledWith('testing', 'en')
    })

    it('does not call API before debounce completes (HS-01-04)', async () => {
      // Arrange
      const { query } = useSearch()

      // Act
      query.value = 'test'
      await nextTick()
      await vi.advanceTimersByTimeAsync(299) // Just before debounce

      // Assert
      expect(mockSearchMulti).not.toHaveBeenCalled()
    })

    it('cancels pending request when input is cleared (HS-01-05)', async () => {
      // Arrange
      const { query } = useSearch()

      // Act - type then clear
      query.value = 'test'
      await nextTick()
      await vi.advanceTimersByTimeAsync(100)

      query.value = ''
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)

      // Assert
      expect(mockSearchMulti).not.toHaveBeenCalled()
    })
  })

  describe('result filtering', () => {
    it('returns movie results (HS-03-01)', async () => {
      // Arrange
      mockSearchMulti.mockResolvedValue({
        page: 1,
        results: [mockMovieResult],
        total_pages: 1,
        total_results: 1,
      })

      const { query, results } = useSearch()

      // Act
      query.value = 'fight'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      // Assert
      expect(results.value).toHaveLength(1)
      expect(results.value[0].id).toBe(550)
    })

    it('returns TV show results (HS-03-02)', async () => {
      // Arrange
      mockSearchMulti.mockResolvedValue({
        page: 1,
        results: [mockTvResult],
        total_pages: 1,
        total_results: 1,
      })

      const { query, results } = useSearch()

      // Act
      query.value = 'breaking'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      // Assert
      expect(results.value).toHaveLength(1)
      expect(results.value[0].id).toBe(1396)
    })

    it('filters out person results (HS-03-03, HS-03-05)', async () => {
      // Arrange
      mockSearchMulti.mockResolvedValue({
        page: 1,
        results: [mockMovieResult, mockPersonResult, mockTvResult],
        total_pages: 1,
        total_results: 3,
      })

      const { query, results } = useSearch()

      // Act
      query.value = 'brad'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      // Assert
      expect(results.value).toHaveLength(2)
      expect(results.value.every((r: any) => r.media_type !== 'person')).toBe(true)
    })

    it('returns empty array when all results are persons (HS-03-04)', async () => {
      // Arrange
      mockSearchMulti.mockResolvedValue({
        page: 1,
        results: [mockPersonResult],
        total_pages: 1,
        total_results: 1,
      })

      const { query, results } = useSearch()

      // Act
      query.value = 'brad pitt'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      // Assert
      expect(results.value).toHaveLength(0)
    })
  })

  describe('loading state', () => {
    it('transitions from idle to loading to success (HS-07-01, HS-07-06)', async () => {
      // Arrange
      let resolvePromise: (value: any) => void
      mockSearchMulti.mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve
        }),
      )

      const { query, loading, results } = useSearch()

      // Assert - initially idle
      expect(loading.value).toBe(false)

      // Act - type to trigger search
      query.value = 'test'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)

      // Assert - should be loading
      expect(loading.value).toBe(true)

      // Resolve the promise
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      resolvePromise!({
        page: 1,
        results: [mockMovieResult],
        total_pages: 1,
        total_results: 1,
      })
      await vi.runAllTimersAsync()

      // Assert - should be done loading with results
      expect(loading.value).toBe(false)
      expect(results.value).toHaveLength(1)
    })
  })

  describe('error handling', () => {
    it('sets error ref on API failure (HS-08-01)', async () => {
      // Arrange
      mockSearchMulti.mockRejectedValue(new Error('Network error'))

      const { query, error } = useSearch()

      // Act
      query.value = 'test'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      // Assert
      expect(error.value).not.toBeNull()
      expect(error.value?.message).toBe('Network error')
    })

    it('retry triggers new API call with current query (HS-08-03)', async () => {
      // Arrange
      mockSearchMulti.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        page: 1,
        results: [mockMovieResult],
        total_pages: 1,
        total_results: 1,
      })

      const { query, retry } = useSearch()

      // Trigger initial failed search
      query.value = 'test'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      // Act - retry
      retry()
      await vi.runAllTimersAsync()

      // Assert
      expect(mockSearchMulti).toHaveBeenCalledTimes(2)
      expect(mockSearchMulti).toHaveBeenLastCalledWith('test', 'en')
    })

    it('successful retry replaces error with results (HS-08-04)', async () => {
      // Arrange
      mockSearchMulti.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        page: 1,
        results: [mockMovieResult],
        total_pages: 1,
        total_results: 1,
      })

      const { query, error, results, retry } = useSearch()

      // Trigger initial failed search
      query.value = 'test'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      expect(error.value).not.toBeNull()

      // Act - retry
      retry()
      await vi.runAllTimersAsync()

      // Assert
      expect(error.value).toBeNull()
      expect(results.value).toHaveLength(1)
    })

    it('new search clears previous error (HS-08-08)', async () => {
      // Arrange
      mockSearchMulti.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
        page: 1,
        results: [mockMovieResult],
        total_pages: 1,
        total_results: 1,
      })

      const { query, error } = useSearch()

      // Trigger initial failed search
      query.value = 'bad'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      expect(error.value).not.toBeNull()

      // Act - new search
      query.value = 'good'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      // Assert
      expect(error.value).toBeNull()
    })
  })

  describe('clear functionality', () => {
    it('clears query, results, and error (HS-11-01, HS-11-06)', async () => {
      // Arrange
      mockSearchMulti.mockResolvedValue({
        page: 1,
        results: [mockMovieResult],
        total_pages: 1,
        total_results: 1,
      })

      const { query, results, clear } = useSearch()

      // Trigger a search
      query.value = 'test'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      expect(results.value).toHaveLength(1)

      // Act
      clear()

      // Assert
      expect(query.value).toBe('')
      expect(results.value).toHaveLength(0)
    })
  })

  describe('empty results', () => {
    it('results array is empty when API returns no matches (HS-06-01)', async () => {
      // Arrange
      mockSearchMulti.mockResolvedValue({
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      })

      const { query, results, loading } = useSearch()

      // Act
      query.value = 'xyznonexistent'
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await vi.runAllTimersAsync()

      // Assert
      expect(loading.value).toBe(false)
      expect(results.value).toHaveLength(0)
    })
  })

  describe('mode state', () => {
    it('isSearchMode is false initially (HS-09-01, HS-09-03)', () => {
      // Arrange & Act
      const { isSearchMode } = useSearch()

      // Assert
      expect(isSearchMode.value).toBe(false)
    })

    it('isSearchMode is true when query has content (HS-10-01, HS-10-02)', async () => {
      // Arrange
      const { query, isSearchMode } = useSearch()

      // Act
      query.value = 'a'
      await nextTick()

      // Assert
      expect(isSearchMode.value).toBe(true)
    })

    it('isSearchMode is false for whitespace-only query', async () => {
      // Arrange
      const { query, isSearchMode } = useSearch()

      // Act
      query.value = '   '
      await nextTick()

      // Assert
      expect(isSearchMode.value).toBe(false)
    })
  })
})
