import { describe, it, expect } from 'vitest'
import { selectSeeds, deduplicateRecommendations } from '@/domain/recommendations.logic'
import type { LibraryEntry } from '@/domain/library.schema'
import type { SearchResult } from '@/domain/search.schema'

describe('Recommendations Logic', () => {
  describe('selectSeeds', () => {
    it('selects up to 5 seeds prioritized by rating then recency', () => {
      const entries: LibraryEntry[] = [
        {
          id: 1,
          rating: 5,
          addedAt: '2023-01-01T00:00:00Z',
          mediaType: 'movie',
          title: 'A',
          status: 'watched',
          favorite: false,
          lists: [],
          tags: [],
          notes: '',
          watchDates: [],
        },
        {
          id: 2,
          rating: 5,
          addedAt: '2023-01-02T00:00:00Z',
          mediaType: 'movie',
          title: 'B',
          status: 'watched',
          favorite: false,
          lists: [],
          tags: [],
          notes: '',
          watchDates: [],
        },
        {
          id: 3,
          rating: 4,
          addedAt: '2023-01-03T00:00:00Z',
          mediaType: 'movie',
          title: 'C',
          status: 'watched',
          favorite: false,
          lists: [],
          tags: [],
          notes: '',
          watchDates: [],
        },
        {
          id: 4,
          rating: 0,
          addedAt: '2023-01-04T00:00:00Z',
          mediaType: 'movie',
          title: 'D',
          status: 'watched',
          favorite: false,
          lists: [],
          tags: [],
          notes: '',
          watchDates: [],
        },
        {
          id: 5,
          rating: 0,
          addedAt: '2023-01-05T00:00:00Z',
          mediaType: 'movie',
          title: 'E',
          status: 'watched',
          favorite: false,
          lists: [],
          tags: [],
          notes: '',
          watchDates: [],
        },
        {
          id: 6,
          rating: 0,
          addedAt: '2023-01-06T00:00:00Z',
          mediaType: 'movie',
          title: 'F',
          status: 'watched',
          favorite: false,
          lists: [],
          tags: [],
          notes: '',
          watchDates: [],
        },
      ]

      const seeds = selectSeeds(entries)

      expect(seeds).toHaveLength(5)
      expect(seeds[0].id).toBe(2) // Rating 5, newer
      expect(seeds[1].id).toBe(1) // Rating 5, older
      expect(seeds[2].id).toBe(3) // Rating 4
      expect(seeds[3].id).toBe(6) // Rating 0, newest activity
      expect(seeds[4].id).toBe(5) // Rating 0, second newest activity
    })

    it('uses latest watch date for recency if available', () => {
      const entries: LibraryEntry[] = [
        {
          id: 1,
          rating: 0,
          addedAt: '2023-01-01T00:00:00Z',
          watchDates: ['2023-01-10T00:00:00Z'],
          mediaType: 'movie',
          title: 'A',
          status: 'watched',
          favorite: false,
          lists: [],
          tags: [],
          notes: '',
        },
        {
          id: 2,
          rating: 0,
          addedAt: '2023-01-05T00:00:00Z',
          watchDates: [],
          mediaType: 'movie',
          title: 'B',
          status: 'watched',
          favorite: false,
          lists: [],
          tags: [],
          notes: '',
        },
      ]

      const seeds = selectSeeds(entries)

      expect(seeds[0].id).toBe(1) // Watch date 10th > Added date 5th
    })

    it('returns all entries if there are fewer than 5', () => {
      const entries: LibraryEntry[] = [
        {
          id: 1,
          rating: 5,
          addedAt: '2023-01-01T00:00:00Z',
          mediaType: 'movie',
          title: 'A',
          status: 'watched',
          favorite: false,
          lists: [],
          tags: [],
          notes: '',
          watchDates: [],
        },
      ]

      const seeds = selectSeeds(entries)

      expect(seeds).toHaveLength(1)
    })
  })

  describe('deduplicateRecommendations', () => {
    it('deduplicates across sections and filters out library entries', () => {
      const libraryIds = new Set([100, 101])
      const section1: SearchResult[] = [
        { id: 100, media_type: 'movie', title: 'In Library' } as SearchResult,
        { id: 200, media_type: 'movie', title: 'New Movie' } as SearchResult,
        { id: 300, media_type: 'movie', title: 'Duplicate' } as SearchResult,
      ]
      const section2: SearchResult[] = [
        { id: 300, media_type: 'movie', title: 'Duplicate' } as SearchResult,
        { id: 400, media_type: 'movie', title: 'Another New Movie' } as SearchResult,
      ]

      const results = deduplicateRecommendations([section1, section2], libraryIds)

      expect(results[0]).toHaveLength(2)
      expect(results[0].map((r) => r.id)).toEqual([200, 300])
      expect(results[1]).toHaveLength(1)
      expect(results[1].map((r) => r.id)).toEqual([400])
    })
  })
})
