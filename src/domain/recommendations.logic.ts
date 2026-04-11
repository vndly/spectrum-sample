import type { LibraryEntry } from '@/domain/library.schema'
import type { SearchResult } from '@/domain/search.schema'

/**
 * Selects up to 5 seed entries from the library for recommendations.
 * Priority: Highest Rating (5-1) > Last Activity (latest of addedAt and watchDates).
 *
 * @param entries - The user's library entries
 * @returns Up to 5 selected seed entries
 */
export function selectSeeds(entries: LibraryEntry[]): LibraryEntry[] {
  const sorted = [...entries].sort((a, b) => {
    // 1. Priority by Rating (Highest first)
    if (a.rating !== b.rating) {
      return b.rating - a.rating
    }

    // 2. Priority by Recency (Latest first)
    const getLatestActivity = (entry: LibraryEntry) => {
      const dates = [entry.addedAt, ...(entry.watchDates || [])]
      return Math.max(...dates.map((d) => new Date(d).getTime()))
    }

    return getLatestActivity(b) - getLatestActivity(a)
  })

  return sorted.slice(0, 5)
}

/**
 * Deduplicates recommendations across all sections and filters out existing library entries.
 * A title SHALL NOT appear twice across any recommendation or browse section on the screen.
 *
 * @param sections - Array of recommendation arrays (one per seed/trending section)
 * @param libraryIds - Set of provider IDs already in the user's library
 * @returns Deduplicated and filtered sections
 */
export function deduplicateRecommendations(
  sections: SearchResult[][],
  libraryIds: Set<number>,
): SearchResult[][] {
  const seenIds = new Set<number>(libraryIds)
  const result: SearchResult[][] = []

  for (const section of sections) {
    const deduplicatedSection: SearchResult[] = []
    for (const item of section) {
      if (!seenIds.has(item.id)) {
        deduplicatedSection.push(item)
        seenIds.add(item.id)
      }
    }
    result.push(deduplicatedSection)
  }

  return result
}
