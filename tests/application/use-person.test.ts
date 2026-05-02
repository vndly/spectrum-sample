import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { usePerson } from '@/application/use-person'
import { getPersonDetail } from '@/infrastructure/provider.client'

vi.mock('@/infrastructure/provider.client', () => ({
  getPersonDetail: vi.fn(),
}))

const language = ref('en')

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language,
  }),
}))

const mockGetPersonDetail = vi.mocked(getPersonDetail)

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
        id: 1,
        media_type: 'movie' as const,
        title: 'Older Movie',
        character: 'Role A',
        release_date: '1999-10-15',
        poster_path: '/older.jpg',
        order: 1,
      },
      {
        id: 2,
        media_type: 'tv' as const,
        name: 'Newest Show',
        character: 'Role B',
        first_air_date: '2024-02-01',
        poster_path: '/newest.jpg',
        order: 1,
      },
      {
        id: 1,
        media_type: 'movie' as const,
        title: 'Older Movie',
        character: 'Duplicate Better Billing',
        release_date: '1999-10-15',
        poster_path: '/older.jpg',
        order: 0,
      },
      {
        id: 3,
        media_type: 'movie' as const,
        title: 'Undated Movie',
        character: null,
        release_date: null,
        poster_path: null,
        order: null,
      },
    ],
  },
  external_ids: {
    imdb_id: 'nm0000093',
    instagram_id: 'bradpitt',
    twitter_id: null,
  },
}

async function flushPromises() {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('usePerson', () => {
  beforeEach(() => {
    language.value = 'en'
    mockGetPersonDetail.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('transitions from idle to loading to success with person page data', async () => {
    // Arrange
    let resolvePerson!: (value: typeof mockPersonDetail) => void
    mockGetPersonDetail.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePerson = resolve
      }),
    )

    // Act
    const { data, loading, error } = usePerson(287)
    await nextTick()

    // Assert
    expect(loading.value).toBe(true)
    expect(data.value).toBeNull()
    expect(error.value).toBeNull()

    // Act
    resolvePerson(mockPersonDetail)
    await flushPromises()

    // Assert
    expect(loading.value).toBe(false)
    expect(data.value?.id).toBe(287)
    expect(data.value?.name).toBe('Brad Pitt')
    expect(error.value).toBeNull()
  })

  it('transitions from idle to loading to error with error populated', async () => {
    // Arrange
    mockGetPersonDetail.mockRejectedValueOnce(new Error('Network error'))

    // Act
    const { data, loading, error } = usePerson(287)
    await flushPromises()

    // Assert
    expect(loading.value).toBe(false)
    expect(data.value).toBeNull()
    expect(error.value?.message).toBe('Network error')
  })

  it('exposes server errors for manual retry', async () => {
    // Arrange
    mockGetPersonDetail.mockRejectedValueOnce(new Error('API request failed: 500 Server Error'))

    // Act
    const { error } = usePerson(287)
    await flushPromises()

    // Assert
    expect(error.value?.message).toContain('500')
  })

  it('refresh re-fetches data after an error', async () => {
    // Arrange
    mockGetPersonDetail
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockPersonDetail)

    const { data, error, refresh } = usePerson(287)
    await flushPromises()
    expect(error.value).not.toBeNull()

    // Act
    refresh()
    await flushPromises()

    // Assert
    expect(mockGetPersonDetail).toHaveBeenCalledTimes(2)
    expect(error.value).toBeNull()
    expect(data.value?.name).toBe('Brad Pitt')
  })

  it('passes the current Settings.language to getPersonDetail', async () => {
    // Arrange
    language.value = 'fr'
    mockGetPersonDetail.mockResolvedValueOnce(mockPersonDetail)

    // Act
    usePerson(287)
    await flushPromises()

    // Assert
    expect(mockGetPersonDetail).toHaveBeenCalledWith(287, 'fr')
  })

  it('refetches the same person when Settings.language changes', async () => {
    // Arrange
    mockGetPersonDetail.mockResolvedValue(mockPersonDetail)
    usePerson(287)
    await flushPromises()

    // Act
    language.value = 'es'
    await flushPromises()

    // Assert
    expect(mockGetPersonDetail).toHaveBeenCalledWith(287, 'es')
  })

  it('deduplicates and sorts filmography before Presentation receives it', async () => {
    // Arrange
    mockGetPersonDetail.mockResolvedValueOnce(mockPersonDetail)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert
    expect(data.value?.filmography.map((credit) => credit.id)).toEqual([2, 1, 3])
    expect(data.value?.filmography[1].character).toBe('Duplicate Better Billing')
    expect(data.value?.filmography[2].releaseYear).toBeNull()
  })

  it('builds formatted dates, external links, profile URL, and poster URLs', async () => {
    // Arrange
    mockGetPersonDetail.mockResolvedValueOnce(mockPersonDetail)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert
    expect(data.value?.birthInfo).toContain('December')
    expect(data.value?.birthInfo).toContain('Shawnee, Oklahoma, USA')
    expect(data.value?.deathInfo).toBeNull()
    expect(data.value?.profileUrl).toContain('/w185/profile.jpg')
    expect(data.value?.externalLinks).toEqual([
      { type: 'imdb', url: 'https://www.imdb.com/name/nm0000093' },
      { type: 'instagram', url: 'https://www.instagram.com/bradpitt' },
    ])
    expect(data.value?.filmography[0].posterUrl).toContain('/w185/newest.jpg')
    expect(data.value?.filmography[0].route).toBe('/show/2')
    expect(data.value?.filmography[1].route).toBe('/movie/1')
  })

  it('refetches when the person ID ref changes', async () => {
    // Arrange
    const personId = ref(287)
    mockGetPersonDetail.mockResolvedValue(mockPersonDetail)
    usePerson(personId)
    await flushPromises()

    // Act
    personId.value = 288
    await flushPromises()

    // Assert
    expect(mockGetPersonDetail).toHaveBeenCalledTimes(2)
    expect(mockGetPersonDetail).toHaveBeenLastCalledWith(288, 'en')
  })
})
