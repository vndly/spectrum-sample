import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import type { MovieListItem } from '@/domain/movie.schema'
import type { ShowListItem } from '@/domain/show.schema'
import type { SearchResultItem } from '@/domain/search.schema'
import { searchMulti } from '@/infrastructure/provider.client'
import { useSettings } from '@/application/use-settings'
import { SEARCH_DEBOUNCE_MS } from '@/domain/constants'

/** Union type for displayable search results (movies and TV shows, no persons). */
type MediaResult = (MovieListItem | ShowListItem) & { media_type: 'movie' | 'tv' }

/**
 * Filters search results to only include movies and TV shows.
 * @param results - Raw search results including persons
 * @returns Filtered results with only movies and TV shows
 */
function filterMediaResults(results: SearchResultItem[]): MediaResult[] {
  return results.filter(
    (item): item is MediaResult => item.media_type === 'movie' || item.media_type === 'tv',
  )
}

/**
 * Composable for searching movies and TV shows.
 * Provides debounced search with loading, error, and results state.
 * @returns Search state and control functions
 */
export function useSearch() {
  const { language } = useSettings()

  const query: Ref<string> = ref('')
  const results: Ref<MediaResult[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<Error | null> = ref(null)
  const hasSearched: Ref<boolean> = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * Computed property indicating if we're in search mode.
   * True when query has non-whitespace content.
   */
  const isSearchMode = computed(() => query.value.trim().length > 0)

  /**
   * Performs the search API call.
   * @param searchQuery - The search query string
   */
  async function performSearch(searchQuery: string) {
    const trimmedQuery = searchQuery.trim()
    loading.value = true
    error.value = null

    try {
      const response = await searchMulti(trimmedQuery, language.value)
      results.value = filterMediaResults(response.results)
      hasSearched.value = true
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Search failed')
      results.value = []
      hasSearched.value = false
    } finally {
      loading.value = false
    }
  }

  /**
   * Retries the last search with the current query value.
   */
  function retry() {
    if (query.value.trim()) {
      performSearch(query.value)
    }
  }

  /**
   * Clears the search query, results, and error.
   */
  function clear() {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
    query.value = ''
    results.value = []
    error.value = null
    loading.value = false
    hasSearched.value = false
  }

  // Watch query changes and trigger debounced search
  watch(query, (newQuery) => {
    // Clear any pending debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    const trimmedQuery = newQuery.trim()

    // If query is empty, clear results immediately
    if (!trimmedQuery) {
      results.value = []
      error.value = null
      loading.value = false
      hasSearched.value = false
      return
    }

    hasSearched.value = false

    // Set up debounced search
    debounceTimer = setTimeout(() => {
      performSearch(newQuery)
    }, SEARCH_DEBOUNCE_MS)
  })

  return {
    query,
    results,
    loading,
    error,
    hasSearched,
    isSearchMode,
    retry,
    clear,
  }
}
