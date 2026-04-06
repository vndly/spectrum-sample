import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import FilterBar from '@/presentation/components/home/filter-bar.vue'
import { ref } from 'vue'

// Mock useFilters
const mockFilters = {
  genres: [] as number[],
  mediaType: 'all',
  yearFrom: null,
  yearTo: null,
}
const mockClearAll = vi.fn()

vi.mock('@/application/use-filters', () => ({
  useFilters: () => ({
    filters: mockFilters,
    genres: ref([
      { id: 28, name: 'Action' },
      { id: 35, name: 'Comedy' },
    ]),
    clearAll: mockClearAll,
  }),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'home.filters.genre': 'Genre',
      'home.filters.mediaType.all': 'All',
      'home.filters.mediaType.movie': 'Movies',
      'home.filters.mediaType.tv': 'TV Shows',
      'home.filters.yearFrom': 'From Year',
      'home.filters.yearTo': 'To Year',
      'home.filters.clear': 'Clear All',
    },
  },
})

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div></div>' } }],
})

describe('FilterBar', () => {
  beforeEach(() => {
    mockFilters.genres = []
    mockFilters.mediaType = 'all'
    mockFilters.yearFrom = null
    mockFilters.yearTo = null
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    expect(wrapper.text()).toContain('Genre')
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Movies')
  })

  it('toggles genre dropdown', async () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.text()).toContain('Action')
    expect(wrapper.text()).toContain('Comedy')
  })

  it('updates media type when clicked', async () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    const movieButton = wrapper.findAll('button').find((b) => b.text() === 'Movies')
    await movieButton?.trigger('click')
    expect(mockFilters.mediaType).toBe('movie')
  })

  it('shows clear button when filters are active', async () => {
    mockFilters.mediaType = 'movie'
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    expect(wrapper.text()).toContain('Clear All')
  })

  it('calls clearAll when clear button clicked', async () => {
    mockFilters.mediaType = 'movie'
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    const clearButton = wrapper.findAll('button').find((b) => b.text() === 'Clear All')
    await clearButton?.trigger('click')
    expect(mockClearAll).toHaveBeenCalled()
  })
})
