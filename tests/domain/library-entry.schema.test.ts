import { describe, it, expect } from 'vitest'
import { LibraryEntrySchema, WatchStatusSchema, MediaTypeSchema } from '@/domain/library.schema'

describe('WatchStatusSchema', () => {
  it('accepts valid watch statuses', () => {
    // Act & Assert
    expect(WatchStatusSchema.parse('watchlist')).toBe('watchlist')
    expect(WatchStatusSchema.parse('watched')).toBe('watched')
    expect(WatchStatusSchema.parse('none')).toBe('none')
  })

  it('rejects invalid watch status', () => {
    // Act & Assert
    expect(() => WatchStatusSchema.parse('invalid')).toThrow()
    expect(() => WatchStatusSchema.parse('')).toThrow()
  })
})

describe('MediaTypeSchema', () => {
  it('accepts valid media types', () => {
    // Act & Assert
    expect(MediaTypeSchema.parse('movie')).toBe('movie')
    expect(MediaTypeSchema.parse('tv')).toBe('tv')
  })

  it('rejects invalid media type', () => {
    // Act & Assert
    expect(() => MediaTypeSchema.parse('show')).toThrow()
    expect(() => MediaTypeSchema.parse('')).toThrow()
  })
})

describe('LibraryEntrySchema', () => {
  it('validates a complete library entry', () => {
    // Arrange
    const entry = {
      id: 550,
      mediaType: 'movie',
      title: 'Fight Club',
      posterPath: '/poster.jpg',
      rating: 5,
      favorite: true,
      status: 'watched',
      lists: ['favorites', 'action'],
      tags: ['classic', 'thriller'],
      notes: 'Great movie!',
      watchDates: ['2024-01-15', '2024-06-20'],
      addedAt: '2024-01-15T10:00:00Z',
    }

    // Act
    const result = LibraryEntrySchema.parse(entry)

    // Assert
    expect(result.id).toBe(550)
    expect(result.mediaType).toBe('movie')
    expect(result.title).toBe('Fight Club')
    expect(result.rating).toBe(5)
    expect(result.favorite).toBe(true)
    expect(result.status).toBe('watched')
    expect(result.lists).toHaveLength(2)
    expect(result.tags).toHaveLength(2)
  })

  it('validates rating range (0-5)', () => {
    // Arrange
    const baseEntry = {
      id: 550,
      mediaType: 'movie',
      title: 'Test',
      posterPath: null,
      favorite: false,
      status: 'none',
      lists: [],
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: '2024-01-01T00:00:00Z',
    }

    // Act & Assert - valid ratings
    expect(LibraryEntrySchema.parse({ ...baseEntry, rating: 0 }).rating).toBe(0)
    expect(LibraryEntrySchema.parse({ ...baseEntry, rating: 1 }).rating).toBe(1)
    expect(LibraryEntrySchema.parse({ ...baseEntry, rating: 5 }).rating).toBe(5)

    // Invalid ratings
    expect(() => LibraryEntrySchema.parse({ ...baseEntry, rating: -1 })).toThrow()
    expect(() => LibraryEntrySchema.parse({ ...baseEntry, rating: 6 })).toThrow()
    expect(() => LibraryEntrySchema.parse({ ...baseEntry, rating: 3.5 })).not.toThrow() // numbers between 0-5 are valid
  })

  it('validates status enum values', () => {
    // Arrange
    const baseEntry = {
      id: 550,
      mediaType: 'movie',
      title: 'Test',
      posterPath: null,
      rating: 0,
      favorite: false,
      lists: [],
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: '2024-01-01T00:00:00Z',
    }

    // Act & Assert - valid statuses
    expect(LibraryEntrySchema.parse({ ...baseEntry, status: 'watchlist' }).status).toBe('watchlist')
    expect(LibraryEntrySchema.parse({ ...baseEntry, status: 'watched' }).status).toBe('watched')
    expect(LibraryEntrySchema.parse({ ...baseEntry, status: 'none' }).status).toBe('none')

    // Invalid status
    expect(() => LibraryEntrySchema.parse({ ...baseEntry, status: 'invalid' })).toThrow()
  })

  it('validates mediaType enum values', () => {
    // Arrange
    const baseEntry = {
      id: 550,
      title: 'Test',
      posterPath: null,
      rating: 0,
      favorite: false,
      status: 'none',
      lists: [],
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: '2024-01-01T00:00:00Z',
    }

    // Act & Assert - valid media types
    expect(LibraryEntrySchema.parse({ ...baseEntry, mediaType: 'movie' }).mediaType).toBe('movie')
    expect(LibraryEntrySchema.parse({ ...baseEntry, mediaType: 'tv' }).mediaType).toBe('tv')

    // Invalid media type
    expect(() => LibraryEntrySchema.parse({ ...baseEntry, mediaType: 'show' })).toThrow()
  })

  it('allows null posterPath', () => {
    // Arrange
    const entry = {
      id: 550,
      mediaType: 'movie',
      title: 'Test',
      posterPath: null,
      rating: 0,
      favorite: false,
      status: 'none',
      lists: [],
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: '2024-01-01T00:00:00Z',
    }

    // Act
    const result = LibraryEntrySchema.parse(entry)

    // Assert
    expect(result.posterPath).toBeNull()
  })

  it('accepts rating of 0 (unrated)', () => {
    // Arrange
    const entry = {
      id: 550,
      mediaType: 'movie',
      title: 'Test',
      posterPath: null,
      rating: 0,
      favorite: false,
      status: 'none',
      lists: [],
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: '2024-01-01T00:00:00Z',
    }

    // Act
    const result = LibraryEntrySchema.parse(entry)

    // Assert
    expect(result.rating).toBe(0)
  })
})
