import { describe, it, expect } from 'vitest'
import {
  filterResults,
  matchesLibraryFilters,
  toLibraryViewItem,
  getLibraryComparator,
  countActiveFilters,
  matchesFilters,
} from '@/domain/filter.logic'
import { FilterState, DEFAULT_LIBRARY_FILTER_STATE } from '@/domain/filter.schema'
import { SearchResultItem } from '@/domain/search.schema'
import { LibraryEntry } from '@/domain/library.schema'

describe('filter.logic', () => {
  const mockMovie: SearchResultItem = {
    id: 1,
    title: 'Movie 1',
    original_title: 'Movie 1',
    overview: 'Overview 1',
    release_date: '2020-01-01',
    poster_path: '/path1.jpg',
    backdrop_path: '/back1.jpg',
    vote_average: 8.0,
    vote_count: 100,
    popularity: 10.0,
    genre_ids: [28, 12], // Action, Adventure
    adult: false,
    original_language: 'en',
    video: false,
    media_type: 'movie',
  }

  const mockShow: SearchResultItem = {
    id: 2,
    name: 'Show 1',
    original_name: 'Show 1',
    overview: 'Overview 2',
    first_air_date: '2022-01-01',
    poster_path: '/path2.jpg',
    backdrop_path: '/back2.jpg',
    vote_average: 7.0,
    vote_count: 50,
    popularity: 5.0,
    genre_ids: [35], // Comedy
    adult: false,
    original_language: 'en',
    origin_country: ['US'],
    media_type: 'tv',
  }

  const items = [mockMovie, mockShow]

  it('should match all items with default filters', () => {
    const filters: FilterState = {
      genres: [],
      mediaType: 'all',
      yearFrom: null,
      yearTo: null,
    }
    expect(filterResults(items, filters)).toHaveLength(2)
  })

  it('should filter by media type', () => {
    const movieFilters: FilterState = {
      genres: [],
      mediaType: 'movie',
      yearFrom: null,
      yearTo: null,
    }
    expect(filterResults(items, movieFilters)).toHaveLength(1)
    expect(filterResults(items, movieFilters)[0].id).toBe(1)

    const tvFilters: FilterState = {
      genres: [],
      mediaType: 'tv',
      yearFrom: null,
      yearTo: null,
    }
    expect(filterResults(items, tvFilters)).toHaveLength(1)
    expect(filterResults(items, tvFilters)[0].id).toBe(2)
  })

  it('should filter by genre', () => {
    const actionFilters: FilterState = {
      genres: [28],
      mediaType: 'all',
      yearFrom: null,
      yearTo: null,
    }
    expect(filterResults(items, actionFilters)).toHaveLength(1)
    expect(filterResults(items, actionFilters)[0].id).toBe(1)

    const comedyFilters: FilterState = {
      genres: [35],
      mediaType: 'all',
      yearFrom: null,
      yearTo: null,
    }
    expect(filterResults(items, comedyFilters)).toHaveLength(1)
    expect(filterResults(items, comedyFilters)[0].id).toBe(2)

    const bothGenresFilters: FilterState = {
      genres: [28, 12],
      mediaType: 'all',
      yearFrom: null,
      yearTo: null,
    }
    expect(filterResults(items, bothGenresFilters)).toHaveLength(1)

    const nonExistentGenreFilters: FilterState = {
      genres: [99],
      mediaType: 'all',
      yearFrom: null,
      yearTo: null,
    }
    expect(filterResults(items, nonExistentGenreFilters)).toHaveLength(0)
  })

  it('should filter by year range', () => {
    const yearFromFilters: FilterState = {
      genres: [],
      mediaType: 'all',
      yearFrom: 2021,
      yearTo: null,
    }
    expect(filterResults(items, yearFromFilters)).toHaveLength(1)
    expect(filterResults(items, yearFromFilters)[0].id).toBe(2)

    const yearToFilters: FilterState = {
      genres: [],
      mediaType: 'all',
      yearFrom: null,
      yearTo: 2021,
    }
    expect(filterResults(items, yearToFilters)).toHaveLength(1)
    expect(filterResults(items, yearToFilters)[0].id).toBe(1)

    const rangeFilters: FilterState = {
      genres: [],
      mediaType: 'all',
      yearFrom: 2020,
      yearTo: 2022,
    }
    expect(filterResults(items, rangeFilters)).toHaveLength(2)
  })

  it('should combine multiple filters (AND logic)', () => {
    const combinedFilters: FilterState = {
      genres: [28],
      mediaType: 'tv',
      yearFrom: null,
      yearTo: null,
    }
    expect(filterResults(items, combinedFilters)).toHaveLength(0)

    const correctCombinedFilters: FilterState = {
      genres: [28],
      mediaType: 'movie',
      yearFrom: 2019,
      yearTo: 2021,
    }
    expect(filterResults(items, correctCombinedFilters)).toHaveLength(1)
    expect(filterResults(items, correctCombinedFilters)[0].id).toBe(1)
  })

  it('should exclude person results and items without release dates when year filters are active', () => {
    const person = {
      id: 3,
      name: 'Person',
      media_type: 'person',
    } as SearchResultItem
    const movieWithoutDate = {
      ...mockMovie,
      id: 4,
      release_date: '',
    }
    const filters: FilterState = {
      genres: [],
      mediaType: 'all',
      yearFrom: 2020,
      yearTo: null,
    }

    expect(matchesFilters(person, filters)).toBe(false)
    expect(matchesFilters(movieWithoutDate, filters)).toBe(false)
  })

  it('should treat missing genre arrays and missing year-filtered dates as non-matches', () => {
    const noGenresShow = {
      ...mockShow,
      genre_ids: undefined,
    }
    const noDateShow = {
      ...mockShow,
      first_air_date: '',
    }

    expect(
      matchesFilters(noGenresShow, {
        genres: [35],
        mediaType: 'all',
        yearFrom: null,
        yearTo: null,
      }),
    ).toBe(false)

    expect(
      matchesFilters(noDateShow, {
        genres: [],
        mediaType: 'all',
        yearFrom: null,
        yearTo: 2021,
      }),
    ).toBe(false)

    const itemWithoutGenreIds = { ...mockMovie } as Partial<typeof mockMovie>
    delete itemWithoutGenreIds.genre_ids
    expect(
      matchesFilters(itemWithoutGenreIds as SearchResultItem, {
        genres: [28],
        mediaType: 'all',
        yearFrom: null,
        yearTo: null,
      }),
    ).toBe(false)

    expect(
      matchesFilters(noDateShow as SearchResultItem, {
        genres: [],
        mediaType: 'all',
        yearFrom: null,
        yearTo: null,
      }),
    ).toBe(true)
  })

  describe('library filter logic', () => {
    const mockEntry: LibraryEntry = {
      id: 1,
      mediaType: 'movie',
      title: 'Action Movie',
      posterPath: '/path.jpg',
      rating: 4,
      favorite: false,
      status: 'watchlist',
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: '2024-01-01T00:00:00Z',
      releaseDate: '2020-01-01',
      genreIds: [28],
    }

    const item = toLibraryViewItem(mockEntry)

    it('matches default filters', () => {
      expect(matchesLibraryFilters(item, DEFAULT_LIBRARY_FILTER_STATE)).toBe(true)
    })

    it('filters by media type', () => {
      expect(
        matchesLibraryFilters(item, { ...DEFAULT_LIBRARY_FILTER_STATE, mediaType: 'movie' }),
      ).toBe(true)
      expect(
        matchesLibraryFilters(item, { ...DEFAULT_LIBRARY_FILTER_STATE, mediaType: 'tv' }),
      ).toBe(false)
    })

    it('filters by genre (AND logic)', () => {
      expect(matchesLibraryFilters(item, { ...DEFAULT_LIBRARY_FILTER_STATE, genres: [28] })).toBe(
        true,
      )
      expect(matchesLibraryFilters(item, { ...DEFAULT_LIBRARY_FILTER_STATE, genres: [35] })).toBe(
        false,
      )
      expect(
        matchesLibraryFilters(item, { ...DEFAULT_LIBRARY_FILTER_STATE, genres: [28, 35] }),
      ).toBe(false)
    })

    it('filters by rating range', () => {
      expect(
        matchesLibraryFilters(item, {
          ...DEFAULT_LIBRARY_FILTER_STATE,
          ratingMin: 3,
          ratingMax: 5,
        }),
      ).toBe(true)
      expect(
        matchesLibraryFilters(item, {
          ...DEFAULT_LIBRARY_FILTER_STATE,
          ratingMin: 4.5,
          ratingMax: 5,
        }),
      ).toBe(false)
      expect(
        matchesLibraryFilters(item, {
          ...DEFAULT_LIBRARY_FILTER_STATE,
          ratingMin: 0,
          ratingMax: 3.5,
        }),
      ).toBe(false)
    })

    it('counts active filters correctly', () => {
      expect(countActiveFilters(DEFAULT_LIBRARY_FILTER_STATE)).toBe(0)
      expect(countActiveFilters({ ...DEFAULT_LIBRARY_FILTER_STATE, genres: [28] })).toBe(1)
      expect(countActiveFilters({ ...DEFAULT_LIBRARY_FILTER_STATE, mediaType: 'movie' })).toBe(1)
      expect(countActiveFilters({ ...DEFAULT_LIBRARY_FILTER_STATE, ratingMin: 1 })).toBe(1)
      expect(countActiveFilters({ ...DEFAULT_LIBRARY_FILTER_STATE, ratingMax: 4 })).toBe(1)

      expect(
        countActiveFilters({
          ...DEFAULT_LIBRARY_FILTER_STATE,
          genres: [28],
          mediaType: 'movie',
        }),
      ).toBe(2)
    })

    describe('sorting', () => {
      const items = [
        toLibraryViewItem({
          ...mockEntry,
          id: 1,
          title: 'B',
          addedAt: '2024-01-01',
          releaseDate: '2020-01-01',
          rating: 5,
        }),
        toLibraryViewItem({
          ...mockEntry,
          id: 2,
          title: 'A',
          addedAt: '2024-01-02',
          releaseDate: '2010-01-01',
          rating: 3,
        }),
        toLibraryViewItem({
          ...mockEntry,
          id: 3,
          title: 'C',
          addedAt: '2024-01-03',
          releaseDate: '2015-01-01',
          rating: 4,
        }),
      ]

      it('sorts by dateAdded', () => {
        const sortedDesc = [...items].sort(getLibraryComparator('dateAdded', 'desc'))
        expect(sortedDesc.map((i) => i.id)).toEqual([3, 2, 1])

        const sortedAsc = [...items].sort(getLibraryComparator('dateAdded', 'asc'))
        expect(sortedAsc.map((i) => i.id)).toEqual([1, 2, 3])
      })

      it('sorts by title', () => {
        const sortedAsc = [...items].sort(getLibraryComparator('title', 'asc'))
        expect(sortedAsc.map((i) => i.id)).toEqual([2, 1, 3])
      })

      it('sorts by releaseYear', () => {
        const sortedDesc = [...items].sort(getLibraryComparator('releaseYear', 'desc'))
        expect(sortedDesc.map((i) => i.id)).toEqual([1, 3, 2])
      })

      it('sorts missing release years as zero', () => {
        const comparator = getLibraryComparator('releaseYear', 'asc')
        expect(comparator({ ...items[0], releaseYear: undefined }, items[1])).toBeLessThan(0)
        expect(comparator(items[0], { ...items[1], releaseYear: undefined })).toBeGreaterThan(0)
      })

      it('sorts by userRating', () => {
        const sortedDesc = [...items].sort(getLibraryComparator('userRating', 'desc'))
        expect(sortedDesc.map((i) => i.id)).toEqual([1, 3, 2])
      })
    })
  })
})
