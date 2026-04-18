/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TrailerEmbed from '@/presentation/components/details/trailer-embed.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      details: {
        trailer: {
          title: 'Trailer',
          play: 'Play trailer',
        },
      },
    },
  },
})

describe('TrailerEmbed', () => {
  const trailerVideo = {
    id: 'abc123',
    key: 'SUXWAEX2jlg',
    name: 'Official Trailer',
    site: 'YouTube',
    type: 'Trailer',
    official: true,
  }

  const teaserVideo = {
    id: 'def456',
    key: 'xyz789',
    name: 'Teaser',
    site: 'YouTube',
    type: 'Teaser',
    official: true,
  }

  it('renders play button overlay initially (ED-04-01)', () => {
    // Arrange & Act
    const wrapper = mount(TrailerEmbed, {
      props: { videos: [trailerVideo] },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="play-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="youtube-iframe"]').exists()).toBe(false)
  })

  it('clicking play embeds YouTube iframe (ED-04-02)', async () => {
    // Arrange
    const wrapper = mount(TrailerEmbed, {
      props: { videos: [trailerVideo] },
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="play-button"]').trigger('click')

    // Assert
    const iframe = wrapper.find('[data-testid="youtube-iframe"]')
    expect(iframe.exists()).toBe(true)
    expect(wrapper.find('[data-testid="play-button"]').exists()).toBe(false)
  })

  it('uses privacy-enhanced domain youtube-nocookie.com (ED-04-03)', async () => {
    // Arrange
    const wrapper = mount(TrailerEmbed, {
      props: { videos: [trailerVideo] },
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="play-button"]').trigger('click')

    // Assert
    const iframe = wrapper.find('[data-testid="youtube-iframe"]')
    expect(iframe.attributes('src')).toContain('youtube-nocookie.com')
    expect(iframe.attributes('src')).toContain('SUXWAEX2jlg')
  })

  it('component not rendered when no trailer available (ED-04-04)', () => {
    // Arrange & Act - only teaser, no trailer
    const wrapper = mount(TrailerEmbed, {
      props: { videos: [teaserVideo] },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="trailer-embed"]').exists()).toBe(false)
  })

  it('component not rendered when videos is empty', () => {
    // Arrange & Act
    const wrapper = mount(TrailerEmbed, {
      props: { videos: [] },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="trailer-embed"]').exists()).toBe(false)
  })

  it('ignores non-YouTube trailers', () => {
    // Arrange
    const vimeoTrailer = {
      ...trailerVideo,
      site: 'Vimeo',
    }

    // Act
    const wrapper = mount(TrailerEmbed, {
      props: { videos: [vimeoTrailer] },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="trailer-embed"]').exists()).toBe(false)
  })

  it('renders thumbnail image', () => {
    // Arrange & Act
    const wrapper = mount(TrailerEmbed, {
      props: { videos: [trailerVideo] },
      global: { plugins: [i18n] },
    })

    // Assert
    const thumbnail = wrapper.find('[data-testid="trailer-thumbnail"]')
    expect(thumbnail.exists()).toBe(true)
    expect(thumbnail.attributes('src')).toContain('img.youtube.com')
    expect(thumbnail.attributes('src')).toContain('SUXWAEX2jlg')
  })

  it('computes null embed and thumbnail URLs when no trailer is available', () => {
    const wrapper = mount(TrailerEmbed, {
      props: { videos: [] },
      global: { plugins: [i18n] },
    })

    const setupState = (wrapper.vm as any).$?.setupState
    expect(setupState.embedUrl).toBeNull()
    expect(setupState.thumbnailUrl).toBeNull()
  })
})
