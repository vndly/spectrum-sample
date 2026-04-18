import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SortDropdown from '@/presentation/components/common/sort-dropdown.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'library.sort.label': 'Sort',
      'library.sort.dateAdded': 'Date Added',
      'library.sort.title': 'Title',
      'library.sort.releaseYear': 'Release Year',
      'library.sort.userRating': 'User Rating',
      'library.sort.order.asc': 'Ascending',
      'library.sort.order.desc': 'Descending',
      'library.sort.order.dateAdded.asc': 'Oldest First',
      'library.sort.order.dateAdded.desc': 'Newest First',
    },
  },
})

describe('SortDropdown', () => {
  const addEventListener = vi.spyOn(document, 'addEventListener')
  const removeEventListener = vi.spyOn(document, 'removeEventListener')

  beforeEach(() => {
    addEventListener.mockClear()
    removeEventListener.mockClear()
  })

  it('renders with current selection', () => {
    const wrapper = mount(SortDropdown, {
      global: { plugins: [i18n] },
      props: {
        modelValue: 'dateAdded',
        order: 'desc',
      },
    })

    expect(wrapper.text()).toContain('Date Added')
    expect(wrapper.text()).toContain('Newest First')
  })

  it('opens the field dropdown and emits a new sort field', async () => {
    const wrapper = mount(SortDropdown, {
      global: { plugins: [i18n] },
      props: {
        modelValue: 'dateAdded',
        order: 'desc',
      },
      attachTo: document.body,
    })

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function))

    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.text()).toContain('Title')

    const buttons = wrapper.findAll('button')
    await buttons[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['title']])
  })

  it('toggles the sort order and closes on outside clicks', async () => {
    const wrapper = mount(SortDropdown, {
      global: { plugins: [i18n] },
      props: {
        modelValue: 'title',
        order: 'asc',
      },
      attachTo: document.body,
    })

    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('update:order')).toEqual([['desc']])

    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.text()).toContain('Release Year')

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('Release Year')

    wrapper.unmount()
    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('toggles descending order back to ascending', async () => {
    const wrapper = mount(SortDropdown, {
      global: { plugins: [i18n] },
      props: {
        modelValue: 'title',
        order: 'desc',
      },
    })

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.emitted('update:order')).toEqual([['asc']])
  })
})
