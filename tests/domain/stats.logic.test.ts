import { describe, it, expect } from 'vitest'
import {
  calculateKeyMetrics,
  calculateGenreDistribution,
  calculateMonthlyActivity,
  getTopRatedItems,
  formatWatchTime,
} from '@/domain/stats.logic'
import type { LibraryEntry } from '@/domain/library.schema'

const MOCK_ENTRIES: LibraryEntry[] = [
  {
    id: 1,
    mediaType: 'movie',
    title: 'Movie A',
    status: 'watched',
    rating: 5,
    runtime: 120,
    genreIds: [28, 12],
    watchDates: ['2026-01-15', '2026-02-20'],
    addedAt: '2026-01-01',
    favorite: false,
    tags: [],
    notes: '',
    posterPath: null,
  },
  {
    id: 2,
    mediaType: 'movie',
    title: 'Movie B',
    status: 'watched',
    rating: 3,
    runtime: 90,
    genreIds: [28],
    watchDates: ['2026-03-10'],
    addedAt: '2026-01-01',
    favorite: false,
    tags: [],
    notes: '',
    posterPath: null,
  },
  {
    id: 3,
    mediaType: 'movie',
    title: 'Movie C',
    status: 'watchlist',
    rating: 0,
    runtime: 100,
    genreIds: [12],
    watchDates: [],
    addedAt: '2026-01-01',
    favorite: false,
    tags: [],
    notes: '',
    posterPath: null,
  },
  {
    id: 4,
    mediaType: 'tv',
    title: 'Show D',
    status: 'watched',
    rating: 4,
    runtime: 45,
    genreIds: [18],
    watchDates: ['2026-01-05'],
    addedAt: '2026-01-01',
    favorite: false,
    tags: [],
    notes: '',
    posterPath: null,
  },
]

describe('stats.logic', () => {
  describe('calculateKeyMetrics', () => {
    it('calculates metrics correctly for a set of entries', () => {
      const metrics = calculateKeyMetrics(MOCK_ENTRIES)
      expect(metrics.totalWatched).toBe(3)
      expect(metrics.totalWatchlist).toBe(1)
      expect(metrics.averageRating).toBe(4) // (5 + 3 + 4) / 3
      expect(metrics.totalWatchTimeMinutes).toBe(255) // 120 + 90 + 45
    })

    it('returns zeroes for empty entries', () => {
      const metrics = calculateKeyMetrics([])
      expect(metrics.totalWatched).toBe(0)
      expect(metrics.totalWatchlist).toBe(0)
      expect(metrics.averageRating).toBe(0)
      expect(metrics.totalWatchTimeMinutes).toBe(0)
    })

    it('treats missing runtimes as zero watch time', () => {
      const metrics = calculateKeyMetrics([
        {
          ...MOCK_ENTRIES[0],
          runtime: undefined,
        },
      ])

      expect(metrics.totalWatchTimeMinutes).toBe(0)
    })
  })

  describe('calculateGenreDistribution', () => {
    it('calculates counts per genre correctly', () => {
      const dist = calculateGenreDistribution(MOCK_ENTRIES)
      expect(dist[28]).toBe(2) // Movie A, Movie B
      expect(dist[12]).toBe(1) // Movie A (Movie C is watchlist)
      expect(dist[18]).toBe(1) // Show D
    })
  })

  describe('calculateMonthlyActivity', () => {
    it('calculates counts per month for the given year', () => {
      const activity = calculateMonthlyActivity(MOCK_ENTRIES, 2026)
      expect(activity[0]).toBe(2) // Jan 15 (Movie A), Jan 5 (Show D)
      expect(activity[1]).toBe(1) // Feb 20 (Movie A)
      expect(activity[2]).toBe(1) // Mar 10 (Movie B)
      expect(activity[3]).toBe(0)
    })

    it('ignores watch dates outside the requested year', () => {
      const activity = calculateMonthlyActivity(
        [
          ...MOCK_ENTRIES,
          {
            ...MOCK_ENTRIES[0],
            id: 5,
            watchDates: ['2025-12-31'],
          },
        ],
        2026,
      )

      expect(activity[11]).toBe(0)
    })
  })

  describe('getTopRatedItems', () => {
    it('returns items sorted by rating desc then title asc', () => {
      const top = getTopRatedItems(MOCK_ENTRIES)
      expect(top[0].id).toBe(1) // Rating 5
      expect(top[1].id).toBe(4) // Rating 4
      expect(top[2].id).toBe(2) // Rating 3
      expect(top.length).toBe(3) // Only watched items with rating > 0
    })

    it('limits the results', () => {
      const top = getTopRatedItems(MOCK_ENTRIES, 2)
      expect(top.length).toBe(2)
    })

    it('breaks rating ties by title', () => {
      const top = getTopRatedItems([
        ...MOCK_ENTRIES,
        {
          id: 5,
          mediaType: 'movie',
          title: 'Alpha',
          status: 'watched',
          rating: 5,
          runtime: 110,
          genreIds: [],
          watchDates: ['2026-04-01'],
          addedAt: '2026-01-01',
          favorite: false,
          tags: [],
          notes: '',
          posterPath: null,
        },
      ])

      expect(top[0].title).toBe('Alpha')
      expect(top[1].title).toBe('Movie A')
    })
  })

  describe('formatWatchTime', () => {
    it('formats zero minutes', () => {
      expect(formatWatchTime(0)).toBe('0m')
    })

    it('formats days, hours, and minutes', () => {
      expect(formatWatchTime(24 * 60 + 90)).toBe('1d 1h 30m')
    })

    it('omits zero-minute suffixes when days or hours are present', () => {
      expect(formatWatchTime(24 * 60)).toBe('1d')
      expect(formatWatchTime(120)).toBe('2h')
    })
  })
})
