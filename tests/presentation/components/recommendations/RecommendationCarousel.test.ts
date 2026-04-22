import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import RecommendationCarousel from '@/presentation/components/recommendations/RecommendationCarousel.vue'

const observe = vi.fn()
const isIntersecting = ref(false)
const push = vi.fn()

vi.mock('@/presentation/composables/use-intersection-observer', () => ({
  useIntersectionObserver: () => ({
    observe,
    isIntersecting,
    unobserve: vi.fn(),
  }),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  flatJson: true,
  messages: {
    en: {
      'recommendations.section.title': 'Because you liked {name}',
      'recommendations.scrollNext': 'Scroll recommendations right',
      'recommendations.scrollPrevious': 'Scroll recommendations left',
      'errors.generic': 'Something went wrong',
      'common.retry': 'Retry',
    },
  },
})

describe('RecommendationCarousel', () => {
  beforeEach(() => {
    observe.mockReset()
    push.mockReset()
    isIntersecting.value = false
  })

  const movieItem = {
    id: 1,
    media_type: 'movie' as const,
    title: 'Arrival',
    original_title: 'Arrival',
    overview: 'Overview',
    release_date: '2016-11-11',
    poster_path: '/arrival.jpg',
    backdrop_path: '/arrival-backdrop.jpg',
    vote_average: 8,
    vote_count: 100,
    popularity: 10,
    genre_ids: [18],
    adult: false,
    original_language: 'en',
    video: false,
  }

  const showItem = {
    id: 2,
    media_type: 'tv' as const,
    name: 'Severance',
    original_name: 'Severance',
    overview: 'Overview',
    first_air_date: '2022-02-18',
    poster_path: null,
    backdrop_path: '/severance-backdrop.jpg',
    vote_average: 8,
    vote_count: 100,
    popularity: 10,
    genre_ids: [18],
    adult: false,
    original_language: 'en',
    origin_country: ['US'],
  }

  function renderCarousel(overrides: Partial<Record<string, unknown>> = {}) {
    return mount(RecommendationCarousel, {
      props: {
        titleKey: 'recommendations.section.title',
        titleParams: { name: 'Arrival' },
        items: [movieItem, showItem],
        loading: false,
        error: null,
        fetched: true,
        ...overrides,
      },
      global: {
        plugins: [i18n],
      },
    })
  }

  it('starts observing on mount and emits intersect when the observer turns visible', async () => {
    const wrapper = renderCarousel()

    expect(observe).toHaveBeenCalledTimes(1)

    isIntersecting.value = true
    await nextTick()

    expect(wrapper.emitted('intersect')).toHaveLength(1)
  })

  it('renders the error state and re-emits intersect from the retry button', async () => {
    const wrapper = renderCarousel({
      items: [],
      error: new Error('boom'),
    })

    expect(wrapper.text()).toContain('Something went wrong')

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('intersect')).toHaveLength(1)
  })

  it('renders the loading and empty-state branches', () => {
    const loadingWrapper = renderCarousel({
      items: [],
      loading: true,
      fetched: false,
    })
    expect(loadingWrapper.findAll('.animate-pulse')).toHaveLength(6)

    const pendingWrapper = renderCarousel({
      items: [],
      loading: false,
      fetched: false,
    })
    expect(pendingWrapper.findAll('.animate-pulse')).toHaveLength(6)

    const emptyWrapper = renderCarousel({
      items: [],
    })
    expect(emptyWrapper.find('.h-4').exists()).toBe(true)
  })

  it('renders carousel items and navigates on click and keyboard activation', async () => {
    const wrapper = renderCarousel()

    expect(wrapper.text()).toContain('Because you liked Arrival')
    expect(wrapper.text()).toContain('Arrival')
    expect(wrapper.text()).toContain('Severance')
    expect(wrapper.find('img')?.attributes('alt')).toBe('Arrival')
    expect(wrapper.find('img')?.attributes('srcset')).toContain('/w500/arrival.jpg 500w')

    const cards = wrapper.findAll('[role="button"]')
    await cards[0].trigger('click')
    await cards[1].trigger('keydown.enter')
    await cards[0].trigger('keydown.space')

    expect(push).toHaveBeenNthCalledWith(1, '/movie/1')
    expect(push).toHaveBeenNthCalledWith(2, '/show/2')
    expect(push).toHaveBeenNthCalledWith(3, '/movie/1')
  })

  it('renders scroll controls and scrolls the carousel when clicked', async () => {
    const wrapper = renderCarousel()

    const scrollContainer = wrapper.get('[data-testid="recommendation-carousel"]')
      .element as HTMLElement
    const scrollBy = vi.fn()
    scrollContainer.scrollBy = scrollBy
    Object.defineProperty(scrollContainer, 'clientWidth', {
      configurable: true,
      value: 600,
    })

    expect(wrapper.get('[data-testid="recommendation-carousel"]').classes()).toContain(
      '[scrollbar-width:none]',
    )
    expect(wrapper.get('[data-testid="recommendation-scroll-next"]').attributes('aria-label')).toBe(
      'Scroll recommendations right',
    )
    expect(
      wrapper.get('[data-testid="recommendation-scroll-previous"]').attributes('aria-label'),
    ).toBe('Scroll recommendations left')

    await wrapper.get('[data-testid="recommendation-scroll-next"]').trigger('click')
    await wrapper.get('[data-testid="recommendation-scroll-previous"]').trigger('click')

    expect(scrollBy).toHaveBeenNthCalledWith(1, {
      left: 510,
      behavior: 'smooth',
    })
    expect(scrollBy).toHaveBeenNthCalledWith(2, {
      left: -510,
      behavior: 'smooth',
    })
  })

  it('hides scroll controls when there is only one recommendation', () => {
    const wrapper = renderCarousel({
      items: [movieItem],
    })

    expect(wrapper.find('[data-testid="recommendation-scroll-next"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="recommendation-scroll-previous"]').exists()).toBe(false)
  })

  it('renders fallback text when a recommendation has no poster', () => {
    const wrapper = renderCarousel({
      items: [showItem],
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Severance')
  })
})
