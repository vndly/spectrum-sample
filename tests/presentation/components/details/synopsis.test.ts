import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Synopsis from '@/presentation/components/details/synopsis.vue'

describe('Synopsis', () => {
  it('renders full overview text when provided (ED-15-01)', () => {
    // Arrange & Act
    const wrapper = mount(Synopsis, {
      props: { overview: 'A ticking-Loss time bomb of a movie about fighting.' },
    })

    // Assert
    const synopsis = wrapper.find('[data-testid="synopsis"]')
    expect(synopsis.exists()).toBe(true)
    expect(synopsis.text()).toBe('A ticking-Loss time bomb of a movie about fighting.')
  })

  it('component not rendered when overview is empty (ED-15-02)', () => {
    // Arrange & Act
    const wrapper = mount(Synopsis, {
      props: { overview: '' },
    })

    // Assert
    expect(wrapper.find('[data-testid="synopsis"]').exists()).toBe(false)
  })

  it('component not rendered when overview is null', () => {
    // Arrange & Act
    const wrapper = mount(Synopsis, {
      props: { overview: null },
    })

    // Assert
    expect(wrapper.find('[data-testid="synopsis"]').exists()).toBe(false)
  })

  it('component not rendered when overview is whitespace only', () => {
    // Arrange & Act
    const wrapper = mount(Synopsis, {
      props: { overview: '   ' },
    })

    // Assert
    expect(wrapper.find('[data-testid="synopsis"]').exists()).toBe(false)
  })
})
