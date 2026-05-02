import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import PersonBio from '@/presentation/components/details/person-bio.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  flatJson: true,
  messages: {
    en: {
      'person.biography': 'Biography',
      'person.biographyEmpty': 'No biography available.',
      'person.readLess': 'Read less',
      'person.readMore': 'Read more',
    },
  },
})

describe('PersonBio', () => {
  it('truncates long biography and expands with localized controls', async () => {
    // Arrange
    const longBiography = Array.from({ length: 20 }, () => 'Long biography text.').join(' ')
    const wrapper = mount(PersonBio, {
      props: { biography: longBiography },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.get('h2').text()).toBe('Biography')
    expect(wrapper.get('[data-testid="person-biography"]').classes()).toContain('line-clamp-6')
    expect(wrapper.get('[data-testid="person-bio-toggle"]').text()).toBe('Read more')

    // Act
    await wrapper.get('[data-testid="person-bio-toggle"]').trigger('click')

    // Assert
    expect(wrapper.get('[data-testid="person-biography"]').classes()).not.toContain('line-clamp-6')
    expect(wrapper.get('[data-testid="person-bio-toggle"]').text()).toBe('Read less')
  })

  it('does not show expansion controls for short biography', () => {
    // Arrange & Act
    const wrapper = mount(PersonBio, {
      props: { biography: 'Short biography.' },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.text()).toContain('Short biography.')
    expect(wrapper.find('[data-testid="person-bio-toggle"]').exists()).toBe(false)
  })

  it('renders empty state when biography is missing', () => {
    // Arrange & Act
    const wrapper = mount(PersonBio, {
      props: { biography: null },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.text()).toContain('No biography available.')
  })
})
