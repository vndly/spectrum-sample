import { describe, it, expect, beforeEach } from 'vitest'
import {
  getLibraryEntry,
  saveLibraryEntry,
  getAllLibraryEntries,
  removeLibraryEntry,
  STORAGE_KEY,
} from '@/infrastructure/storage.service'
import type { LibraryEntry } from '@/domain/library.schema'

describe('storage.service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const createEntry = (overrides: Partial<LibraryEntry> = {}): LibraryEntry => ({
    id: 550,
    mediaType: 'movie',
    title: 'Fight Club',
    posterPath: '/poster.jpg',
    rating: 0,
    favorite: false,
    status: 'none',
    tags: [],
    notes: '',
    watchDates: [],
    addedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  })

  describe('getLibraryEntry', () => {
    it('returns null for non-existent entry (ED-06-01)', () => {
      // Act
      const result = getLibraryEntry(999, 'movie')

      // Assert
      expect(result).toBeNull()
    })

    it('returns entry when it exists', () => {
      // Arrange
      const entry = createEntry()
      saveLibraryEntry(entry)

      // Act
      const result = getLibraryEntry(550, 'movie')

      // Assert
      expect(result).not.toBeNull()
      expect(result?.id).toBe(550)
      expect(result?.title).toBe('Fight Club')
    })

    it('distinguishes between movie and tv entries with same ID', () => {
      // Arrange
      const movieEntry = createEntry({ id: 123, mediaType: 'movie', title: 'Movie' })
      const tvEntry = createEntry({ id: 123, mediaType: 'tv', title: 'TV Show' })
      saveLibraryEntry(movieEntry)
      saveLibraryEntry(tvEntry)

      // Act
      const movieResult = getLibraryEntry(123, 'movie')
      const tvResult = getLibraryEntry(123, 'tv')

      // Assert
      expect(movieResult?.title).toBe('Movie')
      expect(tvResult?.title).toBe('TV Show')
    })
  })

  describe('saveLibraryEntry', () => {
    it('creates new entry (ED-06-02)', () => {
      // Arrange
      const entry = createEntry()

      // Act
      saveLibraryEntry(entry)

      // Assert
      const result = getLibraryEntry(550, 'movie')
      expect(result).not.toBeNull()
      expect(result?.id).toBe(550)
    })

    it('updates existing entry (ED-06-03)', () => {
      // Arrange
      const entry = createEntry({ rating: 3 })
      saveLibraryEntry(entry)

      // Act
      const updatedEntry = createEntry({ rating: 5 })
      saveLibraryEntry(updatedEntry)

      // Assert
      const result = getLibraryEntry(550, 'movie')
      expect(result?.rating).toBe(5)
    })

    it('persists rating field (ED-06-04)', () => {
      // Arrange
      const entry = createEntry({ rating: 4 })

      // Act
      saveLibraryEntry(entry)

      // Assert
      const result = getLibraryEntry(550, 'movie')
      expect(result?.rating).toBe(4)
    })

    it('persists favorite field (ED-07-01)', () => {
      // Arrange
      const entry = createEntry({ favorite: true })

      // Act
      saveLibraryEntry(entry)

      // Assert
      const result = getLibraryEntry(550, 'movie')
      expect(result?.favorite).toBe(true)
    })

    it('persists status field (ED-08-01)', () => {
      // Arrange
      const entry = createEntry({ status: 'watched' })

      // Act
      saveLibraryEntry(entry)

      // Assert
      const result = getLibraryEntry(550, 'movie')
      expect(result?.status).toBe('watched')
    })

    it('updates favorite toggle (ED-07-02)', () => {
      // Arrange
      const entry = createEntry({ favorite: false })
      saveLibraryEntry(entry)

      // Act
      const updatedEntry = createEntry({ favorite: true })
      saveLibraryEntry(updatedEntry)

      // Assert
      const result = getLibraryEntry(550, 'movie')
      expect(result?.favorite).toBe(true)
    })

    it('updates status field (ED-08-02)', () => {
      // Arrange
      const entry = createEntry({ status: 'watchlist' })
      saveLibraryEntry(entry)

      // Act
      const updatedEntry = createEntry({ status: 'watched' })
      saveLibraryEntry(updatedEntry)

      // Assert
      const result = getLibraryEntry(550, 'movie')
      expect(result?.status).toBe('watched')
    })
  })

  describe('getAllLibraryEntries', () => {
    it('returns empty array when no entries exist', () => {
      // Act
      const result = getAllLibraryEntries()

      // Assert
      expect(result).toEqual([])
    })

    it('returns all saved entries', () => {
      // Arrange
      saveLibraryEntry(createEntry({ id: 1, title: 'Movie 1' }))
      saveLibraryEntry(createEntry({ id: 2, title: 'Movie 2' }))
      saveLibraryEntry(createEntry({ id: 3, mediaType: 'tv', title: 'TV Show 1' }))

      // Act
      const result = getAllLibraryEntries()

      // Assert
      expect(result).toHaveLength(3)
    })
  })

  describe('removeLibraryEntry', () => {
    it('removes existing entry', () => {
      // Arrange
      const entry = createEntry()
      saveLibraryEntry(entry)

      // Act
      removeLibraryEntry(550, 'movie')

      // Assert
      expect(getLibraryEntry(550, 'movie')).toBeNull()
    })

    it('does not affect other entries', () => {
      // Arrange
      saveLibraryEntry(createEntry({ id: 1, title: 'Movie 1' }))
      saveLibraryEntry(createEntry({ id: 2, title: 'Movie 2' }))

      // Act
      removeLibraryEntry(1, 'movie')

      // Assert
      expect(getLibraryEntry(1, 'movie')).toBeNull()
      expect(getLibraryEntry(2, 'movie')).not.toBeNull()
    })
  })

  describe('data validation', () => {
    it('filters out invalid entries on read', () => {
      // Arrange - store invalid data directly
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          {
            id: 1,
            mediaType: 'movie',
            title: 'Valid',
            posterPath: null,
            rating: 3,
            favorite: false,
            status: 'none',
            tags: [],
            notes: '',
            watchDates: [],
            addedAt: '2024-01-01',
          },
          { id: 2, invalidField: true }, // Invalid entry
        ]),
      )

      // Act
      const result = getAllLibraryEntries()

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })

    it('returns empty array for corrupted JSON', () => {
      // Arrange
      localStorage.setItem(STORAGE_KEY, 'not valid json')

      // Act
      const result = getAllLibraryEntries()

      // Assert
      expect(result).toEqual([])
    })

    it('returns empty array for non-array data', () => {
      // Arrange
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ notAnArray: true }))

      // Act
      const result = getAllLibraryEntries()

      // Assert
      expect(result).toEqual([])
    })
  })
})
