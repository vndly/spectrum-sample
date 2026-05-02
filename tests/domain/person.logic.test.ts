import { describe, expect, it } from 'vitest'
import {
  buildExternalUrl,
  deduplicateCredits,
  hasExternalLinks,
  normalizePersonDates,
  sortCreditsByDate,
} from '@/domain/person.logic'
import type { ExternalIds, PersonCredit } from '@/domain/person.schema'

describe('person logic', () => {
  describe('sortCreditsByDate', () => {
    it('sorts mixed movie and TV credits by date descending with null dates last', () => {
      // Arrange
      const credits: PersonCredit[] = [
        {
          id: 1,
          media_type: 'movie',
          title: 'Older Movie',
          character: 'A',
          release_date: '1999-10-15',
          poster_path: null,
          order: 1,
        },
        {
          id: 2,
          media_type: 'tv',
          name: 'Newest Show',
          character: 'B',
          first_air_date: '2024-02-01',
          poster_path: null,
          order: 1,
        },
        {
          id: 3,
          media_type: 'movie',
          title: 'No Date',
          character: 'C',
          release_date: null,
          poster_path: null,
          order: 1,
        },
        {
          id: 4,
          media_type: 'tv',
          name: 'Middle Show',
          character: 'D',
          first_air_date: '2010-01-01',
          poster_path: null,
          order: 1,
        },
      ]

      // Act
      const result = sortCreditsByDate(credits)

      // Assert
      expect(result.map((credit) => credit.id)).toEqual([2, 4, 1, 3])
      expect(credits.map((credit) => credit.id)).toEqual([1, 2, 3, 4])
    })
  })

  describe('deduplicateCredits', () => {
    it('uses media type and ID, keeping the lowest numeric order for duplicates', () => {
      // Arrange
      const credits: PersonCredit[] = [
        {
          id: 550,
          media_type: 'movie',
          title: 'Fight Club',
          character: 'Narrator',
          release_date: '1999-10-15',
          poster_path: null,
          order: 5,
        },
        {
          id: 550,
          media_type: 'movie',
          title: 'Fight Club',
          character: 'Tyler Durden',
          release_date: '1999-10-15',
          poster_path: null,
          order: 1,
        },
        {
          id: 550,
          media_type: 'tv',
          name: 'Fight Club Show',
          character: 'Guest',
          first_air_date: '2020-01-01',
          poster_path: null,
          order: 0,
        },
      ]

      // Act
      const result = deduplicateCredits(credits)

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({ media_type: 'movie', id: 550, character: 'Tyler Durden' })
      expect(result[1]).toMatchObject({ media_type: 'tv', id: 550 })
    })

    it('keeps the first API entry when duplicate orders are all null', () => {
      // Arrange
      const credits: PersonCredit[] = [
        {
          id: 1,
          media_type: 'movie',
          title: 'Same Title',
          character: 'First',
          release_date: '2020-01-01',
          poster_path: null,
          order: null,
        },
        {
          id: 1,
          media_type: 'movie',
          title: 'Same Title',
          character: 'Second',
          release_date: '2020-01-01',
          poster_path: null,
          order: null,
        },
      ]

      // Act
      const result = deduplicateCredits(credits)

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].character).toBe('First')
    })
  })

  describe('normalizePersonDates', () => {
    it('returns locale-neutral birthday, deathday, and birthplace fields', () => {
      expect(normalizePersonDates('1963-12-18', null, 'Oklahoma')).toEqual({
        birthday: '1963-12-18',
        deathday: null,
        placeOfBirth: 'Oklahoma',
      })
      expect(normalizePersonDates('1963', '2020-01-02', null)).toEqual({
        birthday: '1963',
        deathday: '2020-01-02',
        placeOfBirth: null,
      })
      expect(normalizePersonDates(null, null, null)).toEqual({
        birthday: null,
        deathday: null,
        placeOfBirth: null,
      })
    })
  })

  describe('external links', () => {
    it('detects whether any supported external links exist', () => {
      expect(
        hasExternalLinks({ imdb_id: null, instagram_id: null, twitter_id: null } as ExternalIds),
      ).toBe(false)
      expect(hasExternalLinks({ imdb_id: 'nm0000093', instagram_id: null, twitter_id: null })).toBe(
        true,
      )
      expect(hasExternalLinks({ imdb_id: null, instagram_id: 'actor', twitter_id: null })).toBe(
        true,
      )
      expect(hasExternalLinks({ imdb_id: null, instagram_id: null, twitter_id: 'actor' })).toBe(
        true,
      )
    })

    it('builds full IMDB, Instagram, and Twitter URLs', () => {
      expect(buildExternalUrl('imdb', 'nm0000093')).toBe('https://www.imdb.com/name/nm0000093')
      expect(buildExternalUrl('instagram', 'actor')).toBe('https://www.instagram.com/actor')
      expect(buildExternalUrl('twitter', 'actor')).toBe('https://twitter.com/actor')
    })
  })
})
