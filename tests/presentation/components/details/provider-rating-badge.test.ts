import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProviderRatingBadge from '@/presentation/components/details/provider-rating-badge.vue'

describe('ProviderRatingBadge', () => {
  it('renders vote average as badge (ED-13-01)', () => {
    // Arrange & Act
    const wrapper = mount(ProviderRatingBadge, {
      props: { voteAverage: 8.4 },
    })

    // Assert
    expect(wrapper.find('[data-testid="provider-rating-badge"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="rating-value"]').text()).toBe('8.4')
  })

  it('formats value to one decimal place (ED-13-02)', () => {
    // Arrange & Act
    const wrapper = mount(ProviderRatingBadge, {
      props: { voteAverage: 8 },
    })

    // Assert
    expect(wrapper.find('[data-testid="rating-value"]').text()).toBe('8.0')
  })

  it('rounds correctly (ED-13-03)', () => {
    // Arrange & Act
    const wrapper = mount(ProviderRatingBadge, {
      props: { voteAverage: 7.856 },
    })

    // Assert
    expect(wrapper.find('[data-testid="rating-value"]').text()).toBe('7.9')
  })

  it('displays star icon alongside the number', () => {
    // Arrange & Act
    const wrapper = mount(ProviderRatingBadge, {
      props: { voteAverage: 8.4 },
    })

    // Assert
    expect(wrapper.find('[data-testid="star-icon"]').exists()).toBe(true)
  })

  it('uses teal accent styling', () => {
    // Arrange & Act
    const wrapper = mount(ProviderRatingBadge, {
      props: { voteAverage: 8.4 },
    })

    // Assert
    const badge = wrapper.find('[data-testid="provider-rating-badge"]')
    expect(badge.classes()).toContain('bg-accent')
    expect(badge.classes()).toContain('text-white')
  })
})
