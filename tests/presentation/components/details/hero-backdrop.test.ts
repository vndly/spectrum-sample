import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroBackdrop from '@/presentation/components/details/hero-backdrop.vue'
import * as imageHelper from '@/infrastructure/image.helper'

describe('HeroBackdrop', () => {
  it('renders backdrop image when backdrop_path provided (ED-01-01)', () => {
    // Arrange & Act
    const wrapper = mount(HeroBackdrop, {
      props: {
        backdropPath: '/backdrop.jpg',
        title: 'Fight Club',
      },
    })

    // Assert
    const img = wrapper.find('[data-testid="backdrop-image"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('/backdrop.jpg')
    expect(img.attributes('src')).toContain('/w1280/backdrop.jpg')
    expect(img.attributes('srcset')).toContain('/w780/backdrop.jpg 780w')
  })

  it('renders gradient overlay (ED-01-02)', () => {
    // Arrange & Act
    const wrapper = mount(HeroBackdrop, {
      props: {
        backdropPath: '/backdrop.jpg',
        title: 'Fight Club',
      },
    })

    // Assert
    const overlay = wrapper.find('[data-testid="gradient-overlay"]')
    expect(overlay.exists()).toBe(true)
  })

  it('renders title text (ED-01-02)', () => {
    // Arrange & Act
    const wrapper = mount(HeroBackdrop, {
      props: {
        backdropPath: '/backdrop.jpg',
        title: 'Fight Club',
      },
    })

    // Assert
    const title = wrapper.find('[data-testid="title"]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Fight Club')
  })

  it('renders tagline when provided (ED-14-01)', () => {
    // Arrange & Act
    const wrapper = mount(HeroBackdrop, {
      props: {
        backdropPath: '/backdrop.jpg',
        title: 'Fight Club',
        tagline: 'Mischief. Mayhem. Soap.',
      },
    })

    // Assert
    const tagline = wrapper.find('[data-testid="tagline"]')
    expect(tagline.exists()).toBe(true)
    expect(tagline.text()).toBe('Mischief. Mayhem. Soap.')
  })

  it('renders solid gradient when backdrop_path is null (ED-01-03)', () => {
    // Arrange & Act
    const wrapper = mount(HeroBackdrop, {
      props: {
        backdropPath: null,
        title: 'Fight Club',
      },
    })

    // Assert
    const fallback = wrapper.find('[data-testid="backdrop-fallback"]')
    expect(fallback.exists()).toBe(true)
    expect(wrapper.find('[data-testid="backdrop-image"]').exists()).toBe(false)
  })

  it('does not render tagline when empty (ED-14-02)', () => {
    // Arrange & Act
    const wrapper = mount(HeroBackdrop, {
      props: {
        backdropPath: '/backdrop.jpg',
        title: 'Fight Club',
        tagline: '',
      },
    })

    // Assert
    const tagline = wrapper.find('[data-testid="tagline"]')
    expect(tagline.exists()).toBe(false)
  })

  it('does not render tagline when null (ED-14-03)', () => {
    // Arrange & Act
    const wrapper = mount(HeroBackdrop, {
      props: {
        backdropPath: '/backdrop.jpg',
        title: 'Fight Club',
        tagline: null,
      },
    })

    // Assert
    const tagline = wrapper.find('[data-testid="tagline"]')
    expect(tagline.exists()).toBe(false)
  })

  describe('srcset fallback branch coverage', () => {
    beforeEach(() => {
      vi.spyOn(imageHelper, 'buildImageSrcSet').mockReturnValue(null)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('renders backdrop img without srcset when buildImageSrcSet returns null', () => {
      const wrapper = mount(HeroBackdrop, {
        props: {
          backdropPath: '/backdrop.jpg',
          title: 'Fight Club',
        },
      })

      const img = wrapper.find('[data-testid="backdrop-image"]')
      expect(img.exists()).toBe(true)
      expect(img.attributes('srcset')).toBeUndefined()
    })
  })
})
