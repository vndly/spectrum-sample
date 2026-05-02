import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import FilmographyCard from '@/presentation/components/details/filmography-card.vue'
import type { PersonCreditViewModel } from '@/application/use-person'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  flatJson: true,
  messages: {
    en: {
      'person.media.movie': 'Movie',
      'person.media.tv': 'Show',
      'person.posterAlt': '{title} poster',
      'person.tba': 'TBA',
    },
  },
})

const routerLinkStub = {
  props: ['to'],
  template: '<a :href="to" data-testid="filmography-link"><slot /></a>',
}

describe('FilmographyCard', () => {
  it('renders required credit fields, badge, poster, and route', () => {
    // Arrange
    const credit: PersonCreditViewModel = {
      id: 550,
      mediaType: 'movie',
      title: 'Fight Club',
      character: 'Tyler Durden',
      releaseYear: '1999',
      posterUrl: 'https://image.tmdb.org/t/p/w185/poster.jpg',
      route: '/movie/550',
    }

    // Act
    const wrapper = mount(FilmographyCard, {
      props: { credit },
      global: { plugins: [i18n], stubs: { RouterLink: routerLinkStub } },
    })

    // Assert
    expect(wrapper.get('[data-testid="filmography-link"]').attributes('href')).toBe('/movie/550')
    expect(wrapper.text()).toContain('Fight Club')
    expect(wrapper.text()).toContain('1999')
    expect(wrapper.text()).toContain('Movie')
    expect(wrapper.text()).toContain('Tyler Durden')
    expect(wrapper.get('img').attributes('loading')).toBe('lazy')
    expect(wrapper.get('img').attributes('alt')).toBe('Fight Club poster')
  })

  it('renders Show badge and TBA fallback for missing dates', () => {
    // Arrange
    const credit: PersonCreditViewModel = {
      id: 1396,
      mediaType: 'tv',
      title: 'Breaking Bad',
      character: null,
      releaseYear: null,
      posterUrl: null,
      route: '/show/1396',
    }

    // Act
    const wrapper = mount(FilmographyCard, {
      props: { credit },
      global: { plugins: [i18n], stubs: { RouterLink: routerLinkStub } },
    })

    // Assert
    expect(wrapper.text()).toContain('Show')
    expect(wrapper.text()).toContain('TBA')
    expect(wrapper.find('[data-testid="filmography-poster-placeholder"]').exists()).toBe(true)
  })

  it('uses browser-default keyboard activation through RouterLink semantics', () => {
    // Arrange
    const credit: PersonCreditViewModel = {
      id: 550,
      mediaType: 'movie',
      title: 'Fight Club',
      character: 'Tyler Durden',
      releaseYear: '1999',
      posterUrl: null,
      route: '/movie/550',
    }

    // Act
    const wrapper = mount(FilmographyCard, {
      props: { credit },
      global: { plugins: [i18n], stubs: { RouterLink: routerLinkStub } },
    })

    // Assert
    expect(wrapper.get('[data-testid="filmography-link"]').element.tagName).toBe('A')
    expect(wrapper.get('[data-testid="filmography-link"]').classes()).toContain('min-h-11')
  })
})
