import type { ExternalIds, PersonCredit } from './person.schema'

/** Locale-neutral person date fields ready for Application formatting. */
export type PersonDateInfo = {
  birthday: string | null
  deathday: string | null
  placeOfBirth: string | null
}

type ExternalLinkType = 'imdb' | 'instagram' | 'twitter'

/**
 * Returns the date field used for sorting a person cast credit.
 * @param credit - The movie or TV cast credit to inspect
 * @returns The release or first-air date, or null when unavailable
 */
function getCreditDate(credit: PersonCredit): string | null {
  return credit.media_type === 'movie' ? credit.release_date : credit.first_air_date
}

/**
 * Sorts person cast credits by release date descending, with missing dates last.
 * @param credits - Person cast credits to sort
 * @returns A new array sorted newest first, preserving the input array
 */
export function sortCreditsByDate(credits: PersonCredit[]): PersonCredit[] {
  return [...credits].sort((a, b) => {
    const aDate = getCreditDate(a)
    const bDate = getCreditDate(b)

    if (aDate === bDate) {
      return 0
    }
    if (!aDate) {
      return 1
    }
    if (!bDate) {
      return -1
    }

    return bDate.localeCompare(aDate)
  })
}

/**
 * Removes duplicate cast credits by media type and provider ID.
 * @param credits - Person cast credits in API response order
 * @returns A deduplicated array, keeping the lowest numeric billing order
 */
export function deduplicateCredits(credits: PersonCredit[]): PersonCredit[] {
  const deduplicated = new Map<string, PersonCredit>()

  for (const credit of credits) {
    const key = `${credit.media_type}:${credit.id}`
    const existing = deduplicated.get(key)

    if (!existing) {
      deduplicated.set(key, credit)
      continue
    }

    if (credit.order === null) {
      continue
    }
    if (existing.order === null || credit.order < existing.order) {
      deduplicated.set(key, credit)
    }
  }

  return Array.from(deduplicated.values())
}

/**
 * Normalizes raw person date fields for Application-layer display formatting.
 * @param birthday - Raw birthday string from TMDB
 * @param deathday - Raw deathday string from TMDB
 * @param placeOfBirth - Raw birthplace string from TMDB
 * @returns Locale-neutral person date information
 */
export function normalizePersonDates(
  birthday: string | null,
  deathday: string | null,
  placeOfBirth: string | null,
): PersonDateInfo {
  return {
    birthday,
    deathday,
    placeOfBirth,
  }
}

/**
 * Checks whether a person has at least one supported external profile link.
 * @param externalIds - Person external identifiers from TMDB
 * @returns True when IMDB, Instagram, or Twitter IDs are present
 */
export function hasExternalLinks(externalIds: ExternalIds): boolean {
  return Boolean(externalIds.imdb_id || externalIds.instagram_id || externalIds.twitter_id)
}

/**
 * Builds the full URL for a supported person external profile.
 * @param type - External link provider type
 * @param id - Provider-specific external profile ID
 * @returns Full external profile URL
 */
export function buildExternalUrl(type: ExternalLinkType, id: string): string {
  if (type === 'imdb') {
    return `https://www.imdb.com/name/${id}`
  }
  if (type === 'instagram') {
    return `https://www.instagram.com/${id}`
  }

  return `https://twitter.com/${id}`
}
