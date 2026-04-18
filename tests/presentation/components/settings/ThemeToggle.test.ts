import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ThemeToggle from '@/presentation/components/settings/ThemeToggle.vue'

describe('ThemeToggle', () => {
  it('renders the light theme state', () => {
    const wrapper = mount(ThemeToggle, {
      props: {
        modelValue: 'light',
      },
    })

    expect(wrapper.get('button').classes()).toContain('bg-slate-300')
    expect(wrapper.find('.text-amber-500').exists()).toBe(true)
  })

  it('renders the dark theme state', () => {
    const wrapper = mount(ThemeToggle, {
      props: {
        modelValue: 'dark',
      },
    })

    expect(wrapper.get('button').classes()).toContain('bg-slate-700')
    expect(wrapper.find('.translate-x-6').exists()).toBe(true)
  })

  it('emits the toggled theme value on click', async () => {
    const lightWrapper = mount(ThemeToggle, {
      props: {
        modelValue: 'light',
      },
    })
    await lightWrapper.get('button').trigger('click')
    expect(lightWrapper.emitted('update:modelValue')).toEqual([['dark']])

    const darkWrapper = mount(ThemeToggle, {
      props: {
        modelValue: 'dark',
      },
    })
    await darkWrapper.get('button').trigger('click')
    expect(darkWrapper.emitted('update:modelValue')).toEqual([['light']])
  })
})
