import { FilterState } from './filter.schema'
import { SearchResultItem } from './search.schema'

/**
 * Checks if a search result item matches the current filter state.
 * @param item - The item to check.
 * @param filters - The current filter state.
 * @returns True if the item matches the filters, false otherwise.
 */
export function matchesFilters(item: SearchResultItem, filters: FilterState): boolean {
  // Exclude persons from filtering
  if (item.media_type === 'person') {
    return false
  }

  // Media Type Filter
  if (filters.mediaType !== 'all' && item.media_type !== filters.mediaType) {
    return false
  }

  // Genre Filter (AND logic: matches all selected genres)
  if (filters.genres.length > 0) {
    const hasAllGenres = filters.genres.every((id) => item.genre_ids.includes(id))
    if (!hasAllGenres) {
      return false
    }
  }

  // Year Range Filter
  const releaseDate = item.media_type === 'movie' ? item.release_date : item.first_air_date
  if (releaseDate) {
    const year = new Date(releaseDate).getFullYear()

    if (filters.yearFrom !== null && year < filters.yearFrom) {
      return false
    }

    if (filters.yearTo !== null && year > filters.yearTo) {
      return false
    }
  } else if (filters.yearFrom !== null || filters.yearTo !== null) {
    // If we have year filters but no release date, it doesn't match
    return false
  }

  return true
}

/**
 * Filters an array of search result items based on the current filter state.
 * @param items - The items to filter.
 * @param filters - The filter state to apply.
 * @returns The filtered array of items.
 */
export function filterResults(items: SearchResultItem[], filters: FilterState): SearchResultItem[] {
  return items.filter((item) => matchesFilters(item, filters))
}
