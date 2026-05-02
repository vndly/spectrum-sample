import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import PersonHero from '@/presentation/components/details/person-hero.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  flatJson: true,
  messages: {
    en: {
      'person.born': 'Born',
      'person.died': 'Died',
      'person.profileAlt': '{name} profile image',
    },
  },
})

describe('PersonHero', () => {
  it('renders profile image with localized alt text and responsive sizing', () => {
    // Arrange & Act
    const wrapper = mount(PersonHero, {
      props: {
        name: 'Brad Pitt',
        knownForDepartment: 'Acting',
        profileUrl: 'https://image.tmdb.org/t/p/w185/profile.jpg',
        birthInfo: null,
        deathInfo: null,
      },
      global: { plugins: [i18n] },
    })

    // Assert
    const image = wrapper.get('[data-testid="person-profile-image"]')
    expect(image.attributes('src')).toBe('https://image.tmdb.org/t/p/w185/profile.jpg')
    expect(image.attributes('alt')).toBe('Brad Pitt profile image')
    expect(image.classes()).toContain('size-40')
    expect(image.classes()).toContain('md:size-[200px]')
  })

  it('renders fallback icon when profile URL is missing', () => {
    // Arrange & Act
    const wrapper = mount(PersonHero, {
      props: {
        name: 'Brad Pitt',
        knownForDepartment: 'Acting',
        profileUrl: null,
        birthInfo: null,
        deathInfo: null,
      },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="person-profile-image"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="person-profile-placeholder"]').exists()).toBe(true)
  })

  it('renders name and known-for department', () => {
    // Arrange & Act
    const wrapper = mount(PersonHero, {
      props: {
        name: 'Brad Pitt',
        knownForDepartment: 'Acting',
        profileUrl: null,
        birthInfo: null,
        deathInfo: null,
      },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.text()).toContain('Brad Pitt')
    expect(wrapper.text()).toContain('Acting')
  })

  it('renders birth and death metadata below the name and department', () => {
    // Arrange & Act
    const wrapper = mount(PersonHero, {
      props: {
        name: 'Brad Pitt',
        knownForDepartment: 'Acting',
        profileUrl: null,
        birthInfo: 'December 18, 1963 - Shawnee, Oklahoma, USA',
        deathInfo: 'January 1, 2020',
      },
      global: { plugins: [i18n] },
    })

    // Assert
    const info = wrapper.get('[data-testid="person-hero-info"]')
    expect(info.text()).toContain('Born')
    expect(info.text()).toContain('December 18, 1963 - Shawnee, Oklahoma, USA')
    expect(info.text()).toContain('Died')
    expect(info.text()).toContain('January 1, 2020')
  })
})
