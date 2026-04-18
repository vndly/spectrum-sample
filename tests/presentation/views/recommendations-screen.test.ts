import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import RecommendationsScreen from '@/presentation/views/recommendations-screen.vue'

const sections = ref([
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
      },
      fr: {
        'recommendations.title': 'Recommandé pour vous',
        'recommendations.section.one': 'Parce que vous avez aimé Arrival',
        'recommendations.section.two': 'Parce que vous avez aimé Severance',
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
      },
    },
  })
}

describe('RecommendationsScreen', () => {
  beforeEach(() => {
    loading.value = false
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
    fetchSection.mockReset()
  })

  it('renders the loading skeleton layout', () => {
    loading.value = true

    const wrapper = renderRecommendationsScreen()

    expect(wrapper.findAll('.animate-pulse')).toHaveLength(21)
  })

  it('renders carousels in English and handles intersect events by section index', async () => {
    const wrapper = renderRecommendationsScreen('en')

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
})
