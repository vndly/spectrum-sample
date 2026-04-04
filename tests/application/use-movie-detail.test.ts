import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useMovieDetail } from '@/application/use-movie-detail'
import * as providerClient from '@/infrastructure/provider.client'

vi.mock('@/infrastructure/provider.client', () => ({
  getMovieDetail: vi.fn(),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language: { value: 'en' },
  }),
}))

describe('useMovieDetail', () => {
  const mockGetMovieDetail = vi.mocked(providerClient.getMovieDetail)

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
          id: 'abc',
          key: 'trailer',
          name: 'Trailer',
          site: 'YouTube',
          type: 'Trailer',
          official: true,
        },
      ],
    },
    'watch/providers': { results: {} },
    release_dates: { results: [] },
  }

  beforeEach(() => {
    mockGetMovieDetail.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns data, loading, error, and refresh (ED-11-01)', () => {
    // Arrange
    mockGetMovieDetail.mockResolvedValue(mockMovieDetail)

    // Act
    const result = useMovieDetail(550)

    // Assert
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('loading')
    expect(result).toHaveProperty('error')
    expect(result).toHaveProperty('refresh')
  })

  it('transitions from idle to loading to success (ED-11-02)', async () => {
    // Arrange
    let resolvePromise: (value: typeof mockMovieDetail) => void
    mockGetMovieDetail.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve
      }),
    )

    // Act
    const { data, loading } = useMovieDetail(550)
    await nextTick()

    // Assert - should be loading
    expect(loading.value).toBe(true)
    expect(data.value).toBeNull()

    // Resolve the promise
    resolvePromise(mockMovieDetail)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert - should be done loading with data
    expect(loading.value).toBe(false)
    expect(data.value).not.toBeNull()
    expect(data.value?.id).toBe(550)
  })

  it('transitions from idle to loading to error (ED-11-03)', async () => {
    // Arrange
    mockGetMovieDetail.mockRejectedValue(new Error('Network error'))

    // Act
    const { data, loading, error } = useMovieDetail(550)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(loading.value).toBe(false)
    expect(data.value).toBeNull()
    expect(error.value).not.toBeNull()
    expect(error.value?.message).toBe('Network error')
  })

  it('sets error for 404 response (ED-12-03)', async () => {
    // Arrange
    mockGetMovieDetail.mockRejectedValue(new Error('API request failed: 404 Not Found'))

    // Act
    const { error } = useMovieDetail(999999999)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(error.value).not.toBeNull()
    expect(error.value?.message).toContain('404')
  })

  it('sets error for network failure (ED-12-04)', async () => {
    // Arrange
    mockGetMovieDetail.mockRejectedValue(new Error('Network error'))

    // Act
    const { error } = useMovieDetail(550)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(error.value).not.toBeNull()
    expect(error.value?.message).toBe('Network error')
  })

  it('refresh re-fetches data (ED-12-05)', async () => {
    // Arrange
    mockGetMovieDetail.mockResolvedValue(mockMovieDetail)

    const { refresh } = useMovieDetail(550)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockGetMovieDetail).toHaveBeenCalledTimes(1)

    // Act
    refresh()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(mockGetMovieDetail).toHaveBeenCalledTimes(2)
  })

  it('data includes all expected MovieDetail fields (ED-02-01)', async () => {
    // Arrange
    mockGetMovieDetail.mockResolvedValue(mockMovieDetail)

    // Act
    const { data } = useMovieDetail(550)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(data.value?.id).toBe(550)
    expect(data.value?.title).toBe('Fight Club')
    expect(data.value?.overview).toBe('A ticking-Loss time bomb of a movie.')
    expect(data.value?.tagline).toBe('Mischief. Mayhem. Soap.')
    expect(data.value?.release_date).toBe('1999-10-15')
    expect(data.value?.runtime).toBe(139)
    expect(data.value?.vote_average).toBe(8.433)
    expect(data.value?.imdb_id).toBe('tt0137523')
    expect(data.value?.budget).toBe(63000000)
    expect(data.value?.revenue).toBe(100853753)
    expect(data.value?.genres).toHaveLength(1)
    expect(data.value?.credits.cast).toHaveLength(1)
    expect(data.value?.credits.crew).toHaveLength(1)
    expect(data.value?.videos.results).toHaveLength(1)
  })

  it('passes language to API', async () => {
    // Arrange
    mockGetMovieDetail.mockResolvedValue(mockMovieDetail)

    // Act
    useMovieDetail(550)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(mockGetMovieDetail).toHaveBeenCalledWith(550, 'en')
  })

  it('clears error on successful refresh after failure', async () => {
    // Arrange
    mockGetMovieDetail
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockMovieDetail)

    const { error, refresh } = useMovieDetail(550)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(error.value).not.toBeNull()

    // Act
    refresh()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(error.value).toBeNull()
  })
})
