import { describe, it, expect } from 'vitest'
import { ShowDetailSchema, ShowListItemSchema } from '@/domain/show.schema'

describe('ShowListItemSchema', () => {
  it('parses minimal show item with missing optional fields', () => {
    // Arrange
    const minimalShow = {
      id: 1396,
      name: 'Breaking Bad',
      poster_path: null,
      backdrop_path: null,
    }

    // Act
    const result = ShowListItemSchema.parse(minimalShow)

    // Assert
    expect(result.id).toBe(1396)
    expect(result.name).toBe('Breaking Bad')
    expect(result.first_air_date).toBe('')
    expect(result.vote_count).toBe(0)
    expect(result.origin_country).toEqual([])
  })
})

describe('ShowDetailSchema', () => {
  it('parses a valid TV show detail response with all appended relations', () => {
    // Arrange
    const showDetail = {
      id: 1396,
      name: 'Breaking Bad',
      original_name: 'Breaking Bad',
      overview: 'A chemistry teacher diagnosed with inoperable lung cancer.',
      tagline: 'All Hail the King',
      first_air_date: '2008-01-20',
      last_air_date: '2013-09-29',
      number_of_seasons: 5,
      number_of_episodes: 62,
      episode_run_time: [45, 47],
      poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
      vote_average: 8.9,
      vote_count: 12000,
      popularity: 400.5,
      status: 'Ended',
      homepage: 'https://www.amc.com/shows/breaking-bad',
      adult: false,
      original_language: 'en',
      in_production: false,
      type: 'Scripted',
      genres: [
        { id: 18, name: 'Drama' },
        { id: 80, name: 'Crime' },
      ],
      spoken_languages: [
        { iso_639_1: 'en', name: 'English', english_name: 'English' },
        { iso_639_1: 'es', name: 'Español', english_name: 'Spanish' },
      ],
      production_companies: [
        {
          id: 11073,
          name: 'Sony Pictures Television',
          logo_path: '/sony.png',
          origin_country: 'US',
        },
      ],
      production_countries: [{ iso_3166_1: 'US', name: 'United States of America' }],
      origin_country: ['US'],
      networks: [{ id: 174, name: 'AMC', logo_path: '/amc.png', origin_country: 'US' }],
      created_by: [
        { id: 66633, name: 'Vince Gilligan', profile_path: '/vince.jpg', credit_id: 'abc123' },
      ],
      next_episode_to_air: null,
      credits: {
        cast: [
          {
            id: 17419,
            name: 'Bryan Cranston',
            character: 'Walter White',
            profile_path: '/bryan.jpg',
            order: 0,
          },
          {
            id: 84497,
            name: 'Aaron Paul',
            character: 'Jesse Pinkman',
            profile_path: '/aaron.jpg',
            order: 1,
          },
        ],
        crew: [
          {
            id: 66633,
            name: 'Vince Gilligan',
            job: 'Creator',
            department: 'Production',
            profile_path: '/vince.jpg',
          },
        ],
      },
      videos: {
        results: [
          {
            id: 'video123',
            key: 'HhesaQXLuRY',
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
            link: 'https://www.themoviedb.org/tv/1396/watch?locale=US',
            flatrate: [{ provider_id: 8, provider_name: 'Netflix', logo_path: '/netflix.png' }],
          },
        },
      },
      content_ratings: {
        results: [
          { iso_3166_1: 'US', rating: 'TV-MA' },
          { iso_3166_1: 'GB', rating: '18' },
        ],
      },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0903747',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }

    // Act
    const result = ShowDetailSchema.parse(showDetail)

    // Assert
    expect(result.id).toBe(1396)
    expect(result.name).toBe('Breaking Bad')
    expect(result.tagline).toBe('All Hail the King')
    expect(result.number_of_seasons).toBe(5)
    expect(result.number_of_episodes).toBe(62)
    expect(result.episode_run_time).toEqual([45, 47])
    expect(result.genres).toHaveLength(2)
    expect(result.created_by).toHaveLength(1)
    expect(result.networks).toHaveLength(1)
    expect(result.credits.cast).toHaveLength(2)
    expect(result.videos.results).toHaveLength(1)
    expect(result.content_ratings.results).toHaveLength(2)
  })

  it('handles TV-specific fields correctly', () => {
    // Arrange
    const showDetail = {
      id: 1396,
      name: 'Breaking Bad',
      original_name: 'Breaking Bad',
      overview: 'A show.',
      tagline: null,
      first_air_date: '2008-01-20',
      last_air_date: '2013-09-29',
      number_of_seasons: 5,
      number_of_episodes: 62,
      episode_run_time: [45],
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.9,
      vote_count: 12000,
      popularity: 400.5,
      status: 'Ended',
      homepage: null,
      adult: false,
      original_language: 'en',
      in_production: false,
      type: 'Scripted',
      genres: [],
      spoken_languages: [],
      production_companies: [],
      production_countries: [],
      origin_country: ['US'],
      networks: [],
      created_by: [
        { id: 66633, name: 'Vince Gilligan', profile_path: '/vince.jpg', credit_id: 'abc' },
      ],
      next_episode_to_air: null,
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      content_ratings: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0903747',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }

    // Act
    const result = ShowDetailSchema.parse(showDetail)

    // Assert
    expect(result.number_of_seasons).toBe(5)
    expect(result.number_of_episodes).toBe(62)
    expect(result.episode_run_time).toEqual([45])
    expect(result.created_by[0].name).toBe('Vince Gilligan')
    expect(result.in_production).toBe(false)
    expect(result.type).toBe('Scripted')
  })

  it('parses next_episode_to_air when present', () => {
    // Arrange
    const showDetail = {
      id: 1399,
      name: 'Game of Thrones',
      original_name: 'Game of Thrones',
      overview: 'A show.',
      tagline: null,
      first_air_date: '2011-04-17',
      last_air_date: null,
      number_of_seasons: 8,
      number_of_episodes: 73,
      episode_run_time: [60],
      poster_path: '/poster.jpg',
      backdrop_path: '/backdrop.jpg',
      vote_average: 8.4,
      vote_count: 20000,
      popularity: 500.0,
      status: 'Returning Series',
      homepage: null,
      adult: false,
      original_language: 'en',
      in_production: true,
      type: 'Scripted',
      genres: [],
      spoken_languages: [],
      production_companies: [],
      production_countries: [],
      origin_country: ['US'],
      networks: [],
      created_by: [],
      next_episode_to_air: {
        id: 123456,
        name: 'The Final Episode',
        overview: 'The conclusion.',
        air_date: '2024-05-01',
        episode_number: 1,
        season_number: 9,
        still_path: '/still.jpg',
        vote_average: 0,
        vote_count: 0,
        runtime: 80,
      },
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      content_ratings: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: 'tt0944947',
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }

    // Act
    const result = ShowDetailSchema.parse(showDetail)

    // Assert
    expect(result.next_episode_to_air).not.toBeNull()
    expect(result.next_episode_to_air?.name).toBe('The Final Episode')
    expect(result.next_episode_to_air?.episode_number).toBe(1)
    expect(result.next_episode_to_air?.season_number).toBe(9)
    expect(result.next_episode_to_air?.runtime).toBe(80)
  })

  it('handles null values for optional fields', () => {
    // Arrange
    const showDetail = {
      id: 1396,
      name: 'Breaking Bad',
      original_name: 'Breaking Bad',
      overview: 'A show.',
      tagline: null,
      first_air_date: '2008-01-20',
      last_air_date: null,
      number_of_seasons: 5,
      number_of_episodes: 62,
      episode_run_time: [],
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.9,
      vote_count: 12000,
      popularity: 400.5,
      status: 'Ended',
      homepage: null,
      adult: false,
      original_language: 'en',
      in_production: false,
      type: 'Scripted',
      genres: [],
      spoken_languages: [],
      production_companies: [],
      production_countries: [],
      origin_country: [],
      networks: [],
      created_by: [],
      next_episode_to_air: null,
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      content_ratings: { results: [] },
      images: { backdrops: [], posters: [] },
      external_ids: {
        imdb_id: null,
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }

    // Act
    const result = ShowDetailSchema.parse(showDetail)

    // Assert
    expect(result.tagline).toBeNull()
    expect(result.last_air_date).toBeNull()
    expect(result.poster_path).toBeNull()
    expect(result.backdrop_path).toBeNull()
    expect(result.homepage).toBeNull()
    expect(result.next_episode_to_air).toBeNull()
  })
})
