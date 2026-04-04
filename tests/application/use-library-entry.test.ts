import { describe, it, expect, beforeEach } from 'vitest'
import { useLibraryEntry } from '@/application/use-library-entry'
import { getLibraryEntry, saveLibraryEntry } from '@/infrastructure/storage.service'
import type { LibraryEntry } from '@/domain/library.schema'

describe('useLibraryEntry', () => {
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
    lists: [],
    tags: [],
    notes: '',
    watchDates: [],
    addedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  })

  describe('initialization', () => {
    it('returns null entry when no entry exists (ED-06-01)', () => {
      // Act
      const { entry } = useLibraryEntry(550, 'movie', 'Test', '/poster.jpg')

      // Assert
      expect(entry.value).toBeNull()
    })

    it('returns existing entry from storage', () => {
      // Arrange
      const existingEntry = createEntry({ rating: 4, favorite: true })
      saveLibraryEntry(existingEntry)

      // Act
      const { entry } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Assert
      expect(entry.value).not.toBeNull()
      expect(entry.value?.rating).toBe(4)
      expect(entry.value?.favorite).toBe(true)
    })
  })

  describe('setRating', () => {
    it('creates entry and sets rating when entry does not exist (ED-06-02)', () => {
      // Arrange
      const { entry, setRating } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      setRating(4)

      // Assert
      expect(entry.value?.rating).toBe(4)
      expect(getLibraryEntry(550, 'movie')?.rating).toBe(4)
    })

    it('updates existing entry rating (ED-06-03)', () => {
      // Arrange
      const existingEntry = createEntry({ rating: 3 })
      saveLibraryEntry(existingEntry)
      const { entry, setRating } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      setRating(5)

      // Assert
      expect(entry.value?.rating).toBe(5)
      expect(getLibraryEntry(550, 'movie')?.rating).toBe(5)
    })

    it('persists rating to storage (ED-06-04)', () => {
      // Arrange
      const { setRating } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      setRating(4)

      // Assert
      const stored = getLibraryEntry(550, 'movie')
      expect(stored?.rating).toBe(4)
    })

    it('clears rating when set to 0', () => {
      // Arrange
      const existingEntry = createEntry({ rating: 4 })
      saveLibraryEntry(existingEntry)
      const { entry, setRating } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      setRating(0)

      // Assert
      expect(entry.value?.rating).toBe(0)
    })
  })

  describe('toggleFavorite', () => {
    it('creates entry and sets favorite when entry does not exist (ED-07-01)', () => {
      // Arrange
      const { entry, toggleFavorite } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      toggleFavorite()

      // Assert
      expect(entry.value?.favorite).toBe(true)
      expect(getLibraryEntry(550, 'movie')?.favorite).toBe(true)
    })

    it('toggles favorite from false to true (ED-07-02)', () => {
      // Arrange
      const existingEntry = createEntry({ favorite: false })
      saveLibraryEntry(existingEntry)
      const { entry, toggleFavorite } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      toggleFavorite()

      // Assert
      expect(entry.value?.favorite).toBe(true)
    })

    it('toggles favorite from true to false (ED-07-03)', () => {
      // Arrange
      const existingEntry = createEntry({ favorite: true })
      saveLibraryEntry(existingEntry)
      const { entry, toggleFavorite } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      toggleFavorite()

      // Assert
      expect(entry.value?.favorite).toBe(false)
    })

    it('persists favorite to storage', () => {
      // Arrange
      const { toggleFavorite } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      toggleFavorite()

      // Assert
      const stored = getLibraryEntry(550, 'movie')
      expect(stored?.favorite).toBe(true)
    })
  })

  describe('setStatus', () => {
    it('creates entry and sets status when entry does not exist (ED-08-01)', () => {
      // Arrange
      const { entry, setStatus } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      setStatus('watchlist')

      // Assert
      expect(entry.value?.status).toBe('watchlist')
      expect(getLibraryEntry(550, 'movie')?.status).toBe('watchlist')
    })

    it('updates existing entry status (ED-08-02)', () => {
      // Arrange
      const existingEntry = createEntry({ status: 'watchlist' })
      saveLibraryEntry(existingEntry)
      const { entry, setStatus } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      setStatus('watched')

      // Assert
      expect(entry.value?.status).toBe('watched')
    })

    it('clears status when set to none (ED-08-03)', () => {
      // Arrange
      const existingEntry = createEntry({ status: 'watched' })
      saveLibraryEntry(existingEntry)
      const { entry, setStatus } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      setStatus('none')

      // Assert
      expect(entry.value?.status).toBe('none')
    })

    it('persists status to storage (ED-08-04)', () => {
      // Arrange
      const { setStatus } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')

      // Act
      setStatus('watched')

      // Assert
      const stored = getLibraryEntry(550, 'movie')
      expect(stored?.status).toBe('watched')
    })
  })

  describe('entry creation', () => {
    it('creates entry with defaults on first mutation', () => {
      // Arrange
      const { entry, setRating } = useLibraryEntry(550, 'movie', 'Fight Club', '/poster.jpg')
      expect(entry.value).toBeNull()

      // Act
      setRating(3)

      // Assert
      expect(entry.value).not.toBeNull()
      expect(entry.value?.id).toBe(550)
      expect(entry.value?.mediaType).toBe('movie')
      expect(entry.value?.title).toBe('Fight Club')
      expect(entry.value?.posterPath).toBe('/poster.jpg')
      expect(entry.value?.rating).toBe(3)
      expect(entry.value?.favorite).toBe(false)
      expect(entry.value?.status).toBe('none')
    })

    it('uses provided title and posterPath for new entries', () => {
      // Arrange
      const { setRating } = useLibraryEntry(1396, 'tv', 'Breaking Bad', '/bb-poster.jpg')

      // Act
      setRating(5)

      // Assert
      const stored = getLibraryEntry(1396, 'tv')
      expect(stored?.title).toBe('Breaking Bad')
      expect(stored?.posterPath).toBe('/bb-poster.jpg')
    })
  })

  describe('media type isolation', () => {
    it('handles same ID for different media types independently', () => {
      // Arrange
      const movieComposable = useLibraryEntry(123, 'movie', 'Movie', '/movie.jpg')
      const tvComposable = useLibraryEntry(123, 'tv', 'TV Show', '/tv.jpg')

      // Act
      movieComposable.setRating(5)
      tvComposable.setRating(3)

      // Assert
      expect(movieComposable.entry.value?.rating).toBe(5)
      expect(tvComposable.entry.value?.rating).toBe(3)
      expect(getLibraryEntry(123, 'movie')?.rating).toBe(5)
      expect(getLibraryEntry(123, 'tv')?.rating).toBe(3)
    })
  })
})
