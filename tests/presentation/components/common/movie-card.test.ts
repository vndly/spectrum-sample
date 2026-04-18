/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MovieCard from '@/presentation/components/common/movie-card.vue'
import type { MovieListItem } from '@/domain/movie.schema'
import type { ShowListItem } from '@/domain/show.schema'

describe('MovieCard', () => {
  it('renders a grid movie card with poster, year, and rating badge', () => {
    const wrapper = mount(MovieCard, {
      props: {
        item: {
          id: 550,
          media_type: 'movie',
          title: 'Fight Club',
          original_title: 'Fight Club',
          overview: 'Overview',
          release_date: '1999-10-15',
          poster_path: '/fight-club.jpg',
          backdrop_path: '/fight-club-backdrop.jpg',
          vote_average: 8.4,
          vote_count: 100,
          popularity: 10,
          genre_ids: [18],
          adult: false,
          original_language: 'en',
          video: false,
        },
      },
    })

    expect(wrapper.text()).toContain('Fight Club')
    expect(wrapper.text()).toContain('1999')
    expect(wrapper.text()).toContain('8.4')
    expect(wrapper.get('img').attributes('alt')).toBe('Fight Club')
  })

  it('renders a list TV card with fallback art and media label', () => {
    const wrapper = mount(MovieCard, {
      props: {
        item: {
          id: 1396,
          media_type: 'tv',
          name: 'Breaking Bad',
          original_name: 'Breaking Bad',
          overview: 'Overview',
          first_air_date: '2008-01-20',
          poster_path: null,
          backdrop_path: '/breaking-bad-backdrop.jpg',
          vote_average: 9.5,
          vote_count: 100,
          popularity: 10,
          genre_ids: [18],
          adult: false,
          original_language: 'en',
          origin_country: ['US'],
        },
        variant: 'list',
      },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Breaking Bad')
    expect(wrapper.text()).toContain('Show')
    expect(wrapper.text()).toContain('2008')
    expect(wrapper.text()).toContain('9.5')
  })

  it('renders a list movie card with poster art and media label', () => {
    const wrapper = mount(MovieCard, {
      props: {
        item: {
          id: 11,
          media_type: 'movie',
          title: 'Arrival',
          release_date: '2016-11-11',
          poster_path: '/arrival.jpg',
          vote_average: 0,
        } as any,
        variant: 'list',
      },
    })

    expect(wrapper.get('img').attributes('alt')).toBe('Arrival')
    expect(wrapper.text()).toContain('Movie')
    expect(wrapper.text()).toContain('2016')
  })

  it('uses the person name branch and suppresses year and media label', () => {
    const wrapper = mount(MovieCard, {
      props: {
        item: {
          id: 287,
          media_type: 'person',
          name: 'Brad Pitt',
          poster_path: null,
          vote_average: 0,
        } as unknown as (MovieListItem | ShowListItem) & { media_type?: 'movie' | 'tv' | 'person' },
        variant: 'list',
      },
    })

    expect(wrapper.text()).toContain('Brad Pitt')
    expect(wrapper.text()).not.toContain('Movie')
    expect(wrapper.text()).not.toContain('Show')
  })

  it('falls back to empty title and 0.0 rating when name, title, and rating are missing', () => {
    const wrapper = mount(MovieCard, {
      props: {
        item: {
          id: 99,
          media_type: 'movie',
          poster_path: null,
        } as any,
      },
    })

    expect(wrapper.attributes('aria-label')).toBe('')
    expect(wrapper.text()).not.toContain('0.0')
    const setupState = (wrapper.vm as any).$?.setupState
    expect(setupState.displayTitle).toBe('')
    expect(setupState.displayRating).toBe('0.0')
  })

  it('emits click on pointer and keyboard activation', async () => {
    const wrapper = mount(MovieCard, {
      props: {
        item: {
          id: 1,
          media_type: 'movie',
          title: 'Arrival',
          original_title: 'Arrival',
          overview: 'Overview',
          release_date: '',
          poster_path: null,
          backdrop_path: null,
          vote_average: 0,
          vote_count: 0,
          popularity: 0,
          genre_ids: [],
          adult: false,
          original_language: 'en',
          video: false,
        },
      },
    })

    const article = wrapper.get('[role="button"]')
    await article.trigger('click')
    await article.trigger('keydown', { key: 'Enter' })
    await article.trigger('keydown', { key: ' ' })

    expect(wrapper.emitted('click')).toHaveLength(3)
  })

  it('ignores unrelated keyboard input', async () => {
    const wrapper = mount(MovieCard, {
      props: {
        item: {
          id: 1,
          media_type: 'movie',
          title: 'Arrival',
          poster_path: null,
          vote_average: 0,
        } as any,
      },
    })

    await wrapper.get('[role="button"]').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
