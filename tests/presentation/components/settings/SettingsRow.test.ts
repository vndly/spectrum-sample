import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SettingsRow from '@/presentation/components/settings/SettingsRow.vue'

describe('SettingsRow', () => {
  it('renders the label, description, and slotted content', () => {
    const wrapper = mount(SettingsRow, {
      props: {
        label: 'Theme',
        description: 'Choose the application theme.',
      },
      slots: {
        default: '<button type="button">Toggle</button>',
      },
    })

    expect(wrapper.text()).toContain('Theme')
    expect(wrapper.text()).toContain('Choose the application theme.')
    expect(wrapper.text()).toContain('Toggle')
  })

  it('omits the description element when no description is provided', () => {
    const wrapper = mount(SettingsRow, {
      props: {
        label: 'Language',
      },
    })

    expect(wrapper.text()).toContain('Language')
    expect(wrapper.find('.text-slate-400').exists()).toBe(false)
  })
})
