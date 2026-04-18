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
  status: 'all',
  listIds: [],
})
const activeFilterCount = ref(0)
const clearFilters = vi.fn()
const sortField = ref('dateAdded')
const sortOrder = ref('desc')
const entries = ref<any[]>([])
const allEntries = ref<any[]>([])
const refresh = vi.fn()
const lists = ref<{ id: string; name: string }[]>([])
const createList = vi.fn()
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

vi.mock('@/application/use-lists', () => ({
  useLists: () => ({
    lists,
    createList,
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
        'library.tabs.lists': 'Lists',
        'library.empty.filtered.title': 'No matches',
        'library.empty.filtered.description': 'Try clearing your filters.',
        'library.empty.watchlist.title': 'Your watchlist is empty',
        'library.empty.watchlist.description': 'Add movies and shows you want to watch later.',
        'library.empty.watched.title': 'Nothing watched yet',
        'library.empty.watched.description': 'Titles you finish will appear here.',
        'library.empty.list.title': 'This list is empty',
        'library.empty.list.description': 'Add something to this list.',
        'library.empty.allLists.title': 'Create your first list',
        'library.empty.allLists.description': 'Lists help you group titles.',
        'library.lists.newNamePlaceholder': 'New list name',
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
          props: ['showWatchStatus', 'showCustomLists', 'activeFilterCount'],
          template:
            '<div data-testid="filter-bar">{{ showWatchStatus }}|{{ showCustomLists }}|{{ activeFilterCount }}</div>',
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
      status: 'all',
      listIds: [],
    }
    activeFilterCount.value = 0
    entries.value = []
    allEntries.value = []
    lists.value = []
    genres.value = [{ id: 1, name: 'Action' }]
    language.value = 'en'
    clearFilters.mockReset()
    refresh.mockReset()
    createList.mockReset()
    fetchGenres.mockReset()
  })

  it('renders the default watchlist empty state and fetches genres on mount', () => {
    const wrapper = renderLibraryScreen()

    expect(wrapper.get('h1').text()).toBe('Library')
    expect(fetchGenres).toHaveBeenCalledWith('en')
    expect(wrapper.get('[data-testid="empty-state"] h2').text()).toBe('Your watchlist is empty')
    expect(wrapper.get('[data-testid="filter-bar"]').text()).toContain('false|true|0')
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
        listIds: [],
        lists: [],
      },
    ]
    activeFilterCount.value = 2

    const wrapper = renderLibraryScreen()

    expect(wrapper.get('[data-testid="empty-state"] h2').text()).toBe('No matches')

    await wrapper.get('[data-testid="empty-state"] button').trigger('click')
    expect(clearFilters).toHaveBeenCalled()
  })

  it('handles custom list selection and renders list-specific entries', async () => {
    entries.value = [
      {
        id: 2,
        title: 'Severance',
        status: 'watchlist',
        listIds: ['list-2'],
        lists: ['list-2'],
      },
    ]
    allEntries.value = [...entries.value]
    lists.value = [
      { id: 'list-1', name: 'Sci-Fi' },
      { id: 'list-2', name: 'Office Dramas' },
    ]

    const wrapper = renderLibraryScreen()

    wrapper.findComponent({ name: 'TabToggle' }).vm.$emit('update:active-tab', 'lists')
    await nextTick()

    expect(wrapper.text()).toContain('Sci-Fi')
    expect(wrapper.text()).toContain('Office Dramas')
    expect(wrapper.get('[data-testid="empty-state"] h2').text()).toBe('This list is empty')
    expect(wrapper.get('[data-testid="filter-bar"]').text()).toContain('true|false')

    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Office Dramas')
      ?.trigger('click')
    await nextTick()

    expect(wrapper.get('[data-testid="entry-grid"]').text()).toBe('1')
  })

  it('renders the no-lists state and creates a new list from the form', async () => {
    const wrapper = renderLibraryScreen()

    wrapper.findComponent({ name: 'TabToggle' }).vm.$emit('update:active-tab', 'lists')
    await nextTick()

    expect(wrapper.get('[data-testid="empty-state"] h2').text()).toBe('Create your first list')

    const input = wrapper.get('input[type="text"]')
    await input.setValue('   ')
    await wrapper.get('form').trigger('submit')
    expect(createList).not.toHaveBeenCalled()

    await input.setValue('Favorites')
    await wrapper.get('form').trigger('submit')

    expect(createList).toHaveBeenCalledWith('Favorites')
    expect(refresh).toHaveBeenCalled()
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
