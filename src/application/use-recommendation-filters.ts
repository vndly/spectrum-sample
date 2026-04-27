import { ref, computed } from 'vue'
import { DEFAULT_FILTER_STATE, type FilterState } from '@/domain/filter.schema'

/**
 * Composable for managing recommendation-specific filter state.
 * Uses local state without URL synchronization.
 */
export function useRecommendationFilters() {
  const filters = ref<FilterState>({ ...DEFAULT_FILTER_STATE })

  const activeFilterCount = computed(() => {
    let count = 0
    if (filters.value.genres.length > 0) count++
    if (filters.value.mediaType !== 'all') count++
    return count
  })

  const clearFilters = () => {
    filters.value = { ...DEFAULT_FILTER_STATE }
  }

  return {
    filters,
    activeFilterCount,
    clearFilters,
  }
}
