import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DetailSkeleton from '@/presentation/components/details/detail-skeleton.vue'

describe('DetailSkeleton', () => {
  it('renders backdrop placeholder (ED-11-01)', () => {
    // Arrange & Act
    const wrapper = mount(DetailSkeleton)

    // Assert
    expect(wrapper.find('[data-testid="backdrop-skeleton"]').exists()).toBe(true)
  })

  it('renders title line placeholders (ED-11-02)', () => {
    // Arrange & Act
    const wrapper = mount(DetailSkeleton)

    // Assert
    expect(wrapper.find('[data-testid="title-skeleton"]').exists()).toBe(true)
  })

  it('renders metadata line placeholders (ED-11-03)', () => {
    // Arrange & Act
    const wrapper = mount(DetailSkeleton)

    // Assert
    expect(wrapper.find('[data-testid="metadata-skeleton"]').exists()).toBe(true)
  })

  it('renders cast circle placeholders (ED-11-04)', () => {
    // Arrange & Act
    const wrapper = mount(DetailSkeleton)

    // Assert
    expect(wrapper.find('[data-testid="cast-skeleton"]').exists()).toBe(true)
  })

  it('renders action button placeholders', () => {
    // Arrange & Act
    const wrapper = mount(DetailSkeleton)

    // Assert
    expect(wrapper.find('[data-testid="actions-skeleton"]').exists()).toBe(true)
  })

  it('has shimmer animation via SkeletonLoader', () => {
    // Arrange & Act
    const wrapper = mount(DetailSkeleton)

    // Assert - SkeletonLoader components have animate-pulse class
    const skeletons = wrapper.findAllComponents({ name: 'SkeletonLoader' })
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
