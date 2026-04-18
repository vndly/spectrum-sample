import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PopularGrid from '@/presentation/components/home/popular-grid.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

describe('PopularGrid', () => {
  beforeEach(() => {
    push.mockReset()
  })

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
      vote_count: 100,
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
      vote_count: 100,
    },
  ]

  it('renders loading state', () => {
    const wrapper = mount(PopularGrid, {
      props: { title: 'Popular Movies', items: [], loading: true },
      global: {
        stubs: {
          MovieCardSkeleton: {
            template: '<div data-testid="movie-card-skeleton"></div>',
          },
        },
      },
    })
    expect(wrapper.find('[data-testid="popular-grid-loading"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="movie-card-skeleton"]')).toHaveLength(6)
  })

  it('renders items in the default grid layout', () => {
    const wrapper = mount(PopularGrid, {
      props: { title: 'Popular Movies', items: mockItems, loading: false },
      global: {
        stubs: {
          MovieCard: {
            props: ['item', 'variant'],
            template:
              '<button data-testid="movie-card" @click="$emit(\'click\')">{{ item.media_type }}-{{ variant }}</button>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Popular Movies')
    expect(wrapper.get('[data-testid="popular-grid"]').classes()).toContain('grid')
    expect(wrapper.findAll('[data-testid="movie-card"]')).toHaveLength(2)
  })

  it('renders list layout and routes to the movie detail screen', async () => {
    const wrapper = mount(PopularGrid, {
      props: {
        title: 'Popular Movies',
        items: [mockItems[0]],
        loading: false,
        variant: 'list',
      },
      global: {
        stubs: {
          MovieCard: {
            props: ['item', 'variant'],
            template:
              '<button data-testid="movie-card" @click="$emit(\'click\')">{{ item.media_type }}-{{ variant }}</button>',
          },
        },
      },
    })

    expect(wrapper.get('[data-testid="popular-grid"]').classes()).toContain('flex')
    expect(wrapper.text()).toContain('movie-list')

    await wrapper.get('[data-testid="movie-card"]').trigger('click')

    expect(push).toHaveBeenCalledWith('/movie/1')
  })

  it('routes to the show detail screen for TV results', async () => {
    const wrapper = mount(PopularGrid, {
      props: {
        title: 'Popular Shows',
        items: [mockItems[1]],
        loading: false,
        variant: 'list',
      },
      global: {
        stubs: {
          MovieCard: {
            props: ['item', 'variant'],
            template:
              '<button data-testid="movie-card" @click="$emit(\'click\')">{{ item.media_type }}-{{ variant }}</button>',
          },
        },
      },
    })

    await wrapper.get('[data-testid="movie-card"]').trigger('click')

    expect(push).toHaveBeenCalledWith('/show/2')
  })
})
