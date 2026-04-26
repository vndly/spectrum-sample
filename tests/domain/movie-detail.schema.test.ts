import { describe, it, expect } from 'vitest'
import { MovieDetailSchema, MovieListItemSchema } from '@/domain/movie.schema'

describe('MovieListItemSchema', () => {
  it('parses minimal movie item with missing optional fields', () => {
    // Arrange
    const minimalMovie = {
      id: 550,
      title: 'Fight Club',
      poster_path: null,
      backdrop_path: null,
    }

    // Act
    const result = MovieListItemSchema.parse(minimalMovie)

    // Assert
    expect(result.id).toBe(550)
    expect(result.title).toBe('Fight Club')
    expect(result.overview).toBe('')
    expect(result.release_date).toBe('')
    expect(result.vote_average).toBe(0)
    expect(result.adult).toBe(false)
  })
})

describe('MovieDetailSchema', () => {
  it('parses a valid movie detail response with all appended relations', () => {
    // Arrange
    const movieDetail = {
      id: 550,
      title: 'Fight Club',
      original_title: 'Fight Club',
      overview: 'A ticking-Loss time bomb of a movie.',
      tagline: 'Mischief. Mayhem. Soap.',
      release_date: '1999-10-15',
      runtime: 139,
      poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
      vote_average: 8.433,
      vote_count: 27000,
      popularity: 73.433,
      imdb_id: 'tt0137523',
      budget: 63000000,
      revenue: 100853753,
      status: 'Released',
      homepage: 'https://www.foxmovies.com/movies/fight-club',
      adult: false,
      original_language: 'en',
      video: false,
      genres: [
        { id: 18, name: 'Drama' },
        { id: 53, name: 'Thriller' },
      ],
      spoken_languages: [{ iso_639_1: 'en', name: 'English', english_name: 'English' }],
      production_companies: [
        { id: 508, name: 'Regency Enterprises', logo_path: '/logo.png', origin_country: 'US' },
      ],
      production_countries: [{ iso_3166_1: 'US', name: 'United States of America' }],
      belongs_to_collection: null,
      credits: {
        cast: [
          {
            id: 819,
            name: 'Edward Norton',
            character: 'The Narrator',
            profile_path: '/profile.jpg',
            order: 0,
          },
          {
            id: 287,
            name: 'Brad Pitt',
            character: 'Tyler Durden',
            profile_path: '/profile2.jpg',
            order: 1,
          },
        ],
        crew: [
          {
            id: 7467,
            name: 'David Fincher',
            job: 'Director',
            department: 'Directing',
            profile_path: '/crew.jpg',
          },
          {
            id: 7468,
            name: 'Jim Uhls',
            job: 'Screenplay',
            department: 'Writing',
            profile_path: null,
          },
        ],
      },
      videos: {
        results: [
          {
            id: 'abc123',
            key: 'SUXWAEX2jlg',
            name: 'Official Trailer',
            site: 'YouTube',
            type: 'Trailer',
            official: true,
          },
        ],
      },
      'watch/providers': {
        results: {
          US: {
            link: 'https://www.themoviedb.org/movie/550-fight-club/watch?locale=US',
            flatrate: [{ provider_id: 8, provider_name: 'Netflix', logo_path: '/netflix.png' }],
            rent: [{ provider_id: 3, provider_name: 'Amazon', logo_path: '/amazon.png' }],
            buy: [{ provider_id: 2, provider_name: 'Apple TV', logo_path: '/apple.png' }],
          },
        },
      },
      release_dates: {
        results: [
          {
            iso_3166_1: 'US',
            release_dates: [
              {
                certification: 'R',
                iso_639_1: 'en',
                release_date: '1999-10-15T00:00:00.000Z',
                type: 3,
                note: '',
              },
            ],
          },
        ],
      },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0137523',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }

    // Act
    const result = MovieDetailSchema.parse(movieDetail)

    // Assert
    expect(result.id).toBe(550)
    expect(result.title).toBe('Fight Club')
    expect(result.tagline).toBe('Mischief. Mayhem. Soap.')
    expect(result.runtime).toBe(139)
    expect(result.imdb_id).toBe('tt0137523')
    expect(result.budget).toBe(63000000)
    expect(result.revenue).toBe(100853753)
    expect(result.genres).toHaveLength(2)
    expect(result.credits.cast).toHaveLength(2)
    expect(result.credits.crew).toHaveLength(2)
    expect(result.videos.results).toHaveLength(1)
    expect(result['watch/providers'].results.US.flatrate).toHaveLength(1)
  })

  it('handles null values for optional fields', () => {
    // Arrange
    const movieDetail = {
      id: 550,
      title: 'Fight Club',
      original_title: 'Fight Club',
      overview: 'A movie.',
      tagline: null,
      release_date: '1999-10-15',
      runtime: null,
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.4,
      vote_count: 27000,
      popularity: 73.4,
      imdb_id: null,
      budget: 0,
      revenue: 0,
      status: 'Released',
      homepage: null,
      adult: false,
      original_language: 'en',
      video: false,
      genres: [],
      spoken_languages: [],
      production_companies: [],
      production_countries: [],
      belongs_to_collection: null,
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      release_dates: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: null,
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }

    // Act
    const result = MovieDetailSchema.parse(movieDetail)

    // Assert
    expect(result.tagline).toBeNull()
    expect(result.backdrop_path).toBeNull()
    expect(result.imdb_id).toBeNull()
    expect(result.runtime).toBeNull()
    expect(result.homepage).toBeNull()
  })

  it('parses credits.cast and credits.crew arrays correctly', () => {
    // Arrange
    const movieDetail = {
      id: 550,
      title: 'Fight Club',
      original_title: 'Fight Club',
      overview: 'A movie.',
      tagline: null,
      release_date: '1999-10-15',
      runtime: 139,
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.4,
      vote_count: 27000,
      popularity: 73.4,
      imdb_id: 'tt0137523',
      budget: 63000000,
      revenue: 100853753,
      status: 'Released',
      homepage: null,
      adult: false,
      original_language: 'en',
      video: false,
      genres: [],
      spoken_languages: [],
      production_companies: [],
      production_countries: [],
      belongs_to_collection: null,
      credits: {
        cast: [
          { id: 1, name: 'Actor One', character: 'Character A', profile_path: '/a.jpg', order: 0 },
          { id: 2, name: 'Actor Two', character: 'Character B', profile_path: null, order: 1 },
        ],
        crew: [
          {
            id: 3,
            name: 'Director',
            job: 'Director',
            department: 'Directing',
            profile_path: '/d.jpg',
          },
          { id: 4, name: 'Writer', job: 'Writer', department: 'Writing', profile_path: null },
        ],
      },
      videos: { results: [] },
      'watch/providers': { results: {} },
      release_dates: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0137523',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }

    // Act
    const result = MovieDetailSchema.parse(movieDetail)

    // Assert
    expect(result.credits.cast).toHaveLength(2)
    expect(result.credits.cast[0].name).toBe('Actor One')
    expect(result.credits.cast[0].character).toBe('Character A')
    expect(result.credits.cast[1].profile_path).toBeNull()
    expect(result.credits.crew).toHaveLength(2)
    expect(result.credits.crew[0].job).toBe('Director')
    expect(result.credits.crew[1].department).toBe('Writing')
  })

  it('parses videos.results array correctly', () => {
    // Arrange
    const movieDetail = {
      id: 550,
      title: 'Fight Club',
      original_title: 'Fight Club',
      overview: 'A movie.',
      tagline: null,
      release_date: '1999-10-15',
      runtime: 139,
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.4,
      vote_count: 27000,
      popularity: 73.4,
      imdb_id: 'tt0137523',
      budget: 63000000,
      revenue: 100853753,
      status: 'Released',
      homepage: null,
      adult: false,
      original_language: 'en',
      video: false,
      genres: [],
      spoken_languages: [],
      production_companies: [],
      production_countries: [],
      belongs_to_collection: null,
      credits: { cast: [], crew: [] },
      videos: {
        results: [
          {
            id: 'v1',
            key: 'abc123',
            name: 'Trailer',
            site: 'YouTube',
            type: 'Trailer',
            official: true,
          },
          {
            id: 'v2',
            key: 'def456',
            name: 'Teaser',
            site: 'YouTube',
            type: 'Teaser',
            official: false,
          },
        ],
      },
      'watch/providers': { results: {} },
      release_dates: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0137523',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }

    // Act
    const result = MovieDetailSchema.parse(movieDetail)

    // Assert
    expect(result.videos.results).toHaveLength(2)
    expect(result.videos.results[0].key).toBe('abc123')
    expect(result.videos.results[0].type).toBe('Trailer')
    expect(result.videos.results[0].site).toBe('YouTube')
    expect(result.videos.results[1].official).toBe(false)
  })

  it('parses watch/providers.results with region-keyed provider data', () => {
    // Arrange
    const movieDetail = {
      id: 550,
      title: 'Fight Club',
      original_title: 'Fight Club',
      overview: 'A movie.',
      tagline: null,
      release_date: '1999-10-15',
      runtime: 139,
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.4,
      vote_count: 27000,
      popularity: 73.4,
      imdb_id: 'tt0137523',
      budget: 63000000,
      revenue: 100853753,
      status: 'Released',
      homepage: null,
      adult: false,
      original_language: 'en',
      video: false,
      genres: [],
      spoken_languages: [],
      production_companies: [],
      production_countries: [],
      belongs_to_collection: null,
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': {
        results: {
          US: {
            link: 'https://tmdb.org/watch/US',
            flatrate: [{ provider_id: 8, provider_name: 'Netflix', logo_path: '/netflix.png' }],
          },
          GB: {
            link: 'https://tmdb.org/watch/GB',
            rent: [{ provider_id: 3, provider_name: 'Amazon', logo_path: '/amazon.png' }],
            buy: [{ provider_id: 2, provider_name: 'Apple TV', logo_path: '/apple.png' }],
          },
        },
      },
      release_dates: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0137523',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }

    // Act
    const result = MovieDetailSchema.parse(movieDetail)

    // Assert
    expect(Object.keys(result['watch/providers'].results)).toContain('US')
    expect(Object.keys(result['watch/providers'].results)).toContain('GB')
    expect(result['watch/providers'].results.US.flatrate).toHaveLength(1)
    expect(result['watch/providers'].results.US.flatrate?.[0].provider_name).toBe('Netflix')
    expect(result['watch/providers'].results.GB.rent).toHaveLength(1)
    expect(result['watch/providers'].results.GB.buy).toHaveLength(1)
  })
})
