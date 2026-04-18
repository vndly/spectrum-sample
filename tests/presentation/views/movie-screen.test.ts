/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import MovieScreen from '@/presentation/views/movie-screen.vue'
import { useMovieDetail } from '@/application/use-movie-detail'
import { useLibraryEntry } from '@/application/use-library-entry'
import { useSettings } from '@/application/use-settings'
import { useToast } from '@/presentation/composables/use-toast'
import { useRouter } from 'vue-router'
import * as storageService from '@/infrastructure/storage.service'

const push = vi.fn()
const mockMovieData = ref<any>(null)
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
    rating: 3,
    favorite: false,
    status: 'watchlist',
    lists: ['list-1'],
  }),
  setRating,
  toggleFavorite,
  setStatus,
  loadEntry,
}
const preferredRegion = ref('US')

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '550' },
  }),
  useRouter: vi.fn(),
}))

vi.mock('@/application/use-movie-detail', () => ({
  useMovieDetail: vi.fn(),
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

vi.mock('@/infrastructure/storage.service', async () => {
  const actual = await vi.importActual<typeof import('@/infrastructure/storage.service')>(
    '@/infrastructure/storage.service',
  )
  return {
    ...actual,
    updateEntryLists: vi.fn(),
  }
})

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

function renderMovieScreen() {
  return mount(MovieScreen, {
    global: {
      plugins: [i18n],
      stubs: {
        HeroBackdrop: {
          props: ['title', 'tagline'],
          template: '<div data-testid="hero-backdrop">{{ title }}|{{ tagline }}</div>',
        },
        ProviderRatingBadge: {
          props: ['voteAverage'],
          template: '<div data-testid="provider-rating-badge">{{ voteAverage }}</div>',
        },
        RatingStars: {
          props: ['modelValue'],
          template:
            '<button data-testid="rating-stars" @click="$emit(\'update:modelValue\', 4)">{{ modelValue }}</button>',
        },
        MetadataPanel: {
          props: ['releaseDate', 'runtime'],
          template: '<div data-testid="metadata-panel">{{ releaseDate }}|{{ runtime }}</div>',
        },
        Synopsis: {
          props: ['overview'],
          template: '<div data-testid="synopsis">{{ overview }}</div>',
        },
        BoxOffice: {
          props: ['budget', 'revenue'],
          template: '<div data-testid="box-office">{{ budget }}|{{ revenue }}</div>',
        },
        ActionButtons: {
          props: ['shareUrl', 'hasLists', 'status'],
          template: `
            <div data-testid="action-buttons">
              <button data-testid="toggle-favorite" @click="$emit('toggle-favorite')"></button>
              <button data-testid="status-watched" @click="$emit('update-status', 'watched')"></button>
              <button data-testid="manage-lists" @click="$emit('manage-lists')"></button>
              <button data-testid="share" @click="$emit('share')">{{ shareUrl }}|{{ hasLists }}|{{ status }}</button>
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
        ListManagerModal: {
          props: ['modelValue', 'entryLists'],
          template:
            '<div data-testid="list-manager-modal">{{ modelValue }}|{{ entryLists.join(\',\') }}<button data-testid="emit-update-lists" @click="$emit(\'update:entry-lists\', [\'list-2\'])"></button><button data-testid="emit-close-modal" @click="$emit(\'update:modelValue\', false)"></button></div>',
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

describe('MovieScreen', () => {
  beforeEach(() => {
    mockMovieData.value = null
    mockLoading.value = true
    mockError.value = null
    libraryEntry.entry.value = {
      rating: 3,
      favorite: false,
      status: 'watchlist',
      lists: ['list-1'],
    }
    push.mockReset()
    mockRefresh.mockReset()
    addToast.mockReset()
    setRating.mockReset()
    toggleFavorite.mockReset()
    setStatus.mockReset()
    loadEntry.mockReset()
    vi.mocked(useRouter).mockReturnValue({ push } as any)
    vi.mocked(useMovieDetail).mockReturnValue({
      data: mockMovieData,
      loading: mockLoading,
      error: mockError,
      refresh: mockRefresh,
    } as any)
    vi.mocked(useLibraryEntry).mockReturnValue(libraryEntry as any)
    vi.mocked(useSettings).mockReturnValue({ preferredRegion } as any)
    vi.mocked(useToast).mockReturnValue({ addToast } as any)
    vi.mocked(storageService.updateEntryLists).mockReset()
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
    const wrapper = renderMovieScreen()
    expect(wrapper.find('[data-testid="detail-skeleton"]').exists()).toBe(true)
  })

  it('renders the generic error state and retries', async () => {
    mockLoading.value = false
    mockError.value = new Error('Network error')

    const wrapper = renderMovieScreen()

    expect(wrapper.text()).toContain('Something went wrong')
    await wrapper.get('[data-testid="retry-button"]').trigger('click')
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('renders the not found state and navigates home', async () => {
    mockLoading.value = false
    mockError.value = new Error('API request failed: 404 Not Found')

    const wrapper = renderMovieScreen()

    expect(wrapper.text()).toContain('Not found')
    await wrapper.get('button').trigger('click')
    expect(push).toHaveBeenCalledWith('/')
  })

  it('renders content and routes rating, favorite, status, and list updates to the library entry', async () => {
    mockLoading.value = false
    mockMovieData.value = {
      id: 550,
      title: 'Fight Club',
      tagline: 'Mischief. Mayhem. Soap.',
      overview: 'A ticking time bomb.',
      release_date: '1999-10-15',
      runtime: 139,
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.4,
      imdb_id: 'tt0137523',
      budget: 63000000,
      revenue: 100853753,
      genres: [{ id: 18, name: 'Drama' }],
      spoken_languages: [{ iso_639_1: 'en', name: 'English', english_name: 'English' }],
      credits: { cast: [{ id: 1 }], crew: [{ id: 2 }] },
      videos: { results: [{ id: 'a' }] },
      'watch/providers': { results: {} },
      poster_path: '/poster.jpg',
    }

    const wrapper = renderMovieScreen()

    expect(wrapper.get('[data-testid="hero-backdrop"]').text()).toContain('Fight Club')
    expect(wrapper.get('[data-testid="streaming-badges"]').text()).toBe('US')

    await wrapper.get('[data-testid="rating-stars"]').trigger('click')
    await wrapper.get('[data-testid="toggle-favorite"]').trigger('click')
    await wrapper.get('[data-testid="status-watched"]').trigger('click')
    await wrapper.get('[data-testid="manage-lists"]').trigger('click')
    await nextTick()
    await wrapper.get('[data-testid="emit-update-lists"]').trigger('click')

    expect(setRating).toHaveBeenCalledWith(4)
    expect(toggleFavorite).toHaveBeenCalled()
    expect(setStatus).toHaveBeenCalledWith('watched')
    expect(wrapper.get('[data-testid="list-manager-modal"]').text()).toContain('true|list-1')
    expect(storageService.updateEntryLists).toHaveBeenCalledWith(550, 'movie', ['list-2'])
    expect(loadEntry).toHaveBeenCalled()
  })

  it('uses the native share API when available', async () => {
    mockLoading.value = false
    mockMovieData.value = {
      id: 550,
      title: 'Fight Club',
      tagline: '',
      overview: '',
      release_date: '1999-10-15',
      runtime: 139,
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.4,
      imdb_id: 'tt0137523',
      budget: 0,
      revenue: 0,
      genres: [],
      spoken_languages: [],
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      poster_path: '/poster.jpg',
    }
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'share', {
      configurable: true,
      value: share,
    })

    const wrapper = renderMovieScreen()
    await wrapper.get('[data-testid="share"]').trigger('click')

    expect(share).toHaveBeenCalledWith({
      title: 'Fight Club',
      url: 'http://localhost:3000/movie/550',
    })
    expect(addToast).not.toHaveBeenCalled()
  })

  it('falls back to the clipboard share flow and reports success and failure', async () => {
    mockLoading.value = false
    mockMovieData.value = {
      id: 550,
      title: 'Fight Club',
      tagline: '',
      overview: '',
      release_date: '1999-10-15',
      runtime: 139,
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.4,
      imdb_id: 'tt0137523',
      budget: 0,
      revenue: 0,
      genres: [],
      spoken_languages: [],
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      poster_path: '/poster.jpg',
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

    const successWrapper = renderMovieScreen()
    await successWrapper.get('[data-testid="share"]').trigger('click')
    expect(writeText).toHaveBeenCalledWith('http://localhost:3000/movie/550')
    expect(addToast).toHaveBeenCalledWith({ message: 'Link copied to clipboard', type: 'success' })

    addToast.mockClear()
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('nope')) },
    })

    const failureWrapper = renderMovieScreen()
    await failureWrapper.get('[data-testid="share"]').trigger('click')
    expect(addToast).toHaveBeenCalledWith({ message: 'Failed to copy link', type: 'error' })
  })

  it('applies modal v-model updates and falls back to empty library entry defaults', async () => {
    mockLoading.value = false
    mockMovieData.value = {
      id: 550,
      title: 'Fight Club',
      tagline: '',
      overview: '',
      release_date: '1999-10-15',
      runtime: undefined,
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.4,
      imdb_id: 'tt0137523',
      budget: 0,
      revenue: 0,
      genres: [],
      spoken_languages: [],
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      poster_path: '/poster.jpg',
    }
    vi.mocked(useLibraryEntry).mockReturnValue({
      ...libraryEntry,
      entry: ref(null),
    } as any)

    const wrapper = renderMovieScreen()

    expect(useLibraryEntry).toHaveBeenCalledWith(
      550,
      'movie',
      'Fight Club',
      '/poster.jpg',
      8.4,
      '1999-10-15',
      undefined,
    )
    expect(wrapper.get('[data-testid="rating-stars"]').text()).toBe('0')
    expect(wrapper.get('[data-testid="action-buttons"]').text()).toContain('false|none')

    await wrapper.get('[data-testid="emit-close-modal"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-testid="list-manager-modal"]').text()).toContain('false|')
  })
})
