/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { selectSeeds, deduplicateRecommendations } from '@/domain/recommendations.logic'
import type { LibraryEntry } from '@/domain/library.schema'
import type { SearchResultItem } from '@/domain/search.schema'

describe('Recommendations Logic', () => {
  describe('selectSeeds', () => {
    it('selects up to 5 seeds prioritized by rating then recency', () => {
      const entries: any[] = [
        {
          id: 1,
          rating: 5,
          addedAt: '2023-01-01T00:00:00Z',
          mediaType: 'movie',
          title: 'A',
          status: 'watched',
          favorite: false,
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
          tags: [],
          notes: '',
          watchDates: [],
        },
      ]

      const result = selectSeeds(entries as LibraryEntry[])
      expect(result).toHaveLength(5)
      expect(result.map((e) => e.id)).toEqual([2, 1, 3, 6, 5])
    })

    it('uses latest watch date for recency if available', () => {
      const entries: any[] = [
        {
          id: 1,
          rating: 0,
          addedAt: '2023-01-01T00:00:00Z',
          watchDates: ['2023-01-10T00:00:00Z'],
          mediaType: 'movie',
          title: 'A',
          status: 'watched',
          favorite: false,
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
          tags: [],
          notes: '',
        },
      ]

      const result = selectSeeds(entries as LibraryEntry[])
      expect(result[0].id).toBe(1)
    })

    it('falls back to addedAt when watchDates is missing', () => {
      const entries: any[] = [
        {
          id: 1,
          rating: 0,
          addedAt: '2023-01-01T00:00:00Z',
          mediaType: 'movie',
          title: 'A',
          status: 'watched',
          favorite: false,
          tags: [],
          notes: '',
        },
        {
          id: 2,
          rating: 0,
          addedAt: '2023-01-02T00:00:00Z',
          mediaType: 'movie',
          title: 'B',
          status: 'watched',
          favorite: false,
          tags: [],
          notes: '',
        },
      ]

      expect(selectSeeds(entries as LibraryEntry[]).map((entry) => entry.id)).toEqual([2, 1])
    })

    it('returns all entries if there are fewer than 5', () => {
      const entries: any[] = [
        {
          id: 1,
          rating: 5,
          addedAt: '2023-01-01T00:00:00Z',
          mediaType: 'movie',
          title: 'A',
          status: 'watched',
          favorite: false,
          tags: [],
          notes: '',
          watchDates: [],
        },
      ]

      const result = selectSeeds(entries as LibraryEntry[])
      expect(result).toHaveLength(1)
    })
  })

  describe('deduplicateRecommendations', () => {
    it('removes duplicates across sections and library', () => {
      const sections: SearchResultItem[][] = [
        [
          { id: 1, media_type: 'movie', title: 'M1' } as any,
          { id: 2, media_type: 'movie', title: 'M2' } as any,
        ],
        [
          { id: 2, media_type: 'movie', title: 'M2' } as any,
          { id: 3, media_type: 'movie', title: 'M3' } as any,
        ],
      ]
      const libraryIds = new Set([1])

      const result = deduplicateRecommendations(sections, libraryIds)

      expect(result[0]).toHaveLength(1)
      expect(result[0][0].id).toBe(2)
      expect(result[1]).toHaveLength(1)
      expect(result[1][0].id).toBe(3)
    })

    it('limits each section to 20 items', () => {
      const largeSection: SearchResultItem[] = Array.from({ length: 30 }, (_, i) => ({
        id: i + 100,
        media_type: 'movie',
        title: `M${i}`,
      })) as any

      const result = deduplicateRecommendations([largeSection], new Set())
      expect(result[0]).toHaveLength(20)
    })
  })
})
