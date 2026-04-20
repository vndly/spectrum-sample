import { describe, it, expect, beforeEach } from 'vitest'
import { getSettings, saveSettings, STORAGE_KEY_SETTINGS } from '@/infrastructure/storage.service'
import { DEFAULT_SETTINGS } from '@/domain/settings.schema'

describe('storage.service settings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns default settings when none exist', () => {
    const settings = getSettings()
    expect(settings).toEqual(DEFAULT_SETTINGS)
  })

  it('saves and retrieves settings', () => {
    const newSettings = {
      ...DEFAULT_SETTINGS,
      theme: 'light' as const,
      language: 'fr',
    }
    saveSettings(newSettings)

    const retrieved = getSettings()
    expect(retrieved).toEqual(newSettings)
  })

  it('migrates layoutMode from standalone key', () => {
    localStorage.setItem('layoutMode', 'list')

    const settings = getSettings()
    expect(settings.layoutMode).toBe('list')
    expect(localStorage.getItem('layoutMode')).toBeNull()
  })

  it('removes legacy list storage data', () => {
    localStorage.setItem('plot-twisted-lists', JSON.stringify([{ name: 'Old list' }]))

    getSettings()

    expect(localStorage.getItem('plot-twisted-lists')).toBeNull()
  })

  it('merges existing settings with defaults when some fields are missing', () => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({ theme: 'light' }))

    const settings = getSettings()
    expect(settings.theme).toBe('light')
    expect(settings.language).toBe(DEFAULT_SETTINGS.language)
    expect(settings.librarySortField).toBe(DEFAULT_SETTINGS.librarySortField)
  })

  it('falls back to defaults for invalid settings', () => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, 'invalid json')
    const settings = getSettings()
    expect(settings).toEqual(DEFAULT_SETTINGS)
  })

  it('falls back to defaults when merged settings still fail schema validation', () => {
    localStorage.setItem(
      STORAGE_KEY_SETTINGS,
      JSON.stringify({
        theme: 'light',
        preferredRegion: 42,
      }),
    )

    const settings = getSettings()
    expect(settings).toEqual(DEFAULT_SETTINGS)
  })
})
