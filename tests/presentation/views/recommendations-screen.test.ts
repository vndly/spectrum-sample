import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi } from 'vitest'
import RecommendationsScreen from '@/presentation/views/recommendations-screen.vue'
import RecommendationCarousel from '@/presentation/components/recommendations/RecommendationCarousel.vue'

// Mock the composables
vi.mock('@/application/use-recommendations', () => ({
  useRecommendations: vi.fn(() => ({
    sections: [
      {
        titleKey: 'recommendations.trending.title',
        results: [],
        loading: false,
        error: null,
        fetched: false,
      },
    ],
    loading: false,
    fetchSection: vi.fn(),
  })),
}))

vi.mock('@/application/use-library-entries', () => ({
  useLibraryEntries: vi.fn(() => ({
    allEntries: { value: [] },
  })),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: vi.fn(() => ({
    settings: { value: { language: 'en' } },
  })),
}))

// Mock router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
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
        'recommendations.trending.title': 'Trending Today',
      },
      fr: {
        'recommendations.title': 'Recommandé pour vous',
        'recommendations.trending.title': 'Tendances du jour',
      },
    },
  })
}

function renderRecommendationsScreen(locale: 'en' | 'fr') {
  return mount(RecommendationsScreen, {
    global: {
      plugins: [createTestI18n(locale)],
      stubs: {
        RecommendationCarousel: true,
      },
    },
  })
}

describe('RecommendationsScreen', () => {
  it('renders the recommendations title in English', () => {
    const wrapper = renderRecommendationsScreen('en')
    expect(wrapper.get('h2').text()).toBe('Recommended for You')
  })

  it('renders the recommendations title in French', () => {
    const wrapper = renderRecommendationsScreen('fr')
    expect(wrapper.get('h2').text()).toBe('Recommandé pour vous')
  })

  it('renders recommendation carousels', () => {
    const wrapper = renderRecommendationsScreen('en')
    expect(wrapper.findComponent(RecommendationCarousel).exists()).toBe(true)
  })
})
