import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RatingStars from '@/presentation/components/details/rating-stars.vue'

describe('RatingStars', () => {
  it('renders 5 star icons (ED-06-01)', () => {
    // Arrange & Act
    const wrapper = mount(RatingStars, {
      props: { modelValue: 0 },
    })

    // Assert
    for (let i = 1; i <= 5; i++) {
      expect(wrapper.find(`[data-testid="star-${i}"]`).exists()).toBe(true)
    }
  })

  it('filled stars match current rating value (ED-06-02)', () => {
    // Arrange & Act
    const wrapper = mount(RatingStars, {
      props: { modelValue: 3 },
    })

    // Assert
    const star1 = wrapper.find('[data-testid="star-1"]')
    const star3 = wrapper.find('[data-testid="star-3"]')
    const star4 = wrapper.find('[data-testid="star-4"]')

    expect(star1.classes()).toContain('text-accent')
    expect(star3.classes()).toContain('text-accent')
    expect(star4.classes()).toContain('text-slate-500')
  })

  it('hover previews selection (ED-06-03)', async () => {
    // Arrange
    const wrapper = mount(RatingStars, {
      props: { modelValue: 0 },
    })

    // Act
    await wrapper.find('[data-testid="star-4"]').trigger('mouseenter')

    // Assert - stars 1-4 should be highlighted
    expect(wrapper.find('[data-testid="star-1"]').classes()).toContain('text-accent')
    expect(wrapper.find('[data-testid="star-4"]').classes()).toContain('text-accent')
    expect(wrapper.find('[data-testid="star-5"]').classes()).toContain('text-slate-500')
  })

  it('click sets rating and emits update (ED-06-04)', async () => {
    // Arrange
    const wrapper = mount(RatingStars, {
      props: { modelValue: 0 },
    })

    // Act
    await wrapper.find('[data-testid="star-4"]').trigger('click')

    // Assert
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('clicking same star clears rating (ED-06-05)', async () => {
    // Arrange
    const wrapper = mount(RatingStars, {
      props: { modelValue: 3 },
    })

    // Act
    await wrapper.find('[data-testid="star-3"]').trigger('click')

    // Assert
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('keyboard navigation with arrow keys (ED-06-06)', async () => {
    // Arrange
    const wrapper = mount(RatingStars, {
      props: { modelValue: 0 },
    })
    const container = wrapper.find('[data-testid="rating-stars"]')

    // Act - navigate right
    await container.trigger('keydown', { key: 'ArrowRight' })
    await container.trigger('keydown', { key: 'ArrowRight' })

    // Act - press Enter to select
    await container.trigger('keydown', { key: 'Enter' })

    // Assert
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('keyboard navigation with space to select', async () => {
    // Arrange
    const wrapper = mount(RatingStars, {
      props: { modelValue: 0 },
    })
    const container = wrapper.find('[data-testid="rating-stars"]')

    // Act
    await container.trigger('keydown', { key: 'ArrowRight' })
    await container.trigger('keydown', { key: ' ' })

    // Assert
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('has proper ARIA attributes for screen readers', () => {
    // Arrange & Act
    const wrapper = mount(RatingStars, {
      props: { modelValue: 3 },
    })

    // Assert
    const container = wrapper.find('[data-testid="rating-stars"]')
    expect(container.attributes('role')).toBe('slider')
    expect(container.attributes('aria-valuenow')).toBe('3')
    expect(container.attributes('aria-valuemin')).toBe('0')
    expect(container.attributes('aria-valuemax')).toBe('5')
  })

  it('hover state resets on mouse leave', async () => {
    // Arrange
    const wrapper = mount(RatingStars, {
      props: { modelValue: 2 },
    })

    // Act
    await wrapper.find('[data-testid="star-5"]').trigger('mouseenter')
    await wrapper.find('[data-testid="star-5"]').trigger('mouseleave')

    // Assert - should go back to showing value of 2
    expect(wrapper.find('[data-testid="star-2"]').classes()).toContain('text-accent')
    expect(wrapper.find('[data-testid="star-3"]').classes()).toContain('text-slate-500')
  })

  it('supports left and down arrow navigation and updates focus on button focus', async () => {
    const wrapper = mount(RatingStars, {
      props: { modelValue: 0 },
    })

    await wrapper.get('[data-testid="star-4"]').trigger('focus')
    expect(wrapper.get('[data-testid="star-4"]').classes()).toContain('ring-2')

    const container = wrapper.get('[data-testid="rating-stars"]')
    await container.trigger('keydown', { key: 'ArrowLeft' })
    await container.trigger('keydown', { key: 'ArrowDown' })
    await container.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })
})
