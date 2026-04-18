import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import ViewToggle from '@/presentation/components/home/view-toggle.vue'

const layoutMode = ref<'grid' | 'list'>('grid')

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    layoutMode,
  }),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  flatJson: true,
  messages: {
    en: {
      'home.filters.grid': 'Grid',
      'home.filters.list': 'List',
    },
  },
})

describe('ViewToggle', () => {
  beforeEach(() => {
    layoutMode.value = 'grid'
  })

  it('highlights the active grid button', () => {
    const wrapper = mount(ViewToggle, {
      global: {
        plugins: [i18n],
      },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).toContain('bg-accent')
    expect(buttons[1].classes()).toContain('text-slate-400')
  })

  it('updates the shared layout mode when the list button is clicked', async () => {
    const wrapper = mount(ViewToggle, {
      global: {
        plugins: [i18n],
      },
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(layoutMode.value).toBe('list')
  })

  it('switches back to grid mode when the grid button is clicked', async () => {
    layoutMode.value = 'list'

    const wrapper = mount(ViewToggle, {
      global: {
        plugins: [i18n],
      },
    })

    await wrapper.findAll('button')[0].trigger('click')

    expect(layoutMode.value).toBe('grid')
  })
})
