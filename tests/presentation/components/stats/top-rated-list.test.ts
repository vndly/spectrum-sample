import { RouterLinkStub, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import TopRatedList from '@/presentation/components/stats/top-rated-list.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  flatJson: true,
  messages: {
    en: {
      'stats.topRated.title': 'Top Rated',
      'stats.topRated.empty': 'Nothing rated yet',
    },
  },
})

describe('TopRatedList', () => {
  it('renders ranked items with links, posters, and formatted ratings', () => {
    const wrapper = mount(TopRatedList, {
      props: {
        items: [
          {
            id: 1,
            mediaType: 'movie',
            title: 'Arrival',
            rating: 4.25,
            posterPath: '/arrival.jpg',
            favorite: false,
            status: 'watched',
            tags: [],
            notes: '',
            watchDates: [],
            addedAt: '2026-01-01',
          },
        ],
      },
      global: {
        plugins: [i18n],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Top Rated')
    expect(wrapper.get('img').attributes('alt')).toBe('Arrival')
    expect(wrapper.text()).toContain('4.3')
    expect(wrapper.getComponent(RouterLinkStub).props('to')).toBe('/movie/1')
  })

  it('renders the poster fallback and empty state branches', () => {
    const wrapper = mount(TopRatedList, {
      props: {
        items: [
          {
            id: 2,
            mediaType: 'tv',
            title: 'Severance',
            rating: 5,
            posterPath: null,
            favorite: false,
            status: 'watched',
            tags: [],
            notes: '',
            watchDates: [],
            addedAt: '2026-01-01',
          },
        ],
      },
      global: {
        plugins: [i18n],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('1')

    const emptyWrapper = mount(TopRatedList, {
      props: {
        items: [],
      },
      global: {
        plugins: [i18n],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(emptyWrapper.text()).toContain('Nothing rated yet')
  })

  it('renders TV links correctly', () => {
    const wrapper = mount(TopRatedList, {
      props: {
        items: [
          {
            id: 2,
            mediaType: 'tv',
            title: 'Severance',
            rating: 5,
            posterPath: '/severance.jpg',
            favorite: false,
            status: 'watched',
            tags: [],
            notes: '',
            watchDates: [],
            addedAt: '2026-01-01',
          },
        ],
      },
      global: {
        plugins: [i18n],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.getComponent(RouterLinkStub).props('to')).toBe('/tv/2')
  })
})
