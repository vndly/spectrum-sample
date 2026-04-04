import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BoxOffice from '@/presentation/components/details/box-office.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      details: {
        boxOffice: {
          title: 'Box Office',
          budget: 'Budget',
          revenue: 'Revenue',
        },
      },
    },
  },
})

describe('BoxOffice', () => {
  it('renders budget and revenue when both available (ED-16-01)', () => {
    // Arrange & Act
    const wrapper = mount(BoxOffice, {
      props: { budget: 63000000, revenue: 100853753 },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="budget"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="revenue"]').exists()).toBe(true)
  })

  it('renders only budget when revenue is 0 (ED-16-02)', () => {
    // Arrange & Act
    const wrapper = mount(BoxOffice, {
      props: { budget: 63000000, revenue: 0 },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="budget"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="revenue"]').exists()).toBe(false)
  })

  it('renders only revenue when budget is 0 (ED-16-03)', () => {
    // Arrange & Act
    const wrapper = mount(BoxOffice, {
      props: { budget: 0, revenue: 100853753 },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="budget"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="revenue"]').exists()).toBe(true)
  })

  it('component not rendered when both are 0 (ED-16-04)', () => {
    // Arrange & Act
    const wrapper = mount(BoxOffice, {
      props: { budget: 0, revenue: 0 },
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="box-office"]').exists()).toBe(false)
  })

  it('values formatted as currency with commas (ED-16-05)', () => {
    // Arrange & Act
    const wrapper = mount(BoxOffice, {
      props: { budget: 200000000, revenue: 500000000 },
      global: { plugins: [i18n] },
    })

    // Assert
    const budget = wrapper.find('[data-testid="budget"]')
    const revenue = wrapper.find('[data-testid="revenue"]')
    expect(budget.text()).toContain('$200,000,000')
    expect(revenue.text()).toContain('$500,000,000')
  })
})
