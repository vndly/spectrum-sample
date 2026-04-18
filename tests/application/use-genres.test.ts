import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as providerClient from '@/infrastructure/provider.client'

vi.mock('@/infrastructure/provider.client', () => ({
  getMovieGenres: vi.fn(),
  getTvGenres: vi.fn(),
}))

describe('useGenres', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  async function loadComposable() {
    return import('@/application/use-genres')
  }

  it('fetches, deduplicates, and sorts genres for a language', async () => {
    vi.mocked(providerClient.getMovieGenres).mockResolvedValue({
      genres: [
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
      ],
    })
    vi.mocked(providerClient.getTvGenres).mockResolvedValue({
      genres: [
        { id: 18, name: 'Drama' },
        { id: 28, name: 'Action' },
      ],
    })

    const { useGenres } = await loadComposable()
    const { genres, loading, error, fetchGenres } = useGenres()

    await fetchGenres('en')

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(genres.value).toEqual([
      { id: 28, name: 'Action' },
      { id: 35, name: 'Comedy' },
      { id: 18, name: 'Drama' },
    ])
    expect(providerClient.getMovieGenres).toHaveBeenCalledWith('en')
    expect(providerClient.getTvGenres).toHaveBeenCalledWith('en')
  })

  it('reuses the in-memory cache for the same language', async () => {
    vi.mocked(providerClient.getMovieGenres).mockResolvedValue({
      genres: [{ id: 28, name: 'Action' }],
    })
    vi.mocked(providerClient.getTvGenres).mockResolvedValue({
      genres: [{ id: 18, name: 'Drama' }],
    })

    const { useGenres } = await loadComposable()
    const { fetchGenres } = useGenres()

    await fetchGenres('en')
    await fetchGenres('en')

    expect(providerClient.getMovieGenres).toHaveBeenCalledTimes(1)
    expect(providerClient.getTvGenres).toHaveBeenCalledTimes(1)
  })

  it('refetches when the language changes', async () => {
    vi.mocked(providerClient.getMovieGenres)
      .mockResolvedValueOnce({ genres: [{ id: 28, name: 'Action' }] })
      .mockResolvedValueOnce({ genres: [{ id: 35, name: 'Comedie' }] })
    vi.mocked(providerClient.getTvGenres)
      .mockResolvedValueOnce({ genres: [{ id: 18, name: 'Drama' }] })
      .mockResolvedValueOnce({ genres: [{ id: 99, name: 'Documentaire' }] })

    const { useGenres } = await loadComposable()
    const { genres, fetchGenres } = useGenres()

    await fetchGenres('en')
    await fetchGenres('fr')

    expect(providerClient.getMovieGenres).toHaveBeenCalledTimes(2)
    expect(providerClient.getTvGenres).toHaveBeenCalledTimes(2)
    expect(genres.value).toEqual([
      { id: 35, name: 'Comedie' },
      { id: 99, name: 'Documentaire' },
    ])
  })

  it('stores thrown Error instances when fetching fails', async () => {
    vi.mocked(providerClient.getMovieGenres).mockRejectedValue(new Error('Movie genres failed'))

    const { useGenres } = await loadComposable()
    const { genres, loading, error, fetchGenres } = useGenres()

    await fetchGenres('en')

    expect(genres.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value?.message).toBe('Movie genres failed')
  })

  it('wraps non-Error failures in a fallback Error', async () => {
    vi.mocked(providerClient.getMovieGenres).mockRejectedValue('boom')

    const { useGenres } = await loadComposable()
    const { error, fetchGenres } = useGenres()

    await fetchGenres('en')

    expect(error.value?.message).toBe('Failed to fetch genres')
  })
})
