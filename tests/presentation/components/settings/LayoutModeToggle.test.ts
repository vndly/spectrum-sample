import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LayoutModeToggle from '@/presentation/components/settings/LayoutModeToggle.vue'

describe('LayoutModeToggle', () => {
  it('renders the active grid state from the model value', () => {
    const wrapper = mount(LayoutModeToggle, {
      props: {
        modelValue: 'grid',
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).toContain('bg-accent')
    expect(buttons[1].classes()).toContain('text-slate-400')
  })

  it('emits grid and list updates when buttons are clicked', async () => {
    const wrapper = mount(LayoutModeToggle, {
      props: {
        modelValue: 'list',
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['grid'], ['list']])
  })
})
