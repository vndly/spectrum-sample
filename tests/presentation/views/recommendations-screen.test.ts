import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import RecommendationsScreen from '@/presentation/views/recommendations-screen.vue'

const sections = ref<
  {
    titleKey: string
    titleParams: { name: string }
    results: { id: number; media_type: string; genre_ids: number[] }[]
    loading: boolean
    error: Error | null
    fetched: boolean
    seed: { id: number } | null
  }[]
>([
  {
    titleKey: 'recommendations.section.one',
    titleParams: { name: 'Arrival' },
    results: [
      { id: 101, media_type: 'movie', genre_ids: [28] },
      { id: 102, media_type: 'tv', genre_ids: [35] },
    ],
    loading: false,
    error: null,
    fetched: true,
    seed: { id: 1 },
  },
  {
    titleKey: 'recommendations.section.two',
    titleParams: { name: 'Severance' },
    results: [{ id: 201, media_type: 'movie', genre_ids: [18] }],
    loading: false,
    error: null,
    fetched: true,
    seed: null,
  },
])
const loading = ref(false)
const fetchSection = vi.fn()

vi.mock('@/application/use-recommendations', () => ({
  useRecommendations: () => ({
    sections,
    loading,
    fetchSection,
  }),
}))

const mockFilters = ref({ genres: [], mediaType: 'all' as const, yearFrom: null, yearTo: null })
const mockActiveFilterCount = ref(0)
const mockClearFilters = vi.fn()

vi.mock('@/application/use-recommendation-filters', () => ({
  useRecommendationFilters: () => ({
    filters: mockFilters,
    activeFilterCount: mockActiveFilterCount,
    clearFilters: mockClearFilters,
  }),
}))

vi.mock('@/application/use-genres', () => ({
  useGenres: () => ({
    genres: ref([]),
    fetchGenres: vi.fn(),
  }),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language: ref('en'),
  }),
}))

function createTestI18n(locale: 'en' | 'fr') {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'recommendations.title': 'Recommended for You',
        'recommendations.section.one': 'Because you liked Arrival',
        'recommendations.section.two': 'Because you liked Severance',
        'home.filters.genre': 'Genre',
        'home.filters.mediaType.all': 'All',
        'home.filters.mediaType.movie': 'Movies',
        'home.filters.mediaType.tv': 'Shows',
      },
      fr: {
        'recommendations.title': 'Recommandé pour vous',
        'recommendations.section.one': 'Parce que vous avez aimé Arrival',
        'recommendations.section.two': 'Parce que vous avez aimé Severance',
        'home.filters.genre': 'Genre',
        'home.filters.mediaType.all': 'Tout',
        'home.filters.mediaType.movie': 'Films',
        'home.filters.mediaType.tv': 'Séries',
      },
    },
  })
}

function renderRecommendationsScreen(locale: 'en' | 'fr' = 'en') {
  return mount(RecommendationsScreen, {
    global: {
      plugins: [createTestI18n(locale)],
      stubs: {
        RecommendationCarousel: {
          name: 'RecommendationCarousel',
          props: ['titleKey', 'fetched'],
          template:
            '<button data-testid="recommendation-carousel" @click="$emit(\'intersect\')">{{ titleKey }}-{{ fetched }}</button>',
        },
        FilterBar: {
          name: 'FilterBar',
          template:
            '<div data-testid="filter-bar"><button data-testid="update-filters" @click="$emit(\'update:modelValue\', { genres: [28], mediaType: \'movie\', yearFrom: null, yearTo: null })"></button></div>',
        },
      },
    },
  })
}

describe('RecommendationsScreen', () => {
  beforeEach(() => {
    loading.value = false
    mockFilters.value = { genres: [], mediaType: 'all' as const, yearFrom: null, yearTo: null }
    mockActiveFilterCount.value = 0
    mockClearFilters.mockReset()
    sections.value = [
      {
        titleKey: 'recommendations.section.one',
        titleParams: { name: 'Arrival' },
        results: [
          { id: 101, media_type: 'movie', genre_ids: [28] },
          { id: 102, media_type: 'tv', genre_ids: [35] },
        ],
        loading: false,
        error: null,
        fetched: true,
        seed: { id: 1 },
      },
      {
        titleKey: 'recommendations.section.two',
        titleParams: { name: 'Severance' },
        results: [{ id: 201, media_type: 'movie', genre_ids: [18] }],
        loading: false,
        error: null,
        fetched: true,
        seed: null,
      },
    ]
    fetchSection.mockReset()
  })

  it('renders the loading skeleton layout', () => {
    loading.value = true

    const wrapper = renderRecommendationsScreen()

    expect(wrapper.findAll('.animate-pulse')).toHaveLength(21)
  })

  it('renders carousels in English and handles intersect events by section index', async () => {
    const wrapper = renderRecommendationsScreen('en')

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['px-2', 'pb-8', 'pt-2', 'md:px-3', 'md:pb-10']),
    )
    expect(wrapper.get('h2').text()).toBe('Recommended for You')
    expect(wrapper.findAll('[data-testid="recommendation-carousel"]')).toHaveLength(2)

    const buttons = wrapper.findAll('[data-testid="recommendation-carousel"]')
    await buttons[1].trigger('click')

    expect(fetchSection).toHaveBeenCalledWith(1)
  })

  it('renders the localized title in French', () => {
    const wrapper = renderRecommendationsScreen('fr')
    expect(wrapper.get('h2').text()).toBe('Recommandé pour vous')
  })

  it('renders the filter bar', () => {
    const wrapper = renderRecommendationsScreen()
    expect(wrapper.find('[data-testid="filter-bar"]').exists()).toBe(true)
  })

  it('shows empty state with clear button when all sections are empty after filtering', async () => {
    // Set up empty results for all sections (simulating filtered out)
    sections.value = [
      {
        titleKey: 'recommendations.section.one',
        titleParams: { name: 'Arrival' },
        results: [],
        loading: false,
        error: null,
        fetched: true,
        seed: { id: 1 },
      },
      {
        titleKey: 'recommendations.section.two',
        titleParams: { name: 'Severance' },
        results: [],
        loading: false,
        error: null,
        fetched: true,
        seed: null,
      },
    ]
    mockActiveFilterCount.value = 1

    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      fallbackLocale: 'en',
      flatJson: true,
      messages: {
        en: {
          'recommendations.title': 'Recommended for You',
          'recommendations.noFilterResults': 'No recommendations match your filters.',
          'home.filters.clear': 'Clear Filters',
        },
      },
    })

    const wrapper = mount(RecommendationsScreen, {
      global: {
        plugins: [i18n],
        stubs: {
          RecommendationCarousel: {
            name: 'RecommendationCarousel',
            template: '<div></div>',
          },
          FilterBar: {
            name: 'FilterBar',
            template: '<div data-testid="filter-bar"></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('No recommendations match your filters.')
    expect(wrapper.find('button').text()).toBe('Clear Filters')

    await wrapper.find('button').trigger('click')
    expect(mockClearFilters).toHaveBeenCalled()
  })

  it('does not show empty state when sections are not all fetched', () => {
    sections.value = [
      {
        titleKey: 'recommendations.section.one',
        titleParams: { name: 'Arrival' },
        results: [],
        loading: false,
        error: null,
        fetched: false, // Not yet fetched
        seed: { id: 1 },
      },
    ]
    mockActiveFilterCount.value = 1

    const wrapper = renderRecommendationsScreen()

    // Should show loading/skeleton state, not empty state
    expect(wrapper.text()).not.toContain('No recommendations match your filters.')
  })

  it('shows sections that have loading or error state even when results are empty', () => {
    sections.value = [
      {
        titleKey: 'recommendations.section.one',
        titleParams: { name: 'Arrival' },
        results: [],
        loading: true,
        error: null,
        fetched: false,
        seed: { id: 1 },
      },
      {
        titleKey: 'recommendations.section.two',
        titleParams: { name: 'Severance' },
        results: [],
        loading: false,
        error: new Error('Failed'),
        fetched: true,
        seed: null,
      },
    ]

    const wrapper = renderRecommendationsScreen()

    // Both sections should be visible (loading + error state)
    expect(wrapper.findAll('[data-testid="recommendation-carousel"]')).toHaveLength(2)
  })

  it('updates filters when FilterBar emits update:modelValue', async () => {
    const wrapper = renderRecommendationsScreen()

    // Click the button in the stub that triggers filter update
    await wrapper.find('[data-testid="update-filters"]').trigger('click')

    // Verify the filters were updated via v-model
    expect(mockFilters.value).toEqual({
      genres: [28],
      mediaType: 'movie',
      yearFrom: null,
      yearTo: null,
    })
  })
})
