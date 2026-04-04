import { ref, toValue } from 'vue'
import type { Ref, MaybeRef } from 'vue'
import type { MovieDetail } from '@/domain/movie.schema'
import { getMovieDetail } from '@/infrastructure/provider.client'
import { useSettings } from '@/application/use-settings'

/**
 * Composable for fetching and managing movie detail data.
 * @param id - The TMDB movie ID (can be a ref or a plain number)
 * @returns Object containing data, loading state, error, and refresh function
 */
export function useMovieDetail(id: MaybeRef<number>) {
  const { language } = useSettings()

  const data: Ref<MovieDetail | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<Error | null> = ref(null)

  /**
   * Fetches the movie detail from the API.
   */
  async function fetchData() {
    loading.value = true
    error.value = null

    try {
      const movieId = toValue(id)
      data.value = await getMovieDetail(movieId, language.value)
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Failed to fetch movie details')
      data.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Refreshes the movie detail data.
   */
  function refresh() {
    fetchData()
  }

  // Fetch data immediately
  fetchData()

  return {
    data,
    loading,
    error,
    refresh,
  }
}
