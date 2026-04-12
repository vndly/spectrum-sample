/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import MovieScreen from '@/presentation/views/movie-screen.vue'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '550' },
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock composables
const mockMovieData = ref<any>(null)
const mockLoading = ref(true)
const mockError = ref<any>(null)
const mockRefresh = vi.fn()

vi.mock('@/application/use-movie-detail', () => ({
  useMovieDetail: () => ({
    data: mockMovieData,
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
      'details.boxOffice.title': 'Box Office',
      'details.boxOffice.budget': 'Budget',
      'details.boxOffice.revenue': 'Revenue',
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
      'details.actions.imdb': 'View on IMDB',
    },
  },
})

describe('MovieScreen', () => {
  beforeEach(() => {
    mockMovieData.value = null
    mockLoading.value = true
    mockError.value = null
    mockRefresh.mockClear()
  })

  it('renders loading skeleton while loading', () => {
    // Arrange
    mockLoading.value = true

    // Act
    const wrapper = mount(MovieScreen, {
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
    const wrapper = mount(MovieScreen, {
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
    const wrapper = mount(MovieScreen, {
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

    const wrapper = mount(MovieScreen, {
      global: { plugins: [i18n] },
    })
    await flushPromises()

    // Act
    await wrapper.find('[data-testid="retry-button"]').trigger('click')

    // Assert
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('renders movie content when data is loaded', async () => {
    // Arrange
    mockLoading.value = false
    mockMovieData.value = {
      id: 550,
      title: 'Fight Club',
      original_title: 'Fight Club',
      overview: 'A ticking time bomb.',
      tagline: 'Mischief. Mayhem. Soap.',
      release_date: '1999-10-15',
      runtime: 139,
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.4,
      vote_count: 27000,
      popularity: 73.4,
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
        cast: [{ id: 1, name: 'Brad Pitt', character: 'Tyler', profile_path: null, order: 0 }],
        crew: [
          {
            id: 2,
            name: 'David Fincher',
            job: 'Director',
            department: 'Directing',
            profile_path: null,
          },
        ],
      },
      videos: { results: [] },
      'watch/providers': { results: {} },
      release_dates: { results: [] },
    }

    // Act
    const wrapper = mount(MovieScreen, {
      global: { plugins: [i18n] },
    })
    await flushPromises()

    // Assert
    expect(wrapper.find('[data-testid="title"]').text()).toBe('Fight Club')
    expect(wrapper.find('[data-testid="tagline"]').text()).toBe('Mischief. Mayhem. Soap.')
    expect(wrapper.find('[data-testid="metadata-panel"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="synopsis"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="box-office"]').exists()).toBe(true)
  })
})
