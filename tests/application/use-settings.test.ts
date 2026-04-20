import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as storageService from '@/infrastructure/storage.service'

vi.mock('@/infrastructure/storage.service', () => ({
  getSettings: vi.fn(),
  saveSettings: vi.fn(),
  exportData: vi.fn(),
  importData: vi.fn(),
  downloadFile: vi.fn(),
  parseFile: vi.fn(),
}))

const baseSettings = {
  theme: 'dark' as const,
  language: 'en',
  preferredRegion: 'US',
  layoutMode: 'grid' as const,
  defaultHomeSection: 'trending' as const,
  librarySortField: 'dateAdded' as const,
  librarySortOrder: 'desc' as const,
}

describe('useSettings', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.mocked(storageService.getSettings).mockReturnValue(baseSettings)
    document.documentElement.lang = ''
    document.documentElement.className = ''
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  async function loadComposable() {
    return import('@/application/use-settings')
  }

  it('initializes from storage and synchronizes document state', async () => {
    const { useSettings } = await loadComposable()
    const { theme, language, layoutMode } = useSettings()

    expect(theme.value).toBe('dark')
    expect(language.value).toBe('en')
    expect(layoutMode.value).toBe('grid')
    expect(storageService.saveSettings).toHaveBeenCalled()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.lang).toBe('en')
  })

  it('serializes exports and downloads the generated file', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-18T10:00:00.000Z'))
    vi.mocked(storageService.exportData).mockResolvedValue({
      exportVersion: 1,
      exportedAt: '2026-04-18T10:00:00.000Z',
      schemaVersion: 1,
      library: {},
      tags: [],
      settings: baseSettings,
    })

    const { useSettings } = await loadComposable()
    const { triggerExport } = useSettings()

    await triggerExport()

    expect(storageService.downloadFile).toHaveBeenCalledWith(
      JSON.stringify(
        {
          exportVersion: 1,
          exportedAt: '2026-04-18T10:00:00.000Z',
          schemaVersion: 1,
          library: {},
          tags: [],
          settings: baseSettings,
        },
        null,
        2,
      ),
      'plot-twisted-export-2026-04-18.json',
      'application/json',
    )
  })

  it('parses a file and delegates the import to storage', async () => {
    const file = new File(['{}'], 'library.json', { type: 'application/json' })
    vi.mocked(storageService.parseFile).mockResolvedValue({ imported: true })

    const { useSettings } = await loadComposable()
    const { handleImportFile } = useSettings()

    await handleImportFile(file, 'merge')

    expect(storageService.parseFile).toHaveBeenCalledWith(file)
    expect(storageService.importData).toHaveBeenCalledWith({ imported: true }, 'merge')
  })

  it('refreshes local refs when an overwrite import completes', async () => {
    vi.mocked(storageService.getSettings)
      .mockReturnValueOnce(baseSettings)
      .mockReturnValueOnce({
        ...baseSettings,
        theme: 'light',
        language: 'fr',
        preferredRegion: 'FR',
        layoutMode: 'list',
        defaultHomeSection: 'popular',
        librarySortField: 'title',
        librarySortOrder: 'asc',
      })

    const { useSettings } = await loadComposable()
    const { importLibrary, theme, language, preferredRegion, layoutMode, defaultHomeSection } =
      useSettings()

    await importLibrary({ imported: true }, 'overwrite')

    expect(storageService.importData).toHaveBeenCalledWith({ imported: true }, 'overwrite')
    expect(theme.value).toBe('light')
    expect(language.value).toBe('fr')
    expect(preferredRegion.value).toBe('FR')
    expect(layoutMode.value).toBe('list')
    expect(defaultHomeSection.value).toBe('popular')
  })

  it('skips document synchronization when document is unavailable', async () => {
    vi.resetModules()

    const previousDocument = globalThis.document
    vi.stubGlobal('document', undefined)

    const freshStorage = await import('@/infrastructure/storage.service')
    vi.mocked(freshStorage.getSettings).mockReturnValue(baseSettings)

    const { useSettings } = await import('@/application/use-settings')
    const settings = useSettings()

    expect(settings.language.value).toBe('en')
    expect(freshStorage.saveSettings).toHaveBeenCalled()

    vi.unstubAllGlobals()
    vi.stubGlobal('document', previousDocument)
  })
})
