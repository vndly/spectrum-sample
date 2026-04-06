import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FilterState, DEFAULT_FILTER_STATE } from '@/domain/filter.schema'
import { getMovieGenres, getTvGenres } from '@/infrastructure/provider.client'
import { useSettings } from './use-settings'
import { Genre } from '@/domain/shared.schema'

// Global state to share across instances
const filters = reactive<FilterState>({ ...DEFAULT_FILTER_STATE })
const genresCache = ref<Genre[]>([])
const isInitialized = ref(false)

/**
 * Resets the filter state and initialization flag.
 * Used primarily for testing.
 */
export function _resetFilters() {
  Object.assign(filters, DEFAULT_FILTER_STATE)
  isInitialized.value = false
}

/**
 * Composable for managing home screen filters.
 * Handles filter state, genre fetching, and URL synchronization.
 */
export function useFilters() {
  const router = useRouter()
  const route = useRoute()
  const { language } = useSettings()

  /**
   * Fetches and merges movie and TV genres from TMDB.
   */
  const fetchGenres = async () => {
    if (genresCache.value.length > 0) return

    try {
      const [movieGenresRes, tvGenresRes] = await Promise.all([
        getMovieGenres(language.value),
        getTvGenres(language.value),
      ])

      const merged = [...movieGenresRes.genres, ...tvGenresRes.genres]
      const unique = Array.from(new Map(merged.map((g) => [g.id, g])).values())
      
      genresCache.value = unique.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Failed to fetch genres:', error)
    }
  }

  /**
   * Synchronizes the filter state with the URL query parameters.
   */
  const syncToUrl = () => {
    // Only sync if router and route are available (might not be in some contexts)
    if (!router || !route) return

    const query: Record<string, string> = { ...route.query }

    if (filters.genres.length > 0) {
      query.genres = filters.genres.join(',')
    } else {
      delete query.genres
    }

    if (filters.mediaType !== 'all') {
      query.mediaType = filters.mediaType
    } else {
      delete query.mediaType
    }

    if (filters.yearFrom !== null && filters.yearFrom !== undefined && !isNaN(filters.yearFrom)) {
      query.yearFrom = filters.yearFrom.toString()
    } else {
      delete query.yearFrom
    }

    if (filters.yearTo !== null && filters.yearTo !== undefined && !isNaN(filters.yearTo)) {
      query.yearTo = filters.yearTo.toString()
    } else {
      delete query.yearTo
    }

    // Only update if the query has changed to avoid unnecessary history entries
    if (JSON.stringify(query) !== JSON.stringify(route.query)) {
      router.push({ query })
    }
  }

  /**
   * Restores the filter state from the URL query parameters.
   */
  const restoreFromUrl = () => {
    if (!route) return

    if (route.query.genres) {
      filters.genres = (route.query.genres as string).split(',').map(Number)
    } else {
      filters.genres = []
    }

    if (route.query.mediaType) {
      filters.mediaType = route.query.mediaType as any
    } else {
      filters.mediaType = 'all'
    }

    if (route.query.yearFrom) {
      filters.yearFrom = Number(route.query.yearFrom)
    } else {
      filters.yearFrom = null
    }

    if (route.query.yearTo) {
      filters.yearTo = Number(route.query.yearTo)
    } else {
      filters.yearTo = null
    }
  }

  /**
   * Clears all active filters.
   */
  const clearAll = () => {
    Object.assign(filters, DEFAULT_FILTER_STATE)
    syncToUrl()
  }

  // Watch for filter changes and update URL
  watch(filters, () => {
    syncToUrl()
  }, { deep: true })

  // Initialize only once
  onMounted(() => {
    if (!isInitialized.value) {
      restoreFromUrl()
      fetchGenres()
      isInitialized.value = true
    }
  })

  return {
    filters,
    genres: genresCache,
    clearAll,
    fetchGenres,
  }
}
