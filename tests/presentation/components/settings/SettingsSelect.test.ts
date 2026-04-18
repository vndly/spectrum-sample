import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import SettingsSelect from '@/presentation/components/settings/SettingsSelect.vue'

describe('SettingsSelect', () => {
  const addEventListener = vi.spyOn(window, 'addEventListener')
  const removeEventListener = vi.spyOn(window, 'removeEventListener')

  beforeEach(() => {
    addEventListener.mockClear()
    removeEventListener.mockClear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  const options = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
  ]

  it('shows the matching label for the current model value', () => {
    const wrapper = mount(SettingsSelect, {
      props: {
        modelValue: 'fr',
        options,
      },
    })

    expect(wrapper.get('button').text()).toContain('Français')
  })

  it('falls back to the raw value when the option is unknown', () => {
    const wrapper = mount(SettingsSelect, {
      props: {
        modelValue: 'de',
        options,
      },
    })

    expect(wrapper.get('button').text()).toContain('de')
  })

  it('opens the dropdown, selects an option, and emits the new value', async () => {
    const wrapper = mount(SettingsSelect, {
      props: {
        modelValue: 'en',
        options,
      },
      attachTo: document.body,
    })

    await wrapper.get('button').trigger('click')
    expect(wrapper.text()).toContain('Français')

    const optionButtons = wrapper.findAll('button')
    await optionButtons[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['fr']])
    expect(wrapper.text()).not.toContain('FrançaisEnglishFrançais')
  })

  it('closes when clicking outside and unregisters listeners on unmount', async () => {
    const wrapper = mount(SettingsSelect, {
      props: {
        modelValue: 'en',
        options,
      },
      attachTo: document.body,
    })

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function))

    await wrapper.get('button').trigger('click')
    expect(wrapper.text()).toContain('Français')

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('FrançaisEnglishFrançais')

    wrapper.unmount()
    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function))
  })
})
