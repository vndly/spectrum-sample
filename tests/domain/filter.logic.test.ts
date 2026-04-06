import { describe, it, expect } from 'vitest'
import { filterResults } from '@/domain/filter.logic'
import { FilterState } from '@/domain/filter.schema'
import { SearchResultItem } from '@/domain/search.schema'

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
})
