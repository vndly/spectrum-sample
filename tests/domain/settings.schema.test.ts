import { describe, it, expect } from 'vitest'
import { SettingsSchema, ExportDataSchema, ImportDataSchema } from '@/domain/settings.schema'

describe('Settings Domain Schemas', () => {
  describe('SettingsSchema', () => {
    it('should validate correct settings object', () => {
      const valid = {
        theme: 'dark',
        language: 'en',
        preferredRegion: 'US',
        layoutMode: 'grid',
        defaultHomeSection: 'trending',
        librarySortField: 'title',
        librarySortOrder: 'asc',
      }
      expect(SettingsSchema.parse(valid)).toEqual(valid)
    })

    it('should reject invalid theme', () => {
      const invalid = {
        theme: 'blue',
        language: 'en',
        preferredRegion: 'US',
        layoutMode: 'grid',
        defaultHomeSection: 'trending',
      }
      expect(() => SettingsSchema.parse(invalid)).toThrow()
    })

    it('should reject invalid layout mode', () => {
      const invalid = {
        theme: 'dark',
        language: 'en',
        preferredRegion: 'US',
        layoutMode: 'masonry',
        defaultHomeSection: 'trending',
      }
      expect(() => SettingsSchema.parse(invalid)).toThrow()
    })
  })

  describe('ExportDataSchema', () => {
    const validEntry = {
      id: 1,
      mediaType: 'movie',
      title: 'Test',
      posterPath: null,
      rating: 0,
      favorite: false,
      status: 'none',
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: new Date().toISOString(),
    }

    const validExport = {
      exportVersion: 1,
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      library: { '1-movie': validEntry },
      tags: ['test'],
      settings: {
        theme: 'dark',
        language: 'en',
        preferredRegion: 'US',
        layoutMode: 'grid',
        defaultHomeSection: 'trending',
      },
    }

    it('should validate correct export object', () => {
      expect(ExportDataSchema.parse(validExport)).toEqual(validExport)
    })

    it('should reject invalid exportVersion', () => {
      const invalid = { ...validExport, exportVersion: 2 }
      expect(() => ExportDataSchema.parse(invalid)).toThrow()
    })

    it('should reject invalid schemaVersion', () => {
      const invalid = { ...validExport, schemaVersion: 2 }
      expect(() => ExportDataSchema.parse(invalid)).toThrow()
    })
  })

  describe('ImportDataSchema', () => {
    it('should allow valid v1 export', () => {
      const validExport = {
        exportVersion: 1,
        exportedAt: new Date().toISOString(),
        schemaVersion: 1,
        library: {},
        tags: [],
        settings: {
          theme: 'dark',
          language: 'en',
          preferredRegion: 'US',
          layoutMode: 'grid',
          defaultHomeSection: 'trending',
        },
      }
      expect(ImportDataSchema.parse(validExport)).toEqual(validExport)
    })
  })
})
