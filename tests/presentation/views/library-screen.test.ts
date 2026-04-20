/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import LibraryScreen from '@/presentation/views/library-screen.vue'

const filters = ref({
  genres: [],
  mediaType: 'all',
  ratingMin: 0,
  ratingMax: 5,
})
const activeFilterCount = ref(0)
const clearFilters = vi.fn()
const sortField = ref('dateAdded')
const sortOrder = ref('desc')
const entries = ref<any[]>([])
const allEntries = ref<any[]>([])
const refresh = vi.fn()
const genres = ref([{ id: 1, name: 'Action' }])
const fetchGenres = vi.fn()
const language = ref('en')

vi.mock('@/application/use-library-filters', () => ({
  useLibraryFilters: () => ({
    filters,
    activeFilterCount,
    clearFilters,
  }),
}))

vi.mock('@/application/use-sort', () => ({
  useSort: () => ({
    sortField,
    sortOrder,
  }),
}))

vi.mock('@/application/use-library-entries', () => ({
  useLibraryEntries: () => ({
    entries,
    allEntries,
    refresh,
  }),
}))

vi.mock('@/application/use-genres', () => ({
  useGenres: () => ({
    genres,
    fetchGenres,
  }),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language,
  }),
}))

function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'page.library.title': 'Library',
        'library.tabs.watchlist': 'Watchlist',
        'library.tabs.watched': 'Watched',
        'library.empty.filtered.title': 'No matches',
        'library.empty.filtered.description': 'Try clearing your filters.',
        'library.empty.watchlist.title': 'Your watchlist is empty',
        'library.empty.watchlist.description': 'Add movies and shows you want to watch later.',
        'library.empty.watched.title': 'Nothing watched yet',
        'library.empty.watched.description': 'Titles you finish will appear here.',
        'home.filters.clear': 'Clear filters',
      },
    },
  })
}

function renderLibraryScreen() {
  return mount(LibraryScreen, {
    global: {
      plugins: [createTestI18n()],
      stubs: {
        SortDropdown: {
          name: 'SortDropdown',
          template: '<div data-testid="sort-dropdown"></div>',
        },
        TabToggle: {
          name: 'TabToggle',
          template: '<div data-testid="tab-toggle"></div>',
        },
        EntryGrid: {
          name: 'EntryGrid',
          props: ['entries'],
          template: '<div data-testid="entry-grid">{{ entries.length }}</div>',
        },
        FilterBar: {
          name: 'FilterBar',
          props: ['activeFilterCount'],
          template: '<div data-testid="filter-bar">{{ activeFilterCount }}</div>',
        },
        EmptyState: {
          name: 'EmptyState',
          props: ['title', 'description'],
          template:
            '<div data-testid="empty-state"><h2>{{ title }}</h2><p>{{ description }}</p><slot /></div>',
        },
      },
    },
  })
}

describe('LibraryScreen', () => {
  beforeEach(() => {
    filters.value = {
      genres: [],
      mediaType: 'all',
      ratingMin: 0,
      ratingMax: 5,
    }
    activeFilterCount.value = 0
    entries.value = []
    allEntries.value = []
    genres.value = [{ id: 1, name: 'Action' }]
    language.value = 'en'
    clearFilters.mockReset()
    refresh.mockReset()
    fetchGenres.mockReset()
  })

  it('renders the default watchlist empty state and fetches genres on mount', () => {
    const wrapper = renderLibraryScreen()

    expect(wrapper.get('h1').text()).toBe('Library')
    expect(fetchGenres).toHaveBeenCalledWith('en')
    expect(wrapper.get('[data-testid="empty-state"] h2').text()).toBe('Your watchlist is empty')
    expect(wrapper.get('[data-testid="filter-bar"]').text()).toBe('0')
  })

  it('switches to the watched tab and renders the watched empty state', async () => {
    const wrapper = renderLibraryScreen()

    wrapper.findComponent({ name: 'TabToggle' }).vm.$emit('update:active-tab', 'watched')
    await nextTick()

    expect(wrapper.get('[data-testid="empty-state"] h2').text()).toBe('Nothing watched yet')
  })

  it('shows the filtered empty state and clears filters from the CTA', async () => {
    allEntries.value = [
      {
        id: 1,
        title: 'Arrival',
        status: 'watchlist',
      },
    ]
    activeFilterCount.value = 2

    const wrapper = renderLibraryScreen()

    expect(wrapper.get('[data-testid="empty-state"] h2').text()).toBe('No matches')

    await wrapper.get('[data-testid="empty-state"] button').trigger('click')
    expect(clearFilters).toHaveBeenCalled()
  })

  it('renders entries for the active status tab', async () => {
    entries.value = [
      {
        id: 2,
        title: 'Severance',
        status: 'watchlist',
      },
      {
        id: 3,
        title: 'Andor',
        status: 'watched',
      },
    ]
    allEntries.value = [...entries.value]

    const wrapper = renderLibraryScreen()

    expect(wrapper.get('[data-testid="entry-grid"]').text()).toBe('1')

    wrapper.findComponent({ name: 'TabToggle' }).vm.$emit('update:active-tab', 'watched')
    await nextTick()

    expect(wrapper.get('[data-testid="entry-grid"]').text()).toBe('1')
  })

  it('updates sort and filter state from child v-model emissions', async () => {
    const wrapper = renderLibraryScreen()

    wrapper.findComponent({ name: 'SortDropdown' }).vm.$emit('update:modelValue', 'title')
    wrapper.findComponent({ name: 'SortDropdown' }).vm.$emit('update:order', 'asc')
    wrapper.findComponent({ name: 'FilterBar' }).vm.$emit('update:modelValue', {
      ...filters.value,
      mediaType: 'movie',
    })
    await nextTick()

    expect(sortField.value).toBe('title')
    expect(sortOrder.value).toBe('asc')
    expect(filters.value.mediaType).toBe('movie')
  })
})
