import type { LibraryEntry, MediaType } from '@/domain/library.schema'
import { LibraryEntrySchema } from '@/domain/library.schema'
import type { Settings, ExportData } from '@/domain/settings.schema'
import { SettingsSchema, DEFAULT_SETTINGS, ImportDataSchema } from '@/domain/settings.schema'

/** Storage key for the library data in localStorage. */
export const STORAGE_KEY = 'plot-twisted-library'

/** Storage key for settings in localStorage. */
export const STORAGE_KEY_SETTINGS = 'plot-twisted-settings'

/** Legacy storage key for data removed with the list feature. */
const LEGACY_LISTS_STORAGE_KEY = 'plot-twisted-lists'

/**
 * Retrieves user settings from localStorage.
 * Handles migration from standalone layoutMode key.
 * @returns Validated user settings
 */
export function getSettings(): Settings {
  localStorage.removeItem(LEGACY_LISTS_STORAGE_KEY)

  const stored = localStorage.getItem(STORAGE_KEY_SETTINGS)

  let settings: Partial<Settings> = {}

  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      const result = SettingsSchema.safeParse(parsed)
      if (result.success) {
        return result.data
      }
      settings = parsed
    } catch {
      // Fall through to defaults/migration
    }
  }

  // Handle migration of standalone layoutMode
  const standaloneLayout = localStorage.getItem('layoutMode')
  if (standaloneLayout === 'grid' || standaloneLayout === 'list') {
    settings.layoutMode = standaloneLayout
    // Clean up standalone key
    localStorage.removeItem('layoutMode')
  }

  const merged = { ...DEFAULT_SETTINGS, ...settings }
  const result = SettingsSchema.safeParse(merged)

  if (result.success) {
    // Save migrated settings back to storage
    saveSettings(result.data)
    return result.data
  }

  return DEFAULT_SETTINGS
}

/**
 * Saves user settings to localStorage.
 * @param settings - The settings object to save
 */
export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
}

/**
 * Retrieves all library entries from localStorage.
 * @returns Array of validated library entries, or empty array if none exist
 */
export function getAllLibraryEntries(): LibraryEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return []
    }

    // Validate and normalize each entry, stripping legacy fields.
    return parsed.flatMap((entry) => {
      const result = LibraryEntrySchema.safeParse(entry)
      return result.success ? [result.data] : []
    })
  } catch {
    return []
  }
}

/**
 * Retrieves a specific library entry by ID and media type.
 * @param id - The TMDB ID of the movie or TV show
 * @param mediaType - The type of media ('movie' or 'tv')
 * @returns The library entry if found, or null
 */
export function getLibraryEntry(id: number, mediaType: MediaType): LibraryEntry | null {
  const entries = getAllLibraryEntries()
  return entries.find((entry) => entry.id === id && entry.mediaType === mediaType) ?? null
}

/**
 * Saves or updates a library entry in localStorage.
 * If an entry with the same ID and media type exists, it will be replaced.
 * @param entry - The library entry to save
 */
export function saveLibraryEntry(entry: LibraryEntry): void {
  const entries = getAllLibraryEntries()
  const existingIndex = entries.findIndex(
    (e) => e.id === entry.id && e.mediaType === entry.mediaType,
  )

  if (existingIndex >= 0) {
    entries[existingIndex] = entry
  } else {
    entries.push(entry)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

/**
 * Removes a library entry from localStorage.
 * @param id - The TMDB ID of the movie or TV show
 * @param mediaType - The type of media ('movie' or 'tv')
 */
export function removeLibraryEntry(id: number, mediaType: MediaType): void {
  const entries = getAllLibraryEntries()
  const filtered = entries.filter((e) => !(e.id === id && e.mediaType === mediaType))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

/**
 * Generates an export object containing all user data.
 * @returns The export data object
 */
export async function exportData(): Promise<ExportData> {
  const libraryEntries = getAllLibraryEntries()
  const settings = getSettings()

  // Convert arrays to records as expected by schema
  const libraryRecord: Record<string, LibraryEntry> = {}
  libraryEntries.forEach((entry) => {
    libraryRecord[`${entry.id}-${entry.mediaType}`] = entry
  })

  // Extract all unique tags
  const tags = new Set<string>()
  libraryEntries.forEach((entry) => {
    entry.tags.forEach((tag) => tags.add(tag))
  })

  const exportData: ExportData = {
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    library: libraryRecord,
    tags: Array.from(tags).sort(),
    settings,
  }

  return exportData
}

/**
 * Imports user data from a provided object using the specified strategy.
 * @param data - The data to import (untrusted)
 * @param strategy - Whether to 'merge' with existing data or 'overwrite' it
 */
export async function importData(data: unknown, strategy: 'merge' | 'overwrite'): Promise<void> {
  // 1. Validate structure
  const result = ImportDataSchema.safeParse(data)
  if (!result.success) {
    throw new Error(`Invalid export data: ${result.error.message}`)
  }

  const validatedData = result.data

  // 2. Safety Export for overwrite strategy
  if (strategy === 'overwrite') {
    const backup = await exportData()
    downloadFile(
      JSON.stringify(backup, null, 2),
      `plot-twisted-backup-${new Date().toISOString()}.json`,
      'application/json',
    )
  }

  // 3. Process entries with sanitization
  const sanitizeEntry = (entry: LibraryEntry): LibraryEntry => ({
    ...entry,
    title: sanitize(entry.title),
    notes: sanitize(entry.notes),
    tags: entry.tags.map(sanitize),
  })

  // 4. Apply strategy
  if (strategy === 'overwrite') {
    // Clear existing
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY_SETTINGS)

    // Save imported
    const libraryEntries = Object.values(validatedData.library).map(sanitizeEntry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(libraryEntries))

    saveSettings(validatedData.settings)
  } else {
    // Merge
    const importedLibrary = Object.values(validatedData.library).map(sanitizeEntry)
    importedLibrary.forEach((entry) => saveLibraryEntry(entry))

    // Settings are ignored in merge strategy per requirements
  }
}

/**
 * Triggers a file download in the browser.
 * @param content - The string content of the file
 * @param fileName - The desired name for the downloaded file
 * @param contentType - The MIME type of the file
 */
export function downloadFile(content: string, fileName: string, contentType: string): void {
  const a = document.createElement('a')
  const file = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(file)
  a.href = url
  a.download = fileName
  a.click()
  // Give it a moment before revoking
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Parses a JSON file from a File object.
 * @param file - The browser File object
 * @returns The parsed data
 */
export async function parseFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        resolve(JSON.parse(content))
      } catch {
        reject(new Error('Invalid JSON format'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Simple sanitization to prevent XSS.
 * Trims and removes script-like tags.
 */
function sanitize(value: string): string {
  if (!value) return value
  return value.trim().replace(/<[^>]*>?/gm, '')
}
