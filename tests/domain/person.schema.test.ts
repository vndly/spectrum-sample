import { describe, expect, it } from 'vitest'
import { PersonCreditSchema, PersonDetailWithCreditsSchema } from '@/domain/person.schema'

describe('PersonDetailWithCreditsSchema', () => {
  it('parses a valid person detail response with credits and external IDs', () => {
    // Arrange
    const personDetail = {
      id: 287,
      name: 'Brad Pitt',
      biography: 'An actor and producer.',
      birthday: '1963-12-18',
      deathday: null,
      place_of_birth: 'Shawnee, Oklahoma, USA',
      profile_path: '/profile.jpg',
      known_for_department: 'Acting',
      also_known_as: ['William Bradley Pitt'],
      homepage: null,
      combined_credits: {
        cast: [
          {
            id: 550,
            media_type: 'movie',
            title: 'Fight Club',
            character: 'Tyler Durden',
            release_date: '1999-10-15',
            poster_path: '/fight-club.jpg',
            order: 1,
          },
          {
            id: 1396,
            media_type: 'tv',
            name: 'Breaking Bad',
            character: 'Guest',
            first_air_date: '2008-01-20',
            poster_path: '/breaking-bad.jpg',
            order: 3,
          },
        ],
        crew: [{ id: 1, job: 'Producer' }],
      },
      external_ids: {
        imdb_id: 'nm0000093',
        instagram_id: 'bradpitt',
        twitter_id: 'bradpitt',
      },
    }

    // Act
    const result = PersonDetailWithCreditsSchema.parse(personDetail)

    // Assert
    expect(result.id).toBe(287)
    expect(result.name).toBe('Brad Pitt')
    expect(result.known_for_department).toBe('Acting')
    expect(result.biography).toBe('An actor and producer.')
    expect(result.birthday).toBe('1963-12-18')
    expect(result.deathday).toBeNull()
    expect(result.place_of_birth).toBe('Shawnee, Oklahoma, USA')
    expect(result.profile_path).toBe('/profile.jpg')
    expect(result.combined_credits.cast).toHaveLength(2)
    expect(result.external_ids.imdb_id).toBe('nm0000093')
  })

  it('parses movie and TV cast-credit variants without crew dependency', () => {
    // Arrange
    const movieCredit = {
      id: 550,
      media_type: 'movie',
      title: 'Fight Club',
      character: 'Tyler Durden',
      release_date: '1999-10-15',
      poster_path: '/poster.jpg',
      order: 1,
    }
    const tvCredit = {
      id: 1396,
      media_type: 'tv',
      name: 'Breaking Bad',
      character: 'Guest',
      first_air_date: '2008-01-20',
      poster_path: '/poster.jpg',
      order: 2,
    }

    // Act
    const parsedMovie = PersonCreditSchema.parse(movieCredit)
    const parsedTv = PersonCreditSchema.parse(tvCredit)

    // Assert
    expect(parsedMovie.media_type).toBe('movie')
    expect(parsedMovie).toMatchObject({ title: 'Fight Club' })
    expect(parsedTv.media_type).toBe('tv')
    expect(parsedTv).toMatchObject({ name: 'Breaking Bad' })
  })

  it('parses null profile, null external IDs, null dates, and empty credits', () => {
    // Arrange
    const personDetail = {
      id: 1,
      name: 'Unknown Actor',
      biography: '',
      birthday: null,
      deathday: null,
      place_of_birth: null,
      profile_path: null,
      known_for_department: 'Acting',
      also_known_as: [],
      homepage: null,
      combined_credits: {
        cast: [],
      },
      external_ids: {
        imdb_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }

    // Act
    const result = PersonDetailWithCreditsSchema.parse(personDetail)

    // Assert
    expect(result.profile_path).toBeNull()
    expect(result.birthday).toBeNull()
    expect(result.deathday).toBeNull()
    expect(result.place_of_birth).toBeNull()
    expect(result.combined_credits.cast).toEqual([])
    expect(result.external_ids.instagram_id).toBeNull()
  })

  it('rejects invalid API response data', () => {
    // Arrange
    const invalidPersonDetail = {
      id: 'not-a-number',
      name: 'Invalid',
      biography: '',
      birthday: null,
      deathday: null,
      place_of_birth: null,
      profile_path: null,
      known_for_department: 'Acting',
      also_known_as: [],
      homepage: null,
      combined_credits: { cast: [] },
      external_ids: { imdb_id: null, instagram_id: null, twitter_id: null },
    }

    // Act & Assert
    expect(() => PersonDetailWithCreditsSchema.parse(invalidPersonDetail)).toThrow()
  })
})
