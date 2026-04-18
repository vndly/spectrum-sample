import { describe, it, expect, beforeEach } from 'vitest'
import { useLists } from '@/application/use-lists'
import { getAllLists, saveList } from '@/infrastructure/storage.service'

describe('useLists', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('lists', () => {
    it('initializes with an empty array when no lists exist', () => {
      // Act
      const { lists } = useLists()

      // Assert
      expect(lists.value).toEqual([])
    })

    it('initializes with existing lists from storage', () => {
      // Arrange
      const list = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Horror',
        createdAt: new Date().toISOString(),
      }
      saveList(list)

      // Act
      const { lists } = useLists()

      // Assert
      expect(lists.value).toHaveLength(1)
      expect(lists.value[0].name).toBe('Horror')
    })
  })

  describe('createList', () => {
    it('creates a new list with a valid name (L-03)', () => {
      // Arrange
      const { lists, createList } = useLists()

      // Act
      createList('Sci-Fi')

      // Assert
      expect(lists.value).toHaveLength(1)
      expect(lists.value[0].name).toBe('Sci-Fi')
      expect(getAllLists()).toHaveLength(1)
    })

    it('trims the list name before creation', () => {
      // Arrange
      const { lists, createList } = useLists()

      // Act
      createList('  Action  ')

      // Assert
      expect(lists.value[0].name).toBe('Action')
    })

    it('fails to create a list with an empty name', () => {
      // Arrange
      const { lists, createList } = useLists()

      // Act
      createList('')

      // Assert
      expect(lists.value).toHaveLength(0)
    })

    it('fails to create a list with a duplicate name (case-insensitive) (L-03)', () => {
      // Arrange
      const { createList } = useLists()
      createList('Horror')

      // Act
      createList('horror')

      // Assert
      expect(getAllLists()).toHaveLength(1)
    })
  })

  describe('renameList', () => {
    it('renames an existing list (L-03)', () => {
      // Arrange
      const { lists, createList, renameList } = useLists()
      createList('Old Name')
      const id = lists.value[0].id

      // Act
      renameList(id, 'New Name')

      // Assert
      expect(lists.value[0].name).toBe('New Name')
      expect(getAllLists()[0].name).toBe('New Name')
    })

    it('fails to rename to a duplicate name', () => {
      // Arrange
      const { lists, createList, renameList } = useLists()
      createList('List 1')
      createList('List 2')
      const id1 = lists.value[0].id

      // Act
      renameList(id1, 'list 2')

      // Assert
      expect(lists.value.find((l) => l.id === id1)?.name).toBe('List 1')
    })

    it('fails to rename when the new name is empty', () => {
      const { lists, createList, renameList } = useLists()
      createList('List 1')
      const id = lists.value[0].id

      renameList(id, '   ')

      expect(lists.value[0].name).toBe('List 1')
    })

    it('fails to rename a missing list', () => {
      const { createList, renameList } = useLists()
      createList('List 1')

      renameList('missing-id', 'Renamed')

      expect(getAllLists()[0].name).toBe('List 1')
    })
  })

  describe('deleteList', () => {
    it('removes a list from state and storage (L-03)', () => {
      // Arrange
      const { lists, createList, deleteList } = useLists()
      createList('To Delete')
      const id = lists.value[0].id

      // Act
      deleteList(id)

      // Assert
      expect(lists.value).toHaveLength(0)
      expect(getAllLists()).toHaveLength(0)
    })
  })
})
