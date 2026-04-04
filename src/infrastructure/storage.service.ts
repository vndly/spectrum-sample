import type { LibraryEntry, MediaType } from '@/domain/library.schema'
import { LibraryEntrySchema } from '@/domain/library.schema'

/** Storage key for the library data in localStorage. */
export const STORAGE_KEY = 'plot-twisted-library'

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

    // Validate each entry, filter out invalid ones
    return parsed.filter((entry) => {
      const result = LibraryEntrySchema.safeParse(entry)
      return result.success
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
