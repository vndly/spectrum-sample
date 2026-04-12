/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import ShowScreen from '@/presentation/views/show-screen.vue'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1396' },
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock composables
const mockShowData = ref<any>(null)
const mockLoading = ref(true)
const mockError = ref<any>(null)
const mockRefresh = vi.fn()

vi.mock('@/application/use-show-detail', () => ({
  useShowDetail: () => ({
    data: mockShowData,
    loading: mockLoading,
    error: mockError,
    refresh: mockRefresh,
  }),
}))

vi.mock('@/application/use-library-entry', () => ({
  useLibraryEntry: () => ({
    entry: ref(null),
    setRating: vi.fn(),
    toggleFavorite: vi.fn(),
    setStatus: vi.fn(),
  }),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    preferredRegion: ref('US'),
  }),
}))

vi.mock('@/presentation/composables/use-toast', () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'details.error.title': 'Something went wrong',
      'details.error.retry': 'Retry',
      'details.notFound.title': 'Not found',
      'details.notFound.message': "This title doesn't exist or has been removed.",
      'details.notFound.home': 'Back to Home',
      'details.share.copied': 'Link copied to clipboard',
      'details.streaming.notAvailable': 'Not available for streaming',
      'details.trailer.title': 'Trailer',
      'details.trailer.play': 'Play trailer',
      'details.cast.title': 'Cast',
      'details.metadata.director': 'Director',
      'details.metadata.directors': 'Directors',
      'details.metadata.writer': 'Writer',
      'details.metadata.writers': 'Writers',
      'details.metadata.seasons': 'Seasons',
      'details.metadata.episodes': 'Episodes',
      'details.actions.favorite': 'Add to favorites',
      'details.actions.unfavorite': 'Remove from favorites',
      'details.actions.watchlist': 'Add to watchlist',
      'details.actions.watched': 'Mark as watched',
      'details.actions.share': 'Share',
    },
  },
})

describe('ShowScreen', () => {
  beforeEach(() => {
    mockShowData.value = null
    mockLoading.value = true
    mockError.value = null
    mockRefresh.mockClear()
  })

  it('renders loading skeleton while loading', () => {
    // Arrange
    mockLoading.value = true

    // Act
    const wrapper = mount(ShowScreen, {
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="detail-skeleton"]').exists()).toBe(true)
  })

  it('renders error state on API failure', async () => {
    // Arrange
    mockLoading.value = false
    mockError.value = new Error('Network error')

    // Act
    const wrapper = mount(ShowScreen, {
      global: { plugins: [i18n] },
    })
    await flushPromises()

    // Assert
    expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="retry-button"]').exists()).toBe(true)
  })

  it('renders not found state on 404', async () => {
    // Arrange
    mockLoading.value = false
    mockError.value = new Error('API request failed: 404 Not Found')

    // Act
    const wrapper = mount(ShowScreen, {
      global: { plugins: [i18n] },
    })
    await flushPromises()

    // Assert
    expect(wrapper.find('[data-testid="not-found"]').exists()).toBe(true)
  })

  it('calls refresh when retry button is clicked', async () => {
    // Arrange
    mockLoading.value = false
    mockError.value = new Error('Network error')

    const wrapper = mount(ShowScreen, {
      global: { plugins: [i18n] },
    })
    await flushPromises()

    // Act
    await wrapper.find('[data-testid="retry-button"]').trigger('click')

    // Assert
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('renders show content when data is loaded', async () => {
    // Arrange
    mockLoading.value = false
    mockShowData.value = {
      id: 1396,
      name: 'Breaking Bad',
      original_name: 'Breaking Bad',
      overview: 'A high school chemistry teacher turned meth producer.',
      tagline: 'Remember my name.',
      first_air_date: '2008-01-20',
      last_air_date: '2013-09-29',
      episode_run_time: [45],
      number_of_seasons: 5,
      number_of_episodes: 62,
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      vote_average: 9.5,
      vote_count: 12000,
      popularity: 500.3,
      status: 'Ended',
      type: 'Scripted',
      in_production: false,
      homepage: null,
      adult: false,
      original_language: 'en',
      origin_country: ['US'],
      languages: ['en'],
      genres: [{ id: 18, name: 'Drama' }],
      spoken_languages: [{ iso_639_1: 'en', name: 'English', english_name: 'English' }],
      production_companies: [],
      production_countries: [],
      networks: [],
      created_by: [{ id: 66633, name: 'Vince Gilligan', profile_path: null, credit_id: 'abc123' }],
      next_episode_to_air: null,
      credits: {
        cast: [
          {
            id: 17419,
            name: 'Bryan Cranston',
            character: 'Walter White',
            profile_path: null,
            order: 0,
          },
        ],
        crew: [
          {
            id: 66633,
            name: 'Vince Gilligan',
            job: 'Creator',
            department: 'Production',
            profile_path: null,
          },
        ],
      },
      videos: { results: [] },
      'watch/providers': { results: {} },
      content_ratings: { results: [] },
    }

    // Act
    const wrapper = mount(ShowScreen, {
      global: { plugins: [i18n] },
    })
    await flushPromises()

    // Assert
    expect(wrapper.find('[data-testid="title"]').text()).toBe('Breaking Bad')
    expect(wrapper.find('[data-testid="tagline"]').text()).toBe('Remember my name.')
    expect(wrapper.find('[data-testid="metadata-panel"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="synopsis"]').exists()).toBe(true)
  })
})
