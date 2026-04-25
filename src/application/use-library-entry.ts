import { ref } from 'vue'
import type { Ref } from 'vue'
import type { LibraryEntry, MediaType, WatchStatus } from '@/domain/library.schema'
import { getLibraryEntry, saveLibraryEntry } from '@/infrastructure/storage.service'

/**
 * Composable for managing a library entry for a specific movie or TV show.
 * Provides methods to set rating, toggle favorite, and set watch status.
 * @param id - The TMDB ID of the movie or TV show
 * @param mediaType - The type of media ('movie' or 'tv')
 * @param title - The title to use when creating a new entry
 * @param posterPath - The poster path to use when creating a new entry
 * @returns Object containing entry ref and mutation methods
 */
export function useLibraryEntry(
  id: number,
  mediaType: MediaType,
  title: string,
  posterPath: string | null,
  voteAverage?: number,
  releaseDate?: string,
  runtime?: number,
) {
  const entry: Ref<LibraryEntry | null> = ref(null)

  /**
   * Loads the entry from storage and syncs metadata if needed.
   */
  function loadEntry() {
    const stored = getLibraryEntry(id, mediaType)
    if (stored) {
      let changed = false
      if (posterPath !== undefined && stored.posterPath !== posterPath) {
        stored.posterPath = posterPath
        changed = true
      }
      if (runtime !== undefined && stored.runtime !== runtime) {
        stored.runtime = runtime
        changed = true
      }
      if (voteAverage !== undefined && stored.voteAverage !== voteAverage) {
        stored.voteAverage = voteAverage
        changed = true
      }
      if (releaseDate !== undefined && stored.releaseDate !== releaseDate) {
        stored.releaseDate = releaseDate
        changed = true
      }

      if (changed) {
        saveLibraryEntry(stored)
      }
    }
    entry.value = stored
  }

  /**
   * Creates a new entry with default values.
   */
  function createDefaultEntry(): LibraryEntry {
    return {
      id,
      mediaType,
      title,
      posterPath,
      rating: 0,
      favorite: false,
      status: 'none',
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: new Date().toISOString(),
      voteAverage,
      releaseDate,
      runtime,
    }
  }

  /**
   * Ensures an entry exists, creating one if necessary.
   */
  function ensureEntry(): LibraryEntry {
    if (!entry.value) {
      entry.value = createDefaultEntry()
    }
    return entry.value
  }

  /**
   * Sets the rating for the entry.
   * @param value - Rating value (0-5, where 0 means unrated)
   */
  function setRating(value: number) {
    const currentEntry = ensureEntry()
    currentEntry.rating = value
    saveLibraryEntry(currentEntry)
    entry.value = { ...currentEntry }
  }

  /**
   * Toggles the favorite status of the entry.
   */
  function toggleFavorite() {
    const currentEntry = ensureEntry()
    currentEntry.favorite = !currentEntry.favorite
    saveLibraryEntry(currentEntry)
    entry.value = { ...currentEntry }
  }

  /**
   * Sets the watch status of the entry.
   * @param status - The watch status ('watchlist', 'watched', or 'none')
   */
  function setStatus(status: WatchStatus) {
    const currentEntry = ensureEntry()
    currentEntry.status = status
    saveLibraryEntry(currentEntry)
    entry.value = { ...currentEntry }
  }

  // Load entry immediately
  loadEntry()

  return {
    entry,
    loadEntry,
    setRating,
    toggleFavorite,
    setStatus,
  }
}
