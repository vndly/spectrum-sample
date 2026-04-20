import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { exportData, importData, downloadFile, parseFile } from '@/infrastructure/storage.service'

// Mocking global fetch for download trigger if needed, or window.URL
const createObjectURLMock = vi.fn()
const revokeObjectURLMock = vi.fn()
global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = revokeObjectURLMock

describe('storageService Import/Export', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const validEntry = {
    id: 550,
    title: 'Fight Club',
    mediaType: 'movie',
    posterPath: '/pB8BM79vS6vMvMjnBhCHvDOD0vH.jpg',
    rating: 0,
    favorite: false,
    status: 'none',
    tags: [],
    notes: '',
    watchDates: [],
    addedAt: new Date().toISOString(),
  }

  describe('exportData', () => {
    it('should generate a valid export object containing library, tags, and settings', async () => {
      // Setup mock data in localStorage
      const mockSettings = {
        theme: 'dark',
        language: 'en',
        preferredRegion: 'US',
        layoutMode: 'grid',
        defaultHomeSection: 'trending',
        librarySortField: 'dateAdded',
        librarySortOrder: 'desc',
      }
      const mockLibrary = [validEntry]

      localStorage.setItem('plot-twisted-settings', JSON.stringify(mockSettings))
      localStorage.setItem('plot-twisted-library', JSON.stringify(mockLibrary))

      const exported = await exportData()

      expect(exported.exportVersion).toBe(1)
      expect(exported.schemaVersion).toBe(1)
      expect(exported.settings).toEqual(mockSettings)
      expect(Object.values(exported.library)).toHaveLength(1)
      expect('lists' in exported).toBe(false)
      expect(exported.exportedAt).toBeDefined()
    })

    it('should export sorted tags', async () => {
      localStorage.setItem(
        'plot-twisted-library',
        JSON.stringify([
          {
            ...validEntry,
            id: 1,
            tags: ['beta', 'alpha'],
          },
        ]),
      )

      const exported = await exportData()

      expect(exported.tags).toEqual(['alpha', 'beta'])
    })
  })

  describe('importData', () => {
    const validExport = {
      exportVersion: 1,
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      library: { '550-movie': validEntry },
      tags: ['action'],
      settings: {
        theme: 'light',
        language: 'es',
        preferredRegion: 'ES',
        layoutMode: 'list',
        defaultHomeSection: 'popular',
        librarySortField: 'dateAdded',
        librarySortOrder: 'desc',
      },
    }

    it('should overwrite existing data when strategy is "overwrite"', async () => {
      // Pre-fill storage
      localStorage.setItem(
        'plot-twisted-library',
        JSON.stringify([{ ...validEntry, id: 123, title: 'Old' }]),
      )

      await importData(validExport, 'overwrite')

      const storedLibrary = JSON.parse(localStorage.getItem('plot-twisted-library') || '[]')
      const storedSettings = JSON.parse(localStorage.getItem('plot-twisted-settings') || '{}')

      expect(storedLibrary).toHaveLength(1)
      expect(storedLibrary[0].title).toBe('Fight Club')
      expect(storedSettings.language).toBe('es')
    })

    it('should merge data when strategy is "merge"', async () => {
      // Pre-fill storage
      localStorage.setItem(
        'plot-twisted-library',
        JSON.stringify([{ ...validEntry, id: 123, title: 'Old' }]),
      )
      localStorage.setItem(
        'plot-twisted-settings',
        JSON.stringify({
          theme: 'dark',
          language: 'en',
          preferredRegion: 'US',
          layoutMode: 'grid',
          defaultHomeSection: 'trending',
          librarySortField: 'dateAdded',
          librarySortOrder: 'desc',
        }),
      )

      await importData(validExport, 'merge')

      const storedLibrary = JSON.parse(localStorage.getItem('plot-twisted-library') || '[]')
      const storedSettings = JSON.parse(localStorage.getItem('plot-twisted-settings') || '{}')

      // Library should have both
      expect(storedLibrary).toHaveLength(2)
      expect(storedLibrary.find((e: { id: number }) => e.id === 123)).toBeDefined()
      expect(storedLibrary.find((e: { id: number }) => e.id === 550)).toBeDefined()

      // Settings should NOT be overwritten in merge strategy
      expect(storedSettings.language).toBe('en')
    })

    it('should reject malformed JSON or invalid schema', async () => {
      const invalidData = { ...validExport, exportVersion: 'wrong' }

      await expect(importData(invalidData, 'merge')).rejects.toThrow()
    })

    it('should sanitize imported content to prevent XSS', async () => {
      const maliciousExport = {
        ...validExport,
        library: {
          '666-movie': {
            ...validEntry,
            id: 666,
            title: '<script>alert("xss")</script>Evil',
          },
        },
      }

      await importData(maliciousExport, 'merge')
      const storedLibrary = JSON.parse(localStorage.getItem('plot-twisted-library') || '[]')
      const entry = storedLibrary.find((e: { id: number }) => e.id === 666)

      expect(entry.title).not.toContain('<script>')
    })

    it('should ignore legacy list data during imports', async () => {
      const legacyExport = {
        ...validExport,
        library: {
          '550-movie': {
            ...validEntry,
            lists: ['550e8400-e29b-41d4-a716-446655440001'],
          },
        },
        lists: {
          '550e8400-e29b-41d4-a716-446655440001': {
            id: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Legacy list',
            createdAt: '2026-04-18T10:00:00.000Z',
          },
        },
      }

      await importData(legacyExport, 'merge')

      const storedLibrary = JSON.parse(localStorage.getItem('plot-twisted-library') || '[]')
      expect(storedLibrary[0]).not.toHaveProperty('lists')
      expect(localStorage.getItem('plot-twisted-lists')).toBeNull()
    })
  })

  describe('downloadFile', () => {
    it('should create an anchor, click it, and revoke the object URL', () => {
      vi.useFakeTimers()
      const anchor = document.createElement('a')
      const clickSpy = vi.spyOn(anchor, 'click').mockImplementation(() => {})
      vi.spyOn(document, 'createElement').mockReturnValue(anchor)

      downloadFile('hello', 'library.json', 'application/json')

      expect(createObjectURLMock).toHaveBeenCalled()
      expect(anchor.download).toBe('library.json')
      expect(clickSpy).toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(revokeObjectURLMock).toHaveBeenCalled()
    })
  })

  describe('parseFile', () => {
    it('should resolve parsed JSON content', async () => {
      const fileReaderMock = class {
        onload: ((event: { target: { result: string } }) => void) | null = null
        onerror: (() => void) | null = null

        readAsText() {
          this.onload?.({ target: { result: '{"ok":true}' } })
        }
      }
      vi.stubGlobal('FileReader', fileReaderMock)

      await expect(parseFile(new File(['{}'], 'valid.json'))).resolves.toEqual({ ok: true })
    })

    it('should reject invalid JSON content', async () => {
      const fileReaderMock = class {
        onload: ((event: { target: { result: string } }) => void) | null = null
        onerror: (() => void) | null = null

        readAsText() {
          this.onload?.({ target: { result: '{' } })
        }
      }
      vi.stubGlobal('FileReader', fileReaderMock)

      await expect(parseFile(new File(['{'], 'invalid.json'))).rejects.toThrow(
        'Invalid JSON format',
      )
    })

    it('should reject file read errors', async () => {
      const fileReaderMock = class {
        onload: ((event: { target: { result: string } }) => void) | null = null
        onerror: (() => void) | null = null

        readAsText() {
          this.onerror?.()
        }
      }
      vi.stubGlobal('FileReader', fileReaderMock)

      await expect(parseFile(new File(['{}'], 'error.json'))).rejects.toThrow('Failed to read file')
    })
  })
})
