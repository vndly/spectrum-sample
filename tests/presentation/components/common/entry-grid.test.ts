import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EntryGrid from '@/presentation/components/common/entry-grid.vue'
import type { LibraryEntry } from '@/domain/library.schema'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

describe('EntryGrid', () => {
  beforeEach(() => {
    push.mockReset()
  })

  const entries: LibraryEntry[] = [
    {
      id: 1,
      mediaType: 'movie',
      title: 'Movie 1',
      posterPath: '/path1.jpg',
      rating: 4,
      favorite: false,
      status: 'watched',
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: '2024-01-01T00:00:00Z',
      // Added fields if I decide to add them to schema
      voteAverage: 8.5,
      releaseDate: '2024-01-01',
    } as unknown as LibraryEntry,
    {
      id: 2,
      mediaType: 'tv',
      title: 'Show 1',
      posterPath: '/path2.jpg',
      rating: 0,
      favorite: true,
      status: 'watchlist',
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: '2024-01-01T00:00:00Z',
      voteAverage: 7.2,
      releaseDate: '2023-01-01',
    } as unknown as LibraryEntry,
  ]

  it('renders a card for each entry and maps library entries to card props', () => {
    const wrapper = mount(EntryGrid, {
      props: {
        entries,
      },
      global: {
        stubs: {
          MovieCard: {
            props: ['item'],
            template:
              '<button data-testid="movie-card" @click="$emit(\'click\')">{{ item.media_type }}-{{ item.id }}-{{ item.first_air_date }}</button>',
          },
        },
      },
    })

    const cards = wrapper.findAll('[data-testid="movie-card"]')
    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toContain('movie-1-2024-01-01')
    expect(cards[1].text()).toContain('tv-2-2023-01-01')
  })

  it('falls back vote and date fields when library metadata is missing', () => {
    const wrapper = mount(EntryGrid, {
      props: {
        entries: [
          {
            id: 3,
            mediaType: 'movie',
            title: 'Unknown',
            posterPath: null,
            rating: 0,
            favorite: false,
            status: 'none',
            tags: [],
            notes: '',
            watchDates: [],
            addedAt: '2024-01-01T00:00:00Z',
          } as unknown as LibraryEntry,
        ],
      },
      global: {
        stubs: {
          MovieCard: {
            props: ['item'],
            template:
              '<div data-testid="movie-card">{{ item.vote_average }}|{{ item.release_date }}|{{ item.first_air_date }}</div>',
          },
        },
      },
    })

    expect(wrapper.get('[data-testid="movie-card"]').text()).toBe('0||')
  })

  it('navigates to the movie detail route when a movie card emits click', async () => {
    const wrapper = mount(EntryGrid, {
      props: {
        entries: [entries[0]],
      },
      global: {
        stubs: {
          MovieCard: {
            props: ['item'],
            template: '<button data-testid="movie-card" @click="$emit(\'click\')"></button>',
          },
        },
      },
    })

    await wrapper.get('[data-testid="movie-card"]').trigger('click')

    expect(push).toHaveBeenCalledWith('/movie/1')
  })

  it('navigates to the show detail route when a TV card emits click', async () => {
    const wrapper = mount(EntryGrid, {
      props: {
        entries: [entries[1]],
      },
      global: {
        stubs: {
          MovieCard: {
            props: ['item'],
            template: '<button data-testid="movie-card" @click="$emit(\'click\')"></button>',
          },
        },
      },
    })

    await wrapper.get('[data-testid="movie-card"]').trigger('click')

    expect(push).toHaveBeenCalledWith('/show/2')
  })
})
