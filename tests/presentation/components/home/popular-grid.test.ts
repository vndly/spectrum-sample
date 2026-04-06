import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PopularGrid from '@/presentation/components/home/popular-grid.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Mock i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

describe('PopularGrid', () => {
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
  ]

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/movie/:id', name: 'movie-detail', component: {} },
    ],
  })

  it('renders loading state', () => {
    const wrapper = mount(PopularGrid, {
      props: { title: 'Popular Movies', items: [], loading: true },
    })
    expect(wrapper.find('[data-testid="popular-grid-loading"]').exists()).toBe(true)
  })

  it('renders items when not loading', () => {
    const wrapper = mount(PopularGrid, {
      props: { title: 'Popular Movies', items: mockItems, loading: false },
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain('Popular Movies')
    expect(wrapper.text()).toContain('Movie Title')
    expect(wrapper.findComponent({ name: 'MovieCard' }).exists()).toBe(true)
  })
})
