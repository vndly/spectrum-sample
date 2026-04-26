/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import ShowScreen from '@/presentation/views/show-screen.vue'
import { useShowDetail } from '@/application/use-show-detail'
import { useLibraryEntry } from '@/application/use-library-entry'
import { useSettings } from '@/application/use-settings'
import { useToast } from '@/presentation/composables/use-toast'
import { useRouter } from 'vue-router'

const push = vi.fn()
const mockShowData = ref<any>(null)
const mockLoading = ref(true)
const mockError = ref<any>(null)
const mockRefresh = vi.fn()
const addToast = vi.fn()
const setRating = vi.fn()
const toggleFavorite = vi.fn()
const setStatus = vi.fn()
const loadEntry = vi.fn()
const libraryEntry = {
  entry: ref({
    rating: 4,
    favorite: true,
    status: 'watched',
  }),
  setRating,
  toggleFavorite,
  setStatus,
  loadEntry,
}
const preferredRegion = ref('US')

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1396' },
  }),
  useRouter: vi.fn(),
}))

vi.mock('@/application/use-show-detail', () => ({
  useShowDetail: vi.fn(),
}))

vi.mock('@/application/use-library-entry', () => ({
  useLibraryEntry: vi.fn(),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: vi.fn(),
}))

vi.mock('@/presentation/composables/use-toast', () => ({
  useToast: vi.fn(),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  flatJson: true,
  messages: {
    en: {
      'details.error.title': 'Something went wrong',
      'details.error.retry': 'Retry',
      'details.notFound.title': 'Not found',
      'details.notFound.message': "This title doesn't exist or has been removed.",
      'details.notFound.home': 'Back to Home',
      'details.share.copied': 'Link copied to clipboard',
    },
  },
})

function renderShowScreen() {
  return mount(ShowScreen, {
    global: {
      plugins: [i18n],
      stubs: {
        HeroBackdrop: {
          props: ['title', 'tagline'],
          template:
            '<div data-testid="hero-backdrop">{{ title }}|{{ tagline }}<slot name="actions" /></div>',
        },
        ProviderRatingBadge: {
          props: ['voteAverage'],
          template: '<div data-testid="provider-rating-badge">{{ voteAverage }}</div>',
        },
        MetadataPanel: {
          props: ['firstAirDate', 'numberOfSeasons', 'numberOfEpisodes'],
          template:
            '<div data-testid="metadata-panel">{{ firstAirDate }}|{{ numberOfSeasons }}|{{ numberOfEpisodes }}</div>',
        },
        Synopsis: {
          props: ['overview'],
          template: '<div data-testid="synopsis">{{ overview }}</div>',
        },
        ActionButtons: {
          props: ['shareUrl', 'status'],
          template: `
            <div data-testid="action-buttons">
              <button data-testid="toggle-favorite" @click="$emit('toggle-favorite')"></button>
              <button data-testid="status-none" @click="$emit('update-status', 'none')"></button>
              <button data-testid="share" @click="$emit('share')">{{ shareUrl }}|{{ status }}</button>
            </div>
          `,
        },
        CastCarousel: {
          template: '<div data-testid="cast-carousel"></div>',
        },
        TrailerEmbed: {
          props: ['videos'],
          template: '<div data-testid="trailer-embed">{{ videos.length }}</div>',
        },
        StreamingBadges: {
          props: ['region'],
          template: '<div data-testid="streaming-badges">{{ region }}</div>',
        },
        ContentRatingBadge: {
          props: ['rating'],
          template: '<div data-testid="content-rating-badge">{{ rating }}</div>',
        },
        ExternalLinks: {
          template: '<div data-testid="external-links"></div>',
        },
        ImagesGallery: {
          template: '<div data-testid="images-gallery"></div>',
        },
        DetailSkeleton: {
          template: '<div data-testid="detail-skeleton"></div>',
        },
        EmptyState: {
          props: ['title', 'description'],
          template:
            '<div data-testid="empty-state"><h2>{{ title }}</h2><p>{{ description }}</p><slot /></div>',
        },
      },
    },
  })
}

describe('ShowScreen', () => {
  beforeEach(() => {
    mockShowData.value = null
    mockLoading.value = true
    mockError.value = null
    libraryEntry.entry.value = {
      rating: 4,
      favorite: true,
      status: 'watched',
    }
    push.mockReset()
    mockRefresh.mockReset()
    addToast.mockReset()
    setRating.mockReset()
    toggleFavorite.mockReset()
    setStatus.mockReset()
    loadEntry.mockReset()
    vi.mocked(useRouter).mockReturnValue({ push } as any)
    vi.mocked(useShowDetail).mockReturnValue({
      data: mockShowData,
      loading: mockLoading,
      error: mockError,
      refresh: mockRefresh,
    } as any)
    vi.mocked(useLibraryEntry).mockReturnValue(libraryEntry as any)
    vi.mocked(useSettings).mockReturnValue({ preferredRegion } as any)
    vi.mocked(useToast).mockReturnValue({ addToast } as any)
  })

  afterEach(() => {
    Object.defineProperty(window.navigator, 'share', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn() },
    })
  })

  it('renders the loading skeleton while loading', () => {
    const wrapper = renderShowScreen()
    expect(wrapper.find('[data-testid="detail-skeleton"]').exists()).toBe(true)
  })

  it('renders the generic error state and retries', async () => {
    mockLoading.value = false
    mockError.value = new Error('Network error')

    const wrapper = renderShowScreen()

    expect(wrapper.text()).toContain('Something went wrong')
    await wrapper.get('[data-testid="retry-button"]').trigger('click')
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('renders the not found state and navigates home', async () => {
    mockLoading.value = false
    mockError.value = new Error('API request failed: 404 Not Found')

    const wrapper = renderShowScreen()

    expect(wrapper.text()).toContain('Not found')
    await wrapper.get('button').trigger('click')
    expect(push).toHaveBeenCalledWith('/')
  })

  it('renders content and routes status updates to the library entry', async () => {
    mockLoading.value = false
    mockShowData.value = {
      id: 1396,
      name: 'Breaking Bad',
      tagline: 'Remember my name.',
      overview: 'A chemistry teacher turns to crime.',
      first_air_date: '2008-01-20',
      number_of_seasons: 5,
      number_of_episodes: 62,
      backdrop_path: '/backdrop.jpg',
      vote_average: 9.5,
      genres: [{ id: 18, name: 'Drama' }],
      spoken_languages: [{ iso_639_1: 'en', name: 'English', english_name: 'English' }],
      credits: { cast: [{ id: 1 }], crew: [{ id: 2 }] },
      videos: { results: [{ id: 'a' }] },
      'watch/providers': { results: {} },
      episode_run_time: [45],
      poster_path: '/poster.jpg',
      content_ratings: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0903747',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
      original_language: 'en',
      homepage: null,
    }

    const wrapper = renderShowScreen()

    expect(wrapper.get('[data-testid="hero-backdrop"]').text()).toContain('Breaking Bad')
    expect(wrapper.get('[data-testid="streaming-badges"]').text()).toBe('US')

    await wrapper.get('[data-testid="status-none"]').trigger('click')

    expect(setStatus).toHaveBeenCalledWith('none')
  })

  it('uses the native share API when available', async () => {
    mockLoading.value = false
    mockShowData.value = {
      id: 1396,
      name: 'Breaking Bad',
      tagline: '',
      overview: '',
      first_air_date: '2008-01-20',
      number_of_seasons: 5,
      number_of_episodes: 62,
      backdrop_path: '/backdrop.jpg',
      vote_average: 9.5,
      genres: [],
      spoken_languages: [],
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      episode_run_time: [45],
      poster_path: '/poster.jpg',
      content_ratings: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0903747',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
      original_language: 'en',
      homepage: null,
    }
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'share', {
      configurable: true,
      value: share,
    })

    const wrapper = renderShowScreen()
    await wrapper.get('[data-testid="share"]').trigger('click')

    expect(share).toHaveBeenCalledWith({
      title: 'Breaking Bad',
      url: 'http://localhost:3000/show/1396',
    })
    expect(addToast).not.toHaveBeenCalled()
  })

  it('falls back to the clipboard share flow and reports success and failure', async () => {
    mockLoading.value = false
    mockShowData.value = {
      id: 1396,
      name: 'Breaking Bad',
      tagline: '',
      overview: '',
      first_air_date: '2008-01-20',
      number_of_seasons: 5,
      number_of_episodes: 62,
      backdrop_path: '/backdrop.jpg',
      vote_average: 9.5,
      genres: [],
      spoken_languages: [],
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      episode_run_time: [45],
      poster_path: '/poster.jpg',
      content_ratings: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0903747',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
      original_language: 'en',
      homepage: null,
    }
    Object.defineProperty(window.navigator, 'share', {
      configurable: true,
      value: undefined,
    })

    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    const successWrapper = renderShowScreen()
    await successWrapper.get('[data-testid="share"]').trigger('click')
    expect(writeText).toHaveBeenCalledWith('http://localhost:3000/show/1396')
    expect(addToast).toHaveBeenCalledWith({ message: 'Link copied to clipboard', type: 'success' })

    addToast.mockClear()
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('nope')) },
    })

    const failureWrapper = renderShowScreen()
    await failureWrapper.get('[data-testid="share"]').trigger('click')
    expect(addToast).toHaveBeenCalledWith({ message: 'Failed to copy link', type: 'error' })
  })

  it('falls back to empty library entry defaults', async () => {
    mockLoading.value = false
    mockShowData.value = {
      id: 1396,
      name: 'Breaking Bad',
      tagline: '',
      overview: '',
      first_air_date: '2008-01-20',
      number_of_seasons: 5,
      number_of_episodes: 62,
      backdrop_path: '/backdrop.jpg',
      vote_average: 9.5,
      genres: [],
      spoken_languages: [],
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      episode_run_time: [],
      poster_path: '/poster.jpg',
      content_ratings: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0903747',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
      original_language: 'en',
      homepage: null,
    }
    vi.mocked(useLibraryEntry).mockReturnValue({
      ...libraryEntry,
      entry: ref(null),
    } as any)

    const wrapper = renderShowScreen()

    expect(useLibraryEntry).toHaveBeenCalledWith(
      1396,
      'tv',
      'Breaking Bad',
      '/poster.jpg',
      9.5,
      '2008-01-20',
      undefined,
    )
    expect(wrapper.get('[data-testid="action-buttons"]').text()).toContain('/show/1396|none')
  })
})
