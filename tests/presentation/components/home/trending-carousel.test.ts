import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TrendingCarousel from '@/presentation/components/home/trending-carousel.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Mock i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

describe('TrendingCarousel', () => {
  const mockItems = [
    {
      id: 1,
      media_type: 'movie' as const,
      title: 'Movie Title',
      backdrop_path: '/backdrop.jpg',
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
      vote_count: 100
    },
    {
      id: 2,
      media_type: 'tv' as const,
      name: 'Show Name',
      backdrop_path: '/backdrop2.jpg',
      poster_path: '/poster2.jpg',
      vote_average: 7.0,
      first_air_date: '2024',
      original_name: 'Show Name',
      overview: 'Overview',
      genre_ids: [2],
      adult: false,
      original_language: 'en',
      origin_country: ['US'],
      popularity: 100,
      vote_count: 100
    },
  ]

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/movie/:id', name: 'movie-detail', component: {} },
      { path: '/show/:id', name: 'show-detail', component: {} },
    ],
  })

  it('renders loading state', () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: [], loading: true },
    })
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(3)
  })

  it('renders items when not loading', () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Movie Title')
    expect(wrapper.text()).toContain('Show Name')
    expect(wrapper.findAll('img')).toHaveLength(2)
  })

  it('navigates to detail page on click', async () => {
    const push = vi.spyOn(router, 'push')
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
      global: { plugins: [router] },
    })

    await wrapper.find('[role="button"]').trigger('click')
    expect(push).toHaveBeenCalledWith('/movie/1')
  })
})
