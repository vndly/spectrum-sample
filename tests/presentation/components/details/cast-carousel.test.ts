/* eslint-disable @typescript-eslint/no-explicit-any */
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

const routerLinkStub = {
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

function globalWithI18n(plugin: typeof i18n) {
  return {
    plugins: [plugin],
    stubs: { RouterLink: routerLinkStub },
  }
}

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
      global: globalWithI18n(i18n),
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
      global: globalWithI18n(i18n),
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
      global: globalWithI18n(i18n),
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
      global: globalWithI18n(i18n),
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
      global: globalWithI18n(i18n),
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
      global: globalWithI18n(i18n),
    })

    // Assert
    const members = wrapper.findAll('[data-testid="cast-member"]')
    expect(members).toHaveLength(20)
  })

  it('does not render when cast is empty', () => {
    // Arrange & Act
    const wrapper = mount(CastCarousel, {
      props: { cast: [] },
      global: globalWithI18n(i18n),
    })

    // Assert
    expect(wrapper.find('[data-testid="cast-carousel"]').exists()).toBe(false)
  })

  it('renders scroll buttons when content overflows', async () => {
    // Arrange
    const cast = Array.from({ length: 5 }, (_, i) => createCastMember(i, i))

    // Act
    const wrapper = mount(CastCarousel, {
      props: { cast },
      global: globalWithI18n(i18n),
      attachTo: document.body,
    })

    // Simulate overflow by mocking scrollWidth > clientWidth
    const container = wrapper.find('[data-testid="cast-scroll-container"]').element as HTMLElement
    Object.defineProperty(container, 'scrollWidth', { value: 1000, configurable: true })
    Object.defineProperty(container, 'clientWidth', { value: 500, configurable: true })

    // Trigger the ResizeObserver callback manually
    const vm = wrapper.vm as any
    vm.$.setupState.updateCanScroll()
    await wrapper.vm.$nextTick()

    // Assert
    expect(wrapper.find('[data-testid="cast-scroll-previous"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="cast-scroll-next"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('does not render scroll buttons when content fits', () => {
    // Arrange
    const cast = [createCastMember(1, 0), createCastMember(2, 1), createCastMember(3, 2)]

    // Act
    const wrapper = mount(CastCarousel, {
      props: { cast },
      global: globalWithI18n(i18n),
    })

    // Assert - canScroll is false by default since scrollWidth <= clientWidth in jsdom
    expect(wrapper.find('[data-testid="cast-scroll-previous"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="cast-scroll-next"]').exists()).toBe(false)
  })

  it('scrolls carousel when scroll buttons are clicked', async () => {
    // Arrange
    const cast = Array.from({ length: 5 }, (_, i) => createCastMember(i, i))
    const i18nWithScrollLabels = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en: {
          details: {
            cast: {
              title: 'Cast',
              scrollPrevious: 'Scroll left',
              scrollNext: 'Scroll right',
            },
          },
        },
      },
    })
    const wrapper = mount(CastCarousel, {
      props: { cast },
      global: globalWithI18n(i18nWithScrollLabels),
      attachTo: document.body,
    })

    const scrollContainer = wrapper.find('[data-testid="cast-scroll-container"]')
      .element as HTMLElement

    // Simulate overflow to show scroll buttons
    Object.defineProperty(scrollContainer, 'scrollWidth', { value: 1000, configurable: true })
    Object.defineProperty(scrollContainer, 'clientWidth', { value: 500, configurable: true })

    // Trigger the ResizeObserver callback manually
    const vm = wrapper.vm as any
    vm.$.setupState.updateCanScroll()
    await wrapper.vm.$nextTick()

    // Define scrollBy since jsdom doesn't have it
    const scrollByCalls: ScrollToOptions[] = []
    scrollContainer.scrollBy = ((options?: ScrollToOptions | number) => {
      if (options && typeof options === 'object') scrollByCalls.push(options)
    }) as typeof scrollContainer.scrollBy

    // Act - click next
    await wrapper.find('[data-testid="cast-scroll-next"]').trigger('click')

    // Assert
    expect(scrollByCalls.length).toBe(1)
    expect(scrollByCalls[0].left).toBeGreaterThan(0)
    expect(scrollByCalls[0].behavior).toBe('smooth')

    // Act - click previous
    await wrapper.find('[data-testid="cast-scroll-previous"]').trigger('click')

    // Assert
    expect(scrollByCalls.length).toBe(2)
    expect(scrollByCalls[1].left).toBeLessThan(0)

    wrapper.unmount()
  })

  it('scrollCarousel returns early when carouselRef is null', () => {
    // Arrange - mount with empty cast so carousel container is not rendered
    const wrapper = mount(CastCarousel, {
      props: { cast: [] },
      global: globalWithI18n(i18n),
    })

    // Access the internal scrollCarousel function
    const vm = wrapper.vm as any
    const scrollCarousel = vm.$.setupState.scrollCarousel

    // Act - call scrollCarousel directly (carouselRef is null since no carousel rendered)
    // This should return early without throwing
    scrollCarousel('next')
    scrollCarousel('previous')

    // Assert - no error thrown, function handles null ref gracefully
    expect(true).toBe(true)
  })

  it('links each cast member to the person detail route (CI-01-01)', () => {
    // Arrange & Act
    const wrapper = mount(CastCarousel, {
      props: { cast: [createCastMember(287, 0)] },
      global: globalWithI18n(i18n),
    })

    // Assert
    const member = wrapper.get('[data-testid="cast-member"]')
    expect(member.element.tagName).toBe('A')
    expect(member.attributes('href')).toBe('/person/287')
  })

  it('renders cast member cards as focusable links for keyboard activation (CI-01-02)', () => {
    // Arrange & Act
    const wrapper = mount(CastCarousel, {
      props: { cast: [createCastMember(287, 0)] },
      global: globalWithI18n(i18n),
    })

    // Assert
    const member = wrapper.get('[data-testid="cast-member"]')
    expect(member.element.tagName).toBe('A')
    expect(member.attributes('href')).toBe('/person/287')
  })
})
