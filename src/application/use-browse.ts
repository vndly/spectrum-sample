import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { getTrending, getPopularMovies, getPopularShows } from '@/infrastructure/provider.client'
import { useSettings } from '@/application/use-settings'
import type { MovieListItem } from '@/domain/movie.schema'
import type { ShowListItem } from '@/domain/show.schema'

/** Media result with guaranteed media_type. */
export type MediaResult = (MovieListItem | ShowListItem) & { media_type: 'movie' | 'tv' }

/**
 * Composable for fetching trending and popular media for the browse mode.
 * @returns Browse state and control functions
 */
export function useBrowse() {
  const { language } = useSettings()

  const trending: Ref<MediaResult[]> = ref([])
  const popularMovies: Ref<MediaResult[]> = ref([])
  const popularShows: Ref<MediaResult[]> = ref([])

  const loading: Ref<boolean> = ref(false)
  const error: Ref<Error | null> = ref(null)

  /**
   * Fetches all browse data in parallel.
   */
  async function fetchBrowseData() {
    loading.value = true
    error.value = null

    try {
      const [trendingRes, moviesRes, showsRes] = await Promise.all([
        getTrending(language.value),
        getPopularMovies(language.value),
        getPopularShows(language.value),
      ])

      // Filter and map trending to only include movies/tv
      trending.value = trendingRes.results.filter(
        (item): item is MediaResult => item.media_type === 'movie' || item.media_type === 'tv',
      ).slice(0, 10) // Limit to 10 as per HB-04

      // Popular movies and shows are already filtered by media_type in provider client mapping
      popularMovies.value = (moviesRes.results as MediaResult[]).slice(0, 20) // Limit to 20 as per HB-05
      popularShows.value = (showsRes.results as MediaResult[]).slice(0, 20) // Limit to 20 as per HB-05
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Failed to load browse data')
    } finally {
      loading.value = false
    }
  }

  /**
   * Retries fetching all browse data.
   */
  function retry() {
    fetchBrowseData()
  }

  // Fetch data on initialization
  onMounted(() => {
    fetchBrowseData()
  })

  return {
    trending,
    popularMovies,
    popularShows,
    loading,
    error,
    retry,
  }
}
