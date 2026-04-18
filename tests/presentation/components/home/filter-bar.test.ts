import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import FilterBar from '@/presentation/components/home/filter-bar.vue'
import { ref, computed, nextTick } from 'vue'

// Mock useFilters
const mockFilters = ref({
  genres: [] as number[],
  mediaType: 'all',
  yearFrom: null as number | null,
  yearTo: null as number | null,
})
const mockClearAll = vi.fn()

vi.mock('@/application/use-filters', () => ({
  useFilters: () => ({
    filters: mockFilters,
    genres: ref([
      { id: 28, name: 'Action' },
      { id: 35, name: 'Comedy' },
    ]),
    clearAll: mockClearAll,
    activeFilterCount: computed(() => {
      let count = 0
      if (mockFilters.value.genres.length > 0) count++
      if (mockFilters.value.mediaType !== 'all') count++
      if (mockFilters.value.yearFrom !== null) count++
      if (mockFilters.value.yearTo !== null) count++
      return count
    }),
  }),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'home.filters.genre': 'Genre',
      'home.filters.genreSearch': 'Search genres',
      'home.filters.mediaType.all': 'All',
      'home.filters.mediaType.movie': 'Movies',
      'home.filters.mediaType.tv': 'Shows',
      'home.filters.yearFrom': 'From',
      'home.filters.yearTo': 'To',
      'home.filters.year.decrement': 'Decrease {label}',
      'home.filters.year.increment': 'Increase {label}',
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
    mockFilters.value.genres = []
    mockFilters.value.mediaType = 'all'
    mockFilters.value.yearFrom = null
    mockFilters.value.yearTo = null
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

  it('applies custom scrollbar styling to the genre dropdown', async () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })

    await wrapper.find('button').trigger('click')

    const dropdown = wrapper.get('[data-testid="genre-dropdown-menu"]')
    expect(dropdown.classes()).toContain('[&::-webkit-scrollbar]:w-2')
    expect(dropdown.classes()).toContain('[&::-webkit-scrollbar-thumb]:bg-teal-500/70')
  })

  it('filters genres in real time as the user types', async () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })

    await wrapper.find('button').trigger('click')
    await wrapper.get('[data-testid="genre-filter-input"]').setValue('com')

    const options = wrapper.findAll('[data-testid="genre-option"]')
    expect(options).toHaveLength(1)
    expect(options[0]?.text()).toContain('Comedy')
  })

  it('autofocuses the genre filter input when the dropdown opens', async () => {
    const wrapper = mount(FilterBar, {
      attachTo: document.body,
      global: { plugins: [i18n, router] },
    })

    await wrapper.find('button').trigger('click')
    await nextTick()

    const input = wrapper.get('[data-testid="genre-filter-input"]').element
    expect(document.activeElement).toBe(input)

    wrapper.unmount()
  })

  it('toggles a genre from the filtered list', async () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })

    await wrapper.find('button').trigger('click')
    await wrapper.get('[data-testid="genre-filter-input"]').setValue('act')
    await wrapper.get('[data-testid="genre-option"]').trigger('click')

    expect(mockFilters.value.genres).toEqual([28])
  })

  it('updates media type when clicked', async () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    const movieButton = wrapper.findAll('button').find((b) => b.text() === 'Movies')
    await movieButton?.trigger('click')
    expect(mockFilters.value.mediaType).toBe('movie')
  })

  it('shows clear button when filters are active', async () => {
    mockFilters.value.mediaType = 'movie'
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    expect(wrapper.text()).toContain('Clear All')
  })

  it('renders the clear action as a button-like control', async () => {
    mockFilters.value.mediaType = 'movie'

    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })

    const clearButton = wrapper.findAll('button').find((b) => b.text() === 'Clear All')
    expect(clearButton?.classes()).toContain('rounded-full')
    expect(clearButton?.classes()).toContain('bg-surface')
  })

  it('renders the year controls with the same compact height as the genre selector', () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })

    const genreButton = wrapper.findAll('button').find((button) => button.text().includes('Genre'))
    const yearFromControl = wrapper.get('[data-testid="year-from-control"]')
    const yearFromDecrement = wrapper.get('[data-testid="year-from-decrement"]')
    const yearFromInput = wrapper.get('[data-testid="year-from-input"]')
    const yearToControl = wrapper.get('[data-testid="year-to-control"]')
    const yearToInput = wrapper.get('[data-testid="year-to-input"]')

    expect(genreButton?.classes()).toContain('py-2')
    expect(yearFromControl.classes()).toContain('h-9')
    expect(yearToControl.classes()).toContain('h-9')
    expect(yearFromDecrement.classes()).toContain('h-full')
    expect(yearFromDecrement.classes()).toContain('w-9')
    expect(yearFromInput.classes()).toContain('h-full')
    expect(yearFromInput.classes()).toContain('w-16')
    expect(yearFromInput.classes()).not.toContain('w-20')
    expect(yearToInput.classes()).toContain('w-16')
    expect(yearFromInput.classes()).not.toContain('py-2')
  })

  it('calls clearAll when clear button clicked', async () => {
    mockFilters.value.mediaType = 'movie'
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    const clearButton = wrapper.findAll('button').find((b) => b.text() === 'Clear All')
    await clearButton?.trigger('click')
    expect(mockClearAll).toHaveBeenCalled()
  })

  it('increments the starting year with the custom stepper', async () => {
    mockFilters.value.yearFrom = 2020

    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })

    await wrapper.get('[data-testid="year-from-increment"]').trigger('click')

    expect(mockFilters.value.yearFrom).toBe(2021)
  })

  it('allows entering a year directly from the keyboard', async () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })

    await wrapper.get('[data-testid="year-from-input"]').setValue('2')

    expect(mockFilters.value.yearFrom).toBe(2)
  })

  it('decrements the ending year with the custom stepper', async () => {
    mockFilters.value.yearTo = 2025

    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })

    await wrapper.get('[data-testid="year-to-decrement"]').trigger('click')

    expect(mockFilters.value.yearTo).toBe(2024)
  })
})
