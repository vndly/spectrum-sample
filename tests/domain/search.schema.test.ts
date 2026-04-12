/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { SearchResultItemSchema, SearchResponseSchema } from '@/domain/search.schema'

describe('SearchResultItemSchema', () => {
  it('parses a valid movie result', () => {
    // Arrange
    const movieResult = {
      id: 550,
      title: 'Fight Club',
      original_title: 'Fight Club',
      overview: 'A ticking-Loss time bomb of a movie.',
      release_date: '1999-10-15',
      poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
      vote_average: 8.433,
      vote_count: 27000,
      popularity: 73.433,
      genre_ids: [18, 53, 35],
      adult: false,
      original_language: 'en',
      video: false,
      media_type: 'movie',
    }

    // Act
    const result = SearchResultItemSchema.parse(movieResult)

    // Assert
    expect(result.media_type).toBe('movie')
    expect(result.id).toBe(550)
    if (result.media_type === 'movie') {
      expect((result as any).title).toBe('Fight Club')
      expect((result as any).release_date).toBe('1999-10-15')
    }
  })

  it('parses a valid TV show result', () => {
    // Arrange
    const tvResult = {
      id: 1396,
      name: 'Breaking Bad',
      original_name: 'Breaking Bad',
      overview: 'A chemistry teacher diagnosed with cancer.',
      first_air_date: '2008-01-20',
      poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
      vote_average: 8.9,
      vote_count: 12000,
      popularity: 400.5,
      genre_ids: [18, 80],
      adult: false,
      original_language: 'en',
      origin_country: ['US'],
      media_type: 'tv',
    }

    // Act
    const result = SearchResultItemSchema.parse(tvResult)

    // Assert
    expect(result.media_type).toBe('tv')
    expect(result.id).toBe(1396)
    if (result.media_type === 'tv') {
      expect((result as any).name).toBe('Breaking Bad')
      expect((result as any).first_air_date).toBe('2008-01-20')
    }
  })

  it('parses a valid person result', () => {
    // Arrange
    const personResult = {
      id: 287,
      name: 'Brad Pitt',
      media_type: 'person',
    }

    // Act
    const result = SearchResultItemSchema.parse(personResult)

    // Assert
    expect(result.media_type).toBe('person')
    expect(result.id).toBe(287)
    if (result.media_type === 'person') {
      expect((result as any).name).toBe('Brad Pitt')
    }
  })

  it('parses result with unknown media_type using fallback', () => {
    // Arrange
    const unknownResult = {
      id: 123,
      media_type: 'unknown_type',
    }

    // Act
    const result = SearchResultItemSchema.parse(unknownResult)

    // Assert
    expect(result.id).toBe(123)
    expect(result.media_type).toBe('unknown_type')
  })
})

describe('SearchResponseSchema', () => {
  it('parses a paginated response with mixed results', () => {
    // Arrange
    const response = {
      page: 1,
      results: [
        {
          id: 550,
          title: 'Fight Club',
          original_title: 'Fight Club',
          overview: 'A movie about fighting.',
          release_date: '1999-10-15',
          poster_path: '/path.jpg',
          backdrop_path: '/backdrop.jpg',
          vote_average: 8.4,
          vote_count: 27000,
          popularity: 73.4,
          genre_ids: [18],
          adult: false,
          original_language: 'en',
          video: false,
          media_type: 'movie',
        },
        {
          id: 1396,
          name: 'Breaking Bad',
          original_name: 'Breaking Bad',
          overview: 'A show about chemistry.',
          first_air_date: '2008-01-20',
          poster_path: '/path2.jpg',
          backdrop_path: '/backdrop2.jpg',
          vote_average: 8.9,
          vote_count: 12000,
          popularity: 400.5,
          genre_ids: [18],
          adult: false,
          original_language: 'en',
          origin_country: ['US'],
          media_type: 'tv',
        },
        {
          id: 287,
          name: 'Brad Pitt',
          media_type: 'person',
        },
      ],
      total_pages: 5,
      total_results: 100,
    }

    // Act
    const result = SearchResponseSchema.parse(response)

    // Assert
    expect(result.page).toBe(1)
    expect(result.results).toHaveLength(3)
    expect(result.total_pages).toBe(5)
    expect(result.total_results).toBe(100)
  })

  it('parses an empty results array', () => {
    // Arrange
    const response = {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    }

    // Act
    const result = SearchResponseSchema.parse(response)

    // Assert
    expect(result.results).toHaveLength(0)
  })

  it('rejects response missing required fields', () => {
    // Arrange
    const invalidResponse = {
      page: 1,
      results: [],
      // missing total_pages and total_results
    }

    // Act & Assert
    expect(() => SearchResponseSchema.parse(invalidResponse)).toThrow()
  })
})
