import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FilterState, DEFAULT_FILTER_STATE } from '@/domain/filter.schema'
import { useSettings } from './use-settings'
import { useGenres } from './use-genres'

// Global state to share across instances
const filters = ref<FilterState>({ ...DEFAULT_FILTER_STATE })
const isInitialized = ref(false)

/**
 * Resets the filter state and initialization flag.
 * Used primarily for testing.
 */
export function _resetFilters() {
  filters.value = { ...DEFAULT_FILTER_STATE }
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
  const { genres, fetchGenres } = useGenres()

  /**
   * Synchronizes the filter state with the URL query parameters.
   */
  const syncToUrl = () => {
    // Only sync if router and route are available (might not be in some contexts)
    if (!router || !route) return

    const query: Record<string, string> = { ...(route.query as Record<string, string>) }

    if (filters.value.genres.length > 0) {
      query.genres = filters.value.genres.join(',')
    } else {
      delete query.genres
    }

    if (filters.value.mediaType !== 'all') {
      query.mediaType = filters.value.mediaType
    } else {
      delete query.mediaType
    }

    if (
      filters.value.yearFrom !== null &&
      filters.value.yearFrom !== undefined &&
      !isNaN(filters.value.yearFrom)
    ) {
      query.yearFrom = filters.value.yearFrom.toString()
    } else {
      delete query.yearFrom
    }

    if (
      filters.value.yearTo !== null &&
      filters.value.yearTo !== undefined &&
      !isNaN(filters.value.yearTo)
    ) {
      query.yearTo = filters.value.yearTo.toString()
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
      filters.value.genres = (route.query.genres as string).split(',').map(Number)
    } else {
      filters.value.genres = []
    }

    if (route.query.mediaType) {
      filters.value.mediaType = route.query.mediaType as 'all' | 'movie' | 'tv'
    } else {
      filters.value.mediaType = 'all'
    }

    if (route.query.yearFrom) {
      filters.value.yearFrom = Number(route.query.yearFrom)
    } else {
      filters.value.yearFrom = null
    }

    if (route.query.yearTo) {
      filters.value.yearTo = Number(route.query.yearTo)
    } else {
      filters.value.yearTo = null
    }
  }

  /**
   * Clears all active filters.
   */
  const clearAll = () => {
    filters.value = { ...DEFAULT_FILTER_STATE }
    syncToUrl()
  }

  /**
   * Computed count of active filters.
   */
  const activeFilterCount = computed(() => {
    let count = 0
    if (filters.value.genres.length > 0) count++
    if (filters.value.mediaType !== 'all') count++
    if (filters.value.yearFrom !== null && !isNaN(filters.value.yearFrom)) count++
    if (filters.value.yearTo !== null && !isNaN(filters.value.yearTo)) count++
    return count
  })

  // Watch for filter changes and update URL
  watch(
    () => filters.value,
    () => {
      syncToUrl()
    },
    { deep: true },
  )

  // Initialize only once
  onMounted(() => {
    if (!isInitialized.value) {
      restoreFromUrl()
      fetchGenres(language.value)
      isInitialized.value = true
    }
  })

  return {
    filters,
    genres,
    clearAll,
    fetchGenres,
    activeFilterCount,
  }
}
