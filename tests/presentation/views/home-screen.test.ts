import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import HomeScreen from '@/presentation/views/home-screen.vue'
import * as providerClient from '@/infrastructure/provider.client'

vi.mock('@/infrastructure/provider.client', () => ({
  searchMulti: vi.fn(),
  getTrending: vi.fn(),
  getPopularMovies: vi.fn(),
  getPopularShows: vi.fn(),
}))

vi.mock('@/application/use-browse', () => ({
  useBrowse: vi.fn(() => ({
    trending: [],
    popularMovies: [],
    popularShows: [],
    loading: false,
    error: null,
    retry: vi.fn(),
  })),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language: { value: 'en' },
  }),
}))

const mockSearchMulti = vi.mocked(providerClient.searchMulti)

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  flatJson: true,
  messages: {
    en: {
      'common.empty.title': 'Nothing here yet',
      'common.empty.description': 'This page is under construction.',
      'home.search.placeholder': 'Search movies and shows...',
      'home.search.clear': 'Clear search',
      'home.search.empty.title': 'No results found',
      'home.search.empty.subtitle': 'Try different keywords or check your spelling',
      'home.search.error.message': 'Failed to load search results',
      'home.search.error.retry': 'Retry',
      'home.browse.trending': 'Trending Today',
      'home.browse.popularMovies': 'Popular Movies',
      'home.browse.popularShows': 'Popular TV Shows',
      'home.browse.error.message': 'Failed to load browse content',
      'home.browse.error.retry': 'Retry',
    },
  },
})

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/movie/:id', name: 'movie', component: { template: '<div>Movie</div>' } },
    { path: '/show/:id', name: 'show', component: { template: '<div>Show</div>' } },
  ],
})

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

describe('HomeScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockSearchMulti.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mountComponent = () => {
    return mount(HomeScreen, {
      global: {
        plugins: [i18n, router],
      },
    })
  }

  describe('browse mode (HS-09)', () => {
    it('shows browse sections on initial load (HS-09-01)', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.find('[data-testid="browse-sections"]').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'TrendingCarousel' }).exists()).toBe(true)
      expect(wrapper.findAllComponents({ name: 'PopularGrid' })).toHaveLength(2)
    })

    it('shows SearchBar in browse mode (HS-09-02)', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.find('input[type="search"]').exists()).toBe(true)
    })

    it('does not show search results in browse mode (HS-09-03)', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.find('[data-testid="results-grid"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false)
    })
  })

  describe('search mode (HS-10)', () => {
    it('hides browse sections when query entered (HS-10-01)', async () => {
      // Arrange
      const wrapper = mountComponent()
      const input = wrapper.find('input[type="search"]')

      // Act
      await input.setValue('test')
      await nextTick()

      // Assert
      expect(wrapper.find('[data-testid="browse-sections"]').exists()).toBe(false)
    })

    it('shows SearchResults when query entered (HS-10-02)', async () => {
      // Arrange
      mockSearchMulti.mockResolvedValue({
        page: 1,
        results: [mockMovieResult],
        total_pages: 1,
        total_results: 1,
      })

      const wrapper = mountComponent()
      const input = wrapper.find('input[type="search"]')

      // Act
      await input.setValue('fight')
      await nextTick()
      await vi.advanceTimersByTimeAsync(300)
      await flushPromises()

      // Assert - loading state or results should be visible
      const hasResults = wrapper.find('[data-testid="results-grid"]').exists()
      const hasSkeletons = wrapper.findAll('[data-testid="skeleton"]').length > 0
      expect(hasResults || hasSkeletons).toBe(true)
    })

    it('SearchBar remains visible in search mode (HS-10-03)', async () => {
      // Arrange
      const wrapper = mountComponent()
      const input = wrapper.find('input[type="search"]')

      // Act
      await input.setValue('test')
      await nextTick()

      // Assert
      expect(wrapper.find('input[type="search"]').exists()).toBe(true)
    })

    it('single character triggers search mode (HS-10-04)', async () => {
      // Arrange
      const wrapper = mountComponent()
      const input = wrapper.find('input[type="search"]')

      // Act
      await input.setValue('a')
      await nextTick()

      // Assert
      expect(wrapper.find('[data-testid="browse-sections"]').exists()).toBe(false)
    })

    it('whitespace-only query stays in browse mode (HS-10-05)', async () => {
      // Arrange
      const wrapper = mountComponent()
      const input = wrapper.find('input[type="search"]')

      // Act
      await input.setValue('   ')
      await nextTick()

      // Assert
      expect(wrapper.find('[data-testid="browse-sections"]').exists()).toBe(true)
    })
  })

  describe('mode transition (HS-11)', () => {
    it('clearing query restores browse sections (HS-11-01)', async () => {
      // Arrange
      const wrapper = mountComponent()
      const input = wrapper.find('input[type="search"]')

      // Enter search mode
      await input.setValue('test')
      await nextTick()
      expect(wrapper.find('[data-testid="browse-sections"]').exists()).toBe(false)

      // Act - clear
      await input.setValue('')
      await nextTick()

      // Assert
      expect(wrapper.find('[data-testid="browse-sections"]').exists()).toBe(true)
    })

    it('no mixed state during transition (HS-11-04)', async () => {
      // Arrange
      const wrapper = mountComponent()
      const input = wrapper.find('input[type="search"]')

      // Act - enter search mode
      await input.setValue('test')
      await nextTick()

      // Assert - should not have both browse sections and search results visible
      const hasBrowse = wrapper.find('[data-testid="browse-sections"]').exists()
      const hasSearchResults = wrapper.find('[data-testid="results-grid"]').exists()
      const hasEmpty = wrapper.find('[data-testid="empty-state"]').exists()
      const hasSkeletons = wrapper.findAll('[data-testid="skeleton"]').length > 0
      const hasError = wrapper.find('[data-testid="error-container"]').exists()

      // Either browse mode XOR search mode components should be visible
      const inSearchMode = hasSearchResults || hasEmpty || hasSkeletons || hasError
      expect(hasBrowse && inSearchMode).toBe(false)
    })
  })

  describe('empty state (HS-06)', () => {
    it('does not show empty state when query is empty (HS-06-04)', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false)
    })
  })
})
