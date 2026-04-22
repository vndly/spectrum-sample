/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TrendingCarousel from '@/presentation/components/home/trending-carousel.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

describe('TrendingCarousel', () => {
  beforeEach(() => {
    push.mockReset()
  })

  const mockItems = [
    {
      id: 1,
      media_type: 'movie' as const,
      title: 'Movie Title',
      backdrop_path: null,
      poster_path: '/poster.jpg',
      vote_average: 8.0,
      release_date: '2024',
      original_title: 'Movie Title',
      overview: 'Overview',
      genre_ids: [1],
      adult: false,
      original_language: 'en',
      video: false,
      popularity: 100,
      vote_count: 100,
    },
    {
      id: 2,
      media_type: 'tv' as const,
      name: 'Show Name',
      backdrop_path: '/backdrop2.jpg',
      poster_path: '/poster2.jpg',
      vote_average: 7.0,
      first_air_date: 'not-a-date',
      original_name: 'Show Name',
      overview: 'Overview',
      genre_ids: [2],
      adult: false,
      original_language: 'en',
      origin_country: ['US'],
      popularity: 100,
      vote_count: 100,
    },
  ]

  it('renders loading state', () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: [], loading: true },
    })
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(3)
  })

  it('renders items when not loading', () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    expect(wrapper.text()).toContain('Movie Title')
    expect(wrapper.text()).toContain('Show Name')
    expect(wrapper.findAll('img')).toHaveLength(2)
    expect(wrapper.findAll('img')[0].attributes('src')).toContain('/poster.jpg')
    expect(wrapper.findAll('img')[0].attributes('src')).toContain('/w500/poster.jpg')
    expect(wrapper.findAll('img')[0].attributes('srcset')).toContain('/w342/poster.jpg 342w')
    expect(wrapper.findAll('img')[1].attributes('src')).toContain('/w1280/backdrop2.jpg')
    expect(wrapper.text()).not.toContain('not-a-date')
  })

  it('navigates to detail pages on click and keyboard activation', async () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    const cards = wrapper.findAll('[role="button"]')
    await cards[0].trigger('click')
    await cards[1].trigger('keydown.enter')
    await cards[0].trigger('keydown.space')

    expect(push).toHaveBeenNthCalledWith(1, '/movie/1')
    expect(push).toHaveBeenNthCalledWith(2, '/show/2')
    expect(push).toHaveBeenNthCalledWith(3, '/movie/1')
  })

  it('omits the year when the item has no release date', () => {
    const wrapper = mount(TrendingCarousel, {
      props: {
        items: [
          {
            ...mockItems[0],
            id: 3,
            release_date: '',
          },
        ],
        loading: false,
      },
    })

    expect(wrapper.text()).not.toContain('·')
  })

  it('falls back to an empty image source when no artwork is available', () => {
    const wrapper = mount(TrendingCarousel, {
      props: {
        items: [
          {
            ...mockItems[0],
            id: 4,
            backdrop_path: null,
            poster_path: null,
          },
        ],
        loading: false,
      },
    })

    expect(wrapper.get('img').attributes('src')).toBe('')
  })

  it('renders scroll controls and scrolls the carousel when clicked', async () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    const scrollContainer = wrapper.get('[data-testid="trending-carousel"]').element as HTMLElement
    const scrollBy = vi.fn()
    scrollContainer.scrollBy = scrollBy
    Object.defineProperty(scrollContainer, 'clientWidth', {
      configurable: true,
      value: 600,
    })

    expect(wrapper.get('[data-testid="trending-carousel"]').classes()).toContain(
      '[scrollbar-width:none]',
    )

    await wrapper.get('[data-testid="trending-scroll-next"]').trigger('click')
    await wrapper.get('[data-testid="trending-scroll-previous"]').trigger('click')

    expect(scrollBy).toHaveBeenNthCalledWith(1, {
      left: 510,
      behavior: 'smooth',
    })
    expect(scrollBy).toHaveBeenNthCalledWith(2, {
      left: -510,
      behavior: 'smooth',
    })
  })

  it('does nothing when the scroll controls are triggered without a carousel ref', async () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    ;(wrapper.vm as any).carouselRef = null
    ;(wrapper.vm as any).scrollCarousel('next')

    expect(push).not.toHaveBeenCalled()
  })

  it('hides scroll controls when there is only one item', () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: [mockItems[0]], loading: false },
    })

    expect(wrapper.find('[data-testid="trending-scroll-next"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="trending-scroll-previous"]').exists()).toBe(false)
  })
})
