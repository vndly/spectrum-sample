/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ListManagerModal from '@/presentation/components/details/list-manager-modal.vue'
import * as useListsModule from '@/application/use-lists'
import { ref } from 'vue'

/**
 * Creates a vue-i18n instance for testing.
 */
function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'library.lists.manageTitle': 'Manage Lists',
        'library.lists.noLists': 'No custom lists created yet.',
        'library.lists.newNamePlaceholder': 'New list name...',
      },
    },
  })
}

describe('ListManagerModal', () => {
  const lists = ref([
    { id: '1', name: 'Horror', createdAt: '2026-04-05' },
    { id: '2', name: 'Sci-Fi', createdAt: '2026-04-05' },
  ])

  const mockUseLists = {
    lists,
    createList: vi.fn(),
    renameList: vi.fn(),
    deleteList: vi.fn(),
  }

  beforeEach(() => {
    vi.spyOn(useListsModule, 'useLists').mockReturnValue(mockUseLists as any)
    mockUseLists.createList.mockClear()
  })

  it('renders a list item for each custom list', () => {
    // Arrange
    const i18n = createTestI18n()

    // Act
    const wrapper = mount(ListManagerModal, {
      props: {
        modelValue: true,
        entryLists: ['1'], // Entry is already in Horror
      },
      global: { plugins: [i18n] },
    })

    // Assert
    const listItems = wrapper.findAll('.list-item')
    expect(listItems).toHaveLength(2)
  })

  it('checks the checkbox if the entry belongs to a list (L-04)', () => {
    // Arrange
    const i18n = createTestI18n()

    // Act
    const wrapper = mount(ListManagerModal, {
      props: {
        modelValue: true,
        entryLists: ['1'],
      },
      global: { plugins: [i18n] },
    })

    // Assert
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect((checkboxes[0].element as HTMLInputElement).checked).toBe(true)
    expect((checkboxes[1].element as HTMLInputElement).checked).toBe(false)
  })

  it('emits update:entryLists when a checkbox is toggled (L-04)', async () => {
    // Arrange
    const i18n = createTestI18n()
    const wrapper = mount(ListManagerModal, {
      props: {
        modelValue: true,
        entryLists: ['1'],
      },
      global: { plugins: [i18n] },
    })

    // Act
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[1].setValue(true) // Toggle Sci-Fi to checked

    // Assert
    expect(wrapper.emitted('update:entryLists')).toBeTruthy()
    expect(wrapper.emitted('update:entryLists')?.[0]).toEqual([['1', '2']])
  })

  it('removes a list when an already-selected checkbox is toggled off', async () => {
    const i18n = createTestI18n()
    const wrapper = mount(ListManagerModal, {
      props: {
        modelValue: true,
        entryLists: ['1'],
      },
      global: { plugins: [i18n] },
    })

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[0].setValue(false)

    expect(wrapper.emitted('update:entryLists')?.[0]).toEqual([[]])
  })

  it('allows creating a new list from the modal', async () => {
    // Arrange
    const i18n = createTestI18n()
    const wrapper = mount(ListManagerModal, {
      props: {
        modelValue: true,
        entryLists: [],
      },
      global: { plugins: [i18n] },
    })

    // Act
    const input = wrapper.find('input[type="text"]')
    await input.setValue('Favorites')
    await wrapper.find('form').trigger('submit')

    // Assert
    expect(mockUseLists.createList).toHaveBeenCalledWith('Favorites')
  })

  it('renders the empty-state message when no custom lists exist', () => {
    lists.value = []
    const i18n = createTestI18n()

    const wrapper = mount(ListManagerModal, {
      props: {
        modelValue: true,
        entryLists: [],
      },
      global: { plugins: [i18n] },
    })

    expect(wrapper.text()).toContain('No custom lists created yet.')
    lists.value = [
      { id: '1', name: 'Horror', createdAt: '2026-04-05' },
      { id: '2', name: 'Sci-Fi', createdAt: '2026-04-05' },
    ]
  })

  it('ignores empty list names and closes from the overlay and close button', async () => {
    const i18n = createTestI18n()
    const overlayWrapper = mount(ListManagerModal, {
      props: {
        modelValue: true,
        entryLists: [],
      },
      global: { plugins: [i18n] },
    })

    await overlayWrapper.find('input[type="text"]').setValue('   ')
    await overlayWrapper.find('form').trigger('submit')
    expect(mockUseLists.createList).not.toHaveBeenCalled()

    await overlayWrapper.get('.fixed').trigger('click')
    expect(overlayWrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    const buttonWrapper = mount(ListManagerModal, {
      props: {
        modelValue: true,
        entryLists: [],
      },
      global: { plugins: [i18n] },
    })

    const closeButton = buttonWrapper.findAll('button')[0]
    await closeButton.trigger('click')
    expect(buttonWrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
