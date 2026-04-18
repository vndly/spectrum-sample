import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useShowDetail } from '@/application/use-show-detail'
import * as providerClient from '@/infrastructure/provider.client'

vi.mock('@/infrastructure/provider.client', () => ({
  getShowDetail: vi.fn(),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language: { value: 'en' },
  }),
}))

describe('useShowDetail', () => {
  const mockGetShowDetail = vi.mocked(providerClient.getShowDetail)

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
      { id: 66633, name: 'Vince Gilligan', profile_path: '/vince.jpg', credit_id: 'abc' },
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
    content_ratings: { results: [{ iso_3166_1: 'US', rating: 'TV-MA' }] },
  }

  beforeEach(() => {
    mockGetShowDetail.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns data, loading, error, and refresh', () => {
    // Arrange
    mockGetShowDetail.mockResolvedValue(mockShowDetail)

    // Act
    const result = useShowDetail(1396)

    // Assert
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('loading')
    expect(result).toHaveProperty('error')
    expect(result).toHaveProperty('refresh')
  })

  it('transitions from loading to success', async () => {
    // Arrange
    let resolvePromise!: (value: typeof mockShowDetail) => void
    mockGetShowDetail.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve
      }),
    )

    // Act
    const { data, loading } = useShowDetail(1396)
    await nextTick()

    // Assert - should be loading
    expect(loading.value).toBe(true)
    expect(data.value).toBeNull()

    // Resolve the promise
    resolvePromise(mockShowDetail)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert - should be done loading with data
    expect(loading.value).toBe(false)
    expect(data.value).not.toBeNull()
    expect(data.value?.id).toBe(1396)
  })

  it('transitions from loading to error', async () => {
    // Arrange
    mockGetShowDetail.mockRejectedValue(new Error('Network error'))

    // Act
    const { data, loading, error } = useShowDetail(1396)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(loading.value).toBe(false)
    expect(data.value).toBeNull()
    expect(error.value).not.toBeNull()
    expect(error.value?.message).toBe('Network error')
  })

  it('data includes TV-specific fields', async () => {
    // Arrange
    mockGetShowDetail.mockResolvedValue(mockShowDetail)

    // Act
    const { data } = useShowDetail(1396)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert - TV-specific fields
    expect(data.value?.name).toBe('Breaking Bad')
    expect(data.value?.first_air_date).toBe('2008-01-20')
    expect(data.value?.last_air_date).toBe('2013-09-29')
    expect(data.value?.number_of_seasons).toBe(5)
    expect(data.value?.number_of_episodes).toBe(62)
    expect(data.value?.episode_run_time).toEqual([45, 47])
    expect(data.value?.created_by).toHaveLength(1)
    expect(data.value?.networks).toHaveLength(1)
    expect(data.value?.content_ratings.results).toHaveLength(1)
  })

  it('refresh re-fetches data', async () => {
    // Arrange
    mockGetShowDetail.mockResolvedValue(mockShowDetail)

    const { refresh } = useShowDetail(1396)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(mockGetShowDetail).toHaveBeenCalledTimes(1)

    // Act
    refresh()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(mockGetShowDetail).toHaveBeenCalledTimes(2)
  })

  it('passes language to API', async () => {
    // Arrange
    mockGetShowDetail.mockResolvedValue(mockShowDetail)

    // Act
    useShowDetail(1396)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(mockGetShowDetail).toHaveBeenCalledWith(1396, 'en')
  })

  it('sets error for 404 response', async () => {
    // Arrange
    mockGetShowDetail.mockRejectedValue(new Error('API request failed: 404 Not Found'))

    // Act
    const { error } = useShowDetail(999999999)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(error.value).not.toBeNull()
    expect(error.value?.message).toContain('404')
  })

  it('normalizes non-Error failures into a default show detail error', async () => {
    mockGetShowDetail.mockRejectedValue('boom')

    const { error } = useShowDetail(1396)
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(error.value?.message).toBe('Failed to fetch show details')
  })
})
