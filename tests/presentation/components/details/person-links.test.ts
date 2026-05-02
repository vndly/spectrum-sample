import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import PersonLinks from '@/presentation/components/details/person-links.vue'
import type { PersonExternalLinkViewModel } from '@/application/use-person'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  flatJson: true,
  messages: {
    en: {
      'person.external.imdb': 'Open IMDB profile',
      'person.external.instagram': 'Open Instagram profile',
      'person.external.twitter': 'Open Twitter profile',
    },
  },
})

describe('PersonLinks', () => {
  it('renders available external links with secure new-tab attributes', () => {
    // Arrange
    const links: PersonExternalLinkViewModel[] = [
      { type: 'imdb', url: 'https://www.imdb.com/name/nm0000093' },
      { type: 'instagram', url: 'https://www.instagram.com/bradpitt' },
      { type: 'twitter', url: 'https://twitter.com/bradpitt' },
    ]

    // Act
    const wrapper = mount(PersonLinks, {
      props: { links },
      global: { plugins: [i18n] },
    })
    const labels = {
      imdb: 'Open IMDB profile',
      instagram: 'Open Instagram profile',
      twitter: 'Open Twitter profile',
    }

    // Assert
    for (const link of links) {
      const anchor = wrapper.get(`[data-testid="person-link-${link.type}"]`)
      expect(anchor.attributes('href')).toBe(link.url)
      expect(anchor.attributes('target')).toBe('_blank')
      expect(anchor.attributes('rel')).toBe('noopener noreferrer')
      expect(anchor.attributes('aria-label')).toBe(labels[link.type])
    }
  })

  it('hides missing links and renders only provided entries', () => {
    // Arrange & Act
    const wrapper = mount(PersonLinks, {
      props: { links: [{ type: 'imdb', url: 'https://www.imdb.com/name/nm0000093' }] },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="person-link-imdb"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="person-link-instagram"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="person-link-twitter"]').exists()).toBe(false)
  })

  it('hides the entire section when no links are available', () => {
    // Arrange & Act
    const wrapper = mount(PersonLinks, {
      props: { links: [] },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="person-links"]').exists()).toBe(false)
  })
})
