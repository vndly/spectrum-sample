import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import SettingsScreen from '@/presentation/views/settings-screen.vue'

const language = ref('en')
const preferredRegion = ref('US')
const layoutMode = ref<'grid' | 'list'>('grid')
const theme = ref<'dark' | 'light'>('dark')
const defaultHomeSection = ref<'trending' | 'popular' | 'search'>('trending')
const triggerExport = vi.fn()
const handleImportFile = vi.fn()
const openModal = vi.fn()
const addToast = vi.fn()

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language,
    preferredRegion,
    layoutMode,
    theme,
    defaultHomeSection,
    triggerExport,
    handleImportFile,
  }),
}))

vi.mock('@/presentation/composables/use-modal', () => ({
  useModal: () => ({
    open: openModal,
  }),
}))

vi.mock('@/presentation/composables/use-toast', () => ({
  useToast: () => ({
    addToast,
  }),
}))

function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'settings.title': 'Settings',
        'settings.description': 'Customize your experience',
        'settings.sections.appearance': 'Appearance',
        'settings.sections.content': 'Content',
        'settings.sections.navigation': 'Navigation',
        'settings.sections.data': 'Data',
        'settings.appearance.theme.label': 'Theme',
        'settings.appearance.theme.description': 'Switch between light and dark modes.',
        'settings.appearance.layout.label': 'Layout',
        'settings.appearance.layout.description': 'Choose your browsing layout.',
        'settings.content.language.label': 'Language',
        'settings.content.language.description': 'Pick the interface language.',
        'settings.content.region.label': 'Region',
        'settings.content.region.description': 'Set your preferred region.',
        'settings.navigation.home.label': 'Home Section',
        'settings.navigation.home.description': 'Select the default home section.',
        'settings.data.info.title': 'Manage your library',
        'settings.data.info.description': 'Export or import your local data.',
        'settings.data.export': 'Export',
        'settings.data.import': 'Import',
        'settings.data.exportSuccess': 'Export complete',
        'settings.data.exportError': 'Export failed',
        'settings.data.importSuccess': 'Import complete',
        'settings.data.importError': 'Import failed',
        'settings.import.title': 'Import library',
        'settings.import.description': 'Choose how to import your library.',
        'settings.import.overwrite': 'Overwrite',
        'settings.import.merge': 'Merge',
        'settings.import.confirmOverwriteTitle': 'Confirm overwrite',
        'settings.import.confirmOverwriteDescription': 'This replaces your current data.',
        'settings.import.confirmOverwriteButton': 'Confirm overwrite',
        'settings.footer.legal': 'For personal use only.',
        'home.sections.trending': 'Trending',
        'home.sections.popular': 'Popular',
        'home.sections.search': 'Search',
        'modal.cancel': 'Cancel',
      },
    },
  })
}

function renderSettingsScreen() {
  return mount(SettingsScreen, {
    global: {
      plugins: [createTestI18n()],
      stubs: {
        SettingsRow: {
          name: 'SettingsRow',
          props: ['label', 'description'],
          template:
            '<div data-testid="settings-row"><span>{{ label }}</span><span>{{ description }}</span><slot /></div>',
        },
        ThemeToggle: {
          name: 'ThemeToggle',
          template: '<div data-testid="theme-toggle"></div>',
        },
        LayoutModeToggle: {
          name: 'LayoutModeToggle',
          template: '<div data-testid="layout-mode-toggle"></div>',
        },
        SettingsSelect: {
          name: 'SettingsSelect',
          template: '<div data-testid="settings-select"></div>',
        },
      },
    },
  })
}

describe('SettingsScreen', () => {
  const realCreateElement = document.createElement.bind(document)

  beforeEach(() => {
    language.value = 'en'
    preferredRegion.value = 'US'
    layoutMode.value = 'grid'
    theme.value = 'dark'
    defaultHomeSection.value = 'trending'
    triggerExport.mockReset()
    handleImportFile.mockReset()
    openModal.mockReset()
    addToast.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders all settings rows, data controls, and footer content', () => {
    const wrapper = renderSettingsScreen()

    expect(wrapper.get('h1').text()).toBe('Settings')
    expect(wrapper.findAll('[data-testid="settings-row"]')).toHaveLength(5)
    expect(wrapper.findAll('[data-testid="settings-select"]')).toHaveLength(3)
    expect(wrapper.find('[data-testid="theme-toggle"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="layout-mode-toggle"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Export')
    expect(wrapper.text()).toContain('Import')
    expect(wrapper.text()).toContain('Plot Twisted v1.0.0')
    expect(wrapper.text()).toContain('For personal use only.')
  })

  it('handles export success and failure with toasts', async () => {
    triggerExport.mockResolvedValueOnce(undefined)
    const successWrapper = renderSettingsScreen()
    await successWrapper
      .findAll('button')
      .find((button) => button.text() === 'Export')
      ?.trigger('click')
    expect(triggerExport).toHaveBeenCalled()
    expect(addToast).toHaveBeenCalledWith({ message: 'Export complete', type: 'success' })

    triggerExport.mockRejectedValueOnce(new Error('nope'))
    addToast.mockClear()
    const errorWrapper = renderSettingsScreen()
    await errorWrapper
      .findAll('button')
      .find((button) => button.text() === 'Export')
      ?.trigger('click')
    expect(addToast).toHaveBeenCalledWith({ message: 'Export failed', type: 'error' })
  })

  it('runs the merge import flow after file selection', async () => {
    let createdInput: HTMLInputElement | undefined
    vi.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
      const element = realCreateElement(tagName)
      if (tagName === 'input') {
        createdInput = element as HTMLInputElement
        vi.spyOn(createdInput, 'click').mockImplementation(() => {})
      }
      return element
    }) as typeof document.createElement)

    handleImportFile.mockResolvedValueOnce(undefined)

    const wrapper = renderSettingsScreen()
    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Import')
      ?.trigger('click')

    expect(createdInput).toBeDefined()
    if (!createdInput) {
      throw new Error('Expected import input to be created')
    }
    expect(createdInput.type).toBe('file')
    expect(createdInput.accept).toBe('application/json')

    await createdInput.onchange?.({ target: { files: [] } } as unknown as Event)
    expect(openModal).not.toHaveBeenCalled()

    const file = new File(['{}'], 'library.json', { type: 'application/json' })
    await createdInput.onchange?.({ target: { files: [file] } } as unknown as Event)

    const modalConfig = openModal.mock.calls[0][0]
    await modalConfig.onCancel()

    expect(handleImportFile).toHaveBeenCalledWith(file, 'merge')
    expect(addToast).toHaveBeenCalledWith({ message: 'Import complete', type: 'success' })
  })

  it('runs the overwrite confirmation flow and falls back to the generic import error toast', async () => {
    let createdInput: HTMLInputElement | undefined
    vi.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
      const element = realCreateElement(tagName)
      if (tagName === 'input') {
        createdInput = element as HTMLInputElement
        vi.spyOn(createdInput, 'click').mockImplementation(() => {})
      }
      return element
    }) as typeof document.createElement)

    handleImportFile.mockRejectedValueOnce({})

    const wrapper = renderSettingsScreen()
    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Import')
      ?.trigger('click')

    if (!createdInput) {
      throw new Error('Expected import input to be created')
    }
    const file = new File(['{}'], 'library.json', { type: 'application/json' })
    await createdInput.onchange?.({ target: { files: [file] } } as unknown as Event)

    const firstModal = openModal.mock.calls[0][0]
    firstModal.onConfirm()

    const secondModal = openModal.mock.calls[1][0]
    await secondModal.onConfirm()

    expect(handleImportFile).toHaveBeenCalledWith(file, 'overwrite')
    expect(addToast).toHaveBeenCalledWith({ message: 'Import failed', type: 'error' })
  })

  it('updates reactive settings refs from child v-model emissions', async () => {
    const wrapper = renderSettingsScreen()
    const toggles = wrapper.findAllComponents({ name: 'ThemeToggle' })
    const layoutToggles = wrapper.findAllComponents({ name: 'LayoutModeToggle' })
    const selects = wrapper.findAllComponents({ name: 'SettingsSelect' })

    toggles[0].vm.$emit('update:modelValue', 'light')
    layoutToggles[0].vm.$emit('update:modelValue', 'list')
    selects[0].vm.$emit('update:modelValue', 'fr')
    selects[1].vm.$emit('update:modelValue', 'FR')
    selects[2].vm.$emit('update:modelValue', 'popular')

    expect(theme.value).toBe('light')
    expect(layoutMode.value).toBe('list')
    expect(language.value).toBe('fr')
    expect(preferredRegion.value).toBe('FR')
    expect(defaultHomeSection.value).toBe('popular')
  })
})
