import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StreamingBadges from '@/presentation/components/details/streaming-badges.vue'

describe('StreamingBadges', () => {
  const mockProviders = {
    US: {
      link: 'https://tmdb.org/watch/US',
      flatrate: [
        { provider_id: 8, provider_name: 'Netflix', logo_path: '/netflix.png' },
        { provider_id: 9, provider_name: 'Hulu', logo_path: '/hulu.png' },
      ],
    },
    GB: {
      link: 'https://tmdb.org/watch/GB',
      flatrate: [{ provider_id: 8, provider_name: 'Netflix', logo_path: '/netflix.png' }],
    },
  }

  it('renders provider logos for given region (ED-05-01)', () => {
    // Arrange & Act
    const wrapper = mount(StreamingBadges, {
      props: { providers: mockProviders, region: 'US' },
    })

    // Assert
    const logos = wrapper.findAll('[data-testid="provider-logo"]')
    expect(logos).toHaveLength(2)
    expect(logos[0].attributes('alt')).toBe('Netflix')
    expect(logos[1].attributes('alt')).toBe('Hulu')
  })

  it('does not render when no providers for region (ED-05-02)', () => {
    // Arrange & Act
    const wrapper = mount(StreamingBadges, {
      props: { providers: mockProviders, region: 'JP' },
    })

    // Assert - section should not be rendered at all
    expect(wrapper.find('[data-testid="streaming-badges"]').exists()).toBe(false)
  })

  it('handles missing region data gracefully (ED-05-03)', () => {
    // Arrange & Act
    const wrapper = mount(StreamingBadges, {
      props: { providers: {}, region: 'US' },
    })

    // Assert - section should not be rendered at all
    expect(wrapper.find('[data-testid="streaming-badges"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-testid="provider-logo"]')).toHaveLength(0)
  })

  it('handles region without flatrate providers', () => {
    // Arrange
    const providers = {
      US: {
        link: 'https://tmdb.org/watch/US',
        rent: [{ provider_id: 3, provider_name: 'Amazon', logo_path: '/amazon.png' }],
        // No flatrate key
      },
    }

    // Act
    const wrapper = mount(StreamingBadges, {
      props: { providers, region: 'US' },
    })

    // Assert - section should not be rendered at all
    expect(wrapper.find('[data-testid="streaming-badges"]').exists()).toBe(false)
  })

  it('renders correct logo URLs', () => {
    // Arrange & Act
    const wrapper = mount(StreamingBadges, {
      props: { providers: mockProviders, region: 'US' },
    })

    // Assert
    const logo = wrapper.find('[data-testid="provider-logo"]')
    expect(logo.attributes('src')).toContain('/netflix.png')
  })
})
