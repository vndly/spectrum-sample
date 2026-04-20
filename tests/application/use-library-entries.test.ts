import { describe, it, expect, beforeEach } from 'vitest'
import { useLibraryEntries } from '@/application/use-library-entries'
import { useLibraryFilters } from '@/application/use-library-filters'
import { useSort } from '@/application/use-sort'
import { saveLibraryEntry } from '@/infrastructure/storage.service'
import type { LibraryEntry } from '@/domain/library.schema'

describe('useLibraryEntries', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const createEntry = (overrides: Partial<LibraryEntry> = {}): LibraryEntry => ({
    id: 1,
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

  describe('getAllEntries', () => {
    it('returns all entries in the library', () => {
      // Arrange
      saveLibraryEntry(createEntry({ id: 1, title: 'Entry 1' }))
      saveLibraryEntry(createEntry({ id: 2, title: 'Entry 2' }))

      // Act
      const { entries } = useLibraryEntries()

      // Assert
      expect(entries.value).toHaveLength(2)
    })
  })

  describe('getEntriesByStatus', () => {
    it('returns entries filtered by status (L-01, L-02)', () => {
      // Arrange
      saveLibraryEntry(createEntry({ id: 1, status: 'watchlist' }))
      saveLibraryEntry(createEntry({ id: 2, status: 'watched' }))
      saveLibraryEntry(createEntry({ id: 3, status: 'watchlist' }))

      // Act
      const { getEntriesByStatus } = useLibraryEntries()
      const watchlist = getEntriesByStatus('watchlist')
      const watched = getEntriesByStatus('watched')

      // Assert
      expect(watchlist).toHaveLength(2)
      expect(watched).toHaveLength(1)
    })
  })

  describe('filtering and sorting', () => {
    it('applies filters and sorting to entries', () => {
      // Arrange
      saveLibraryEntry(
        createEntry({ id: 1, title: 'B', addedAt: '2024-01-01', mediaType: 'movie' }),
      )
      saveLibraryEntry(createEntry({ id: 2, title: 'A', addedAt: '2024-01-02', mediaType: 'tv' }))

      const { filters } = useLibraryFilters()
      const { sortField, sortOrder } = useSort()
      const { entries } = useLibraryEntries(filters, sortField, sortOrder)

      // Act & Assert: Initial state (Default sort dateAdded desc)
      expect(entries.value).toHaveLength(2)
      expect(entries.value[0].id).toBe(2) // A added later
      expect(entries.value[1].id).toBe(1)

      // Act: Filter by mediaType
      filters.value.mediaType = 'movie'
      expect(entries.value).toHaveLength(1)
      expect(entries.value[0].id).toBe(1)

      // Act: Reset filter and change sort
      filters.value.mediaType = 'all'
      sortField.value = 'title'
      sortOrder.value = 'asc'
      expect(entries.value).toHaveLength(2)
      expect(entries.value[0].id).toBe(2) // A
      expect(entries.value[1].id).toBe(1) // B
    })
  })

  describe('refresh', () => {
    it('reloads entries from storage after initialization', () => {
      saveLibraryEntry(createEntry({ id: 1, title: 'Entry 1' }))

      const { entries, refresh } = useLibraryEntries()
      expect(entries.value).toHaveLength(1)

      saveLibraryEntry(createEntry({ id: 2, title: 'Entry 2' }))
      refresh()

      expect(entries.value).toHaveLength(2)
    })
  })
})
