import { FilterState, LibraryFilterState, SortField, SortOrder } from './filter.schema'
import { SearchResultItem } from './search.schema'
import { LibraryEntry } from './library.schema'

/**
 * Normalized item for library views.
 */
export interface LibraryViewItem {
  id: number
  mediaType: 'movie' | 'tv'
  title: string
  displayTitle: string
  releaseDate?: string
  releaseYear?: number
  voteAverage?: number
  rating: number
  status: 'watchlist' | 'watched' | 'none'
  listIds: string[]
  genreIds: number[]
  addedAt: string
}

/**
 * Maps a library entry to a normalized library view item.
 * @param entry - The library entry to map.
 * @returns The normalized view item.
 */
export function toLibraryViewItem(entry: LibraryEntry): LibraryViewItem {
  return {
    id: entry.id,
    mediaType: entry.mediaType,
    title: entry.title,
    displayTitle: entry.title.toLowerCase(),
    releaseDate: entry.releaseDate,
    releaseYear: entry.releaseDate ? new Date(entry.releaseDate).getFullYear() : undefined,
    voteAverage: entry.voteAverage,
    rating: entry.rating,
    status: entry.status,
    listIds: entry.lists,
    genreIds: entry.genreIds || [],
    addedAt: entry.addedAt,
  }
}

/**
 * Checks if a library view item matches the current filter state.
 * @param item - The item to check.
 * @param filters - The current library filter state.
 * @returns True if the item matches the filters, false otherwise.
 */
export function matchesLibraryFilters(item: LibraryViewItem, filters: LibraryFilterState): boolean {
  // Media Type Filter
  if (filters.mediaType !== 'all' && item.mediaType !== filters.mediaType) {
    return false
  }

  // Genre Filter (AND logic within the active library scope)
  if (filters.genres.length > 0) {
    const hasAllGenres = filters.genres.every((id) => item.genreIds.includes(id))
    if (!hasAllGenres) {
      return false
    }
  }

  // Rating Range Filter
  if (item.rating < filters.ratingMin || item.rating > filters.ratingMax) {
    return false
  }

  // Status Filter (Only on Lists view, but the logic can be here)
  if (filters.status !== 'all' && item.status !== filters.status) {
    return false
  }

  // Custom List Filter
  if (filters.listIds.length > 0) {
    const isInAnyList = filters.listIds.some((id) => item.listIds.includes(id))
    if (!isInAnyList) {
      return false
    }
  }

  return true
}

/**
 * Creates a comparator function for sorting library items.
 * @param field - The field to sort by.
 * @param order - The sort order.
 * @returns A comparator function.
 */
export function getLibraryComparator(
  field: SortField,
  order: SortOrder,
): (a: LibraryViewItem, b: LibraryViewItem) => number {
  return (a, b) => {
    let comparison = 0

    switch (field) {
      case 'dateAdded':
        comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
        break
      case 'title':
        comparison = a.displayTitle.localeCompare(b.displayTitle)
        break
      case 'releaseYear':
        comparison = (a.releaseYear || 0) - (b.releaseYear || 0)
        break
      case 'userRating':
        comparison = a.rating - b.rating
        break
    }

    return order === 'asc' ? comparison : -comparison
  }
}

/**
 * Counts the number of active filter categories.
 * @param filters - The current library filter state.
 * @returns The number of active filter categories.
 */
export function countActiveFilters(filters: LibraryFilterState): number {
  let count = 0
  if (filters.genres.length > 0) count++
  if (filters.mediaType !== 'all') count++
  if (filters.ratingMin > 0 || filters.ratingMax < 5) count++
  if (filters.status !== 'all') count++
  if (filters.listIds.length > 0) count++
  return count
}

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const genreIds = 'genre_ids' in item ? (item as any).genre_ids : []
    const hasAllGenres = filters.genres.every((id) => genreIds.includes(id))
    if (!hasAllGenres) {
      return false
    }
  }

  // Year Range Filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const releaseDate = item.media_type === 'movie' ? (item as any).release_date : (item as any).first_air_date
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
