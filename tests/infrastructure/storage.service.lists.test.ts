/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAllLists,
  saveList,
  removeList,
  getListEntries,
  updateEntryLists,
  removeListFromAllEntries,
  saveLibraryEntry,
  STORAGE_KEY,
} from '@/infrastructure/storage.service'
import type { List } from '@/domain/library.schema'
import type { LibraryEntry } from '@/domain/library.schema'

describe('storage.service (lists)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const createList = (overrides: Partial<List> = {}): List => ({
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Horror',
    createdAt: '2026-04-05T12:00:00Z',
    ...overrides,
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

  describe('getAllLists', () => {
    it('returns empty array when no lists exist (L-03)', () => {
      // Act
      const result = getAllLists()

      // Assert
      expect(result).toEqual([])
    })

    it('returns all saved lists', () => {
      // Arrange
      saveList(createList({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'List 1' }))
      saveList(createList({ id: '550e8400-e29b-41d4-a716-446655440002', name: 'List 2' }))

      // Act
      const result = getAllLists()

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('List 1')
      expect(result[1].name).toBe('List 2')
    })
  })

  describe('saveList', () => {
    it('creates new list (L-03)', () => {
      // Arrange
      const list = createList()

      // Act
      saveList(list)

      // Assert
      const result = getAllLists()
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('550e8400-e29b-41d4-a716-446655440000')
    })

    it('updates existing list (L-03)', () => {
      // Arrange
      const list = createList({ name: 'Old Name' })
      saveList(list)

      // Act
      const updatedList = createList({ name: 'New Name' })
      saveList(updatedList)

      // Assert
      const result = getAllLists()
      expect(result[0].name).toBe('New Name')
    })
  })

  describe('removeList', () => {
    it('removes existing list (L-03)', () => {
      // Arrange
      const list = createList({ id: '550e8400-e29b-41d4-a716-446655440001' })
      saveList(list)

      // Act
      removeList('550e8400-e29b-41d4-a716-446655440001')

      // Assert
      expect(getAllLists()).toHaveLength(0)
    })
  })

  describe('getListEntries', () => {
    it('returns only entries belonging to the specified list (L-05)', () => {
      // Arrange
      const entry1 = createEntry({ id: 1, lists: ['list-1'] })
      const entry2 = createEntry({ id: 2, lists: ['list-1', 'list-2'] })
      const entry3 = createEntry({ id: 3, lists: ['list-2'] })
      saveLibraryEntry(entry1)
      saveLibraryEntry(entry2)
      saveLibraryEntry(entry3)

      // Act
      const result = getListEntries('list-1')

      // Assert
      expect(result).toHaveLength(2)
      expect(result.map((e) => e.id)).toContain(1)
      expect(result.map((e) => e.id)).toContain(2)
      expect(result.map((e) => e.id)).not.toContain(3)
    })
  })

  describe('updateEntryLists', () => {
    it('updates the lists array for a specific entry (L-04)', () => {
      // Arrange
      const entry = createEntry({ id: 550, lists: ['old-list'] })
      saveLibraryEntry(entry)

      // Act
      updateEntryLists(550, 'movie', ['new-list-1', 'new-list-2'])

      // Assert
      const updated = getAllLibraryEntries().find((e: any) => e.id === 550)
      expect(updated?.lists).toEqual(['new-list-1', 'new-list-2'])
    })
  })

  describe('removeListFromAllEntries', () => {
    it('removes list ID from all associated entries but keeps entries (L-06)', () => {
      // Arrange
      const entry1 = createEntry({ id: 1, lists: ['list-1', 'list-2'] })
      const entry2 = createEntry({ id: 2, lists: ['list-1'] })
      saveLibraryEntry(entry1)
      saveLibraryEntry(entry2)

      // Act
      removeListFromAllEntries('list-1')

      // Assert
      const entries = getAllLibraryEntries()
      const updated1 = entries.find((e: any) => e.id === 1)
      const updated2 = entries.find((e: any) => e.id === 2)

      expect(updated1?.lists).toEqual(['list-2'])
      expect(updated2?.lists).toEqual([])
    })
  })
})

function getAllLibraryEntries() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}
