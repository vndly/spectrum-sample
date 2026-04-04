import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CastCarousel from '@/presentation/components/details/cast-carousel.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      details: {
        cast: {
          title: 'Cast',
        },
      },
    },
  },
})

describe('CastCarousel', () => {
  const createCastMember = (
    id: number,
    order: number,
    profilePath: string | null = '/profile.jpg',
  ) => ({
    id,
    name: `Actor ${id}`,
    character: `Character ${id}`,
    profile_path: profilePath,
    order,
  })

  it('renders horizontally scrollable container (ED-03-01)', () => {
    // Arrange & Act
    const wrapper = mount(CastCarousel, {
      props: { cast: [createCastMember(1, 0)] },
      global: { plugins: [i18n] },
    })

    // Assert
    const container = wrapper.find('[data-testid="cast-scroll-container"]')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('overflow-x-auto')
  })

  it('renders cast members sorted by order (ED-03-02)', () => {
    // Arrange
    const cast = [createCastMember(1, 2), createCastMember(2, 0), createCastMember(3, 1)]

    // Act
    const wrapper = mount(CastCarousel, {
      props: { cast },
      global: { plugins: [i18n] },
    })

    // Assert
    const members = wrapper.findAll('[data-testid="cast-member"]')
    expect(members).toHaveLength(3)
    expect(members[0].text()).toContain('Actor 2') // order 0
    expect(members[1].text()).toContain('Actor 3') // order 1
    expect(members[2].text()).toContain('Actor 1') // order 2
  })

  it('renders profile image for each cast member (ED-03-03)', () => {
    // Arrange & Act
    const wrapper = mount(CastCarousel, {
      props: { cast: [createCastMember(1, 0, '/profile.jpg')] },
      global: { plugins: [i18n] },
    })

    // Assert
    const img = wrapper.find('[data-testid="cast-image"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('/profile.jpg')
  })

  it('renders placeholder when profile_path is null (ED-03-04)', () => {
    // Arrange & Act
    const wrapper = mount(CastCarousel, {
      props: { cast: [createCastMember(1, 0, null)] },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="cast-placeholder"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="cast-image"]').exists()).toBe(false)
  })

  it('renders actor name and character name (ED-03-05)', () => {
    // Arrange & Act
    const wrapper = mount(CastCarousel, {
      props: {
        cast: [
          {
            id: 1,
            name: 'Brad Pitt',
            character: 'Tyler Durden',
            profile_path: '/brad.jpg',
            order: 0,
          },
        ],
      },
      global: { plugins: [i18n] },
    })

    // Assert
    const member = wrapper.find('[data-testid="cast-member"]')
    expect(member.text()).toContain('Brad Pitt')
    expect(member.text()).toContain('Tyler Durden')
  })

  it('limits to 20 cast members maximum', () => {
    // Arrange
    const cast = Array.from({ length: 25 }, (_, i) => createCastMember(i, i))

    // Act
    const wrapper = mount(CastCarousel, {
      props: { cast },
      global: { plugins: [i18n] },
    })

    // Assert
    const members = wrapper.findAll('[data-testid="cast-member"]')
    expect(members).toHaveLength(20)
  })

  it('does not render when cast is empty', () => {
    // Arrange & Act
    const wrapper = mount(CastCarousel, {
      props: { cast: [] },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="cast-carousel"]').exists()).toBe(false)
  })
})
